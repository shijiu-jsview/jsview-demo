/**
 * Created by donglin.lu@qcast.cn on 11/13/2020.
 */

/*
 * 【模块 export 内容】
 * createStandaloneApp: 函数(参数见函数声明处)，将一个React.Component包装成含有焦点管理的应用
 */

import React from 'react';
import { FdivRouter } from "../JsViewEngineWidget/index_widget";
import { jJsvRuntimeBridge } from "./JsvRuntimeBridge";
import { DebugObjectRefer } from "./DebugTool";

/*
 * createStandaloneApp 参数说明:
 *      main_scene_component   (React.Component)    应用主场景Component
 *      override_load_notify (function)          重载componentDidMount自动调用的notifyPageLoaded处理
 */
function createStandaloneApp(main_scene_component, override_load_notify) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this._FocusControl = null;
    }

    render() {
      const scene = React.createElement(main_scene_component,
          {
            branchName: "/__MainJsvApp",
            standAlone: true,
            navigateHome: ()=>{jJsvRuntimeBridge.closePage();}
          });
      return (<FdivRouter controlRef={(ref) => {
        this._FocusControl = ref;
      }} debugRefContainer={DebugObjectRefer}>
            {scene}
        </FdivRouter>);
    }

    componentDidMount() {
      // Should overwrite if calling notifyPageLoaded in other scenario
      this._FocusControl.changeFocus("/__MainJsvApp", true);
      if (!override_load_notify) {
        jJsvRuntimeBridge.notifyPageLoaded();
      } else if (override_load_notify instanceof Function) {
        override_load_notify();
      } else {
        console.log("INFO: load notify NOT a function");
      }
    }
  };
}

export default createStandaloneApp;
