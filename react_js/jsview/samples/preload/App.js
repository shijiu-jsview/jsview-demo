/*
 * 【界面概述】
 * 展示预加载图片的用法
 *
 * 【控件介绍】
 * JsvPreload: 预加载控件
 *          preloadList{array} 预加载图片信息数组
 *          downloadList{array} 预下载的图片信息
 * buildPreloadInfo(url, width, height, color_type) 构建预加载图片信息的函数
 * buildDownloadInfo(url, net_setting) 构建预下载图片信息的函数
 *
 * 【技巧说明】
 * Q: 如何创建预加载图片列表
 * A: 预加载图片列表，通过buildPreloadInfo构建图片信息，组成数组传给 preloadList
 *    预下载图片列表，通过buildDownloadInfo构建图片信息，组成数组传给 downloadList
 *
 * Q: 预下载和预加载有什么区别？
 * A: 预下载仅仅将图片从网络上下载下来，并不进行解码和读入内存，只能加速图片展示的加载过程
 *    预加载是将图片下载后，解码并读入到内存中，以解决类似按钮首次焦点/非焦点状态变化时的闪动问题
 */
import React from 'react';
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";
import { HORIZONTAL, SimpleWidget, SlideStyle } from "../../utils/JsViewEngineWidget/index_widget";
import { buildPreloadInfo, buildDownloadInfo, JsvPreload } from '../../utils/JsViewReactWidget/JsvPreload';

import rank from "./rank.png";
import rankF from "./rank_focus.png";
import rule from "./rule.png";
import ruleF from "./rule_focus.png";
import start from "./start.png";
import startF from "./start_focus.png";
import awesome from "./awesomeface.png";
import cat from "./cat.jpg";

const data = [
    {
        url: rank,
        focusUrl: rankF,
    },
    {
        url: start,
        focusUrl: startF
    },
    {
        url: rule,
        focusUrl: ruleF,
    },
];

class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focus: false,
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
        return (
            <div style={{ width: 166, height: 90, backgroundImage: `url(${this.state.focus ? item.focusUrl : item.url})` }} />
        )
    }
}

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this._onItemBlur = this._onItemBlur.bind(this);
        this._onItemFocus = this._onItemFocus.bind(this);

        this.state = {
            text: ""
        };
    }

    _measures(item) {
        return SimpleWidget.getMeasureObj(180, 90, true, false);
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

    onKeyDown(ev) {
        switch (ev.keyCode) {
            case 10000:
            case 27:
                if (this._NavigateHome) {
                    this._NavigateHome();
                }
                break;
            default:
                break;
        }
        return true;
    }

    onFocus() {
        this.changeFocus(`${this.props.branchName}/swidget`);
    }

    renderContent() {
        const preload_info = [];
        for (const item of data) {
            preload_info.push(buildPreloadInfo(item.url));
            preload_info.push(buildPreloadInfo(item.focusUrl));
        }
        const download_info = [buildDownloadInfo(awesome), buildDownloadInfo(cat)];
        return (
            <div style={{ width: 1920, height: 1080, backgroundColor: "#FFFFFF" }}>
                <div style={{
                    textAlign: "center",
                    fontSize: "30px",
                    lineHeight: "50px",
                    color: "#ffffff",
                    left: 100,
                    top: 20,
                    width: (1280 - 200),
                    height: 50,
                    backgroundColor: "rgba(27,38,151,0.8)"
                }}>{`预加载后，图片(按钮焦点切换)切换不闪屏`}</div>
                <div style={{ top: 200, left: 300 }}>
                    <SimpleWidget
                        width={540}
                        height={90}
                        direction={HORIZONTAL}
                        data={data}
                        slideStyle={SlideStyle.seamLess}
                        renderItem={this._renderItem}
                        onItemFocus={this._onItemFocus}
                        onItemBlur={this._onItemBlur}
                        measures={this._measures}
                        branchName={`${this.props.branchName}/swidget`} />
                </div>
                <div style={{ left: 100, top: 350, width: 800, height: 800, fontSize: "30px", color: "#000000" }}>
                    {this.state.text}
                </div>
                <JsvPreload
                    preloadList={preload_info}
                    downloadList={download_info}
                    onPreloadDone={() => { console.log("PRELOAD DONE!"); }}
                    onDownloadDone={() => { console.log("DOWNLOAD DONE!"); this.setState({ text: `图片下载完成\n${awesome}\n${cat}` }); }} />
            </div>
        );
    }
}

const App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};
