import React, { Component } from 'react';
import {Router, Fdiv, EdgeDirection} from "jsview-react"

class CharacterSizeMeasure extends Component{
    constructor(props) {
        super(props);
        this._List = this._initData();
        this._SizeMap = {};
    }
    _initData() {
        let result = [];
        for (let i = 0; i < 36; ++i) {
            result.push(i < 26 ? String.fromCharCode(i + 65) : String.fromCharCode(i - 26 + 48));
        }
        return result;
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return(
            <div>
                {
                    this._List.map((value) => {
                        //精确测量，画20个取平均
                        return(
                            <div key={value} style={{visibility: "hidden", fontSize: this.props.fontSize}} ref={ (element) => { this._SizeMap[value] = element.clientWidth / 20 } }>
                                {value.repeat(20)}
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    componentDidMount() {
        if (this.props.onMeasureDone) {
            this.props.onMeasureDone(this._SizeMap)
        }
    }
}

class Cursor extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visibility: "inherit"
        }
        this._IntervalHandler = setInterval(() => {
            let v = this.state.visibility === "inherit" ? "hidden" : "inherit";
            this.setState({
                visibility: v
            })
        }, 1000);
    }

    render() {
        return(
            <div style={{visibility: this.state.visibility, backgroundColor: this.props.color, left: this.props.left, top: this.props.top, width: this.props.width, height: this.props.height}}/>
        )
    }

    componentWillUnmount() {
        clearInterval(this._IntervalHandler);
    }
}

class InputDispatcher{
    constructor() {
        this._Input = null;
        this._registerInput = this._registerInput.bind(this);
        this._unregisterInput = this._unregisterInput.bind(this);
        this.dispatch = this.dispatch.bind(this);
    }

    _registerInput(input) {
        this._Input = input;
    }

    _unregisterInput() {
        this._Input = null;
    }

    dispatch(event) {
        if (event && this._Input) {
            this._Input._dispathcEvent(event);
        }
    }
}
InputDispatcher.Type = {
    'add': Symbol('add'),
    'delete': Symbol('delete'),
    'clear': Symbol('clear'),
}

let ifUpperCaseChar = char => 'A'.charCodeAt() <= char.charCodeAt() && char.charCodeAt() <= 'Z'.charCodeAt();
let ifDigital = char => '0'.charCodeAt() <= char.charCodeAt() && char.charCodeAt() <= '9'.charCodeAt();
let ifDirectionKeyCode = code => 37 <= code && code <= 40;
let edgeMap = {
    37: EdgeDirection.left,
    38: EdgeDirection.top,
    39: EdgeDirection.right,
    40: EdgeDirection.bottom
}
/* 
    left { int } 组件的x
    top { int } 组件的y
    width { int } 组件的宽
    height { int } 组件的高
    textColor { string } 文字颜色
    fontSize { string } 文字大小
    cursorColor { string } 光标颜色
    cursorWidth { int } 光标宽度
    dispatcher { InputDispatcher } 向组件发送增删事件的对象
    branchName { string } 焦点管理所需的branchName

    onTextTooLong { function } 文字过长回调，文字最长为3倍的width
    onEdge { function } 方向键到达边缘回调
        @oarams edge_info 边缘信息{direction: EdgeDirection, rect: {x: value,y: value, widht: value,height: value}}
    onTextChange { function } 文字改动回调 
        @params string 当前文字
*/
class Input extends Component{
    constructor(props) {
        super(props);
        this._CharSizeMap = null;
        this._Router = new Router();

        this._onFocus = this._onFocus.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this._dispathcEvent = this._dispathcEvent.bind(this);
        this._calculateSlide = this._calculateSlide.bind(this);
        if (this.props.dispatcher) {
            this.props.dispatcher._registerInput(this);
        }

        this.state = {
            fullString: '',
            curIndex: -1,
            textLeft: 0,
        }
    }

    _getFullStringLength() {
        let length = 0;
        if (this._CharSizeMap) {
            for (let i = 0; i < this.state.fullString.length; i++) {
                length += this._CharSizeMap[this.state.fullString[i]];
            }
        }
        return length;
    }

    _dispathcEvent(event) {
        if (!event) { return; }
        let pre_full_str = this.state.fullString;
        let pre_index = this.state.curIndex;
        switch(event.type) {
            case InputDispatcher.Type.add:
                if (event.data.length === 1 && (ifUpperCaseChar(event.data) || ifDigital(event.data))) {
                    if (this._getFullStringLength() + this._CharSizeMap[event.data] < this.props.width * 3) {
                        let new_index = pre_index + 1;
                        let new_str = pre_full_str.slice(0, pre_index + 1) + event.data + pre_full_str.slice(pre_index + 1);
                        this.setState({
                            fullString: new_str,
                            curIndex: new_index,
                            textLeft: this._calculateSlide(new_str, new_index)
                        }, () => {
                            if (this.props.onTextChange) {
                                this.props.onTextChange(this.state.fullString)
                            }
                        })
                    } else {
                        if (this.props.onTextTooLong) {
                            this.props.onTextTooLong();
                        }
                    }
                }
                break;
            case InputDispatcher.Type.delete:
                if (pre_index >= 0) {
                    let new_index = pre_index - 1;
                    let new_str = pre_full_str.slice(0, pre_index) + pre_full_str.slice(pre_index + 1);
                    let new_left = this.state.textLeft;
                    if (this._CharSizeMap && this.state.textLeft < 0) {
                        new_left = this.state.textLeft + this._CharSizeMap[pre_full_str[pre_index]];
                        new_left = new_left > 0 ? 0 : new_left;
                    }
                    this.setState({
                        fullString: new_str,
                        curIndex: new_index,
                        textLeft: new_left,
                    }, () => {
                        if (this.props.onTextChange) {
                            this.props.onTextChange(this.state.fullString)
                        }
                    })
                }
                break;
            case InputDispatcher.Type.clear:
                this.setState({
                    fullString: '',
                    curIndex: -1,
                    textLeft: 0,
                }, () => {
                    if (this.props.onTextChange) {
                        this.props.onTextChange(this.state.fullString)
                    }
                })
                break;
            default:
                break;
        }
    }

    _calculateCursorPosition(full_str, index) {
        let position = 0;
        if (this._CharSizeMap) {
            for (let i = 0; i <= index; ++i) {
                position += this._CharSizeMap[full_str[i]];
            }
        }
        return position
    }

    _calculateSlide(full_str, cur_index) {
        let new_left = this.state.textLeft;
        if (this._CharSizeMap) {
            let full_text_width = this._calculateCursorPosition(full_str, cur_index);
            if (full_text_width + this.state.textLeft  > this.props.width) {
                new_left = this.state.textLeft - this._CharSizeMap[full_str[cur_index]];
            } else if (full_text_width + this.state.textLeft < 0) {
                if (cur_index >= 0) {
                    new_left = this.state.textLeft + this._CharSizeMap[full_str[cur_index]];
                } else {
                    new_left = 0;
                }
            }
        }
        return new_left;
    }

    _onFocus() {
    }

    _onKeyDown(keyEvent) {
        let pre_index = this.state.curIndex;
        if (ifDirectionKeyCode(keyEvent.keyCode)) {
            let cur_index;
            let valid_move = false;
            if (keyEvent.keyCode === 37) {
                if (pre_index !== -1) {
                    valid_move = true;
                    cur_index = --pre_index;
                }
            } else if (keyEvent.keyCode === 39) {
                if (pre_index !== this.state.fullString.length - 1) {
                    valid_move = true;
                    cur_index = ++pre_index;
                }
            }

            if (valid_move) {     
                this.setState({
                    curIndex: cur_index,
                    textLeft: this._calculateSlide(this.state.fullString, cur_index),
                })
            } else {
                if (this.props.onEdge) {
                    this.props.onEdge({
                        direction: edgeMap[keyEvent.keyCode],
                        rect: {
                            "x": this.props.left,
                            "y": this.props.top,
                            "width": this.props.width,
                            "height": this.props.height,    
                        }
                    })
                }
            }
            return true;
        }
        return false;
    }

    render() {
        let text = this.state.fullString ? this.state.fullString : this.props.defaultText;
        let cursor_left = this._calculateCursorPosition(this.state.fullString, this.state.curIndex) + this.state.textLeft;
        return(
            <div style={{left: this.props.left, top: this.props.top}}>
                <CharacterSizeMeasure fontSize={ this.props.fontSize } onMeasureDone={(map) => {console.log("char map ", map); this._CharSizeMap = map; }}/>
                <Fdiv onFocus={ this._onFocus } routner={ this._Router } branchName={ this.props.branchName } onKeyDown={ this._onKeyDown }>
                    <div style={{clipPath: "inset(0px 0px 0px 0px)", width: this.props.width + this.props.cursorWidth, height: this.props.height,}}>
                        <div style={{ color: this.props.textColor, left: this.state.textLeft, width: this.props.width * 3, height: this.props.height, lineHeight: this.props.height + 'px', fontSize: this.props.fontSize}}>
                            { text }
                        </div>
                        <Cursor left={cursor_left} height={ this.props.height } color={ this.props.cursorColor } width={this.props.cursorWidth}/>
                    </div>
                </Fdiv>
            </div>
        )
    }

    componentWillUnmount() {
        this.props.dispatcher._unregisterInput(this);
    }
}
Input.defaultProps = {
    left: 0,
    top: 0,
    cursorColor: '#FFFFFF',
    cursorWidth: 1,
    textColor: '#FFFFFF',
    fontSize: '20px',
    defaultText: '请输入',
}
export {
    Input as JsvInput,
    InputDispatcher as JsvInputDispatcher
}
