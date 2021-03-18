/*
 * @Author: ChenChanghua
 * @Date: 2021-03-10 16:30:38
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2021-03-12 09:36:11
 * @Description: file content
 */

import React from 'react';
import { FocusBlock } from "../demoCommon/BlockDefine";
import createStandaloneApp from "../demoCommon/StandaloneApp";
import { HORIZONTAL, ButtonsList } from "../demoCommon/ButtonsList"
import {jJsvRuntimeBridge} from "../jsview-utils/JsViewReactTools/JsvRuntimeBridge"
import { getMainPath } from "./Tools"

import JsvTransparentDiv from "../jsview-utils/JsViewReactWidget/JsvNativeSharedDiv"


class MainScene extends FocusBlock {
    constructor(props) {
        super(props);

        this._ButtonsData =  [
            {
                text: "视频界面(迅速)",
                onClick: ()=>{
                    // 启动进行了预热的界面
                    if (window.JsView) {
                        jJsvRuntimeBridge.warmLoadView(this._WarmViewId, null);
                        this._WarmViewId = -1;
                        jJsvRuntimeBridge.closePage();
                    }
                    console.log("warmLoadView done");
                }
            },
            {
                text: "长图片界面(稍慢)",
                onClick: ()=>{
                    // 启动进行了预热的界面，但hash进行了变更
                    if (window.JsView) {
                        jJsvRuntimeBridge.warmLoadView(
                            this._WarmViewId,
                            `${getMainPath()}#/users/IsolateScene/floatViewDemo_PopWindow/SubScene1?plugin=B1`);
                        jJsvRuntimeBridge.closePage();
                    }
                    console.log("warmLoadView with hash change done");
                }
            },
            {
                text: "长文字界面(最慢)",
                onClick: ()=>{
                    // 启动一个非预热的界面，同时关闭预热内容
                    if (window.JsView) {
                        jJsvRuntimeBridge.openWindow(
                            `${getMainPath()}#/users/longText`,
                            null,
                            window.JsView.EngineJs,
                            `${window.JsView.CodeRevision}`,
                            null
                        );
                        jJsvRuntimeBridge.closeWarmedView();
                        jJsvRuntimeBridge.closePage();
                    }
                    console.log("startView with different URL");
                }
            },
        ];

        this._WarmViewId = -1;

        this.state = {
          coolDown: 2, // 2秒coolDown预热其他页面的准备时间
        };
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            if (this._NavigateHome) {
                this._NavigateHome();
            }
        }
        return true;
    }

    onFocus() {
        if (window.JsView) {
            // 调整弹出框的显示范围
            jJsvRuntimeBridge.popupRelativePosition("right bottom", 0.4, 0.4, 16/9);
            jJsvRuntimeBridge.popupGainFocus();

            // 进行界面预加载
            let load_url = `${getMainPath()}#/users/IsolateScene/floatViewDemo_PopWindow/SubScene0?plugin=A1`;
            console.log("init warmUpView load_url=" + load_url);
            this._WarmViewId = jJsvRuntimeBridge.warmUpView(
                window.JsView.EngineJs,
                load_url
            );
        }

        this._coolDown();
    }

    renderContent() {
        return (
            <>
                <JsvTransparentDiv style={{width:2000,height:2000}}/>
                <div style={{ left: 0, top: 0, width: 1240, height: 680, backgroundColor: "rgba(234,66,221,0.3)" }}/>
                <div style={{ left: 40, top: 40, width: 1160, height: 600, backgroundColor: "rgb(234,66,221)" }}/>
                <div key="coolDown" style={{
                    top: 300, left:240, width: 800, height: 120,
                    fontSize: "80px", color: "#FFFFFF", textAlign: "center",
                    visibility: this.state.coolDown > 0 ? "visible" : "hidden"
                }}>
                    {`精彩内容 ${this.state.coolDown} 秒后出现\n可以【返回】退出`}
                </div>
                <div key="content" style={{visibility: this.state.coolDown === 0 ? "visible" : "hidden"}}>
                    <div style={{ top: 175, left:240, width: 800, height: 120,
                        fontSize: "80px", color: "#FFFFFF", textAlign: "center" }}>
                        选择启动的界面
                    </div>
                    <div style={{ left: 140, top: 375 }}>
                        <ButtonsList
                            buttonsData = {this._ButtonsData}
                            direction = {HORIZONTAL}
                            itemWidth = {300}
                            itemHeight = {80}
                            itemGap = {50}
                            focusBranchName = {`${this.props.branchName}/Buttons`}
                        />
                    </div>
                </div>
            </>
        )
    }

    _coolDown() {
        if (this.state.coolDown > 0) {
            let that = this;
            setTimeout(()=>{
                this.setState({coolDown: this.state.coolDown - 1});
                that._coolDown();
            }, 1000);
        } else {
            // 进入选择界面
            this.changeFocus(`${this.props.branchName}/Buttons`)
        }
    }
}

const App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};