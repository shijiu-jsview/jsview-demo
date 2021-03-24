/*
 * 【界面概述】
 * 红包雨游戏，通过左右键控制小人左右移动来接收红包或炸弹，对应分数奖励和扣除，结果反映在界面左边计分板
 *
 * 【控件介绍】
 * JsvSpriteTranslate：可控平移动画组件
 *      style {Object} 同div的style属性，主要使用其中的top和left，控制动画图层的坐标位置
 *      control {SpriteControlBase} (必须) Sprite动作控制器
 *
 * 【技巧说明】
 * Q: 如何高效地判断红包和小人的碰撞？
 * A: 在拿到红包物体的div的ref对象后，通过函数createImpactTracer创建该div与小人碰撞体div的碰撞跟踪对象，
 *    通过函数createImpactCallback创建碰撞回调处理，接受物体相交(碰撞)事件和物体离开事件。
 *    注意：当不再进行碰撞跟进时，请手动调用碰撞跟踪对象的Recycle函数，可在componentWillUnmount中进行
 *
 * Q: 如何让小人进行平滑移动？
 * A: 通过传递给JsvSpriteTranslate的control的实例，通过speed()设置移动速度，通过targetX()设置相对移动的目标位置，
 *    为该方向上移动的终点，数值为相对位置，调用start()，动画会开始。当需要小人暂停时，调用pause()进行动画暂停。
 *    实例中，按键按下时进行一次start()，不要重复调用start()，直到按键抬起时进行pause()
 *
 * Q: 如何设置红包下落效果？
 * A: 通过keyframe动画，在css文件中声明含有平移变化的keyframe，在js的style中通过animation属性设置动画
 *
 * Q: 如何设置分数上漂效果？
 * A: 通过keyframe动画，在css文件中声明含有平移变化的keyframe，在js的style中通过animation属性设置动画
 *    每次div从隐藏状态更换到显示状态时，动画都会执行一次。
 */

import React from 'react';
import './App.css';
import Score from "./score";
import RedPacket from "./red_packet";
import { JsvSpriteTranslate, TranslateControl } from "../jsview-utils/JsViewReactWidget/JsvSpriteTranslate";
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";
import AudioGetUrl from "./audio/get.mp3";
import AudioBoomUrl from "./audio/boom.mp3";
import AudioBgUrl from "./audio/bgMusic-1.mp3";
import createStandaloneApp from "../jsview-utils/JsViewReactTools/StandaloneApp";
import { getKeyFramesGroup } from "../jsview-utils/JsViewReactWidget/JsvDynamicKeyFrames";

function _EnableCss() {
  const group = getKeyFramesGroup("giftRainCss");
  if (!group.hasRule("scoreUp")) {
    const score_up = "@keyframes scoreUp {"
            + "from {transform: translate3d(0, 0px, 0);}"
            + "to {transform: translate3d(0, -20px, 0);}}";

    const rain_down = "@keyframes rainDown {"
            + "from {transform: translate3d(0, -780px, 0);}"
            + "to {transform: translate3d(0, 0px, 0);}}";

    group.insertRule(score_up);
    group.insertRule(rain_down);
  }
}

class MainScene extends FocusBlock {
  constructor(props) {
    super(props);
    this._bgImage = 'http://oss.image.qcast.cn/demo_images/red_packet_rain/bg.jpg';
    this._RedImage = 'http://oss.image.qcast.cn/demo_images/red_packet_rain/red.png';
    this._BigRedImage = 'http://oss.image.qcast.cn/demo_images/red_packet_rain/bigred.png';
    this._BoomImage = 'http://oss.image.qcast.cn/demo_images/red_packet_rain/boom.png';
    this._KiMiNormalImg = "http://oss.image.qcast.cn/demo_images/red_packet_rain/kimi_normal.png";
    this._KiMiBoomImg = "http://oss.image.qcast.cn/demo_images/red_packet_rain/kimi_boom.png";
    this._KiMiSmileImg = "http://oss.image.qcast.cn/demo_images/red_packet_rain/kimi_smile.png";
    this._ScoreAdd1 = "http://oss.image.qcast.cn/demo_images/red_packet_rain/add1.png";
    this._ScoreAdd5 = "http://oss.image.qcast.cn/demo_images/red_packet_rain/add5.png";
    this._ScoreMin1 = "http://oss.image.qcast.cn/demo_images/red_packet_rain/min1.png";
    this._AudioGetUrl = AudioGetUrl;
    this._AudioBoomUrl = AudioBoomUrl;
    this._CurrentRain = null;
    this.score = 0;
    this._Audio = null;
    this._AudioBgUrl = AudioBgUrl;
    this._BgAudio = null;
    this._IsRunning = false;
    this._DisableEffectSound = true;
    this.state = {
      kimi: this._KiMiNormalImg,
      score: this.score,
      min_score_image: null,
      add_score_image: null,
      scoreAddAnim: null,
      scoreMinAnim: null,
      moneyBag: null
    };

    this._ScoreAddAnimationEnd = this._ScoreAddAnimationEnd.bind(this);
    this._ScoreMinAnimationEnd = this._ScoreMinAnimationEnd.bind(this);

    this._TranslateControl = new TranslateControl();
    this._TranslateControl.speed(400);

    _EnableCss();
  }

  _onImpactTracer(rain) {
    if (rain !== null && rain !== this._CurrentRain) {
      this._CurrentRain = rain;
      console.log("_onImpactTracer rain:", rain);

      let kimi = this._KiMiNormalImg;
      let add_score_anim = null;
      let min_score_anim = null;
      let add_score_image = this._ScoreAdd1;
      let min_score_image = this._ScoreMin1;
      switch (rain.type) {
        case 0:
          add_score_anim = "scoreUp 0.2s";
          kimi = this._KiMiNormalImg;
          add_score_image = this._ScoreAdd1;
          this.score += 1;
          if (this._Audio) {
            this._Audio.src = this._AudioGetUrl;
            this._Audio.play();
          }
          break;
        case 1:
          add_score_anim = "scoreUp 0.2s";
          kimi = this._KiMiSmileImg;
          add_score_image = this._ScoreAdd5;
          if (this._Audio) {
            this._Audio.src = this._AudioGetUrl;
            this._Audio.play();
          }
          this.score += 5;
          break;
        case 2:
          min_score_anim = "scoreUp 0.2s";
          min_score_image = "block";
          min_score_image = this._ScoreMin1;
          kimi = this._KiMiBoomImg;
          this.score -= 1;
          if (this.score < 0) {
            this.score = 0;
          }
          if (this._Audio) {
            this._Audio.src = this._AudioBoomUrl;
            this._Audio.play();
          }
          break;
        default:
          break;
      }

      this.setState({
        kimi,
        score: this.score,
        scoreAddAnim: add_score_anim,
        scoreMinAnim: min_score_anim,
        min_score_image,
        add_score_image
      });
    }
  }

  onKeyUp(ev) {
    console.log("onKeyUp in : ", ev);
    if (ev.keyCode === 37 || ev.keyCode === 39) {
      this._IsRunning = false;
      this._TranslateControl.pause((x, y) => {
        console.log(`_TranslateControl pause x:${x}`);
      });
      return true;
    }

    return false;
  }

  onKeyDown(ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      if (this._NavigateHome) {
        this._NavigateHome();
      }
    } else if (ev.keyCode === 37) {
      console.log(" ev.keyCode === 37 !this.state.moveAnim ");
      if (!this._IsRunning) {
        this._TranslateControl.targetX(0).start();
        this._IsRunning = true;
      }
    } else if (ev.keyCode === 39) {
      console.log(" ev.keyCode === 39 !this.state.moveAnim ");
      if (!this._IsRunning) {
        this._TranslateControl.targetX(1280 - 220 - 194).start();
        this._IsRunning = true;
      }
    }
    return true;
  }

  _ScoreAddAnimationEnd(event) {
    event.stopPropagation();
    this.setState({
      scoreAddAnim: null,
    });
    console.log(" _ScoreAddAnimationEnd event:", event);
  }

  _ScoreMinAnimationEnd(event) {
    event.stopPropagation();
    this.setState({
      scoreMinAnim: null,
    });
    console.log(" _ScoreMinAnimationEnd event:", event);
  }

  _InitMoneyBag(ele) {
    if (this.state.moneyBag === null) {
      this.setState({ moneyBag: ele });
    }
  }

  _GetEffectAudio() {
    if (!this._DisableEffectSound) {
      return (<audio ref={(ref) => { this._Audio = ref; }} timeupdateless="true"/>);
    }
  }

  renderContent() {
    const effect_Audio = this._GetEffectAudio();

    return (
            <div style={{ width: "1280px", height: "720px" }}>
                {/* preload image */}
                <div key="pre_KiMiNormalImg"
                     style={{ backgroundImage: `url(${this._KiMiNormalImg})`, width: 1, height: 1 }}></div>
                <div key="pre_KiMiSmileImg"
                     style={{ backgroundImage: `url(${this._KiMiSmileImg})`, width: 1, height: 1 }}></div>
                <div key="pre_KiMiBoomImg"
                     style={{ backgroundImage: `url(${this._KiMiBoomImg})`, width: 1, height: 1 }}></div>
                <div key="pre_RedImage" style={{ backgroundImage: `url(${this._RedImage})`, width: 1, height: 1 }}></div>
                <div key="pre_BigRedImage"
                     style={{ backgroundImage: `url(${this._BigRedImage})`, width: 1, height: 1 }}></div>
                <div key="pre_BoomImage"
                     style={{ backgroundImage: `url(${this._BoomImage})`, width: 1, height: 1 }}></div>

                <div style={{ backgroundImage: `url(${this._bgImage})`, width: "1280px", height: "720px" }}>
                    <Score branchName={ `${this.props.branchName ? this.props.branchName : ""}/score` } score={this.state.score}/>
                    <JsvSpriteTranslate key="JsvSpriteTranslate" style={{
                      top: 476,
                      left: 220,
                      width: 194,
                      height: 244,
                    }} control={this._TranslateControl}>
                        <div key="kimi" style={{
                          top: 0,
                          left: 0,
                          width: 194,
                          height: 244,
                          backgroundImage: `url(${this.state.kimi})`,
                        }}>
                            <div key="MoneyBag" ref={ele => this._InitMoneyBag(ele)} style={{
                              top: 22,
                              left: 7,
                              width: 180,
                              height: 100,
                              backgroundColor: "rgba(0,0,0,0)"
                            }}></div>
                            {
                                this.state.min_score_visible !== "none" ?
                                    <div style={{
                                      top: 0,
                                      left: 40,
                                      width: 81,
                                      height: 74,
                                      visibility: this.state.scoreMinAnim !== null ? "visible" : "hidden",
                                      backgroundImage: `url(${this.state.min_score_image})`,
                                      animation: this.state.scoreMinAnim,
                                    }} onAnimationEnd={this._ScoreMinAnimationEnd}/> : null
                            }
                            {
                                this.state.add_score_visible !== "none" ?
                                    <div style={{
                                      top: 0,
                                      left: 40,
                                      width: 81,
                                      height: 74,
                                      visibility: this.state.scoreAddAnim !== null ? "visible" : "hidden",
                                      backgroundImage: `url(${this.state.add_score_image})`,
                                      animation: this.state.scoreAddAnim,
                                    }} onAnimationEnd={this._ScoreAddAnimationEnd}/> : null
                            }
                        </div>
                    </JsvSpriteTranslate>

                    {
                        <RedPacket MoneyBag={this.state.moneyBag} onImpactTracer={(rain) => {
                          this._onImpactTracer(rain);
                        }}/>
                    }
                </div>

                <audio key="AudioBg"
                       src={ this._AudioBgUrl}
                       timeupdateless="true"
                       ref={(ref) => {
                         this._BgAudio = ref;
                       }}/>
                {effect_Audio}
            </div>
    );
  }

  componentDidMount() {
    console.log("giftRain App componentDidMount in");
    if (this._BgAudio !== null) {
      this._BgAudio.play();
    }
    window.BgAudio = this._BgAudio;
    const focus_name = this.props.branchName ? this.props.branchName : "";
    this.changeFocus(`${focus_name}/score`);
  }

  componentWillUnmount() {
    console.log("giftRain App componentWillUnmount in");
  }
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
