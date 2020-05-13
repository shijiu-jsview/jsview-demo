/*
 * 【界面概述】
 * 展示SimpleWidget控件的用法
 *
 * 【控件介绍】
 * SimpleWidget: 
 *      top {int} 控件的y，默认为0
 *      left {int} 控件的x， 默认为0
 *      width {int} (必选)控件的宽
 *      height {int} (必选)控件的高
 *      padding {object} 控件内边距， 默认为{left: 0, right: 0, top: 0, bottom: 0}
 *      direction {enum} (必选)控件方向 HROIZONTAL/VERTICAL
 *      data {array} (必选)数据列表
 *      branchName {string} (必选)控件名称，用于设置焦点
 *      slideStyle {SlideStyle} 页面滑动类型 seamless/wholepage
 *      dispatcher {SWidgetDispatcher} 用于设置SimpleWidget控件内部的状态，默认为null
 *      measures {function} (必选)返回item的模板信息的回调, 可调用SimpleWidget.getMeasureObj方法获取返回值
 *                              @params item data中的数据
 *                              @return 模板信息 格式: 
 *                                  {
 *                                      "blocks":{
 *                                          "w":330,
 *                                          "h":330
 *                                      },
 *                                      "focusable":true, //该item是否可获得焦点
 *                                      "hasSub": false, //该item中是否包含可获得焦点的控件
 *                                  }
 *      onClick {function} item点击回调 
 *                @params item data中的数据
 *      renderItem {function} (必选)item描画的回调
 *                @params item data中的数据
 *                @return JSX
 *      renderFocus {function} 焦点状态item描画的回调
 *                   @params item data中的数据
 *                   @return JSX
 *      renderBlur {function} 失去焦点item描画的回调
 *                  @params item data中的数据
 *                  @return JSX
 *      onFocus {function} 控件获取焦点的回调
 *      onBlur {function} 控件失去焦点的回调
 *      onItemFocus {function} item获得焦点的回调
 *                   @params item data中的数据
 *                   @params preEdge 前一个焦点的位置信息
 *                              {
 *                                  "direction": 边缘方向, 
 *                                  "rect": 到达边缘时的区域{x: 0, y: 0, width: 0,height: 0}
 *                              }
 *                   @params query 获取位置信息的query对象 { id: id, queryPosition: 获取位置的接口}
 *      onItemBlur {function} item失去焦点的回调
 *                  @params item data中的数据
 *                  @params query 获取位置信息的query
 *      onEdge {function} 焦点移动到边缘时的回调
 *              @params {"direction": {EdgeDirection}边缘方向, "rect": 到达边缘时的区域{x: 0, y: 0, width: 0,height: 0}}
 *
 * 【技巧说明】
 * Q: 焦点放大如何居中?
 * A: 1.renderFocus中需要计算view的位置。2.css动画的transform-origin需要设置为center
 * 
 * Q: 边缘格获取焦点放大后显示不全？
 * A: 设置padding，注意item的排布范围是控件的宽高减去对应的padding
 * 
 * Q: 焦点怎么移出控件？
 * A: 当焦点移动到控件边缘时，会调用onEdge回调。在回调中通过参数传递的值来决定焦点转移的行为
 * 
 * Q: 点击事件怎么获得
 * A: 传递onClick回调，回调参数是当前点击item的数据。
 */
import React from 'react';
import './App.css';
import { SimpleWidget, HORIZONTAL, SlideStyle} from "../jsview-utils/jsview-react/index_widget.js"
import { globalHistory } from '../demoCommon/RouterHistory';
import { FocusBlock } from "../demoCommon/BlockDefine"

let homePageData = [
    {
        "blocks": {
            "w": 200,
            "h": 160
        },
        "focusable": true,
        "color": "#000022",
        "content": 0
    },
    {
        "blocks": {
            "w": 200,
            "h": 160
        },
        "focusable": true,
        "color": "#003300",
        "content": 1
    },
    {
        "blocks": {
            "w": 200,
            "h": 160
        },
        "focusable": true,
        "color": "#000044",
        "content": 2
    },
    {
        "blocks": {
            "w": 400,
            "h": 320
        },
        "focusable": true,
        "color": "#000055",
        "content": 3
    },
    {
        "blocks": {
            "w": 200,
            "h": 160
        },
        "focusable": true,
        "color": "#000066",
        "content": 4
    },
    {
        "blocks": {
            "w": 200,
            "h": 160
        },
        "focusable": true,
        "color": "#0000CD",
        "content": 5
    },
]

let content = 6;
for (let i = 0; i < 5; i++) {
    homePageData.push({
        "blocks": {
            "w": 200,
            "h": 320
        },
        "focusable": true,
        "color": "#000022",
        "content": content++
    });
    homePageData.push({
        "blocks": {
            "w": 200,
            "h": 160
        },
        "focusable": true,
        "color": "#003300",
        "content": content++
    });
}

class App extends FocusBlock {
    constructor(props) {
        super(props);
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._RenderBlur = this._RenderBlur.bind(this);
        this._onWidgetMount = this._onWidgetMount.bind(this);
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, false)
    }

    _RenderFocus(item) {
        let width = (item.blocks.w - 10) * (1 / 0.9);
        let height = (item.blocks.h - 10) * (1 / 0.9);
        let x = ((item.blocks.w - 10) - width) / 2;
        let y = ((item.blocks.h - 10) - height) / 2;
        return (
            <div style={{animation: "focusScale 0.2s", left: x, top: y, backgroundColor: "#FF0000", width: width, height: height, color: "#FFFFFF", }}>
                {item.content}
            </div>
        )
    }

    _RenderBlur(item, callback) {
        return (
            <div style={{  backgroundColor: "#00FF00", width: item.blocks.w - 10, height: item.blocks.h - 10, color: "#FF00FF", animation: "blurScale 0.2s",}}
                onAnimationEnd={callback}>
                {item.content}
            </div>
        )
    }

    _RenderItem(item) {
        return (
            <div style={{ backgroundColor: item.color, width: item.blocks.w - 10, height: item.blocks.h - 10, color: "#FFFFFF" }}>
                {item.content}
            </div>
        )
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
            <div style={{width: 1920, height: 1080, backgroundColor: "#FFFFFF"}}>
                <SimpleWidget
                    top={120}
                    left={50}
                    width={1280}
                    height={520}
                    padding={{left: 20, top: 20, right: 20, bottom: 20}}
                    direction={HORIZONTAL}
                    data={homePageData}
                    onClick={(item) => {console.log("onclick" + item.content)}}
                    renderBlur={this._RenderBlur}
                    renderItem={this._RenderItem}
                    renderFocus={this._RenderFocus}
                    measures={this._Measures}
                    branchName={this.props.branchName + "/widget1"}
                    onWidgetMount={this._onWidgetMount}
                />
            </div>
        )
    }

    _onWidgetMount() {
        this.changeFocus(this.props.branchName + "/widget1")
    }
}
export default App;
