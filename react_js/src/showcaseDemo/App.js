/*
 * 【界面概述】
 * 绘制橱窗界面，展示SimpleWidget控件，JsvMarquee控件
 *
 * 【控件介绍】
 * SimpleWidget：见simpleMetroWidget示例中的说明
 * JsvMarquee：文字跑马灯控件
 *              top {int} 控件的Y坐标，默认为0
 *              left {int} 控件的X坐标，默认为0
 *	            width {int} (必须)控件的宽度
 *              height {int} (必须)控件的高度
 *              text {string} (必须)控件中显示的文字内容
 *              fontStyle {object} style中的文字相关属性设置，例如font, color, fontSize, lineHeight
 * 【技巧说明】
 * Q: 跑马灯控件如何使用？
 * A: 将div的style中要填写的文字style内容做成一个对象，通过fontStyle传入。
 *    div的style的坐标属性，也改为通过对应属性传入。
 *    本应用中，simpleMetroWidget.renderFocus下加入跑马灯控件，非焦点状态时，只是使用简单的文字展示，
 *    所以非焦点切换焦点状态，才会表现出跑马灯效果，焦点移走后跑马灯就消失了。
 *
 */

import React from 'react';
import './App.css';
import { SimpleWidget, VERTICAL } from "../jsview-utils/jsview-react/index_widget.js"
import JsvMarquee from "../jsview-utils/JsViewReactWidget/JsvMarquee"
import { HomePageData, PAGE_THEME_ITEM_GAP, PAGE_THEME_ITEM_SCALE, PAGE_THEME_ITEM_TEXT_HEIGHT } from "./DataProvader"
import createStandaloneApp from "../demoCommon/StandaloneApp"
import { FocusBlock } from "../demoCommon/BlockDefine"
import borderImgPath from './images/nine_patch_focus.png';

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._RenderBlur = this._RenderBlur.bind(this);
        this._onWidgetMount = this._onWidgetMount.bind(this);
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            if (this._NavigateHome) {
                this._NavigateHome();
            }
        } return true;
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _RenderFocus(item) {
        let image_width = item.blocks.w - PAGE_THEME_ITEM_GAP;
        let scale_width = parseInt(image_width * PAGE_THEME_ITEM_SCALE);
        let left = -parseInt((scale_width - image_width) / 2);
        let image_height = item.blocks.h - PAGE_THEME_ITEM_GAP - PAGE_THEME_ITEM_TEXT_HEIGHT;
        let scale_height = parseInt(image_height * PAGE_THEME_ITEM_SCALE);
        let top = -parseInt((scale_height - image_height) / 2);
        console.log("left:" + left + ", top:" + top + ",width:" + scale_width + ", height:" + scale_height);
        return (
            <div>
                <div style={{
                    animation: "focusScale 0.25s",
                    backgroundImage: `url(${item.content.url})`,
                    left: left,
                    top: top,
                    width: scale_width,
                    height: scale_height,
                    borderRadius: '8px 8px 8px 8px',
                    borderImage: `url(${borderImgPath}) 40 fill`,
                    borderImageWidth: '40px',
                    borderImageOutset: "28px 28px 28px 28px",
                }}>

                </div>

                <JsvMarquee text={item.content.title}
                    top={image_height} left={0}
                    width={image_width} height={PAGE_THEME_ITEM_TEXT_HEIGHT}
                    fontStyle={{
                        color: "#ffffff",
                        fontSize: 20,
                        lineHeight: PAGE_THEME_ITEM_TEXT_HEIGHT + "px"
                    }} />
            </div>
        )
    }

    _RenderBlur(item, callback) {
        return (
            <div>
                <div style={{
                    animation: "blurScale 0.25s",
                    backgroundImage: `url(${item.content.url})`,
                    width: item.blocks.w - PAGE_THEME_ITEM_GAP,
                    height: item.blocks.h - PAGE_THEME_ITEM_GAP - PAGE_THEME_ITEM_TEXT_HEIGHT,
                }}
                    onAnimationEnd={callback}>
                </div>
                <div style={{
                    color: "#ffffff",
                    fontSize: 20,
                    whiteSpace: 'nowrap',
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    left: 0,
                    top: item.blocks.h - PAGE_THEME_ITEM_GAP - PAGE_THEME_ITEM_TEXT_HEIGHT,
                    lineHeight: PAGE_THEME_ITEM_TEXT_HEIGHT + "px",
                    width: item.blocks.w - PAGE_THEME_ITEM_GAP,
                    height: PAGE_THEME_ITEM_TEXT_HEIGHT
                }}>
                    {item.content.title}
                </div>
            </div>
        )
    }

    _RenderItem(item) {
        return (
            <div>
                <div style={{
                    backgroundImage: `url(${item.content.url})`,
                    width: item.blocks.w - PAGE_THEME_ITEM_GAP,
                    height: item.blocks.h - PAGE_THEME_ITEM_GAP - PAGE_THEME_ITEM_TEXT_HEIGHT,
                }}>
                </div>
                <div style={{
                    color: "#ffffff",
                    fontSize: 20,
                    whiteSpace: 'nowrap',
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    left: 0,
                    top: item.blocks.h - PAGE_THEME_ITEM_GAP - PAGE_THEME_ITEM_TEXT_HEIGHT,
                    lineHeight: PAGE_THEME_ITEM_TEXT_HEIGHT + "px",
                    width: item.blocks.w - PAGE_THEME_ITEM_GAP,
                    height: PAGE_THEME_ITEM_TEXT_HEIGHT
                }}>
                    {item.content.title}
                </div>
            </div>
        )
    }

    renderContent() {
        return (
            <div key="background" style={{ top: 0, left: 0, width: 1280, height: 720, backgroundColor: "#123f80" }}>
                <div key="title" style={{ top: 30, left: 80, width: 80, height: PAGE_THEME_ITEM_TEXT_HEIGHT, fontSize: 24, color: "#369cc4", whiteSpace: "nowrap", textAlign: "center" }}>影音</div>
                <div key="sub_line" style={{ top: 70, left: 80, width: 80, height: 5, backgroundColor: "#2b6da1" }}></div>
                <div style={{ top: 100, left: 40 }}>
                    <SimpleWidget
                        width={1280}
                        height={580 + 40}
                        padding={{ left: 20, top: 20 }}
                        direction={VERTICAL}
                        data={HomePageData}
                        renderBlur={this._RenderBlur}
                        renderItem={this._RenderItem}
                        renderFocus={this._RenderFocus}
                        measures={this._Measures}
                        branchName={this.props.branchName + "/widget"}
                        onWidgetMount={this._onWidgetMount}
                    />
                </div>
            </div>
        )
    }

    _onWidgetMount() {
        this.changeFocus(this.props.branchName + "/widget")
    }
}
let App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};
