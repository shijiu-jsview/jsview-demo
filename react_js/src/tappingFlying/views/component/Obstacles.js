/**
 * Created by luocf on 2020/5/12.
 */
import React from 'react';
import {createImpactTracer, createImpactCallback} from '../../../jsview-utils/jsview-react/index_widget';
import {JsvSpriteTranslate, TranslateControl} from "../../../jsview-utils/JsViewReactWidget/JsvSpriteTranslate"
import JsvSpriteAnim from '../../../jsview-utils/JsViewReactWidget/JsvSpriteImg'

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
     * @param distancePos      滚动距离
     * @param onImpactTracer   碰撞回调
     */
    constructor(props) {
        super(props);
        console.log("Obstacles props:", props);
        this._IsPause = false;
        this.obstacleNum = this.props.obstacleNum;
        this.obstacleConfig = this.props.config;
        this.distancePos = this.props.distancePos;//碰撞后jump的距离
        this.width = this.props.worldWidth;
        this.height = this.props.worldHeight;
        this._TotalDistance = 0;
        this.state = {itemList: []};
        this._PauseX = 0;
        this._PauseY = 0;
        this._Control = new TranslateControl();
        this._Control.speed(this.obstacleConfig.speed);
        this.obstacleTime = this.props.obstacleTime;
        this._InitDone = false;
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
        let spriteInfo = window.Game[this.obstacleConfig.detail];
        this._InitItemImpactTracer(this.props.roleRef);
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
                                     left: item.left, top: item.top,
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
                                    imageUrl={`url(${require("../../assets/atlas/" + this.obstacleConfig.value)})`}/>
                                <div ref={ele => this._InitItemEle(item, ele)}
                                     style={{
                                         backgroundColor: "rgba(0,0,0,0.0)",
                                         left: this.obstacleConfig.bodySize.x,
                                         top: this.obstacleConfig.bodySize.y,
                                         width: this.obstacleConfig.bodySize.w,
                                         height: this.obstacleConfig.bodySize.h,
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
        let spriteInfo = window.Game[this.obstacleConfig.detail];
        let itemList = this.state.itemList;
        for(let i=0; i<this.obstacleNum; i++) {
            this._TotalDistance += parseInt(this.obstacleTime * this.obstacleConfig.speed);//坐标调整
            let left = this._TotalDistance;
            let top = this.Math.between(this.props.obstacleMinY, this.props.obstacleMaxY) - spriteInfo.frames[0].spriteSourceSize.h/2;
            const obstacle = {key:i, left:left, top:top};
            itemList.push(obstacle);
        }
        /*if (this.isFlyingMode) {
         //TODO
         }*/
    }

    _InitItemEle(item, ele) {
        if (ele && !item.ele) {
            item.ele = ele;
        }
    }

    _InitItemImpactTracer(role_ref) {
        if (!this._InitDone && role_ref && role_ref.Sprite) {
            this._InitDone = true;
            let itemList = this.state.itemList;
            for(let i=0; i<itemList.length; i++) {
                let item = itemList[i];
                let obstacle_sensor = createImpactTracer(role_ref.Sprite, item.ele, createImpactCallback(
                    () => {
                        //碰撞开始
                        console.log("碰撞开始 ");
                        this.props.onImpactTracer(item);
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

export default Obstacles;