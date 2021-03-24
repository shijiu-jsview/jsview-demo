import React, { lazy } from 'react';
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";
import createStandaloneApp from "../jsview-utils/JsViewReactTools/StandaloneApp";
import { Switch, Route } from "react-router-dom";
import {jJsvRuntimeBridge} from "../jsview-utils/JsViewReactTools/JsvRuntimeBridge"

const SubScene0 = lazy(() => import('../videoDemo/App').then(m => ({ default: m.SubApp })));
const SubScene1 = lazy(() => import('../longImage/App').then(m => ({ default: m.SubApp })));

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);

        window.MyPopWindow = this;
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
        setTimeout(()=>{
            jJsvRuntimeBridge.popupResizePosition("center center", 0.6, 1, 16/9);
        }, 1000);

        // 浮窗系统整体为一个焦点系统，不需要再次调用 jJsvRuntimeBridge.popupGainFocus
        // 角标界面消失后，焦点自动会落到此window中
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
