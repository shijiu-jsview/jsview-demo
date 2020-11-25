/*
 * 【界面概述】
 * 转盘抽奖展示Demo，按【确定】键后启动转盘，自动停止后，展示得奖情况。看到得奖结果后，可以再次按下【确定】重启转盘
 *
 * 【控件介绍】
 * Fdiv：参照本地另一个demo: basicFdivConrol
 *
 * 【技巧说明】
 * Q: 如何让转盘上的各个奖项旋转一个角度进行展示？
 * A: 通过div的style的transform属性可进行静态的旋转，例如：
 *    <div style={{transform: 'rotate3d(0,0,1,45deg)', backgroundImage:'XXXX'></div>
 *
 * Q: 转盘结束后，如何能再次启动转盘旋转，并且每次旋转所旋转的角度各不相同？
 * A: 见本项目的turntable.js的rotatePanel函数，为了实现每次旋转角度不动，对KeyFrames进行动态的增加和删除，在新的
 *    KeyFrame设置目的角度。具体操作为按照标准Html的规则，通过document.styleSheets查找到对应的keyFrame节点，
 *    通过H5标准函数接口deleteRule和insertRule动态调整keyFrame，然后将新的keyFrame传给div的style.animation启动动画。
 *    注意：由于keyFrame需要更名才能生效，所以，在rotatePanel处理中我们采取了乒乓模式来命名，根据调用的奇偶来对KeyFrame
 *    进行交替命名。
 */

import React from 'react';
import './App.css';
import Turntable from "./turntable";
import { FocusBlock } from "../demoCommon/BlockDefine";
import createStandaloneApp from "../demoCommon/StandaloneApp";

class MainScene extends FocusBlock {
  constructor(props) {
    super(props);
    this.state = { rain: null };
  }

  renderContent() {
    return (
            <div style={{ width: "1280px", height: "720px" }}>
                <Turntable branchName={ `${this.props.branchName}/Turntable` }/>
            </div>
    );
  }

  onKeyDown(ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      if (this._NavigateHome) {
        this._NavigateHome();
      }
    }
    return true;
  }

  componentDidMount() {
    this.changeFocus(`${this.props.branchName}/Turntable`, true);
  }
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
