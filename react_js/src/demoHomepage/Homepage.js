/*
 * @Author: ChenChanghua
 * @Date: 2020-04-13 17:00:41
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2020-05-11 11:08:12
 * @Description: file content
 */

import React from 'react';
import {Router, FdivRoot, Fdiv,FdivWrapper, SimpleWidget, HORIZONTAL, EdgeDirection, VERTICAL} from "../jsview-utils/jsview-react/index_widget.js"
import {getGlobalHistory} from '../demoCommon/RouterHistoryProxy';
let globalHistory = getGlobalHistory();

let CONST_ITEM_WIDTH = 300;
let CONST_ITEM_HEIGHT = 100;
class Home extends FdivWrapper {
	constructor(prop) {
        super(prop);
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._onWidgetMount = this._onWidgetMount.bind(this);
        this._onClick = this._onClick.bind(this);
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
                <div style={{backgroundColor: item.color, width: CONST_ITEM_WIDTH - 10, height: CONST_ITEM_HEIGHT - 10, color: "#000000", fontSize: 30}}>
                    { item.name }
                </div>
            </div>
        )
    }

    _RenderItem(item) {
        return (
            <div style={{backgroundColor: item.color, width: CONST_ITEM_WIDTH - 10, height: CONST_ITEM_HEIGHT - 10, color: "#000000", fontSize: 30}}>
                { item.name }
            </div>
        )
    }

    _onWidgetMount() {
        // this.changeFocus("widget1")
    }

	// 直接集成自FdivWrapper的场合，使用renderContent而不是render进行布局
	renderContent() {
        return (
            <div style={{top: 10, left: 10}}>
                    <SimpleWidget 
                      width={ 1280 } 
                      height={ 720 } 
                      direction={ VERTICAL } 
                      data={ this.props.data } 
                      renderItem={ this._RenderItem }
                      renderFocus={ this._RenderFocus }
                      onClick={ this._onClick }
                      measures={ this._Measures }
                      padding={{top: 10, left: 10}}
                      branchName={ "home_page" }
                      onWidgetMount={ this._onWidgetMount }
                    />
            </div>
        )
	}

	onKeyDown(ev) {
		return false;
	}

	onKeyUp(ev) {
		return false;
	}

	onDispatchKeyDown(ev) {
		return false;
	}

	onDispatchKeyUp(ev) {
		return false;
	}

	onFocus() {
        this.changeFocus("home_page")
	}

	onBlur() {

	}
}

export default Home;