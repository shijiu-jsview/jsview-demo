/**
 * Created by luocf on 2020/5/12.
 */
import React from 'react';
import "./Target.css"
import {createImpactTracer, createImpactCallback} from '../../../../../jsview-utils/jsview-react/index_widget';
import {JsvSpriteTranslate, TranslateControl} from "../../../../../jsview-utils/JsViewReactWidget/JsvSpriteTranslate"
import JsvSpriteAnim from '../../../../../jsview-utils/JsViewReactWidget/JsvSpriteImg'
import Game from "../../common/Game"

import ScrollPage from "./ScrollPage"
class Targets extends ScrollPage {
    /**
     * @param roleRef           role Ref
     * @param worldWidth       Game 场景宽度
     * @param worldHeight      Game 场景高度
     * @param direction        运动方向
     * @param config           障碍物具体属性
     * @param appearNum      障碍物总数
     * @param targetMinY     碰撞最小高度
     * @param targetMaxY     碰撞最大高度
     * @param scrollSpeed     滚动速度
     * @param onTargetImpactTracer   碰撞回调
     */
    constructor(props) {
        super(props);
        console.log("Targets constructor");
        this._IsPause = false;
        this.appearNum = this.props.appearNum;
        this.targetConfig = this.props.config;
        this.width = this.props.worldWidth;
        this.height = this.props.worldHeight;
        this._TotalDistance = 0;
        this.state = {itemList: [], successEffectVisible:"hidden", successEffectLeft:0,successEffectTop:0};
        this._Control = new TranslateControl();
        this._Control.speed(this.props.scrollSpeed);
        this.targetTime = this.props.targetTime;
        this._CurTarget = null;
        this._scaleAnimationEnd = this._scaleAnimationEnd.bind(this);
        this._DrawTargets();
    }

    play() {
        if (this._IsPause) {
            this._IsPause = false;
        }
        let spriteInfo = window.GameSource[this.targetConfig.json];
        this._Control.targetX(-(this._TotalDistance+spriteInfo.frames[0].spriteSourceSize.w)).start(()=>{
            console.log("Targets scroll end");
        });//滚动屏幕
    }

    pause() {
        this._IsPause = true;
        this._Control.pause();
    }

    stop() {
        this._IsPause = true;
        this._Control.pause();
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
        this._InitItemImpactTracer(this.props.roleRef);
        let successEffectInfo = window.GameSource["star_burst_big.json"];
        return (
            <div>
                <JsvSpriteTranslate key="TargetsTranslate"
                                    style={{left: 0, top: 0, width: this.width, height: this.height}}
                                    control={this._Control}>
                    {
                        itemList.map((item) => {
                            console.log("render item:", item.key, ", item left:" + item.left);
                            return (
                                <div key={"TargetsTranslate" + item.key}
                                     style={{
                                         left: item.left, top: item.top,
                                         width: item.spriteInfo.frames[0].spriteSourceSize.w,
                                         height: item.spriteInfo.frames[0].spriteSourceSize.h,
                                         animation: item.anim
                                     }}
                                     onAnimationEnd={this._scaleAnimationEnd}>
                                    <div style={{visibility:item.showStatic?"visible":"hidden"}}>
                                        <JsvSpriteAnim
                                            spriteInfo={item.spriteStaticInfo}
                                            loop="infinite"
                                            viewSize={item.spriteStaticInfo.frames[0].sourceSize}
                                            duration={0.8}
                                            onAnimEnd={function () {
                                                console.log("anim end")
                                            }}
                                            imageUrl={`url(${require("../../../" + Game.apppath + "/assets/atlas/" + this.targetConfig.value)})`}/>
                                    </div>
                                    <div style={{visibility:item.showStatic?"hidden":"visible"}}>
                                        <JsvSpriteAnim
                                            spriteInfo={item.spriteInfo}
                                            loop="infinite"
                                            viewSize={item.spriteInfo.frames[0].sourceSize}
                                            duration={0.8}
                                            onAnimEnd={function () {
                                                console.log("anim end")
                                            }}
                                            imageUrl={`url(${require("../../../" + Game.apppath + "/assets/atlas/" + this.targetConfig.value)})`}/>

                                    </div>
                                    <div ref={ele => this._InitItemEle(item, ele)}
                                         style={{
                                             backgroundColor: "rgba(0,0,0,0.0)",
                                             left: 45,
                                             top: 30,
                                             width: item.spriteInfo.frames[0].spriteSourceSize.w - 90,
                                             height: item.spriteInfo.frames[0].spriteSourceSize.h - 60,
                                         }}></div>

                                </div>
                            )
                        })
                    }
                    <div style={{
                        visibility: this.state.successEffectVisible,
                        left: this.state.successEffectLeft,
                        top: this.state.successEffectTop
                    }}>
                        /*SuccessEffect*/
                        {
                            successEffectInfo ? <JsvSpriteAnim
                                spriteInfo={successEffectInfo}
                                loop="infinite"
                                viewSize={successEffectInfo.frames[0].sourceSize}
                                duration={successEffectInfo.frames.length / 15}
                                onAnimEnd={function () {
                                    console.log("anim end")
                                }}
                                imageUrl={`url(${require("../../../" + Game.apppath + "/assets/atlas/star_burst_big.png")})`}/>
                                : null
                        }
                    </div>
                </JsvSpriteTranslate>

            </div>
        )
    }

    componentDidMount() {
        this._IsRunning = true;
    }


    _DrawTargets() {
        let spriteInfo = window.GameSource[this.targetConfig.json];
        let itemList = this.state.itemList;
        let spriteBaseInfo = window.GameSource[this.targetConfig.json];
        for(let i=0; i<this.appearNum; i++) {
            this._TotalDistance += this.width - spriteInfo.frames[0].spriteSourceSize.w/2;
            let left = this._TotalDistance;
            let top = this.Math.between(this.props.targetMinY, this.props.targetMaxY) - spriteInfo.frames[0].spriteSourceSize.h/2;
            let target = {
                key: i,
                spriteStaticInfo: {frames: [spriteBaseInfo.frames[0]], meta: spriteBaseInfo.meta},
                showStatic:true,
                spriteInfo: {frames: spriteBaseInfo.frames, meta: spriteBaseInfo.meta},
                left: left,
                top: top,
                w: spriteInfo.frames[0].spriteSourceSize.w,
                h: spriteInfo.frames[0].spriteSourceSize.h
            };
            itemList.push(target);
        }
    }

    _scaleAnimationEnd() {
        this.setState({
            successEffectVisible:"hidden",
            successEffectLeft:0,
            successEffectTop:0,

        })
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
                    let target_sensor = createImpactTracer(role_ref.Sprite, item.ele, createImpactCallback(
                        () => {
                            //碰撞开始
                            console.log("碰撞开始 ");
                            if (this._CurTarget !== item) {
                                this._CurTarget = item;
                                item.anim = "targetScale 0.8s linear";
                                item.showStatic = false;
                                this.setState({
                                    successEffectVisible:"visible",
                                    successEffectLeft:item.left,
                                    successEffectTop:item.top,
                                })
                                this.props.onTargetImpactTracer(item);

                            }
                        },
                        () => {
                            //碰撞结束
                            console.log("碰撞结束 ");
                        })
                    );
                    item.sensor = target_sensor;
                }
            }
        }
    }

}

export default Targets;