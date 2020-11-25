/*
 * 【界面概述】
 * 展示通过JsvDynamicKeyFrames控件，动态创建可定制的keyframe的样例，重复10次
 *
 * 【控件介绍】
 * getKeyFramesGroup：获取KeyFrame管理组句柄
 *      获得句柄后提供的接口有：
 *      insertRule(String keyFrameDescribe)     激活一个钉子的keyFrame，参数为该keyFrame的声明
 *      removeRule(String keyFrameName)         从管理组中删除一个指定名字的KeyFrame，
 *                                              请务必保证在willUnmountComponent前清理，
 *                                              否则将有可怕的内存泄漏
 * 【技巧说明】
 * Q: 如何创建一个keyFrame？
 * A: 首先通过 getKeyFramesGroup() 获得管理组的句柄，可以如下定制一个css文件来定制一个新组:
 *    @keyframes named-new-tag{}
 *    然后通过 getKeyFrameGroup("named-new-tag")来获取这个组。
 *    其次，如在css文件中声明keyFrame结构体那样，制作一个keyFrame描述字符串。特别说明的是，
 *    按照css文件规则，同名的keyFrame仍然能够插入，并不会报错，但自生效第一个。
 *    最后，通过管理组的 insertRule接口，添加这个自定义个keyFrame。
 *    【注意】请务必保证在willUnmountComponent前调用removeRule接口清理掉这个keyFrame
 */

import React from 'react';
import createStandaloneApp from "../demoCommon/StandaloneApp";
import { FocusBlock } from "../demoCommon/BlockDefine";
import { getKeyFramesGroup } from "../jsview-utils/JsViewReactWidget/JsvDynamicKeyFrames";

let sAnimIndexToken = 0;
class MainScene extends FocusBlock {
  constructor(props) {
    super(props);
    this._KeyFrameControl = getKeyFramesGroup();
    this._ActiveKeyFrameName = null;
    this._CurrentOffsetX = 0;
    this.state = {
      keyAnimation: null,
      loopLeft: 5
    };
  }

  onKeyDown(ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      if (this._NavigateHome) {
        this._NavigateHome();
      }
      return true;
    }
    return false;
  }

  _animateNext() {
    if (this._ActiveKeyFrameName !== null) {
      this._KeyFrameControl.removeRule(this._ActiveKeyFrameName);
      this._ActiveKeyFrameName = null;
    }

    const left_loop = this.state.loopLeft - 1;
    if (left_loop > 0) {
      this._ActiveKeyFrameName = `Frame${sAnimIndexToken++}`;
      let keyframe = `@keyframes ${this._ActiveKeyFrameName} {`;
      const origin_x = this._CurrentOffsetX;
      this._CurrentOffsetX += 300;
      keyframe += `0%{transform:translate3d(${origin_x}px,0px,0px)}`;
      keyframe += `100%{transform:translate3d(${this._CurrentOffsetX}px,0px,0px)}`;
      keyframe += "}";

      this._KeyFrameControl.insertRule(keyframe);
    }

    this.setState({
      keyAnimation: (left_loop > 0 ? `${this._ActiveKeyFrameName} 2s linear` : null),
      loopLeft: left_loop,
    });
  }

  componentDidMount() {
    this._animateNext();
  }

  renderContent() {
    const that = this;
    return (
        <div>
            <div style={{
              textAlign: "center",
              fontSize: "30px",
              lineHeight: "50px",
              color: "#ffffff",
              left: 100,
              top: 20,
              width: (1280 - 200),
              height: 50,
              backgroundColor: "rgba(27,38,151,0.8)"
            }}>{`动画指令动态生成，不需要提前准备css`}</div>
            <div style={{
              top: 200,
              left: 100,
              height: 100,
              width: 100,
              color: "#FFFFFF",
              fontSize: "20px",
              backgroundColor: "#00F0F0",
              animation: this.state.keyAnimation,
            }}
                onAnimationEnd={() => { that._animateNext(); }}
            >{this.state.loopLeft}</div>
        </div>);
  }
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
