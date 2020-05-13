/*
 * 【界面概述】
 * 展示tabWidget的使用方法
 *
 * 【控件介绍】
 * JsvTabWidget：带tab的主页控件
 *                  onEdge {function} 边缘回调
 *                  flowDirection {Symbol} (必选)控件的方向 
 *                  initFocusId {int} 初始的焦点
 *                  tabFocusable {boolean} tab是否可获得焦点
 *                  onWidgetMount{function} 控件挂载完成回调
 *
 *                  tabData {array} (必选)tab的数据 
 *                  tabMeasures {function} (必选)tab的measures函数 
 *                  tabOnItemFocus {function} tab的onItemFoucs函数
 *                  tabOnItemBlur {function} tab的onItemBlur函数
 *                  tabStyle {object} (必选)tab的style {width: 宽, height: 高, left: x, top: y} 
 *                  tabOnBlur {function} tab的onBlur函数
 *                  tabOnFocus {function} tab的onFocus函数
 *                  tabRenderItem {function} (必选)tab的renderItem函数 
 *                  tabRenderCurItem {function} tab的blur状态下焦点描画函数
 *                  tabRenderFocus {function} tab的renderFocus函数
 *                  tabRenderBlur {function} tab的renderBlur函数
 *                  tabPadding {object} 同SimpleWidget的padding, 默认{top: 0, right: 0, bottom: 0, left: 0}
 *
 *                  bodyStyle {object} (必选)body的style {width: 宽, height: 高, left: x, top: y} 
 *                  bodyData {array} (必选)body的数据 
 *                  bodyOnFocus {function} body的onFocus
 *                  bodyOnItemFocus {function} body的onItemFocus
 *                  bodyOnItemBlur {function} body的onItemBlur
 *                  bodyOnBlur {function} body的onBlur
 *                  bodyRenderItem {function} (必选)body的RenderItem 
 *                  bodyRenderFocus {function} body的renderFocus
 *                  bodyRenderBlur {function} body的renderBlur
 *                  bodyMeasures {function} (必选)body的measures 
 *                  bodyPadding {function} 同SimpleWidget的padding, 默认{top: 0, right: 0, bottom: 0, left: 0}
 *                  bodySlideStyle { Symbol } body的SlideStyle
 *
 * 【技巧说明】
 * Q: 当焦点在content上时，怎么更新tab上对应item的view？
 * A: tabRenderCurItem回调可以设置焦点在content上时对应tab上item显示的view
 */

import React from 'react';
import './App.css';

import { HORIZONTAL, SimpleWidget, EdgeDirection, VERTICAL, SlideStyle } from "../jsview-utils/jsview-react/index_widget.js"
import { JsvTabWidget } from "../jsview-utils/JsViewReactWidget/JsvTabWidget"
import { bodyData, tabData } from "./Data"
import focusBg from "./images/focus_bg.png"
import foucsNinePatch from "./images/nine_patch_focus.png"
import { globalHistory } from '../demoCommon/RouterHistory';
import { FocusBlock } from "../demoCommon/BlockDefine"

class App extends FocusBlock {
    constructor(props) {
        super(props);
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._RenderBlur = this._RenderBlur.bind(this)

        this._TabMeasures = this._TabMeasures.bind(this);
        this._TabRenderFocus = this._TabRenderFocus.bind(this);
        this._TabRenderItem = this._TabRenderItem.bind(this);
        this._TabOnItemFocus = this._TabOnItemFocus.bind(this);
        this._TabRenderCur = this._TabRenderCur.bind(this);
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _RenderFocus(item) {
        let x = -5 + (item.blocks.w - 10 - (item.blocks.w - 10) * 1.05) / 2
        let y = -5 + (item.blocks.h - 10 - (item.blocks.h - 10) * 1.05) / 2
        return (
            <div style={{
                animation: "focusScale 0.2s", backgroundImage: `url(${item.img})`,
                borderRadius: '8px 8px 8px 8px',
                borderImage: `url(${foucsNinePatch}) 40 fill`,
                borderImageWidth: '40px',
                borderImageOutset: "28px 28px 28px 28px",
                left: x, top: y, width: (item.blocks.w - 10) * 1.05, height: (item.blocks.h - 10) * 1.05
            }}>
            </div>
        )
    }

    _RenderBlur(item, callback) {
        return (
            <div style={{
                animation: "blurScale 0.2s", backgroundImage: `url(${item.img})`,
                borderRadius: '8px 8px 8px 8px',
                left: -5, top: -5, width: item.blocks.w - 10, height: item.blocks.h - 10
            }}
                onAnimationEnd={callback}>
            </div>
        )
    }

    _RenderItem(item) {
        return (
            <div style={{
                backgroundImage: `url(${item.img})`,
                borderRadius: '8px 8px 8px 8px',
                left: -5, top: -5, width: item.blocks.w - 10, height: item.blocks.h - 10
            }}>
            </div>
        )
    }

    _TabMeasures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _TabRenderItem(item) {
        return (
            <div style={{ width: item.blocks.w, height: item.blocks.h, color: "#FFFFFF", fontSize: "24px", textAlign: "center", lineHeight: item.blocks.h + "px" }}>
                {item.content}
            </div>
        )
    }

    _TabRenderFocus(item) {
        return (
            <div>
                <div style={{ width: item.blocks.w, height: item.blocks.h, color: "#0000FF", fontSize: "24px", textAlign: "center", lineHeight: item.blocks.h + "px" }}>
                    {item.content}
                </div>
                <div style={{ width: item.blocks.w, height: 5, top: item.blocks.h - 5, backgroundColor: "#FFFFFF" }} />
            </div>
        )
    }

    _TabRenderCur(item) {
        return (
            <div style={{ width: item.blocks.w, height: item.blocks.h, color: "#0000FF", fontSize: "24px", textAlign: "center", lineHeight: item.blocks.h + "px" }}>
                {item.content}
            </div>
        )
    }

    _TabOnItemFocus(item) {
        this.setState({ curTab: item.id })
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            globalHistory.goBack();
            this.changeFocus("/main");
        }
        return true;
    }
    
    renderContent() {
        return (
            <div style={{ backgroundColor: "#005500", width: 1280, height: 720 }}>
                <JsvTabWidget
                    flowDirection={HORIZONTAL}
                    branchName={this.props.branchName + "/tabwidget"}

                    tabStyle={{ left: 64, top: 100, width: 1280, height: 50 }}
                    tabRenderItem={this._TabRenderItem}
                    tabRenderFocus={this._TabRenderFocus}
                    tabMeasures={this._TabMeasures}
                    tabRenderCurItem={this._TabRenderCur}
                    tabData={tabData}

                    bodyStyle={{ left: 0, top: 170, width: 1280, height: 496 }}
                    bodyRenderItem={this._RenderItem}
                    bodyRenderFocus={this._RenderFocus}
                    bodyRenderBlur={this._RenderBlur}
                    bodyMeasures={this._Measures}
                    bodyPadding={{ left: 64, right: 64, top: 20, height: 20 }}
                    bodyData={bodyData}
                    onWidgetMount={() => { this.changeFocus(this.props.branchName + "/tabwidget") }}
                />
            </div>
        )
    }
}
export default App;