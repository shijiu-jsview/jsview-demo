/**
 * Created by luocf on 2020/5/12.
 */
import React from 'react';
import {createImpactTracer, createImpactCallback} from '../../../../../jsview-utils/jsview-react/index_widget';
import {JsvSpriteTranslate, TranslateControl} from "../../../../../jsview-utils/JsViewReactWidget/JsvSpriteTranslate"
import JsvSpriteAnim from '../../../../../jsview-utils/JsViewReactWidget/JsvSpriteImg'
import Game from "../../common/Game"

import ScrollPage from "./ScrollPage"
class Obstacles extends ScrollPage {
    /**
     * @param roleRef           role Ref
     * @param worldWidth       Game 场景宽度
     * @param worldHeight      Game 场景高度
     * @param direction        运动方向
     * @param config           障碍物具体属性
     * @param obstacleNum      障碍物总数
     * @param obstacleMinY     碰撞最小高度
     * @param obstacleMaxY     碰撞最大高度
     * @param isFlyingMode     是否为飞行模式
     * @param scrollSpeed       滚动速度
     * @param distancePos      滚动距离
     * @param onImpactTracer   碰撞回调
     */
    constructor(props) {
        super(props);
        console.log("Obstacles constructor");
        this._IsPause = false;
        this.obstacleNum = this.props.obstacleNum;
        this.obstacleConfig = this.props.config;
        this.distancePos = this.props.distancePos;//碰撞后jump的距离
        this.width = this.props.worldWidth;
        this.height = this.props.worldHeight;
        this._TotalDistance = this.width;
        this.state = {itemList: [],  transition:""};
        this._PauseX = 0;
        this._PauseY = 0;
        this._Control = new TranslateControl();
        this._Control.speed(this.props.scrollSpeed);
        this.obstacleTime = this.props.obstacleTime;
        this._InitDone = false;
        this._isFlyingMode = this.props.isFlyingMode;
        this.speed = this.obstacleConfig.speed ? this.obstacleConfig.speed:this.props.scrollSpeed;
        this._DrawObstacles();
    }

    play() {
        if (this._IsPause) {
            this._IsPause = false;
            //TODO 根据direction决定targetX还是targetY
            this._Control.targetX(this._PauseX + this.distancePos).jump();
        }

        this._Control.targetX(-(this._TotalDistance + this.distancePos)).start(()=>{
            console.log("Obstacles scroll end");
        });//滚动屏幕
    }

    pause() {
        this._IsPause = true;
        this._Control.pause((x,y)=>{
            this._PauseX = x;
            this._PauseY = y;
        });
    }

    stop() {
        this._IsPause = true;
        this._Control.pause((x,y)=>{
            console.log("game over obstacles stop!")
        });
    }

    destroy() {
        super.destroy();
        this.stop();
        let itemList = this.state.itemList;
        for(let i=0; i<itemList.length;i++) {
            let item = itemList[i];
            if (item.sensor) {
                item.sensor.Recycle();
            }
        }
        this.setState({itemList:[]});
    }
    render() {
        const itemList = this.state.itemList;
        let spriteInfo = window.GameSource[this.obstacleConfig.json];
        this._InitItemImpactTracer(this.props.roleRef);
        let bodySize = this.obstacleConfig.bodySize;
        if(!bodySize) {
            bodySize = {x:90,y:20,w:spriteInfo.frames[0].spriteSourceSize.w-180,h:spriteInfo.frames[0].spriteSourceSize.h-40}
        }
        return (
            <div>
                <JsvSpriteTranslate key="ObstacleTranslate"
                                    style={{left: 0, top:0, width: this.width, height: this.height}}
                                    control={this._Control}>
                {
                    itemList.map((item) => {
                        console.log("render item:", item.key, ", item left:"+item.left);
                        return (
                            <div key={"ObstacleTranslate" + item.key}
                                 style={{
                                     left: item.left, top: item.top, transition:"top 2s linear",
                                     width: spriteInfo.frames[0].spriteSourceSize.w,
                                     height: spriteInfo.frames[0].spriteSourceSize.h}}>
                                <JsvSpriteAnim
                                    spriteInfo={spriteInfo}
                                    loop="infinite"
                                    viewSize={spriteInfo.frames[0].spriteSourceSize}
                                    duration={0.8}
                                    onAnimEnd= {function () {
                                        console.log("anim end")
                                    }}
                                    imageUrl={`url(${require("../../../"+Game.apppath+"/assets/atlas/" + this.obstacleConfig.value)})`}/>
                                <div ref={ele => this._InitItemEle(item, ele)}
                                     style={{
                                         backgroundColor: "rgba(0,0,0,0.0)",
                                         left: bodySize.x,
                                         top: bodySize.y,
                                         width: bodySize.w,
                                         height: bodySize.h,
                                         }}></div>

                            </div>
                        )
                    })
                }
                </JsvSpriteTranslate>

            </div>
        )
    }

    componentDidMount() {
        this._IsRunning = true;
    }

    _DrawObstacles() {
        let spriteInfo = window.GameSource[this.obstacleConfig.json];
        let itemList = this.state.itemList;
        for(let i=0; i<this.obstacleNum; i++) {

            let left = this._TotalDistance;
            this._TotalDistance += parseInt(this.obstacleTime * this.speed);//坐标调整
            let top = this.Math.between(this.props.obstacleMinY, this.props.obstacleMaxY) - spriteInfo.frames[0].spriteSourceSize.h/2;
            const obstacle = {key:i, left:left, top:top, w:spriteInfo.frames[0].spriteSourceSize.w,h:spriteInfo.frames[0].spriteSourceSize.h};
            itemList.push(obstacle);
        }
        /*if (this._isFlyingMode) {
         //TODO
         }*/
    }

    _InitItemEle(item, ele) {
        if (ele && !item.ele) {
            item.ele = ele;
            item.initdone = false;
        }
    }

    _InitItemImpactTracer(role_ref) {
        if (role_ref && role_ref.Sprite) {
            let itemList = this.state.itemList;
            for(let i=0; i<itemList.length; i++) {
                let item = itemList[i];
                if (!item.initdone && item.ele) {
                    item.initdone = true;
                    let obstacle_sensor = createImpactTracer(role_ref.Sprite, item.ele, createImpactCallback(
                        () => {
                            //碰撞开始
                            console.log("碰撞开始 ");
                            this.props.onImpactTracer(item);
                            //飞行模式时，障碍物撞到后起飞
                            if (this._isFlyingMode) {
                                item.top = -item.h;
                                this.setState({transition:"top 2s linear"})
                            }
                        },
                        () => {
                            //碰撞结束
                            console.log("碰撞结束 ");
                        })
                    );
                    item.sensor = obstacle_sensor;
                }
            }
        }
    }
}

export default Obstacles;