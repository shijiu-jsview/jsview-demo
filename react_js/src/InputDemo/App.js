import React, { Component } from 'react'
import { JsvInput, JsvInputDispatcher } from '../jsview-utils/JsViewReactWidget/JsvInput'
import {Router, FdivRoot, Fdiv, SimpleWidget, HORIZONTAL, EdgeDirection, VERTICAL} from "../jsview-utils/jsview-react/index.js"

class FullKeyboard extends Component {
    constructor(props) {
        super(props);
        this._Router = new Router();
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
        for (let i = 0; i < 36; ++i) {
            result.push({
                blocks: {
                    w: 40,
                    h: 40,
                },
                focusable: true,
                content: i < 26 ? String.fromCharCode(i + 65) : String.fromCharCode(i - 26 + 48),
            })
        }
        return result;
    }

    _measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _renderItem(item, onedge) {
        return(
            <div style={{ width: item.blocks.w, height: item.blocks.h, fontSize: "25px", textAlign: "center", lineHeight: item.blocks.h + "px", color: "#FFFFFF"}}>
                { item.content }
            </div>
        )
    }

    _renderFocus(item) {
        let width = item.blocks.w * this._ScaleRate;
        let height = item.blocks.h * this._ScaleRate;
        let x = (item.blocks.w - width) / 2
        let y = (item.blocks.h - height) / 2
        return(
            <div style={{animation: "focusScale 0.5s", backgroundColor: "#44DD00", top: y, left: x, width: width, height: height, fontSize: "25px", textAlign: "center", lineHeight: item.blocks.h + "px", color: "#FFFFFF"}}>
                { item.content }
            </div>
        )
    }

    _renderBlur(item, callback) {
        return(
            <div style={{ 
                animation: "blurScale 0.5s", width: item.blocks.w, height: item.blocks.h, 
                fontSize: "25px", textAlign: "center", lineHeight: item.blocks.h + "px", color: "#FFFFFF"}}
                onAnimationEnd={callback}>
                { item.content }
            </div>
        )
    }

    _onClick(item) {
        if(this.props.onClick) {
            this.props.onClick(item.content);
        }
    }

    render() {
        return (
        <Fdiv branchName={ this.props.branchName } router={ this._Router } onFocus={ () => {this._Router.focus("full_keyboard")}}>
            <SimpleWidget
            width={ 260 }
            height={ 300 }
            padding={{left: 10, right: 10, top: 10, bottom: 10}}
            direction={ VERTICAL }
            data={ this._Data }
            onClick={ this._onClick }
            renderBlur={ this._renderBlur }
            onEdge={ this.props.onEdge }
            renderItem={ this._renderItem }
            renderFocus={ this._renderFocus }
            measures={ this._measures }
            branchName={ "full_keyboard" }
            />
        </Fdiv>
        )
    }
}

class App extends Component{
    constructor(props) {
        super(props);
        this._Router = new Router();
        this._Ref = null;
        this._dispatcher = new JsvInputDispatcher();

        this._keyboardOnEdge = this._keyboardOnEdge.bind(this);
        this._keyboardOnClick = this._keyboardOnClick.bind(this);
        this._editableTextOnEdge = this._editableTextOnEdge.bind(this);
    }

    _editableTextOnEdge(edge_info) {
        if (edge_info.direction === EdgeDirection.bottom) {
            this._Router.focus("keyboard")
        }
    }

    _keyboardOnEdge(edge_info) {
        if (edge_info.direction === EdgeDirection.top) {
            this._Router.focus("etext")
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

    render() {
        return(
            <FdivRoot>
                <Fdiv onKeyDown={ this._onKeyDown } style={{backgroundColor: "#000000", width: 1280, height: 720}} router={ this._Router }>
                    <div style={{ left: 50, top: 50, width: 150, height: 40, backgroundColor: '#FF0000'}}/>
                    <JsvInput
                        left={ 50 }
                        top={ 50 }
                        height={ 40 }
                        width={ 150 }
                        fontStyle={{ color: '#FFFFFF', fontSize: '20px'}}
                        dispatcher={ this._dispatcher }
                        branchName="etext"
                        onEdge={this._editableTextOnEdge}
                        onTextChange={ (str) => { console.log("ontextChange " + str) }}
                        onTextOverflow={ () => {console.log("too long")}}
                        />
                    <div style={{ top: 100}}>
                        <FullKeyboard
                        onClick={ this._keyboardOnClick }
                        onEdge={ this._keyboardOnEdge }
                        branchName='keyboard'
                        />
                    </div>
                </Fdiv>
            </FdivRoot>
        )
    }

    componentDidMount() {
        this._Router.focus("keyboard");
    }
}
export default App
