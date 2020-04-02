import React, { Component } from "react"
import {Router, Fdiv, FdivRoot, SWidgetDispatcher, BaseDispatcher, SimpleWidget, HORIZONTAL, EdgeDirection, VERTICAL, SlideStyle} from "../jsview-react/index_widget.js"

let directionPair = {}
directionPair[EdgeDirection.left] = EdgeDirection.right;
directionPair[EdgeDirection.right] = EdgeDirection.left;
directionPair[EdgeDirection.top] = EdgeDirection.bottom;
directionPair[EdgeDirection.left] = EdgeDirection.top;

class TabItem extends React.Component{
    render() {
        if (this.props.renderCurItem) {
            if (this.props.ifCur) {
                return this.props.renderCurItem(this.props.item);
            } else {
                return this.props.renderItem(this.props.item);
            }
        } else {
            return this.props.renderItem(this.props.item);
        }
    }
}

/*
    onEdge {function} 边缘回调
    flowDirection {Symbol} 控件的方向 (必选)
    initFocusId {int} 初始的焦点
    tabFocusable {boolean} tab是否可获得焦点
    onWidgetMount{function} 控件挂载完成回调

    tabData {list} tab的数据 (必选)
    tabMeasures {function} tab的measures函数 (必选)
    tabOnItemFocus {function} tab的onItemFoucs函数
    tabOnItemBlur {function} tab的onItemBlur函数
    tabStyle {object} tab的style {width: 宽, height: 高, left: x, top: y} (必选)
    tabOnBlur {function} tab的onBlur函数
    tabOnFocus {function} tab的onFocus函数
    tabRenderItem {function} tab的renderItem函数 (必选)
    tabRenderCurItem {function} tab的blur状态下焦点描画函数
    tabRenderFocus {function} tab的renderFocus函数
    tabRenderBlur {function} tab的renderBlur函数
    tabPadding {object} 同SimpleWidget的padding

    bodyStyle {object} body的style {width: 宽, height: 高, left: x, top: y} (必选)
    bodyData {list} body的数据 (必选)
    bodyOnFocus {function} body的onFocus
    bodyOnItemFocus {function} body的onItemFocus
    bodyOnItemBlur {function} body的onItemBlur
    bodyOnBlur {function} body的onBlur
    bodyRenderItem {function} body的RenderItem (必选)
    bodyRenderFocus {function} body的renderFocus
    bodyRenderBlur {function} body的renderBlur
    bodyMeasures {function} body的measures (必选)
    bodyPadding {function} 同SimpleWidget的padding
    bodySlideStyle { Symbol } body的SlideStyle
 */

 class TabDispatcher extends BaseDispatcher { }
 TabDispatcher.Type = {

 }

class JsvTabWidget extends Component{
    constructor(props) {
        super(props);
        this._tabOnEdge = this._tabOnEdge.bind(this);
        this._bodyOnEdge = this._bodyOnEdge.bind(this);
        this._generateFrameData = this._generateFrameData.bind(this);
        this._tabOnItemFocus = this._tabOnItemFocus.bind(this);
        this._frameOnItemFocus = this._frameOnItemFocus.bind(this);
        this._frameRenderItem = this._frameRenderItem.bind(this);
        this._frameMeasures = this._frameMeasures.bind(this);
        this._tabRenderItem = this._tabRenderItem.bind(this);
        this._updateTabItem = this._updateTabItem.bind(this);
        this._getTabPosition = this._getTabPosition.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._dispatcherMap = new Map();
        this._dispatcherMap.set("tab", new SWidgetDispatcher());
        this._dispatcherMap.set("body", new SWidgetDispatcher());

        this._Router = new Router();
        this.state = {
            curId: 0,
            frameData: this._generateFrameData(this.props.bodyData)
        };
    }

    _generateFrameData() {
        let result = [];
        for (let i = 0; i < this.props.bodyData.length; ++i) {
            this._dispatcherMap.set("body_" + i, new SWidgetDispatcher());
            result.push({
                "blocks":{
                    "w": this.props.bodyStyle.width,
                    "h": this.props.bodyStyle.height,
                },
                "focusable":true,
                "hasSub": true,
                "tabIndex": i,
            });
        }
        return result;
    }

    _tabRenderItem(item, onedge, queryObj) {
        return (
            <TabItem
            item={item}
            ifCur={ queryObj.id === this.state.curId}
            renderItem = { this.props.tabRenderItem }
            renderCurItem = { this.props.tabRenderCurItem }
            />
        )
    }

    _updateTabItem(index_list) {
        this._dispatcherMap.get("tab").dispatch({
            type: SWidgetDispatcher.Type.updateItem,
            data: index_list
        });
    }

    _getTabPosition() {
        let tab_position;
        if (this.props.flowDirection === HORIZONTAL) {
            if (this.props.tabStyle.top < this.props.bodyStyle.top) {
                tab_position = EdgeDirection.top
            } else {
                tab_position = EdgeDirection.bottom
            }
        } else {
            if (this.props.tabStyle.left < this.props.bodyStyle.left) {
                tab_position = EdgeDirection.left
            } else {
                tab_position = EdgeDirection.right
            }
        }
        return tab_position;
    }

    _tabOnEdge(edge_info) {
        if (edge_info.direction === directionPair[this._getTabPosition()]) {
            this._dispatcherMap.get("body").dispatch({
                type: SWidgetDispatcher.Type.setFocusId,
                data: this.state.curId
            });
            this._dispatcherMap.get("body_" + this.state.curId).dispatch({
                type: SWidgetDispatcher.Type.setFocusId,
                data: 0
            });
            this._Router.focus(this.props.branchName + "_body");
        } else {
            if (this.props.onEdge) {
                this.props.onEdge(edge_info);
            }
        }
    }

    _bodyOnEdge(edge_info) {
        if (this.props.tabFocusable && edge_info.direction === this._getTabPosition()) {
            this._dispatcherMap.get("tab").dispatch({
                type: SWidgetDispatcher.Type.setFocusId,
                data: this.state.curId
            })
            this._Router.focus(this.props.branchName + "_tab");
        } else {
            if (this.props.onEdge) {
                this.props.onEdge(edge_info);
            }
        }
    }

    _tabOnItemFocus(item, edgeInfo, queryObj) {
        let pre_id = this.state.curId;
        this.setState({
            curId: queryObj.id
        }, () => {
            this._updateTabItem([pre_id, queryObj.id], this.state.curId);
            if (pre_id !== this.state.curId) {
                this._dispatcherMap.get("body_" + this.state.curId).dispatch({
                    type: SWidgetDispatcher.Type.slideToItem,
                    data: {
                        id : 0,
                        type: "start"
                    }
                })
            }
        })
    }

    _frameOnItemFocus(item, enter_rect) {
        let pre_focus = this.state.curId;
        this.setState({curId: item.tabIndex}, () => {
            this._updateTabItem([pre_focus, this.state.curId]);
            let focus_info = {
                type: SWidgetDispatcher.Type.setFocusRect,
                data: enter_rect
            };
            this._dispatcherMap.get("body_" + item.tabIndex).dispatch(focus_info);
            this._Router.focus(this.props.branchName + "_body" + item.tabIndex);
        });
    }

    _frameRenderItem(item, onedge) {
        return (
            <SimpleWidget 
                width={ this.props.bodyStyle.width }
                height={ this.props.bodyStyle.height }
                padding={ this.props.bodyPadding }
                direction={ this.direction } 
                dispatcher={ this._dispatcherMap.get("body_" + item.tabIndex) }
                data={ this.props.bodyData[item.tabIndex] } 
                onEdge = { onedge }
                slideStyle={ this.props.bodySlideStyle }
                renderBlur={ this.props.bodyRenderBlur }
                renderItem={ this.props.bodyRenderItem }
                renderFocus={ this.props.bodyRenderFocus }
                measures={ this.props.bodyMeasures }
                branchName={ this.props.branchName + "_body" + item.tabIndex }/>
        )
    }

    _frameMeasures(item) {
        return item;
    }

    _onFocus() {
        if (this.props.initFocusComponent === "body") {
            this._dispatcherMap.get("body").dispatch({
                type: SWidgetDispatcher.Type.setFocusId,
                data: this.state.curId
            })
            this._Router.focus(this.props.branchName + "_body")
        } else {
            this._dispatcherMap.get("tab").dispatch({
                type: SWidgetDispatcher.Type.setFocusId,
                data: this.state.curId
            })
            this._Router.focus(this.props.branchName + "_tab")
        }
    }

    render(){
        return(
            <Fdiv branchName={ this.props.branchName } router={ this._Router } onFocus={ this._onFocus} >
                <SimpleWidget 
                    left={ this.props.tabStyle.left }
                    top={ this.props.tabStyle.top }
                    width={ this.props.tabStyle.width }
                    height={ this.props.tabStyle.height }
                    branchName={ this.props.branchName + "_tab" }
                    dispatcher={ this._dispatcherMap.get("tab") }
                    direction={ this.props.flowDirection }
                    data={ this.props.tabData }
                    padding={ this.props.tabPadding }
                    onFocus={ this.props.tabOnFocus }
                    onBlur={ this.props.tabOnBlur }
                    renderItem={ this._tabRenderItem }
                    renderFocus={ this.props.tabRenderFocus }
                    renderBlur={ this.props.tabRenderBlur }
                    measures={ this.props.tabMeasures }
                    onEdge={ this._tabOnEdge }
                    onItemFocus={ this._tabOnItemFocus }
                    initFocusId={ this.props.initFocusId }/>

                <SimpleWidget 
                    left={ this.props.bodyStyle.left }
                    top={ this.props.bodyStyle.top }
                    width={ this.props.bodyStyle.width }
                    height={ this.props.bodyStyle.height }
                    dispatcher={ this._dispatcherMap.get("body") }
                    branchName={this.props.branchName + "_body"}
                    direction={ this.props.flowDirection }
                    slideStyle={ SlideStyle.wholePage }
                    onFocus={ this.props.bodyOnFocus }
                    onBlur={ this.props.bodyOnBlur }
                    onEdge={ this._bodyOnEdge }
                    onItemFocus={ this._frameOnItemFocus }
                    renderItem={ this._frameRenderItem }
                    measures={ this._frameMeasures }
                    initFocusId={ this.props.initFocusId }
                    data={ this.state.frameData }
                    baseAnchor={{id : this.state.curId, type: "start"}}/>
            </Fdiv>
        )
    }

    componentDidMount() {
        if (this.props.onWidgetMount) {
            Promise.resolve().then(() => {
                this.props.onWidgetMount();
            })
        }
    }
}
JsvTabWidget.defaultProps = {
    branchName: "",
    tabStyle: {
        top: 0,
        left: 0,
    },
    bodyStyle: {
        top: 0,
        left: 0,
    },
    initFocusComponent: "body",
    flowDirection: HORIZONTAL,
    tabFocusable: true,
    initFocusId: 0,
}
export { JsvTabWidget };



