/*
 * 【界面概述】
 * 绘制三个矩形，通过能在矩形间进行移动的焦点框来展示JsvNinePatch控件的使用方法
 *
 * 【控件介绍】
 * JsvSquareNinePatch：对原图为正方形进行NinePatch扩展的控件
 *      style { object } div的left,top,width,height的定位信息
 *      animTime { int } transition动画时长
 *      imageUrl { string } (必须) 原图片url
 *      imageWidth { int } (必须) 原图片的宽，正方形宽和高相等
 *      contentWidth { int } (必须) 图片延展区域的宽
 *      borderOutset { int } 边框向外扩展的大小
 *
 * 【技巧说明】
 * Q: 如何实现NinePatch框的大小和位置的变化?
 * A: 通过css配置控件的left,top,width,height的transition，setState时，只需要改变框的x,y,w,h，
 *    引擎就会自动按照transition中定义的动画，对框进行尺寸和位置调整动画。
 */

import React from 'react';
import { HORIZONTAL, SimpleWidget, SlideStyle } from "../../utils/JsViewEngineWidget/index_widget";
import { JsvSquareNinePatch } from '../../utils/JsViewReactWidget/JsvNinePatch';
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import borderImgPath from './border.png';
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";

const data = [
    {
        blocks: {
            w: 170,
            h: 170
        },
        focusable: true,
        color: "#FF9900",
        content: 0
    },
    {
        blocks: {
            w: 300,
            h: 300
        },
        focusable: true,
        color: "#0099FF",
        content: 1
    },
    {
        blocks: {
            w: 170,
            h: 170
        },
        focusable: true,
        color: "#FF9900",
        content: 2
    },
];


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
        })
    }

    blur() {
        this.setState({
            focus: false,
        })
    }

    render() {
        let item = this.props.data;
        const width = item.blocks.w - 10;
        const height = item.blocks.h - 10;

        const scale_set = this.state.focus ? "scale3d(1.05,1.05,1)" : null;

        return (
            <div style={{
                transition: "transform 0.2s linear",
                transform: scale_set,
                left: 0, top: 0,
                backgroundColor: item.color,
                width: width, height: height,
                color: "#FFFFFF",
                }}>
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
        this._onItemFocus = this._onItemFocus.bind(this);
        this._onItemBlur = this._onItemBlur.bind(this);

        this.state = {
            focusFrameX: 50,
            focusFrameY: 50,
            focusFrameW: 100,
            focusFrameH: 100,
        };
    }

    _measures(item) {
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

    _onItemFocus(item, pre_dege, queryObj, view_obj) {
        const position = queryObj.queryPosition(queryObj.id);
        const x = position.xPos + (item.blocks.w - 10 - (item.blocks.w - 10) * 1.05) / 2;
        const y = position.yPos + (item.blocks.h - 10 - (item.blocks.h - 10) * 1.05) / 2;
        this.setState({
            focusFrameX: x,
            focusFrameY: y,
            focusFrameW: (item.blocks.w - 10) * 1.05,
            focusFrameH: (item.blocks.h - 10) * 1.05,
        });
        if (view_obj && view_obj.view) {
            view_obj.view.focus();
        }
    }

    renderContent() {
        return (
            <div>
                <div style={{ width: 1280, height: 720, backgroundColor: '#FFFFFF' }}>
                    <div style={{
                        textAlign: "center",
                        fontSize: "30px",
                        lineHeight: "50px",
                        color: "#ffffff",
                        left: 140,
                        top: 20,
                        width: 1000,
                        height: 50,
                        backgroundColor: "rgba(27,38,151,0.8)"
                    }}>{`NinePatch展示,框的四个角的方形中心和项目的四个顶点严格对齐`}</div>
                    <SimpleWidget
                        top={100}
                        left={250}
                        width={1000}
                        height={400}
                        direction={HORIZONTAL}
                        data={data}
                        onClick={console.log("item ")}
                        slideStyle={SlideStyle.seamLess}
                        renderItem={this._renderItem}
                        onItemFocus={this._onItemFocus}
                        onItemBlur={this._onItemBlur}
                        measures={this._measures}
                        padding={{ left: 50, right: 50, top: 50, height: 50 }}
                        branchName={`${this.props.branchName}/swidget`} />
                </div>
                <div style={{ top: 150, left: 300 }}>
                    <JsvSquareNinePatch
                        style={{ top: this.state.focusFrameY, left: this.state.focusFrameX, width: this.state.focusFrameW, height: this.state.focusFrameH }}
                        imageUrl={borderImgPath}
                        imageWidth={81}  // 框图原图为 81 x 81
                        contentWidth={25} // 框图中心空白区域为 25 x 25
                        borderOutset={14} // 框图四个角的方块的中心点距离边缘为14(为了达到框图四角方形中心和所框区域四角对齐)
                        animTime={0.2}
                    />
                </div>
            </div>
        );
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            if (this._NavigateHome) {
                this._NavigateHome();
            }
            return true;
        }
        return false;
    }

    componentDidMount() {
        this.changeFocus(`${this.props.branchName}/swidget`);
    }
}

const App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};
