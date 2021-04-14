/*
 * 【界面概述】
 * 幸运九宫格抽奖Demo，按【确定】键启动抽奖，抽奖转盘会逐渐减速最后落在某个奖项上，
 * 显示奖品后，再次按下【确定】键可以再次启动抽奖
 *
 * 【控件介绍】
 * Fdiv：参照本地另一个demo: basicFdivConrol
 *
 * 【技巧说明】
 * Q: 如何每次启动转盘时目标位置各不相同？
 * A: 见本项目的views/NineSquared.js的_StartGame函数，为了实现每次旋转角度不动，对KeyFrames进行动态的增加和删除，在新的
 *    KeyFrame设置目的角度。具体操作为按照标准Html的规则，通过document.styleSheets查找到对应的keyFrame节点，
 *    通过H5标准函数接口deleteRule和insertRule动态调整keyFrame，然后将新的keyFrame传给div的style.animation启动动画。
 *    注意：由于keyFrame需要更名才能生效，所以，在rotatePanel处理中我们采取了乒乓模式来命名，根据调用的奇偶来对KeyFrame
 *    进行交替命名。
 *
 * Q: 如何在keyframe做一个个跳的动画？
 * A: 见本项目的views/NineSquared.js的_StartGame函数，style设置animation时，time-function配置项目，设置为"steps"
 */

import React from 'react';
import './App.css';
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";
import createStandaloneApp from "../jsview-utils/JsViewReactTools/StandaloneApp";
import MainPage from "./views/MainPage";
import ConstantVar from "./common/ConstantVar";

class MainScene extends FocusBlock {
  renderContent() {
    return (
            <div>
                <MainPage branchName={`${this.props.branchName}/MainPage`}/>
            </div>
    );
  }

  onKeyDown(ev) {
    if (ev.keyCode === ConstantVar.KeyCode.Back || ev.keyCode === ConstantVar.KeyCode.Back2) {
      if (this._NavigateHome) {
        this._NavigateHome();
      }
      return true;
    }
    return false;
  }

  componentDidMount() {
    console.log("NineSquared App componentDidMount in");
    this.changeFocus(`${this.props.branchName}/MainPage`);
  }

  componentWillUnmount() {
    console.log("NineSquared App componentWillUnmount in");
  }
}
const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
