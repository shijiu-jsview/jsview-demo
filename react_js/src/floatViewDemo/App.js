/*
 * 【界面概述】
 * 展示启动角标浮窗，并在角标浮窗展示时，预热角标浮窗引导到的霸屏浮窗页面。
 * 预热后，达到在角标浮窗界面点击后能迅速地进入霸屏浮窗页面，用户不在察觉到2~3的启动时间(提前做完)。
 * 本工程中文件分工：
 * App.js       负责调用Native接口启动角标界面
 * PopCorner.js 角标浮窗界面展示内容
 * PopWindow.js 从角标浮窗启动的霸屏浮窗界面展示内容
 *
 * 【控件介绍】
 * jJsvRuntimeBridge：
 *      预热接口: warmUpView, warmLoadView, closeWarmedView
 *      浮窗控制接口: popupResizePosition, popupGainFocus,
 *
 * 【技巧说明】
 * Q: 如何启动角标界面？
 * A: 调用Native端平台提供的接口 window.jDemoInterface.startPopWindowPage。小程序之家等正式平台上，一般为
 *    Native端直接调起(通过Launcher运营等手段)
 *
 * Q: 角标界面如何控制自己的展示位置？
 * A: 通过jJsvRuntimeBridge的 popupResizePosition 接口，在浮窗界面加载完成后，浮窗界面代码
 *    中(例如PopConer.js)调用 popupResizePosition 来通知Native来调整界面的展示位置，并在同js中通过 popupGainFocus来
 *    让浮窗系统获得焦点，能接受按键。
 *    PS: 若浮窗不需要获取焦点，则可以不调用popupGainFocus即可
 *
 * Q: 如何预热界面？
 * A: 通过 warmUpView接口预热(加载)界面，这个接口返回一个ViewId，当该界面需要进行展示时，调用warmLoadView来进行加载。
 *    若预热的界面在展示前就废弃，不需要进行展示的场合，调用closeWarmedView来关闭资源
 */

import React from 'react';
import createStandaloneApp from "../jsview-utils/JsViewReactTools/StandaloneApp";
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";
import { HORIZONTAL, ButtonsList } from "../demoCommon/ButtonsList"
import { getMainPath } from "./Tools"

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);

        this._ButtonsData = [
            {
                text: "启动角标(会缩放)",
                onClick: ()=>{
                    console.log("Do start corner...(start with full)");
                    this.setState({Started: this.state.Started + 1});
                    if (window.jDemoInterface && window.JsView) {
                        // 运行在JsView Demo 环境中，进行启动角标处理
                        let main_path = getMainPath();
                        window.jDemoInterface.startPopWindowPage(
                            window.JsView.EngineJs,
                            `${main_path}?warmMode=0&sizeMode=full#/users/IsolateScene/floatViewDemo_PopCorner`,
                            window.JsView.CodeRevision
                        );
                    } else {
                        console.warn("Warning: only valid in JsView Demo");
                    }
                }
            },
            {
                text: "启动角标(不缩放)",
                onClick: ()=>{
                    console.log("Do start corner...(start with mini)");
                    this.setState({Started: this.state.Started + 1});
                    if (window.jDemoInterface && window.JsView) {
                        // 运行在JsView Demo 环境中，进行启动角标处理
                        let main_path = getMainPath();
                        window.jDemoInterface.startPopWindowPage(
                            window.JsView.EngineJs,
                            `${main_path}?warmMode=0&sizeMode=mini#/users/IsolateScene/floatViewDemo_PopCorner`,
                            window.JsView.CodeRevision
                        );
                    } else {
                        console.warn("Warning: only valid in JsView Demo");
                    }
                }
            },
            {
                text: "退出界面",
                onClick: ()=>{
                    if (this._NavigateHome) {
                        this._NavigateHome();
                    }
                }
            },
        ];

        this.state = {
            Started: 0,
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

    componentDidMount() {
        this.changeFocus(`${this.props.branchName}/Selector`);
    }

    renderContent() {
        return (
            <>
                <div key="LargeBackgroundColor" style={{
                    width: 4000,
                    height: 4000,
                    backgroundColor: "rgb(21, 179, 191)"
                }}/>
                <div style={{
                    textAlign: "center",
                    fontSize: "30px",
                    lineHeight: "50px",
                    color: "#ffffff",
                    left: 140,
                    top: 20,
                    width: 1000,
                    height: 50,
                    backgroundColor: "rgba(27,38,151,0.8)"
                }}>{`一个带子界面预热的角标广告`}</div>
                <div style={{ left: 150, top: 200 }}>
                    <ButtonsList
                        buttonsData = {this._ButtonsData}
                        direction = {HORIZONTAL}
                        itemWidth = {280}
                        itemHeight = {80}
                        itemGap = {60}
                        focusBranchName = {`${this.props.branchName}/Selector`}
                    />
                </div>
                <div style={{textAlign: "center",
                    visibility: this.state.Started > 0 ? "visible" : "hidden",
                    fontSize: "30px",
                    lineHeight: "50px",
                    color: this.state.Started % 2 === 0 ? "#ff0000" : "#0000ff",
                    left: 140,
                    top: 370,
                    width: 1000,
                    height: 100}}>
                    {`角标启动中{第${this.state.Started}次}...\n角标启动过程中，该界面仍然可以使用左右键调焦点`}
                </div>
            </>
        );
    }
}

const App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};