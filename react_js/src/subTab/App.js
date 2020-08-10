
import React from 'react';
import createStandaloneApp from "../demoCommon/StandaloneApp"
import {FocusBlock} from "../demoCommon/BlockDefine"
import {SimpleWidget, HORIZONTAL, EdgeDirection, VERTICAL} from "../jsview-utils/jsview-react/index_widget.js"
import { JsvInput, JsvInputDispatcher } from '../jsview-utils/JsViewReactWidget/JsvInput'
import {jJsvRuntimeBridge} from "../demoCommon/JsvRuntimeBridge"

let CONST_ITEM_WIDTH = 200;
let CONST_ITEM_HEIGHT = 50;
let BUTTON_DATA = [
    {
        'name': '二级页面1'
    },
    {
        'name': "二级页面2"
    }
]
class Button extends FocusBlock{
    constructor(prop) {
        super(prop);
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
	}

    _Measures(item) {
        return SimpleWidget.getMeasureObj(CONST_ITEM_WIDTH, CONST_ITEM_HEIGHT, true, false);
    }

    _RenderFocus(item) {
        return (
            <div>
                <div style={{backgroundColor: "#DD0000", top: -5, left: -5, width: CONST_ITEM_WIDTH, height: CONST_ITEM_HEIGHT}}></div>
                <div style={{backgroundColor: '#EEEEEE', width: CONST_ITEM_WIDTH - 10, height: CONST_ITEM_HEIGHT - 10, color: "#000000", fontSize: 30}}>
                    { item.name }
                </div>
            </div>
        )
    }

    _RenderItem(item) {
        return (
            <div style={{backgroundColor: '#EEEEEE', width: CONST_ITEM_WIDTH - 10, height: CONST_ITEM_HEIGHT - 10, color: "#000000", fontSize: 30}}>
                { item.name }
            </div>
        )
    }

    onFocus() {
        this.changeFocus(this.props.branchName + "/widget")
    }

    renderContent() {
        return(
            <SimpleWidget 
                width={ 500 } 
                height={ 70 } 
                direction={ HORIZONTAL } 
                data={ BUTTON_DATA } 
                renderItem={ this._RenderItem }
                renderFocus={ this._RenderFocus }
                onClick={ this.props.onClick }
                measures={ this._Measures }
                padding={{top: 10, left: 10}}
                onEdge={this.props.onEdge}
                branchName={ this.props.branchName + "/widget" }
            />
        )
    }
}

class FullKeyboard extends FocusBlock {
    constructor(props) {
        super(props);
        this._Data = this._initData();
        this._ScaleRate = 1.05;

        this._renderItem = this._renderItem.bind(this);
        this._renderFocus = this._renderFocus.bind(this);
        this._renderBlur = this._renderBlur.bind(this);
        this._measures = this._measures.bind(this);
        this._onClick = this._onClick.bind(this);
    }

    _initData() {
        let result = [];
        result.push({
            blocks: {
                w: 120,
                h: 40,
            },
            focusable: true,
            content: "删除",
        })
        result.push({
            blocks: {
                w: 120,
                h: 40,
            },
            focusable: true,
            content: "清空",
        })
        for (let i = 0; i < 10; ++i) {
            result.push({
                blocks: {
                    w: 40,
                    h: 40,
                },
                focusable: true,
                content: String.fromCharCode(i + 48),
            })
        }
        return result;
    }

    _measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _renderItem(item, onedge) {
        return (
            <div style={{ width: item.blocks.w, height: item.blocks.h, fontSize: "25px", textAlign: "center", lineHeight: item.blocks.h + "px", color: "#FFFFFF" }}>
                {item.content}
            </div>
        )
    }

    _renderFocus(item) {
        let width = item.blocks.w * this._ScaleRate;
        let height = item.blocks.h * this._ScaleRate;
        let x = (item.blocks.w - width) / 2
        let y = (item.blocks.h - height) / 2
        return (
            <div style={{ animation: "focusScale 0.5s", backgroundColor: "#44DD00", top: y, left: x, width: width, height: height, fontSize: "25px", textAlign: "center", lineHeight: item.blocks.h + "px", color: "#FFFFFF" }}>
                {item.content}
            </div>
        )
    }

    _renderBlur(item, callback) {
        return (
            <div style={{
                animation: "blurScale 0.5s", width: item.blocks.w, height: item.blocks.h,
                fontSize: "25px", textAlign: "center", lineHeight: item.blocks.h + "px", color: "#FFFFFF"
            }}
                onAnimationEnd={callback}>
                {item.content}
            </div>
        )
    }

    _onClick(item) {
        if (this.props.onClick) {
            this.props.onClick(item.content);
        }
    }

    onFocus() {
        this.changeFocus(this.props.branchName + "/full_keyboard");
    }

    renderContent() {
        return (
            <div style={{width: 260, height: 300, backgroundColor: "#000000"}}>
                <SimpleWidget
                    width={260}
                    height={300}
                    padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
                    direction={VERTICAL}
                    data={this._Data}
                    onClick={this._onClick}
                    renderBlur={this._renderBlur}
                    onEdge={this.props.onEdge}
                    renderItem={this._renderItem}
                    renderFocus={this._renderFocus}
                    measures={this._measures}
                    branchName={this.props.branchName + "/full_keyboard"}
                />
            </div>
        )
    }
}

class Input extends FocusBlock{
    constructor(props) {
        super(props);
        this._dispatcher = new JsvInputDispatcher();
        this._keyboardOnEdge = this._keyboardOnEdge.bind(this);
        this._keyboardOnClick = this._keyboardOnClick.bind(this);
        this._editableTextOnEdge = this._editableTextOnEdge.bind(this);
    }
    _editableTextOnEdge(edge_info) {
        if (edge_info.direction === EdgeDirection.bottom) {
            this.changeFocus(this.props.branchName + "/keyboard")
        } else {
            this.props.onEdge(edge_info);
        }
    }

    _keyboardOnEdge(edge_info) {
        if (edge_info.direction === EdgeDirection.top) {
            this.changeFocus(this.props.branchName + "/etext")
        } else {
            this.props.onEdge(edge_info);
        }
    }

    _keyboardOnClick(char) {
        if (char === '删除') {
            this._dispatcher.dispatch({
                type: JsvInputDispatcher.Type.delete,
            })
        } else if (char === '清空') {
            this._dispatcher.dispatch({
                type: JsvInputDispatcher.Type.clear,
            })
        } else {
            this._dispatcher.dispatch({
                type: JsvInputDispatcher.Type.add,
                data: char
            })
        }
    }

    onFocus() {
        this.changeFocus(this.props.branchName + "/keyboard")
    }

    renderContent() {
        return(
            <div>
                <div style={{ left: 50, top: 50, width: 150, height: 40, backgroundColor: '#AA2222' }} />
                <JsvInput
                    left={50}
                    top={50}
                    height={40}
                    width={150}
                    fontStyle={{ color: '#FFFFFF', fontSize: '20px' }}
                    dispatcher={this._dispatcher}
                    branchName={this.props.branchName + "/etext"}
                    onEdge={this._editableTextOnEdge}
                    cursorColor="#999900"
                    cursorWidth={2}
                    defaultText={"版本号"}
                    onTextChange={this.props.onTextChange}
                    onTextOverflow={() => { console.log("too long") }}
                />
                <div style={{ top: 100 }}>
                    <FullKeyboard
                        onClick={this._keyboardOnClick}
                        onEdge={this._keyboardOnEdge}
                        branchName={this.props.branchName + '/keyboard'}
                    />
                </div>
            </div>
        )
    }
}

class MainScene extends FocusBlock{
    constructor(props) {
        super(props);
        this._buttonOnEdge = this._buttonOnEdge.bind(this);
        this._inputOnEdge = this._inputOnEdge.bind(this);
        this._inputOnChange = this._inputOnChange.bind(this);
        this._buttonOnClick = this._buttonOnClick.bind(this);
        this._SubCount = 0;
        let search = window.location.search;
        if (search) {
            let i = search.indexOf("subCount");
            if (i >= 0) {
                let index1 = search.indexOf("=", i);
                let index2 = search.indexOf("&", i);
                index2 = index2 < 0 ? search.length : index2;
                let c = search.substring(index1 + 1, index2);
                try {
                    this._SubCount = parseInt(c);
                } catch(e) {}
            }
        }
        this.state = {
            text: ""
        }
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            if (this._NavigateHome) {
                let result = this._NavigateHome();
                if (!result) {
                    jJsvRuntimeBridge.closePage()
                }
            } else {
                jJsvRuntimeBridge.closePage()
            }
            return true;
        }
        return false;
    }

    onFocus() {
        this.changeFocus(this.props.branchName + "/button");
    }

    _buttonOnEdge(edge_info) {
        if (edge_info.direction === EdgeDirection.left) {
            this.changeFocus(this.props.branchName + "/input")
        }
    }

    _inputOnEdge(edge_info) {
        if (edge_info.direction === EdgeDirection.right) {
            this.changeFocus(this.props.branchName + "/button")
        }
    }

    _inputOnChange(text) {
        this.setState({
            text: text
        })
    }

    _buttonOnClick(item) {
    	let start_image = ""; // 设置为""，则不显示启动图
        // let start_image = "http://192.168.0.50:8080/res/big_image.jpg";

        let engine_js = ""; // 设置为""，则表示使用和当前页面一样的engine js
        
        let index = window.location.href.indexOf("?");
        let url;
        if (index >= 0) {
            url = window.location.href.substring(0, index);
        } else {
            url = window.location.href;
        }

        if (item.name == "二级页面1") {
        	let core_version = ""; // 设置为""，表示使用当前页面一样的core
            jJsvRuntimeBridge.openBlank(engine_js, url + "?target=/users/subTab&subCount=" + (this._SubCount + 1), start_image, core_version);
        } else {
	        let core_version = this.state.text;
            jJsvRuntimeBridge.openBlank(engine_js, url + "?target=/users/subTab&subCount=" + (this._SubCount + 1), start_image, core_version);
        }
    }

    renderContent() {
        let cur_version = window.JsView ? window.JsView.CodeRevision : -1
        return(
            <div style={{width: 1920, height: 1080, backgroundColor: "#004455"}}>
                <div style={{left: 50}}>
                    <Input branchName={this.props.branchName + "/input"} onEdge={this._inputOnEdge} onTextChange = {this._inputOnChange}/>
                </div>

                <div style={{left: 400, top: 50}}>
                    <Button branchName={this.props.branchName + "/button"} onEdge={this._buttonOnEdge} onClick={this._buttonOnClick}/>
                </div>
                <div style={{left: 400, top: 150, color: "#000000", fontSize: 30}}>
                    {
                        "二级页面1: 使用与当前相同版本的jsview\n\二级页面2: 使用不同版本的jsview\n  "
                    }
                </div>
                <div style={{left: 400, top: 250, color: "#000000", fontSize: 30}}>
                    {"当前深度" + this._SubCount}
                </div>
                <div style={{left: 400, top: 290, color: "#000000", fontSize: 30}}>
                    {"当前jsview core版本: " + cur_version}
                </div>
                <div style={{left: 400, top: 330, color: "#000000", fontSize: 30}}>
                    {"启动subtab的jsview版本: " + this.state.text}
                </div>
                <div style={{left: 400, top: 370, width: 800, height: 200, color: "#000000", fontSize: 30}}>
                    {window.location.href}
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