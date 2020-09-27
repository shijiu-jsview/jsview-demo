/*
 * 【界面概述】
 * 带下拉条的长图片展示样例
 *
 * 【控件介绍】
 * SimpleWidget：见simpleMetrowidget
 * 
 * 【技巧说明】
 * Q: 如何让图片的高度自适应？
 * A: 使用img元素，并且style中高度不设置即可
 *    通过element.clientHeight获取渲染后的自动高度，以决定滚动轴的总高度
 *
 * Q: 如何知道图片加载完成？
 * A: 为img标签追加OnLoad回调函数来接收图片加载完成的消息
 */

import React from 'react';
import createStandaloneApp from "../demoCommon/StandaloneApp"
import {FocusBlock} from "../demoCommon/BlockDefine"
import LongImageScroll from './LongImageScroll'
import {SimpleWidget, HORIZONTAL, EdgeDirection} from "../jsview-utils/jsview-react/index_widget.js"
import LongImageSource from './1280x7200.jpg';

let CONST_ITEM_WIDTH = 120;
let CONST_ITEM_HEIGHT = 50;
let BUTTON_DATA = [
    {
        'name': '按钮1'
    },
    {
        'name': '按钮2'
    }
]
class Button extends FocusBlock{
    constructor(prop) {
        super(prop);
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._OnWidgetMount = this._OnWidgetMount.bind(this);
        this._OnClick = this._OnClick.bind(this);
	}

    _Measures(item) {
        return SimpleWidget.getMeasureObj(CONST_ITEM_WIDTH, CONST_ITEM_HEIGHT, true, false);
    }

    _RenderFocus(item) {
        return (
            <div>
                <div style={{backgroundColor: "#DD0000", top: -5, left: -5, width: CONST_ITEM_WIDTH, height: CONST_ITEM_HEIGHT}}></div>
                <div style={{backgroundColor: '#EEEEEE', width: CONST_ITEM_WIDTH - 10, height: CONST_ITEM_HEIGHT - 10, color: "#000000", textAlign: "center", fontSize: 30}}>
                    { item.name }
                </div>
            </div>
        )
    }

    _RenderItem(item) {
        return (
            <div style={{backgroundColor: '#EEEEEE', width: CONST_ITEM_WIDTH - 10, height: CONST_ITEM_HEIGHT - 10, color: "#000000", textAlign: "center", fontSize: 30}}>
                { item.name }
            </div>
        )
    }

    _OnClick(item) {
        console.log("click " + item.name)
    }

    onFocus() {
        this.changeFocus(this.props.branchName + "/widget")
    }

    _OnWidgetMount() {
        
    }

    renderContent() {
        return(
            <SimpleWidget 
                width={ CONST_ITEM_WIDTH * 2 + 20 }
                height={ 70 } 
                direction={ HORIZONTAL } 
                data={ BUTTON_DATA } 
                renderItem={ this._RenderItem }
                renderFocus={ this._RenderFocus }
                onClick={ this._OnClick }
                measures={ this._Measures }
                padding={{top: 10, left: 10, bottom:10, right:10}}
                branchName={ this.props.branchName + "/widget" }
                onEdge={this.props.onEdge}
                onWidgetMount={ this._OnWidgetMount }
            />
        )
    }
}

class MainScene extends FocusBlock{
    constructor(props) {
        super(props);
        this._ButtonOnEdge = this._ButtonOnEdge.bind(this);
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            if (this._NavigateHome) {
                this._NavigateHome();
            }
            return true;
        } else {
            if (ev.keyCode == 40) {
                this.changeFocus(this.props.branchName + "/button");
                return true;
            }
        }
        return false;
    }

    componentDidMount() {
        this.changeFocus(this.props.branchName + "/longImageView");
    }

    _ButtonOnEdge(edge_info) {
        if (edge_info.direction == EdgeDirection.top) {
            this.changeFocus(this.props.branchName + "/longImageView")
        }
    }

    renderContent() {
        return(
            <div style={{left: 140, top: 20}}>
                <LongImageScroll branchName={this.props.branchName + "/longImageView"}
                                style={{width: 1000, height: 500, backgroundColor: '#EEEEEE'}}
                                imageSrc={LongImageSource}
                                scrollBlockStyle={{ width: 10, height: 30, backgroundColor: "#555555"}}
                                scrollStyle={{left: 1005, width: 10, height: 500, backgroundColor: "#DDDDDD"}}
                                step={60} />
                <div style={{left: 400, top: 550}}>
                    <Button branchName={this.props.branchName + "/button"} onEdge={this._ButtonOnEdge}/>
                </div>
            </div>
        )
    }
}

let App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};