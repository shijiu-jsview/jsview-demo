/*
 * @Author: ChenChanghua
 * @Date: 2020-04-13 17:00:41
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2020-08-24 19:46:38
 * @Description: file content
 */

import React from 'react';

import {FdivWrapper, SimpleWidget, VERTICAL, EdgeDirection, SWidgetDispatcher} from "../jsview-utils/jsview-react/index_widget.js"
import {getGlobalHistory} from '../demoCommon/RouterHistoryProxy';
import {jJsvRuntimeBridge} from "../demoCommon/JsvRuntimeBridge"

import {JsvTextStyleClass} from "../jsview-utils/JsViewReactTools/JsvStyleClass"

let globalHistory = getGlobalHistory();

let CONST_ITEM_WIDTH = 300;
let CONST_ITEM_HEIGHT = 100;

let CONST_BTN_ITEM_WIDTH = 200;
let CONST_BTN_ITEM_HEIGHT = 50;

let HomepageInfo = {
    curFocus: -1
}

let sFontStyle = new JsvTextStyleClass({
	width: CONST_ITEM_WIDTH - 10,
	height: CONST_ITEM_HEIGHT - 10,
	color: "#000000",
	fontSize: 30,
});
let sBtnFontStyle = new JsvTextStyleClass({
	width: CONST_BTN_ITEM_WIDTH - 10,
	height: CONST_BTN_ITEM_HEIGHT - 10,
	textAlign:"center",
	color: "#FFFFFF",
	fontSize: 30,
});
class Home extends FdivWrapper {
	constructor(prop) {
        super(prop);
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onItemFocus = this._onItemFocus.bind(this);
        this._Dispatcher = new SWidgetDispatcher();
		this._BtnDispatcher = new SWidgetDispatcher();
		this.btnDatas = this._GetBtnDatas();
		this.curBtnFocus = 0;
		this.state = {
			data:this.props.funcData
		}
	}

	_GetBtnDatas=()=>{
		return [
			{color:"#1c7b24", name:"功能实例", id:0},
			{color:"#1c7b24", name:"场景实例", id:1},
		]
	}

    _onClick(item) {
        globalHistory.push(item.path);
        this.changeFocus(item.path, true);
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(CONST_ITEM_WIDTH, CONST_ITEM_HEIGHT, true, false);
    }

    _RenderFocus(item) {
        return (
            <div>
                <div style={{backgroundColor: "#0000FF", top: -5, left: -5, width: CONST_ITEM_WIDTH, height: CONST_ITEM_HEIGHT}}></div>
                <div className={sFontStyle.getName()}
                     style={{backgroundColor: item.color}}>
                    { item.name }
                </div>
            </div>
        )
    }

    _RenderItem(item) {
        return (
			<div>
				<div className={sFontStyle.getName()}
					 style={{backgroundColor: item.color}}>
					{ item.name }
				</div>
			</div>
        )
    }

    _onItemFocus(item, pre_edge, query) {
        HomepageInfo.curFocus = query.id;
    }

	_onBtnClick=(item)=> {
		if (item.id == 0) {
			this.setState({
				data:this.props.funcData
			})
			this._BtnDispatcher.dispatch({
				type: SWidgetDispatcher.Type.updateItem,
				data: [0]
			})
		} else {
			this.setState({
				data:this.props.sceneData
			})
			this._BtnDispatcher.dispatch({
				type: SWidgetDispatcher.Type.updateItem,
				data: [1]
			})
		}
	}

	_BtnMeasures=(item)=> {
		return SimpleWidget.getMeasureObj(CONST_BTN_ITEM_WIDTH, CONST_BTN_ITEM_HEIGHT, true, false);
	}

	_RenderBtnFocus=(item)=> {
		return (
			<div>
				<div style={{backgroundColor: "#0000FF", top: -5, left: -5, width: CONST_BTN_ITEM_WIDTH, height: CONST_BTN_ITEM_HEIGHT}}></div>
				<div className={sBtnFontStyle.getName()}
					 style={{backgroundColor: item.color}}>
					{ item.name }
				</div>
			</div>
		)
	}

	_RenderBtnItem=(item)=> {
		return (
			<div>
				<div className={sBtnFontStyle.getName()}
					 style={{backgroundColor: item.color}}>
					{ item.name }
				</div>
				{this.curBtnFocus === item.id ? <div style={{
					backgroundColor: "#f0ef29",
					top: 50,
					left: -5,
					width: CONST_BTN_ITEM_WIDTH,
					height: 4
				}}></div> : null}
			</div>

		)
	}
	_onBtnItemFocus=(item)=>{
		this.curBtnFocus = item.id;
		if (item.id == 0) {
			this.setState({
				data:this.props.funcData
			})
		} else {
			this.setState({
				data:this.props.sceneData
			})
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
        return (
            <React.Fragment>
                <div style={{fontSize: "20px", width: 1280, height: 30, color: "#FFFFFF"}}>{window.location.href}</div>
				<div style={{top: 30, left: 10}}>
					<SimpleWidget
						width={ 1280 }
						height={ 100 }
						direction={ VERTICAL }
						data={ this.btnDatas }
						dispatcher={this._BtnDispatcher}
						renderItem={ this._RenderBtnItem }
						renderFocus={ this._RenderBtnFocus }
						onClick={ this._onBtnClick }
						measures={ this._BtnMeasures }
						padding={{top: 10, left: 10, right: 10, bottom: 10}}
						onEdge={this._onBtnEdge}
						onItemFocus={this._onBtnItemFocus}
						branchName={ "homepagebtns" }
					/>
				</div>
                <div style={{top: 100, left: 10}} key={"data_"+(this.state.data=== this.props.funcData?"0":"1")}>
                    <SimpleWidget 
                      width={ 1280 } 
                      height={ 580 }
                      dispatcher={this._Dispatcher}
                      direction={ VERTICAL } 
                      data={ this.state.data }
                      renderItem={ this._RenderItem }
                      renderFocus={ this._RenderFocus }
                      onClick={ this._onClick }
                      measures={ this._Measures }
                      padding={{top: 10, left: 10, right: 10, bottom: 10}}
                      onItemFocus={this._onItemFocus}
					  onEdge={this._onEdge}
                      branchName={ "homepage" }
                    />
                </div>
            </React.Fragment>
        )
	}

	onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            jJsvRuntimeBridge.closePage();
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
            })
            HomepageInfo.curFocus = -1;
        }
        this.changeFocus("homepage")
	}

	onBlur() {

	}
}

export default Home;