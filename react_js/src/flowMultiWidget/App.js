/*
 * 【界面概述】
 * 带有菜单的橱窗界面，主要展示界面间切换的用法
 *
 * 【控件介绍】
 * SimpleWidget：见simpleMetroWidget
 * JsvMarquee: 见showcaseDemo
 *
 * 【技巧说明】
 * Q: 如何实现菜单的显示和隐藏?
 * A: 通过设置菜单界面的visibility属性
 */

import React from 'react';
import './App.css';
import FlowMetroWidget from './views/FlowMetroWidget'
import MenuWidget from './views/MenuWidget'
import { HomePageData, HomePageStyle, MenuPageStyle, MenuPageData } from './DataProvader'
import { globalHistory } from '../demoCommon/RouterHistory';
import { FocusBlock } from "../demoCommon/BlockDefine"

class App extends FocusBlock {
    constructor(props) {
        super(props);
        this.state = {
            menu_visibility: "hidden",
        }
    }
    _ShowMenu() {
        this.setState({
            menu_visibility: "visible",
            menu_animation: "menuShow 0.2s"
        })
        this.changeFocus(this.props.branchName + "/menu")
    }

    _HideMenu() {
        this.setState({
            menu_visibility: "hidden",
            menu_animation: "menuHidden 0.2s"

        })
        this.changeFocus(this.props.branchName + "/flowMetro");
    }

    onKeyDown(ev) {
        console.log("ev.keyCode:", ev.keyCode);
        if (ev.keyCode === 10001 || ev.keyCode === 77) {//menu key or M
            this._ShowMenu();
        } else if (this.state.menu_visibility === "visible" && (ev.keyCode === 10000 || ev.keyCode === 82)) {// back key or R
            this._HideMenu();
        } else if (ev.keyCode === 10000 || ev.keyCode === 27) {
            globalHistory.goBack();
            this.changeFocus("/main");
        }
        return true;
    }

    renderContent() {
        console.log("render App");
        return (
            <div key="background" style={{ top: 0, left: 0, width: 1280, height: 720, backgroundColor: "#123f80" }}>
                <FlowMetroWidget style={{ left: 50, top: 50, width: 800, height: 600 }} data={HomePageData}
                    pageTheme={HomePageStyle} branchName={this.props.branchName + "/flowMetro"}
                    onWidgetMount={() => { this.changeFocus(this.props.branchName + "/flowMetro") }}
                />
                <MenuWidget
                    style={{
                        visibility: this.state.menu_visibility,
                        left: (1280 - 300) / 2, top: (720 - 255) / 2, width: 300, height: 255,
                        backgroundColor: "#000000",
                        animation: this.state.menu_animation
                    }}
                    branchName={this.props.branchName + "/menu"}
                    pageTheme={MenuPageStyle}
                    title="菜单"
                    data={MenuPageData}
                    onClose={() => {
                        this._HideMenu();
                    }} />
            </div>
        )
    }
}
export default App;
