/*
 * @Author: ChenChanghua
 * @Date: 2020-04-13 17:00:41
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2021-03-16 10:40:22
 * @Description: file content
 */

import React from 'react';

import { FdivWrapper, SimpleWidget, VERTICAL, EdgeDirection, SWidgetDispatcher } from "../jsview-utils/jsview-react/index_widget";
import { getGlobalHistory } from '../demoCommon/RouterHistoryProxy';
import { jJsvRuntimeBridge } from "../demoCommon/JsvRuntimeBridge";

import { JsvTextStyleClass } from "../jsview-utils/JsViewReactTools/JsvStyleClass";
import { FocusBlock } from "../demoCommon/BlockDefine";

const globalHistory = getGlobalHistory();

const CONST_ITEM_WIDTH = 300;
const CONST_ITEM_HEIGHT = 100;

const CONST_BTN_ITEM_WIDTH = 200;
const CONST_BTN_ITEM_HEIGHT = 50;

const HomepageInfo = {
    curFocus: -1
};

const sFontStyle = new JsvTextStyleClass({
    width: CONST_ITEM_WIDTH - 10,
    height: CONST_ITEM_HEIGHT - 10,
    color: "#000000",
    fontSize: 30,
});
const sBtnFontStyle = new JsvTextStyleClass({
    width: CONST_BTN_ITEM_WIDTH - 10,
    height: CONST_BTN_ITEM_HEIGHT - 10,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 30,
});

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
class QuitWindow extends FocusBlock {
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
        if (item.content === "确定") {
            this.props.callback(true);
        } else {
            this.props.callback(false);
        }
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

class TabItem extends React.Component {
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

    _renderFocus = (item) => {
        return (
            <div key="focus">
                <div style={{ backgroundColor: "#0000FF", top: -5, left: -5, width: CONST_BTN_ITEM_WIDTH, height: CONST_BTN_ITEM_HEIGHT }}></div>
                <div className={sBtnFontStyle.getName()}
                    style={{ backgroundColor: item.color }}>
                    {item.name}
                </div>
            </div>
        );
    }

    _renderItem = (item) => {
        return (
            <div key="normal">
                <div className={sBtnFontStyle.getName()}
                    style={{ backgroundColor: item.color }}>
                    {item.name}
                </div>
                {this.curBtnFocus === item.id ? <div style={{
                    backgroundColor: "#f0ef29",
                    top: 50,
                    left: -5,
                    width: CONST_BTN_ITEM_WIDTH,
                    height: 4
                }}></div> : null}
            </div>
        );
    }

    render() {
        let item = this.props.data;
        return (
            this.state.focus ? this._renderFocus(item) : this._renderItem(item)
        )
    }
}

class ContentItem extends React.Component {
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

    _renderFocus(item) {
        return (
            <div key="focus">
                <div style={{ backgroundColor: "#0000FF", top: -5, left: -5, width: CONST_ITEM_WIDTH, height: CONST_ITEM_HEIGHT }}></div>
                <div className={sFontStyle.getName()}
                    style={{ backgroundColor: item.color }}>
                    {item.name}
                </div>
            </div>
        );
    }

    _renderItem(item) {
        return (
            <div key="normal">
                <div className={sFontStyle.getName()}
                    style={{ backgroundColor: item.color }}>
                    {item.name}
                </div>
            </div>
        );
    }

    render() {
        let item = this.props.data;
        return (
            this.state.focus ? this._renderFocus(item) : this._renderItem(item)
        )
    }
}

class Home extends FdivWrapper {
    constructor(prop) {
        super(prop);
        this._measures = this._measures.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onItemFocus = this._onItemFocus.bind(this);
        this._onItemBlur = this._onItemBlur.bind(this);
        this._onBtnItemFocus = this._onBtnItemFocus.bind(this);
        this._onBtnItemBlur = this._onBtnItemBlur.bind(this);
        this._quitWindowCallback = this._quitWindowCallback.bind(this);
        this._Dispatcher = new SWidgetDispatcher();
        this._BtnDispatcher = new SWidgetDispatcher();
        this.btnDatas = this._GetBtnDatas();
        this.curBtnFocus = this.props.getFocusId();
        this.state = {
            data: this.props.getRenderData(),
            quitWindow: false
        };
    }

    _GetBtnDatas = () => {
        return [
            { color: "#1c7b24", name: "功能实例", id: 0 },
            { color: "#1c7b24", name: "场景实例", id: 1 },
        ];
    }

    _onClick(item) {
        let path = item.path;
        if (item.params) {
            path += `?${item.params}`;
        }
        globalHistory.push(path);
        this.changeFocus(item.path, true);
    }

    _measures(item) {
        return SimpleWidget.getMeasureObj(CONST_ITEM_WIDTH, CONST_ITEM_HEIGHT, true, false);
    }

    _renderItem(item, on_edge, query, view_obj) {
        return (
            <ContentItem ref={ele => view_obj.view = ele} data={item} />
        )
    }

    _onItemFocus(item, pre_edge, query, view_obj) {
        HomepageInfo.curFocus = query.id;
        if (view_obj && view_obj.view) {
            view_obj.view.focus();
        }
    }

    _onItemBlur(data, qurey, view_obj) {
        if (view_obj && view_obj.view) {
            view_obj.view.blur();
        }
    }

    _onBtnClick = (item) => {
        this.setState({
            data: this.props.getRenderData()
        });
        this._BtnDispatcher.dispatch({
            type: SWidgetDispatcher.Type.updateItem,
            data: [item.id]
        });
    }

    _btnMeasures = (item) => {
        return SimpleWidget.getMeasureObj(CONST_BTN_ITEM_WIDTH, CONST_BTN_ITEM_HEIGHT, true, false);
    }

    _renderBtnItem(item, on_edge, query, view_obj) {
        return (
            <TabItem ref={ele => view_obj.view = ele} data={item} />
        )
    }

    _onBtnItemFocus(item, pre_edge, query, view_obj) {
        this.curBtnFocus = item.id;
        this.props.changeFocusId(item.id);
        this.setState({
            data: this.props.getRenderData()
        });
        if (view_obj && view_obj.view) {
            view_obj.view.focus();
        }
    }

    _onBtnItemBlur(data, qurey, view_obj) {
        if (view_obj && view_obj.view) {
            view_obj.view.blur();
        }
    }

    _onBtnEdge = (edge_info) => {
        if (edge_info.direction === EdgeDirection.bottom) {
            this.changeFocus("homepage");
        }
    }

    _onEdge = (edge_info) => {
        if (edge_info.direction === EdgeDirection.top) {
            this.changeFocus("homepagebtns");
        }
    }

    // 直接集成自FdivWrapper的场合，使用renderContent而不是render进行布局
    renderContent() {
        const btnFocusId = this.props.getFocusId();
        return (
            <React.Fragment>
                <div style={{ fontSize: "20px", width: 1280, height: 30, color: "#FFFFFF" }}>{window.location.href}</div>
                <div style={{ top: 30, left: 10 }}>
                    <SimpleWidget
                        width={1280}
                        height={100}
                        direction={VERTICAL}
                        data={this.btnDatas}
                        initFocusId={btnFocusId}
                        dispatcher={this._BtnDispatcher}
                        renderItem={this._renderBtnItem}
                        onClick={this._onBtnClick}
                        measures={this._btnMeasures}
                        padding={{ top: 10, left: 10, right: 10, bottom: 10 }}
                        onEdge={this._onBtnEdge}
                        onItemFocus={this._onBtnItemFocus}
                        onItemBlur={this._onBtnItemBlur}
                        branchName={"homepagebtns"}
                    />
                </div>
                <div style={{ top: 100, left: 10 }} key={`data_${btnFocusId}`}>
                    <SimpleWidget
                        width={1280}
                        height={580}
                        dispatcher={this._Dispatcher}
                        direction={VERTICAL}
                        data={this.state.data}
                        renderItem={this._renderItem}
                        onClick={this._onClick}
                        measures={this._measures}
                        padding={{ top: 10, left: 10, right: 10, bottom: 10 }}
                        onItemFocus={this._onItemFocus}
                        onItemBlur={this._onItemBlur}
                        onEdge={this._onEdge}
                        branchName={"homepage"}
                        enableTouch={true}
                    />
                </div>
                {
                    this.state.quitWindow ?
                        <div style={{ left: 465, top: 300 }}>
                            <QuitWindow branchName={"quitWindow"} callback={this._quitWindowCallback} />
                        </div> : null
                }
            </React.Fragment >
        );
    }

    _quitWindowCallback(if_quit) {
        if (if_quit) {
            jJsvRuntimeBridge.closePage();
        }
        this.setState({
            quitWindow: false
        });
        this.changeFocus("homepage");
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            // jJsvRuntimeBridge.closePage();
            if (!this.state.quitWindow) {
                this.setState({
                    quitWindow: true
                });
                this.changeFocus("quitWindow");
            }
            return true;
        }
        return false;
    }

    onKeyUp(ev) {
        return true;
    }

    onDispatchKeyDown(ev) {
        return false;
    }

    onDispatchKeyUp(ev) {
        return false;
    }

    onFocus() {
        if (HomepageInfo.curFocus >= 0) {
            this._Dispatcher.dispatch({
                type: SWidgetDispatcher.Type.setFocusId,
                data: HomepageInfo.curFocus
            });
            this._Dispatcher.dispatch({
                type: SWidgetDispatcher.Type.slideToItem,
                data: {
                    id: HomepageInfo.curFocus,
                    type: "end",
                    doAnim: false
                }
            });
            HomepageInfo.curFocus = -1;
        }
        this.changeFocus("homepage");
    }

    onBlur() {

    }
}

export default Home;
