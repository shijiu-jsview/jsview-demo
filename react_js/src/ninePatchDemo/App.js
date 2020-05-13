/*
 * 【界面概述】
 * 绘制三个矩形，通过能在矩形间进行移动的焦点框来展示JsvNinePatch控件的使用方法
 *
 * 【控件介绍】
 * JsvSquareNinePatch：对原图为正方形进行NinePatch扩展的控件
 *      style { object } (必须) div的left,top,width,height的定位信息
 *      animTime { int } transition动画时长
 *      imageUrl { string } (必须) 图片url
 *      imageWidth { int } (必须) 图片的宽，正方形宽和高相等
 *      contentWidth { int } (必须) 图片延展区域的宽
 *      borderOutset { int } 边框向外扩展的大小
 *
 * 【技巧说明】
 * Q: 如何实现NinePatch框的大小和位置的变化?
 * A: 通过css配置控件的left,top,width,height的transition，setState时，只需要改变框的x,y,w,h，
 *    引擎就会自动按照transition中定义的动画，对框进行尺寸和位置调整动画。
 */

import React, { Component } from 'react';
import "./App.css"
import {Router, FdivRoot, Fdiv, HORIZONTAL, SimpleWidget, SWidgetDispatcher, EdgeDirection, VERTICAL, SlideStyle } from "../jsview-utils/jsview-react/index_widget.js"
import {JsvSquareNinePatch} from '../jsview-utils/JsViewReactWidget/JsvNinePatch'
import {FocusBlock} from "../demoCommon/BlockDefine"
import borderImgPath from './border.png';
import {globalHistory} from '../demoCommon/RouterHistory';

let data = [
    {
        "blocks":{
            "w":170,
            "h":170
        },
        "focusable":true,
        "color": "#FF9900",
        "content": 0
    },
    {
        "blocks":{
            "w":300,
            "h":300
        },
        "focusable":true,
        "color": "#0099FF",
        "content": 1
    },
    {
        "blocks":{
            "w":170,
            "h":170
        },
        "focusable":true,
        "color": "#FF9900",
        "content": 2
    },
]

class App extends FocusBlock {
    constructor(props) {
        super(props);
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._RenderBlur = this._RenderBlur.bind(this);
        this._onWidgetMount = this._onWidgetMount.bind(this);
        this._onItemFocus = this._onItemFocus.bind(this);

        this.state = {
            focusFrameX: 50,
            focusFrameY: 50,
            focusFrameW: 100,
            focusFrameH: 100,
        }
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _RenderFocus(item) {
        let x = (item.blocks.w - 10 - (item.blocks.w - 10) * 1.05) / 2
        let y = (item.blocks.h - 10 - (item.blocks.h - 10) * 1.05) / 2
        return (
            <div style={{backgroundColor: item.color, left: x, top: y, width: (item.blocks.w - 10) * 1.05, height: (item.blocks.h - 10)* 1.05, color: "#FF0000", animation: "focusScale 0.2s"}}>
                { item.content }
            </div>
        )
    }

    _RenderBlur(item, callback) {
        return (
            <div style={{backgroundColor: item.color, width: item.blocks.w - 10, height: item.blocks.h - 10, color: "#FF00FF", animation: "blurScale 0.2s"}}
            onAnimationEnd={callback}>
                { item.content }
            </div>
        )
    }

    _RenderItem(item) {
        return (
            <div style={{backgroundColor: item.color, width: item.blocks.w - 10, height: item.blocks.h - 10, color: "#FFFFFF"}}>
                { item.content }
            </div>
        )
    }

    _onItemFocus(item, edgeInfo, queryObj) {
        let position = queryObj.queryPosition(queryObj.id)
        let x = position.xPos + (item.blocks.w - 10 - (item.blocks.w - 10) * 1.05) / 2
        let y = position.yPos + (item.blocks.h - 10 - (item.blocks.h - 10) * 1.05) / 2
        this.setState({
            focusFrameX: x,
            focusFrameY: y,
            focusFrameW: (item.blocks.w - 10) * 1.05,
            focusFrameH: (item.blocks.h - 10) * 1.05,
        })
    }

    renderContent() {
        return(
            <div>
                <div style={{width: 1280, height: 720, backgroundColor: '#FFFFFF'}}>
                    <SimpleWidget 
                    width={ 1000 } 
                    height={ 400 } 
                    direction={ HORIZONTAL } 
                    data={ data } 
                    onClick={ (item) => {} }
                    renderBlur={ this._RenderBlur }
                    slideStyle={SlideStyle.seamLess}
                    renderItem={ this._RenderItem }
                    renderFocus={ this._RenderFocus }
                    onItemFocus={ this._onItemFocus }
                    measures={ this._Measures }
                    onWidgetMount={ this._onWidgetMount }
                    padding={{left: 50, right: 50, top: 50, height: 50}}
                    branchName={ this.props.branchName + "/swidget" }/>
                </div>
                <div style={{top: 50, left: 50}}>
                    <JsvSquareNinePatch
                        style={{ top: this.state.focusFrameY, left: this.state.focusFrameX, width: this.state.focusFrameW, height: this.state.focusFrameH}}
                        imageUrl={ borderImgPath }
                        imageWidth={ 81 }
                        contentWidth={ 21 }
                        borderOutset={ 10 }
                        animTime={ 0.2 }
                        />
                </div>
            </div>
        )
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            globalHistory.goBack();
            this.changeFocus("/main");
            return true;
        }
        return false;
    }

    _onWidgetMount() {
    }

    componentDidMount() {
        this.changeFocus(this.props.branchName + "/swidget");
    }
}

export default App