/*
 * 【界面概述】
 * 展示SimpleWidget控件的嵌套用法
 *
 * 【控件介绍】
 * SimpleWidget：见simpleMetroWidget
 * SWidgetDispatcher：向SimpleWidget分发消息的对象，用于设置SimpleWidget内部状态
 *                      成员函数：
 *                          dispatch
 *                              @params msg {obj} 消息体，{type: SWidgetDispatcher.Type, data: 数据}
 * SWidgetDispatcher.Type: 消息的类型
 *                          "setFocusId": Focus时初始的焦点id data为int
 *                          "setFocusRect": Focus时距离某区域最近的item获得焦点 data为{type:EdgeDirection, rect:{x:0, y:0, widht:0, height:0}}
 *                          "updateItem": 重新描画某个item data为int
 *                          "slideToItem": 界面移到某个item处 data为int
 *
 *
 * 【技巧说明】
 * Q: 如何实现嵌套?
 * A: 当SimpleWidget的measure回调返回值中hasSub为true时，该item的renderItem就可以返回可获得焦点的控件
 *
 * Q: 如何实现焦点的就近切换？
 * A: 通过dispatcher向将要获得焦点的控件发送setFocusRect消息。
 */

import React from 'react';
import './App.css';
import { SimpleWidget, SWidgetDispatcher, HORIZONTAL } from "../jsview-utils/jsview-react/index_widget";
import createStandaloneApp from "../jsview-utils/JsViewReactTools/StandaloneApp";
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";

const frameTemplate = [
    {
        blocks: {
            w: 340,
            h: 340
        },
        focusable: true,
        hasSub: true,
        id: 0,
    },
    {
        blocks: {
            w: 340,
            h: 340
        },
        focusable: true,
        hasSub: true,
        id: 1,
    },
    {
        blocks: {
            w: 340,
            h: 340
        },
        focusable: true,
        hasSub: true,
        id: 2,
    },
    {
        blocks: {
            w: 340,
            h: 340
        },
        focusable: true,
        hasSub: true,
        id: 3,
    },
];

const template = [
    {
        blocks: {
            w: 300,
            h: 100
        },
        focusable: true,
        color: "#000022",
        content: 0
    },
    {
        blocks: {
            w: 150,
            h: 100
        },
        focusable: true,
        color: "#003300",
        content: 1
    },
    {
        blocks: {
            w: 150,
            h: 100
        },
        focusable: true,
        color: "#000044",
        content: 2
    },
    {
        blocks: {
            w: 50,
            h: 200
        },
        focusable: true,
        color: "#000055",
        content: 3
    },
    {
        blocks: {
            w: 50,
            h: 200
        },
        focusable: true,
        color: "#000066",
        content: 4
    },
    {
        blocks: {
            w: 50,
            h: 200
        },
        focusable: true,
        color: "#0000CD",
        content: 5
    },
];

let content = 6;
for (let i = 0; i < 4; i++) {
    template.push({
        blocks: {
            w: 100,
            h: 150
        },
        focusable: true,
        color: "#000022",
        content: content++
    });
    template.push({
        blocks: {
            w: 100,
            h: 150
        },
        focusable: true,
        color: "#003300",
        content: content++
    });
    template.push({
        blocks: {
            w: 100,
            h: 150
        },
        focusable: true,
        color: "#003300",
        content: content++
    });
    template.push({
        blocks: {
            w: 100,
            h: 150
        },
        focusable: true,
        color: "#000022",
        content: content++
    });
}

class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focus: false,
            anim: null,
        }
    }

    focus() {
        this.setState({
            focus: true,
            anim: "focusScale 0.3s"
        })
    }

    blur() {
        this.setState({
            focus: false,
            anim: "blurScale 0.3s"
        })
    }

    render() {
        let item = this.props.data;
        const width = this.state.focus ? (item.blocks.w - 10) * (1 / 0.9) : item.blocks.w - 10;
        const height = this.state.focus ? (item.blocks.h - 10) * (1 / 0.9) : item.blocks.h - 10;
        const x = this.state.focus ? ((item.blocks.w - 10) - width) / 2 : 0;
        const y = this.state.focus ? ((item.blocks.h - 10) - height) / 2 : 0;

        return (
            <div style={{ animation: this.state.anim, top: y, left: x, backgroundColor: this.state.focus ? "#FF0000" : item.color, width, height, color: this.state.focus ? "#000000" : "#FFFFFF" }}>
                {item.content}
            </div>
        );
    }
}

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);
        this._Measures = this._Measures.bind(this);
        this._FrameMeasure = this._FrameMeasure.bind(this);
        this._FrameRenderItem = this._FrameRenderItem.bind(this);
        this._FrameOnItemFocus = this._FrameOnItemFocus.bind(this);
        this._FrameOnItemBlur = this._FrameOnItemBlur.bind(this);

        this._onWidgetMount = this._onWidgetMount.bind(this);

        this._DispatcherMap = {};
        for (const i of frameTemplate) {
            this._DispatcherMap[`item_${i.id}`] = new SWidgetDispatcher();
        }
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub);
    }

    _renderItem(item, on_edge, query, view_obj) {
        return (
            <Item ref={ele => view_obj.view = ele} data={item} />
        )
    }

    _onItemBlur(data, qurey, view_obj) {
        if (view_obj && view_obj.view) {
            view_obj.view.blur();
        }
    }

    _onItemFocus(item, pre_dege, query, view_obj) {
        if (view_obj && view_obj.view) {
            view_obj.view.focus();
        }
    }

    _FrameRenderItem(item, onedge, query) {
        const direction = HORIZONTAL;
        return (
            <SimpleWidget
                width={340}
                height={340}
                padding={{ left: 20, top: 20, right: 20, bottom: 20 }}
                direction={direction}
                data={template}
                onEdge={onedge}
                dispatcher={this._DispatcherMap[`item_${item.id}`]}
                onClick={(item) => { console.log("click", item); }}
                renderItem={this._renderItem}
                onItemFocus={this._onItemFocus}
                onItemBlur={this._onItemBlur}
                measures={this._Measures}
                branchName={`${this.props.branchName}/item${item.id}`}
            />
        );
    }

    _FrameMeasure(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub);
    }

    _FrameOnItemFocus(item, pre_edge, query) {
        this._DispatcherMap[`item_${item.id}`].dispatch({
            type: SWidgetDispatcher.Type.setFocusRect,
            data: pre_edge
        });
        this.changeFocus(`${this.props.branchName}/item${item.id}`);
        console.log(`frame item focus ${item.id}`);
    }

    _FrameOnItemBlur(item) {
        console.log(`frame item blur ${item.id}`);
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            if (this._NavigateHome) {
                this._NavigateHome();
            }
        }
        return true;
    }

    renderContent() {
        return (
            <div style={{ width: 1920, height: 1080, backgroundColor: "#FFFFFF" }}>
                <div style={{ top: 50, left: 50 }}>
                    <SimpleWidget
                        width={680}
                        height={680}
                        direction={HORIZONTAL}
                        data={frameTemplate}
                        onItemFocus={this._FrameOnItemFocus}
                        onItemBlur={this._FrameOnItemBlur}
                        onFocus={() => { console.log("widget 1 on focus"); }}
                        renderItem={this._FrameRenderItem}
                        measures={this._FrameMeasure}
                        branchName={`${this.props.branchName}/widget`}
                        onWidgetMount={this._onWidgetMount}
                    />
                </div>
            </div>
        );
    }

    _onWidgetMount() {
        this.changeFocus(`${this.props.branchName}/widget`);
    }
}

const App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};
