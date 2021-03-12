/*
 * @Author: ChenChanghua
 * @Date: 2021-03-10 15:59:05
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2021-03-12 09:35:55
 * @Description: file content
 */
import React from 'react';
import { FdivWrapper, SimpleWidget, VERTICAL, EdgeDirection, SWidgetDispatcher } from "../jsview-utils/jsview-react/index_widget";
import { getGlobalHistory } from '../demoCommon/RouterHistoryProxy';
import { jJsvRuntimeBridge } from "../demoCommon/JsvRuntimeBridge";
import createStandaloneApp from "../demoCommon/StandaloneApp";
import { JsvTextStyleClass } from "../jsview-utils/JsViewReactTools/JsvStyleClass";
import { FocusBlock } from "../demoCommon/BlockDefine";

let quitData = [
    {
        w: 100,
        h: 50,
        content: "确定"
    },
    {
        w: 100,
        h: 50,
        content: "取消"
    }
]
class MainScene extends FocusBlock {
    constructor(props) {
        super(props);
        this.measures = this.measures.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderFocus = this.renderFocus.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    measures(item) {
        return SimpleWidget.getMeasureObj(item.w + 50, item.h, true, false);
    }

    renderItem(item) {
        return (
            <div style={{ width: item.w, height: item.h, fontSize: "40px", color: "#FFFFFF" }}>
                {item.content}
            </div>
        )
    }

    renderFocus(item) {
        return (
            <div style={{ width: item.w, height: item.h, fontSize: "40px", color: "#0000FF" }}>
                {item.content}
            </div>
        )
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            this.props.callback(false);
        }
        return true;
    }

    onClick(item) {
    }

    onFocus() {
        this.changeFocus(this.props.branchName + "/quit")
    }

    renderContent() {
        return (
            <React.Fragment>
                <div style={{ left: 0, top: 0, width: 350, height: 200, backgroundColor: "rgba(0,0,0,0.7)" }}></div>
                <div style={{ top: 20, width: 350, height: 50, fontSize: "40px", color: "#FFFFFF", textAlign: "center" }}>
                    是否退出
                </div>
                <div style={{ left: 50, top: 120 }}>
                    <SimpleWidget
                        width={300}
                        height={50}
                        direction={VERTICAL}
                        data={quitData}
                        onClick={this.onClick}
                        renderItem={this.renderItem}
                        renderFocus={this.renderFocus}
                        measures={this.measures}
                        branchName={`${this.props.branchName}/quit`}
                    />
                </div>
            </React.Fragment >

        )
    }
}

const App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};
