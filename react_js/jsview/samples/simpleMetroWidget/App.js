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
 *      measures {function} (必选)返回item的模板信息的回调,
 *                              @params item {object} data中的数据
 *                              @return 模板信息，通过SimpleWidget.getMeasureObj(width, height, fosucable, hasSub)方法构建
 *                                      SimpleWidget.getMeasureObj
 *                                          @params width {int} item的宽
 *                                          @params height {int} item的高
 *                                          @params focusable {boolean} item是否可以获得焦点
 *                                          @params hasSub {boolean} item内是否是可获得焦点的控件
 *                                          @return {object} 模板信息
 *
 *      onClick {function} item点击回调
 *                @params item data中的数据
 *      renderItem {function} (必选)item描画的回调
 *                @params item data中的数据
 *                @return JSX
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
 * Q: 如何进行布局，定制每个格的尺寸？
 * A: 首先选定一个布局的方式，一列列地横向布局(HROIZONTAL)还是一行行地纵向(VERTICAL)布局，设置给属性direction
 *    然后将单元格尺寸反馈器(函数)设置到measures中，进行布局时，组件会回调measures函数获得每个单元格的尺寸，
 *    当一列放满单元格后(如果是纵向布局，则是一行放满后)，自动换列去布局下一列。
 *
 * Q: 单元格的普通状态，焦点状态，失焦状态如何渲染？
 * A: 普通状态对应渲染函数renderItem；
 *    焦点状态渲染对应函数renderFocus，若焦点有放大动画，应该在此处理中定义放大效果的keyFrame
 *    失焦状态渲染对应函数renderBlur，失焦状态展示时间很短暂，只在焦点刚失去到恢复到单元格恢复到普通状态这段期间，
 *    主要用于绘制失焦动画
 *
 * Q: 控件中的导航处理(上下左右，OK键)需要什么响应的开发？
 * A: 上下左右键已经由控件接管，不需要开发者而外处理，上下左右键会触发翻页时间，翻页的形式由属性slideStyle来定制。
 *    另外，通过OnClick属性可以注册按键回调函数，来处理用户的OK键动作。
 *
 * Q: 焦点放大如何居中?
 * A: 1.renderFocus中需要计算view的位置。2.css动画的transform-origin需要设置为center
 *
 * Q: 边缘格获取焦点放大后显示不全？
 * A: 设置padding，注意item的排布范围是控件的宽高减去对应的padding
 *
 * Q: 焦点怎么移出控件？
 * A: 当焦点移动到控件边缘时，会调用onEdge回调。在回调中通过参数传递的值来决定焦点转移的行为
 */
import React from 'react';
import './App.css';
import { SimpleWidget, HORIZONTAL } from "../../utils/JsViewEngineWidget/index_widget";
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";
import borderImgPath from "./border.png";
import { JsvSquareNinePatch } from "../../utils/JsViewReactWidget/JsvNinePatch";

const homePageData = [
    {
        blocks: {
            w: 200,
            h: 160
        },
        focusable: true,
        color: "#000022",
        content: 0
    },
    {
        blocks: {
            w: 200,
            h: 160
        },
        focusable: true,
        color: "#003300",
        content: 1
    },
    {
        blocks: {
            w: 200,
            h: 160
        },
        focusable: true,
        color: "#000044",
        content: 2
    },
    {
        blocks: {
            w: 400,
            h: 320
        },
        focusable: true,
        color: "#000055",
        content: 3
    },
    {
        blocks: {
            w: 200,
            h: 160
        },
        focusable: true,
        color: "#000066",
        content: 4
    },
    {
        blocks: {
            w: 200,
            h: 160
        },
        focusable: true,
        color: "#0000CD",
        content: 5
    },
];

let content = 6;
for (let i = 0; i < 5; i++) {
    homePageData.push({
        blocks: {
            w: 200,
            h: 320
        },
        focusable: true,
        color: "#000022",
        content: content++
    });
    homePageData.push({
        blocks: {
            w: 200,
            h: 160
        },
        focusable: true,
        color: "#003300",
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
        const y = this.state.focus ?  ((item.blocks.h - 10) - height) / 2 : 0;

        return (
            <div style={{ animation: this.state.anim, left: x, top: y, backgroundColor: this.state.focus? "#FF0000" : item.color, width: width, height: height, color: "#FFFFFF" }}>
                {item.content}
            </div>
        )
    }
}

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);
        this._measures = this._measures.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onClick = this._onClick.bind(this);
        this._OnItemFocus = this._onItemFocus.bind(this);
        this._onItemBlur = this._onItemBlur.bind(this);
        this._onEdge = this._onEdge.bind(this);
        this.state = {
            focusStyle: {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            }
        };
    }

    _measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, false);
    }

    _renderItem(item, on_edge, query, view_obj) {
        return (
            <Item ref={ele => view_obj.view = ele} data={item}/>
        )
    }

    _onItemBlur(data, qurey, view_obj) {
        if (view_obj && view_obj.view) {
            view_obj.view.blur();
        }
    }

    _onItemFocus(item, pre_dege, query, view_obj) {
        const position = query.queryPosition(query.id);
        const width = (item.blocks.w - 10) * (1 / 0.9);
        const height = (item.blocks.h - 10) * (1 / 0.9);
        const x = ((item.blocks.w - 10) - width) / 2;
        const y = ((item.blocks.h - 10) - height) / 2;
        this.setState({
            focusStyle: {
                x: x + position.xPos,
                y: y + position.yPos,
                w: width,
                h: height
            }
        });
        if (view_obj && view_obj.view) {
            view_obj.view.focus();
        }
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            if (this._NavigateHome) {
                this._NavigateHome();
            }
        }
        return true;
    }

    _onClick() {

    }

    _onEdge(info) {
        console.log("SimpleWidget onEdge", info);
    }

    onFocus() {
        this.changeFocus(`${this.props.branchName}/widget1`);
    }

    renderContent() {
        return (
            <div style={{ width: 1920, height: 1080, backgroundColor: "#FFFFFF" }}>
                <div style={{ top: 120, left: 50 }}>
                    <SimpleWidget
                        width={1280}
                        height={520}
                        padding={{ left: 20, top: 20, right: 20, bottom: 20 }}
                        direction={HORIZONTAL}
                        data={homePageData}
                        onClick={this._onClick}
                        renderItem={this._renderItem}
                        measures={this._measures}
                        branchName={`${this.props.branchName}/widget1`}
                        onItemFocus={this._OnItemFocus}
                        onItemBlur={this._onItemBlur}
                        onEdge={this._onEdge}
                    />
                    <div style={{ top: 20, left: 20 }}>
                        <JsvSquareNinePatch
                            style={{ top: this.state.focusStyle.y, left: this.state.focusStyle.x, width: this.state.focusStyle.w, height: this.state.focusStyle.h }}
                            imageUrl={borderImgPath}
                            imageWidth={81}
                            contentWidth={25}
                            borderOutset={14}
                            animTime={0.2}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};
