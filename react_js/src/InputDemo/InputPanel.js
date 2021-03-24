/*
 * 【界面概述】
 * 一个简易的输入界面，介绍JsvInput控件的用法
 *
 * 【控件介绍】
 /*
 * JsvInput：React高阶组件，文字的输入控件
 *      props说明:
 *         left {number}                组件的x
 *         top {number}                 组件的y
 *         width {number}               组件的宽
 *         height {number}              组件的高
 *         type Input.type.TEXT         若为number类型，则输入时，非number无法输入
 *         placeholder {string}         文字颜色值为灰色,默认值为"请输入文字"
 *         autofocus {bool}             自动获取焦点, 默认为false
 *         maxlength {number}           最大字符长度, 默认100，支持单行最大宽度为1920*2， fontsize为30，则字数大约为1920*2/30 = 100个左右
 *         readonly {bool}              属性规定输入字段是只读的, 默认false
 *         value {string}               输入的字符串
 *         fontStyle {Object}           文字的style
 *         cursorAlwaysShow {bool}      光标是否一直显示，默认为true，false：失去焦点时，光标不显示
 *         cursorColor {string}         光标颜色 默认为文字颜色
 *         cursorWidth {number}         光标宽度 默认为2像素
 *         dispatcher {InputDispatcher} 向组件发送增删事件的对象
 *         branchName {string}          焦点管理所需的branchName
 *         onTextOverflow {function}    文字过长回调
 *         onEdge {function}        方向键到达边缘回调
 *              @oarams edge_info   边缘信息{direction: EdgeDirection, rect: {x: value,y: value, widht: value,height: value}}
 *         onTextChange {function}  文字改动回调
 *              @params string 当前文字
 *
 *  InputDispatcher dispatch支持事件:
 *          add
 *          delete
 *          clear
 *
 * 【技巧说明】
 * Q: 如何修改输入框中的文字?
 * A: 通过JsvInputDispatcher，具体的三个事件的示例可见_keyboardOnClick函数
 *
 * Q: 如何获取输入框中的文字?
 * A: 通过onTextChange回调，输入框中的文字变化时都会调用该回调
 */
import React from 'react';
import { EdgeDirection } from "../jsview-utils/jsview-react/index_widget";
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";
import { JsvInput, JsvInputDispatcher } from '../jsview-utils/JsViewReactWidget/JsvInput';
import FullKeyboard from "./FullKeyboard";

class InputPanel extends FocusBlock {
  constructor(props) {
    super(props);
    this._Ref = null;
    this.state = {
      cursorShow: false
    };
    this._dispatcher = new JsvInputDispatcher();
    this._keyboardOnEdge = this._keyboardOnEdge.bind(this);
    this._keyboardOnClick = this._keyboardOnClick.bind(this);
    this._editableTextOnEdge = this._editableTextOnEdge.bind(this);
  }

  _editableTextOnEdge(edge_info) {
    let used = false;
    if (edge_info.direction === EdgeDirection.bottom) {
      this.changeFocus(`${this.props.branchName}/keyboard`);
      used = true;
    } else {
      if (this.props.onEdge) {
        used = this.props.onEdge(edge_info);
      }
    }
    return used;
  }

  _keyboardOnEdge(edge_info) {
    if (edge_info.direction === EdgeDirection.top) {
      this.changeFocus(`${this.props.branchName}/etext`);
      return true;
    }
    if (this.props.onEdge) {
      return this.props.onEdge(edge_info);
    }

    return false;
  }

  _keyboardOnClick(char) {
    if (char === '删除') {
      this._dispatcher.dispatch({
        type: JsvInputDispatcher.Type.delete,
      });
    } else if (char === '清空') {
      this._dispatcher.dispatch({
        type: JsvInputDispatcher.Type.clear,
      });
    } else {
      this._dispatcher.dispatch({
        type: JsvInputDispatcher.Type.add,
        data: char
      });
    }
  }

  onKeyDown(ev) {
    return false;
  }

  renderContent() {
    return (
        <div>
            <div style={{ left: 50, top: 50, width: 150, height: 40, backgroundColor: '#33334f' }} />
            <JsvInput
                type={this.props.type}
                left={50}
                top={50}
                height={40}
                width={150}
                placeholder={this.props.placeholder}
                cursorShow={this.state.cursorShow}
                fontStyle={{ fontSize: 28, color: "#ffff00", textAlign: this.props.textAlign }}
                dispatcher={this._dispatcher}
                branchName={`${this.props.branchName}/etext`}
                onEdge={this._editableTextOnEdge}
                cursorWidth={2}
                onTextChange={(str) => { console.log(`ontextChange ${str}`); }}
                onTextOverflow={() => { console.log("too long"); }}
            />

            <div style={{ top: 100 }}>
                <FullKeyboard
                    onClick={this._keyboardOnClick}
                    onEdge={this._keyboardOnEdge}
                    branchName={`${this.props.branchName}/keyboard`}
                />
            </div>
        </div>
    );
  }

  onFocus() {
    this.setState({
      cursorShow: true,
    });
    this.changeFocus(`${this.props.branchName}/keyboard`);
  }

  onBlur() {
    this.setState({
      cursorShow: false,
    });
  }

  componentDidMount() {

  }
}
export default InputPanel;
