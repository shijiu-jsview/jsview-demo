import React, { lazy } from 'react';
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";
import { Switch, Route } from "react-router-dom";
import {jJsvRuntimeBridge} from "../../utils/JsViewReactTools/JsvRuntimeBridge"

const SubScene0 = lazy(() => import('../videoDemo/App').then(m => ({ default: m.SubApp })));
const SubScene1 = lazy(() => import('../longImage/App').then(m => ({ default: m.SubApp })));

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);

        window.MyPopWindow = this; // for debug
        this._VisibleCallback = null;
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
        console.log("floatViewDemo PopWindow focused");

        // 演示调整尺寸，以便于识别owner界面的setPopupInitSize是否生效
        if (window.JsView) {
            this._VisibleCallback = (status)=>{
                if (status.status === "show") {
                    setTimeout(()=>{
                        console.log("DebugTest become show");
                        jJsvRuntimeBridge.popupResizePosition("center center", 0.6, 1, 16/9);
                    }, 1000);
                }
            };

            if (window.JsView.getVisibility() === "show") {
                console.log("DebugTest now is show");
                this._VisibleCallback({status:"show"}); // 模拟窗口可视事件
                this._VisibleCallback = null; // 清理callback，不触发unmount释放
            } else {
                // 当前不可见，可见后再进行延迟显示
                console.log("DebugTest now is hide");
                window.JsView.onVisibilityChange(this._VisibleCallback);
            }
        }

        // 浮窗系统整体为一个焦点系统，不需要再次调用 jJsvRuntimeBridge.popupGainFocus
        // 角标界面消失后，焦点自动会落到此window中
    }

    componentWillUnmount() {
        if (this._VisibleCallback !== null) {
            // 释放引用，以免离开界面后，界面的事件处理仍然被回调
            window.JsView.removeEventCallback(this._VisibleCallback);
            this._VisibleCallback = null;
        }
    }

    renderContent() {
        return <>
        <div>
            <Switch>
                <Route path={`${this.props.match.path}/SubScene0`}>
                    <SubScene0 branchName={`${this.props.match.path}/SubScene0`} navigateHome={this._NavigateHome} />
                </Route>
                <Route path={`${this.props.match.path}/SubScene1`}>
                    <SubScene1 branchName={`${this.props.match.path}/SubScene1`}  navigateHome={this._NavigateHome} />
                </Route>
            </Switch>
        </div>
        <div style={{
            textAlign: "left",
            fontSize: "30px",
            lineHeight: "50px",
            color: "#0000FF",
            backgroundColor: "rgba(234,66,221,0.5)",
            left: 1280 - 350,
            top: 30,
            width: (350),
            height: 50,
        }}>{`这是弹出框[${this.props.location.search}]`}</div>
        </>;
    }
}

const App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};
