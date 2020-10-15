/*
 * @Author: ChenChanghua
 * @Date: 2020-04-13 17:00:41
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2020-08-24 19:46:38
 * @Description: file content
 */

import React from 'react';
import {FdivWrapper, SimpleWidget, VERTICAL, SWidgetDispatcher} from "../jsview-utils/jsview-react/index_widget.js"
import {getGlobalHistory} from '../demoCommon/RouterHistoryProxy';
import {jJsvRuntimeBridge} from "../demoCommon/JsvRuntimeBridge"

import {JsvTextStyleClass} from "../jsview-utils/JsViewReactTools/JsvStyleClass"

let globalHistory = getGlobalHistory();

let CONST_ITEM_WIDTH = 300;
let CONST_ITEM_HEIGHT = 100;

let HomepageInfo = {
    curFocus: -1
}

let sFontStyle = new JsvTextStyleClass({
	width: CONST_ITEM_WIDTH - 10,
	height: CONST_ITEM_HEIGHT - 10,
	color: "#000000",
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
            <div className={sFontStyle.getName()}
                 style={{backgroundColor: item.color}}>
                { item.name }
            </div>
        )
    }

    _onItemFocus(item, pre_edge, query) {
        HomepageInfo.curFocus = query.id;
    }

	// 直接集成自FdivWrapper的场合，使用renderContent而不是render进行布局
	renderContent() {
        return (
            <React.Fragment>
                <div style={{fontSize: "20px", width: 1280, height: 70, color: "#FFFFFF"}}>{window.location.href}</div>
                <div style={{top: 70, left: 10}}>
                    <SimpleWidget 
                      width={ 1280 } 
                      height={ 630 } 
                      dispatcher={this._Dispatcher}
                      direction={ VERTICAL } 
                      data={ this.props.data } 
                      renderItem={ this._RenderItem }
                      renderFocus={ this._RenderFocus }
                      onClick={ this._onClick }
                      measures={ this._Measures }
                      padding={{top: 10, left: 10, right: 10, buttom: 10}}
                      onItemFocus={this._onItemFocus}
                      branchName={ "home_page" }
                    />
                </div>
            </React.Fragment>
        )
	}

	onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            jJsvRuntimeBridge.closePage()
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
        this.changeFocus("home_page")
	}

	onBlur() {

	}
}

export default Home;