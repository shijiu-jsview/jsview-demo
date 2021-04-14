/**
 * Created by luocf on 2020/5/12.
 */
import React from 'react';
import "./Target.css";
import { createImpactTracer, createImpactCallback } from '../../../../../../utils/JsViewReactTools/JsvImpactTracer';
import { JsvActorMove, JsvActorMoveControl } from "../../../../../../utils/JsViewReactWidget/JsvActorMove";
import { JsvSpriteAnim } from '../../../../../../utils/JsViewReactWidget/JsvSpriteAnim';
import Game from "../../common/Game";

import ScrollPage from "./ScrollPage";

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
    this.state = { itemList: [], successEffectVisible: "hidden", impactObj: null };
    this._Control = new JsvActorMoveControl();
    this.targetTime = this.props.targetTime;
    this._CurTarget = null;
    this._scaleAnimationEnd = this._scaleAnimationEnd.bind(this);
    this._DrawTargets();
  }

  play() {
    if (this._IsPause) {
      this._IsPause = false;
    }
    const spriteInfo = window.GameSource[this.targetConfig.json];
    this._Control.moveToX(
        -(this._TotalDistance + spriteInfo.frames[0].target.w),
        this.props.scrollSpeed,
        () => {
          console.log("Targets scroll end");
        }
    );// 滚动屏幕
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
    const itemList = this.state.itemList;
    for (let i = 0; i < itemList.length; i++) {
      const item = itemList[i];
      if (item.sensor) {
        item.sensor.Recycle();
      }
    }
    this.setState({ itemList: [] });
  }

  renderSuccessEffect() {
    const successEffectInfo = window.GameSource["star_burst_big.json"];
    if (!successEffectInfo
      || this.state.successEffectVisible !== "visible"
      || !this.state.impactObj) {
      return null;
    }

    const impactObj = this.state.impactObj;
    const width = impactObj.spriteInfo.frames[0].target.w;
    const height = impactObj.spriteInfo.frames[0].target.h;
    const left = impactObj.left + (width - successEffectInfo.viewSize.w) / 2;
    const top = impactObj.top + (height - successEffectInfo.viewSize.h) / 2;

    return (
        <div style={{
          visibility: this.state.successEffectVisible,
          left,
          top
        }}>
            <JsvSpriteAnim
                    spriteInfo={successEffectInfo}
                    loop="infinite"
                    autostart={true}
                    viewSize={successEffectInfo.viewSize}
                    duration={successEffectInfo.frames.length / 15}
                    imageUrl={`url(${Game.requireUrl("star_burst_big.png")})`}/>
        </div>
    );
  }

  render() {
    const itemList = this.state.itemList;
    this._InitItemImpactTracer(this.props.roleRef);

    return (
            <div>
                <JsvActorMove key="TargetsTranslate"
                                    style={{ left: 0, top: 0, width: this.width, height: this.height }}
                                    control={this._Control}>
                    {
                        itemList.map((item) => {
                          console.log("render item:", item.key, `, item left:${item.left}`);
                          return (
                                <div key={`TargetsTranslate${item.key}`}
                                     style={{
                                       left: item.left,
                                       top: item.top,
                                       width: item.spriteInfo.frames[0].target.w,
                                       height: item.spriteInfo.frames[0].target.h,
                                       animation: item.anim
                                     }}
                                     onAnimationEnd={this._scaleAnimationEnd}>
                                    <div style={{ visibility: item.showStatic ? "visible" : "hidden" }}>
                                        <JsvSpriteAnim
                                            spriteInfo={item.spriteStaticInfo}
                                            loop="infinite"
                                            autostart={true}
                                            viewSize={item.spriteStaticInfo.viewSize}
                                            duration={0.8}
                                            imageUrl={`url(${Game.requireUrl(this.targetConfig.value)})`}/>
                                    </div>
                                    <div style={{ visibility: item.showStatic ? "hidden" : "visible" }}>
                                        <JsvSpriteAnim
                                            spriteInfo={item.spriteInfo}
                                            loop="infinite"
                                            autostart={true}
                                            viewSize={item.spriteInfo.viewSize}
                                            duration={0.8}
                                            imageUrl={`url(${Game.requireUrl(this.targetConfig.value)})`}/>

                                    </div>
                                    <div ref={ele => this._InitItemEle(item, ele)}
                                         style={{
                                           backgroundColor: "rgba(0,0,0,0)",
                                           left: 45,
                                           top: 30,
                                           width: item.spriteInfo.frames[0].target.w - 90,
                                           height: item.spriteInfo.frames[0].target.h - 60,
                                         }}></div>

                                </div>
                          );
                        })
                    }
                    { this.renderSuccessEffect()}
                </JsvActorMove>

            </div>
    );
  }

  componentDidMount() {
    this._IsRunning = true;
  }


  _DrawTargets() {
    const spriteInfo = window.GameSource[this.targetConfig.json];
    const itemList = this.state.itemList;
    const spriteBaseInfo = window.GameSource[this.targetConfig.json];
    for (let i = 0; i < this.appearNum; i++) {
      this._TotalDistance += this.width - spriteInfo.frames[0].target.w / 2;
      const left = this._TotalDistance;
      const top = this.Math.between(this.props.targetMinY, this.props.targetMaxY) - spriteInfo.frames[0].target.h / 2;
      const target = {
        key: i,
        spriteStaticInfo: { frames: [spriteBaseInfo.frames[0]], meta: spriteBaseInfo.meta, viewSize: spriteBaseInfo.viewSize },
        showStatic: true,
        spriteInfo: { frames: spriteBaseInfo.frames, meta: spriteBaseInfo.meta, viewSize: spriteBaseInfo.viewSize },
        left,
        top,
        w: spriteInfo.frames[0].target.w,
        h: spriteInfo.frames[0].target.h
      };
      itemList.push(target);
    }
  }

  _scaleAnimationEnd() {
    this.setState({
      successEffectVisible: "hidden",
      impactObj: null,

    });
  }

  _InitItemEle(item, ele) {
    if (ele && !item.ele) {
      item.ele = ele;
      item.initdone = false;
    }
  }

  _InitItemImpactTracer(role_ref) {
    if (role_ref && role_ref.Sprite) {
      const itemList = this.state.itemList;
      for (let i = 0; i < itemList.length; i++) {
        const item = itemList[i];
        if (!item.initdone && item.ele) {
          item.initdone = true;
          const target_sensor = createImpactTracer(role_ref.Sprite, item.ele, createImpactCallback(
            () => {
              // 碰撞开始
              console.log("碰撞开始 ");
              if (this._CurTarget !== item) {
                this._CurTarget = item;
                item.anim = "targetScale 0.8s linear";
                item.showStatic = false;
                this.setState({
                  successEffectVisible: "visible",
                  impactObj: item,
                });
                this.props.onTargetImpactTracer(item);
              }
            },
            () => {
              // 碰撞结束
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
