/**
 * Created by chunfeng.luo@qcast.cn on 10/13/20.
 */
/*
 * JsvInput：React高阶组件，文字的输入控件
 *      props说明:
 *         left {number}                组件的x
 *         top {number}                 组件的y
 *         width {number}               组件的宽
 *         height {number}              组件的高
 *         type Input.type.TEXT         若为number类型，则输入时，非number无法输入
 *         placeholder {string}         文字颜色值为灰色,默认值为"请输入文字"
 *         maxlength {number}           最大字符长度, 默认100，支持单行最大宽度为1920*2， fontsize为30，则字数大约为1920*2/30 = 100个左右
 *         readonly {bool}              属性规定输入字段是只读的, 默认false
 *         value {string}               输入的字符串
 *         fontStyle {Object}           文字的style
 *         cursorShow {bool}            光标是否显示，默认为true，false：光标显示
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
 */

import React, { Component } from 'react';
import { BaseDispatcher, EdgeDirection } from "../JsViewEngineWidget/index_widget";
import { FocusBlock } from "../JsViewReactTools/BlockDefine";
import { Forge, ForgeExtension } from "../../dom/jsv-forge-define";

class Cursor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibility: "inherit"
    };
    this.startBlink();
  }

  stopBlink(show) {
    if (this._IntervalHandler) {
      clearInterval(this._IntervalHandler);
      this._IntervalHandler = null;
    }
    const v = (show === false ? "hidden" : "inherit");
    this.setState({
      visibility: v
    });
  }

  startBlink() {
    this._IntervalHandler = setInterval(() => {
      const v = this.state.visibility === "inherit" ? "hidden" : "inherit";
      this.setState({
        visibility: v
      });
    }, 750);
  }

  render() {
    return (
            <div style={{
              visibility: this.state.visibility,
              backgroundColor: this.props.color,
              left: this.props.left,
              top: this.props.top,
              width: this.props.width,
              height: this.props.height
            }}/>
    );
  }

  componentWillUnmount() {
    this.stopBlink(false);
  }
}

class InputDispatcher extends BaseDispatcher {
}
InputDispatcher.Type = {
  add: Symbol('add'),
  delete: Symbol('delete'),
  clear: Symbol('clear'),
};
const ifDigital = char => '0'.charCodeAt() <= char.charCodeAt() && char.charCodeAt() <= '9'.charCodeAt();
const ifDirectionKeyCode = code => code >= 37 && code <= 40;
const edgeMap = {
  37: EdgeDirection.left,
  38: EdgeDirection.top,
  39: EdgeDirection.right,
  40: EdgeDirection.bottom
};

class Input extends FocusBlock {
  constructor(props) {
    super(props);
    this._InputView = new Forge.EditControlView();
    this._InputView.OnTextChanged = this._onTextChanged;
    this._InputView.OnStatusChanged = this._onStatusChanged;
    const view_store = ForgeExtension.RootActivity ? ForgeExtension.RootActivity.ViewStore : Forge.sViewStore;
    this._InnerViewId = view_store.add(new Forge.ViewInfo(this._InputView));
    if (this.props.dispatcher) {
      this.props.dispatcher.registerComponent(this);
    }
    this._MaxWidth = 1920;
    const cur_position = this._calculateCursorPosition(this.props.value, this.props.value.length);
    this._VisibleAreaCurEnd = cur_position > this.props.width ? cur_position : this.props.width;// 可视区域光标结束位置，当光标位置超出这个范围，则更新start&end,并更新text left
    this._VisibleAreaCurStart = this._VisibleAreaCurEnd - this.props.width;// 可视区域光标起始位置
    this._VisibleAreaCurPos = cur_position;

    // 文字的描画长度，默认为可视区域的长度
    // 文字内容变化时，文字显示宽度变化，最小为可视区域的长度
    this._textWidth = cur_position > this.props.width ? cur_position : this.props.width;
    this.state = {
      fullString: this.props.value,
      curOffset: this.props.value.length,
    };
    this.textLeft = 0;
    this.textLeft = this._calculateSlide("", this.props.value, this.props.value.length);
    this.isFocus = false;
    this._CursorRef = null;
    this._CursorPauseTimer = null;
  }

  _updateTextWidth(text) {
    if (text.length !== this.state.fullString.length) {
      if (text.length === 0) {
        this._textWidth = this.props.width;
      } else {
        this._textWidth = this._calculateCursorPosition(text, text.length);
        if (this._textWidth < this.props.width) {
          this._textWidth = this.props.width;
        }
      }
    }
  }


    _onTextChanged = (text, cursor_pos, moved) => {
      if (moved) {
        // 移动时，光标不闪烁
        this.pauseCursorBlink();
      } else {
        if (text.length >= this.props.maxlength) {
          text = this.state.fullString;
          if (this._InputView && this.isFocus) {
            this._InputView.updateCursorOffset(this.state.fullString, this.state.curOffset);
          }
          return;
        }
      }
      if (text.length > 0) {
        const start = cursor_pos - 1;
        const end = cursor_pos;
        const add_text = text.slice(start, end);
        if (add_text && !ifDigital(add_text) && this.props.type === Forge.TextInputType.NUMBER) {
          console.log(`onTextChanged add text failed, add_text:${add_text}, when input type is number!`);
          if (this._InputView) {
            this._InputView.updateCursorOffset(this.state.fullString, this.state.curOffset);
          }
          return;
        }
      }

      this._updateTextWidth(text);
      this.textLeft = this._calculateSlide(this.state.fullString, text, cursor_pos, moved);
      this.setState({
        fullString: text,
        curOffset: cursor_pos,
      }, () => {
        if (this.props.onTextChange) {
          this.props.onTextChange(text);
        }
      });
    }

    // 1:shown 0:hidden
    _onStatusChanged = (status) => {
      console.log("OnStatusChanged status,");
    }

    _getFullStringLength(str) {
      const size = this.props.fontStyle.fontSize ? this.props.fontStyle.fontSize : 12;
      const font = this.props.fontStyle.fontFamily;
      const alignment = this.props.fontStyle.textAlign;
      const italic = this.props.fontStyle.fontStyle === "italic";
      const bold = this.props.fontStyle.fontWeight === "bold";
      const font_params = Forge.sTextUtils.StringWithFont(str, size, font, alignment, "middle", null, italic, bold);

      return Forge.sTextUtils.GetTextWidth(font_params);
    }

    _dispathcEvent = (event) => {
      if (!event || this.props.readonly) {
        return;
      }

      const pre_full_str = this.state.fullString;
      const pre_index = this.state.curOffset;
      switch (event.type) {
        case InputDispatcher.Type.add:
          if (this.props.type === Input.type.NUMBER && !ifDigital(event.data)) {
            console.log(`The input data:${event.data} is not number`);
            break;
          }
          if (this.state.fullString.length < this.props.maxlength) {
            const new_str = pre_full_str.slice(0, pre_index) + event.data + pre_full_str.slice(pre_index);
            const new_index = pre_index + 1;
            this._onTextChanged(new_str, new_index);
          } else {
            if (this.props.onTextOverflow) {
              this.props.onTextOverflow();
            }
          }
          break;
        case InputDispatcher.Type.delete:
          if (pre_index > 0) {
            const new_str = pre_full_str.slice(0, pre_index - 1) + pre_full_str.slice(pre_index);
            const new_index = pre_index - 1;
            this._onTextChanged(new_str, new_index);
          }
          break;
        case InputDispatcher.Type.clear:
          this._onTextChanged("", 0);
          break;
        default:
          break;
      }
    }

    _calculateCursorPosition(full_str, cursor_offset) {
      const target_str = this._GetRealText(full_str);
      const size = this.props.fontStyle.fontSize;
      const max_width = this._MaxWidth;// 最大宽度为1920*2， 根据texture的最大宽度设定
      const max_rect = new Forge.RectArea(0, 0, max_width, this.props.height);
      const font = this.props.fontStyle.fontFamily;
      const alignment = this.props.fontStyle.textAlign;
      const italic = this.props.fontStyle.fontStyle === "italic";
      const bold = this.props.fontStyle.fontWeight === "bold";
      const font_params = Forge.sTextUtils.StringWithFont(target_str, size, font, alignment, "middle", null, italic, bold);
      const text_attr = Forge.sTextUtils.TextAttr("none", "none");
      const cur_pos = Forge.sTextUtils.GetCursorPosition(target_str, max_rect, font_params, text_attr, this.props.height, cursor_offset);
      return cur_pos.x;
    }

    _getLeftWithDelChar(current_cursor_position, target_str) {
      let new_left = this.textLeft;
      let offset = 0;
      if (current_cursor_position === 0) {
        offset = -new_left;
        new_left = 0;
      } else if ((current_cursor_position - this.props.cursorWidth > 0)
            && (current_cursor_position - this.props.cursorWidth <= this._VisibleAreaCurStart)) {
        offset = this._VisibleAreaCurPos - current_cursor_position;
        if (new_left < 0 && new_left + offset + this._textWidth < this.props.width) {
          // 删除字符时，可视区域内字符串显示不全，对left做调整
          offset = this.props.width - (new_left + this._textWidth);
        }
        new_left += offset;
        if (new_left > 0) {
          new_left = 0;
        } else {
          if (this.props.fontStyle.textAlign === "right") {
            const text_real_width = this._getFullStringLength(target_str);
            if (new_left > text_real_width - this._MaxWidth) {
              new_left = text_real_width - this._MaxWidth;
              offset = this._VisibleAreaCurStart + new_left;
            }
          }
        }
      } else {
        if (new_left < 0 && new_left + this._textWidth < this.props.width) {
          // 删除字符时，可视区域内字符串显示不全，对left做调整
          offset = this.props.width - (new_left + this._textWidth);
          new_left = this.props.width - this._textWidth;
        } else {
          if (this.props.fontStyle.textAlign === "right") {
            const text_real_width = this._getFullStringLength(target_str);
            if (text_real_width >= this.props.width) {
              if (new_left > text_real_width - this._MaxWidth) {
                new_left = text_real_width - this._MaxWidth;
                offset = this._VisibleAreaCurStart + new_left;
              }
            } else {
              new_left = this.props.width - this._MaxWidth;
              offset = this._VisibleAreaCurStart + new_left;
            }
          }
        }
      }

      this._updateVisibleAreaCursor(-offset);
      // console.log(` _getLeftWithDelChar2 target_str:${target_str}, new_left:${new_left}, this._textWidth:${this._textWidth}`);

      return new_left;
    }

    _getLeftWithMoveRight(current_cursor_position) {
      let new_left = this.textLeft;
      let offset = this.props.width / 2;
      // 边界检测
      if (this._textWidth + (new_left - offset) < this.props.width) {
        new_left = this.props.width - this._textWidth;
        offset = -new_left - this._VisibleAreaCurStart;
      } else {
        new_left -= offset;
      }

      this._updateVisibleAreaCursor(offset);
      return new_left;
    }

    _getLeftWithMoveLeft(current_cursor_position) {
      let new_left = this.textLeft;
      let offset = this.props.width / 2;
      new_left += offset;
      // 边界检测
      if (new_left > 0) {
        new_left = 0;
        offset = this._VisibleAreaCurStart;
      } else {
        if (this.props.fontStyle.textAlign === "right") {
          const text_real_width = this._getFullStringLength(this._GetShowText());
          if (new_left > text_real_width - this._MaxWidth) {
            new_left = text_real_width - this._MaxWidth;
            offset = this._VisibleAreaCurStart + new_left;
          }
        }
      }
      this._updateVisibleAreaCursor(-offset);
      return new_left;
    }

    _updateVisibleAreaCursor(offset) {
      this._VisibleAreaCurStart += offset;
      if (this._VisibleAreaCurStart < 0) {
        this._VisibleAreaCurStart = 0;
      }
      this._VisibleAreaCurEnd = this._VisibleAreaCurStart + this.props.width;
    }

    _getLeftWithAddChar(current_cursor_position, end_add) {
      let new_left = this.textLeft;
      if (current_cursor_position + this.props.cursorWidth >= this._VisibleAreaCurEnd) {
        let offset = (current_cursor_position - this._VisibleAreaCurPos);
        new_left -= offset;
        if (end_add) { // 尾部追加，对齐坐标
          if (this.props.fontStyle.textAlign === "right") {
            new_left = this.props.width - this._MaxWidth;
            offset = -this._VisibleAreaCurStart - new_left;
          } else {
            new_left = this.props.width - this._textWidth;
            offset = -this._VisibleAreaCurStart - new_left;
          }
        }

        this._updateVisibleAreaCursor(offset);
      }

      return new_left;
    }

    _calculateSlide = (pre_str, target_str, cur_index, moved) => {
      if (target_str.length === 0) {
        if (this.props.fontStyle.textAlign === "right") {
          const offset = this._MaxWidth - this.props.width - this._VisibleAreaCurStart;
          this._updateVisibleAreaCursor(offset);
          this._VisibleAreaCurPos = this._VisibleAreaCurEnd;
          return this.props.width - this._MaxWidth;
        }
        const offset = -this._VisibleAreaCurStart;
        this._updateVisibleAreaCursor(offset);
        this._VisibleAreaCurPos = this._VisibleAreaCurEnd;
        return 0;
      }

      let new_left = this.textLeft;
      const current_cursor_position = this._calculateCursorPosition(target_str, cur_index);
      let option_mode = "op_vis_normal";// 可视区域内移动
      // 计算模式
      if (pre_str.length > target_str.length) {
        option_mode = "op_del";// 字符删除
      } else if (pre_str.length < target_str.length) {
        option_mode = "op_add";// 字符追加
      } else {
        if (moved) {
          if (current_cursor_position <= this._VisibleAreaCurStart) {
            option_mode = "op_move_left";// 边界左移动
          } else if (current_cursor_position >= this._VisibleAreaCurEnd) {
            option_mode = "op_move_right";// 边界右移动
          }
        }
      }

      // 根据用户动作，区分计算方法
      switch (option_mode) {
        case "op_del":
          new_left = this._getLeftWithDelChar(current_cursor_position, target_str);
          break;
        case "op_add":
          new_left = this._getLeftWithAddChar(current_cursor_position, target_str.length === cur_index);
          break;
        case "op_move_left":
          new_left = this._getLeftWithMoveLeft(current_cursor_position);
          break;
        case "op_move_right":
          new_left = this._getLeftWithMoveRight(current_cursor_position);
          break;
        case "op_vis_normal":
        default:
          break;
      }

      // 更新可视区域光标位置
      this._VisibleAreaCurPos = current_cursor_position;
      return new_left;
    }

    onFocus() {
      console.log("Input Focus");
      this.isFocus = true;
      if (this._InputView && !this.props.readonly) {
        this._InputView.showIme(this.props.type, this.state.fullString, this.state.curOffset);
      }
    }

    onBlur() {
      this.isFocus = false;
      console.log("Input Blur");
      if (this._InputView && !this.props.readonly) {
        this._InputView.hideIme();
      }
    }

    clearCursorPauseTimer() {
      if (this._CursorPauseTimer) {
        clearTimeout(this._CursorPauseTimer);
        this._CursorPauseTimer = null;
      }
    }

    pauseCursorBlink=() => {
      if (this._CursorRef) {
        this._CursorRef.stopBlink(true);
      }
      this.clearCursorPauseTimer();
      this._CursorPauseTimer = setTimeout(() => {
        if (this._CursorRef) {
          this._CursorRef.startBlink();
        }
      }, 500);
    }

    onKeyDown(keyEvent) {
      let key_used = false;
      let pre_index = this.state.curOffset;
      let cur_index;
      let valid_move = false;

      switch (keyEvent.keyCode) {
        case 37:// left
          this.pauseCursorBlink();
          if (pre_index !== 0) {
            valid_move = true;
            cur_index = --pre_index;
            key_used = true;
          }
          break;
        case 39:// right
          this.pauseCursorBlink();
          if (pre_index < this.state.fullString.length) {
            valid_move = true;
            cur_index = ++pre_index;
            key_used = true;
          }
          break;
        case 38:// up
        case 40:// down
          break;
        case 13:
          // 显示键盘
          this._InputView.showIme(this.props.type, this.state.fullString, this.state.curOffset);
          key_used = true;
          break;
        default:// 浏览器中，点击浏览器时input焦点丢失，JsvInput收到任意按键获取焦点
          if (!window.JsView) {
            // 显示键盘
            this._InputView.showIme(this.props.type, this.state.fullString, this.state.curOffset);
            key_used = true;
          }
          break;
      }

      if (ifDirectionKeyCode(keyEvent.keyCode)) {
        if (valid_move) {
          this.setState({
            curOffset: cur_index,
          });
          this.textLeft = this._calculateSlide(this.state.fullString, this.state.fullString, cur_index, true);
          if (this._InputView) {
            this._InputView.updateCursorOffset(this.state.fullString, cur_index);
          }
        } else {
          if (this.props.onEdge && edgeMap[keyEvent.keyCode]) {
            const on_edged = this.props.onEdge({
              direction: edgeMap[keyEvent.keyCode],
              rect: {
                x: this.props.left,
                y: this.props.top,
                width: this.props.width,
                height: this.props.height,
              }
            });
            if (!on_edged && !window.JsView) {
              // 重获焦点
              this._InputView.showIme(this.props.type, this.state.fullString, this.state.curOffset);
            }
          }
        }
      }
      return key_used;
    }

    _GetRealText(src_str) {
      let value = src_str;
      if (this.props.type === Forge.TextInputType.PASSWORD) {
        // password
        value = value.replace(/\w/g, "*");
      }

      return value;
    }

    _GetShowText() {
      return this._GetRealText(this.state.fullString);
    }

    renderContent() {
      const text = this._GetShowText();
      const placeholder_visible = text.length === 0 && this.props.placeholder.length > 0;
      const cursor_left = this._calculateCursorPosition(text, this.state.curOffset) + this.textLeft;
      const cursor_color = this.props.cursorColor ? this.props.cursorColor : this.props.fontStyle.color;
      return (
            <div style={{
              left: this.props.left,
              top: this.props.top,
              width: this.props.width,
              height: this.props.height
            }}>
                <div style={{
                  width: this.props.width,
                  height: this.props.height,
                  overflow: "hidden"
                }}>
                    <div style={{
                      left: this.textLeft,
                      width: this._textWidth,
                      height: this.props.height,
                      lineHeight: `${this.props.height}px`,
                      ...this.props.fontStyle
                    }}>
                        { text }
                    </div>
                    {
                        placeholder_visible ? <div style={{
                          left: 0,
                          width: this.props.width,
                          height: this.props.height,
                          lineHeight: `${this.props.height}px`,
                          ...this.props.fontStyle,
                          color: "#cdccd6"
                        }}>
                            { this.props.placeholder }
                        </div> : null
                    }
                </div>
                {
                    this.props.cursorShow ?
                        <Cursor ref={this.initCursorRef} left={cursor_left} height={ this.props.height } color={ cursor_color }
                                width={this.props.cursorWidth}/> : null
                }
                <div jsv_innerview={ this._InnerViewId}/>
            </div>
      );
    }

    initCursorRef=(ref) => {
      this._CursorRef = ref;
    }

    componentWillUnmount() {
      this.props.dispatcher.unregisterComponent(this);
      this.clearCursorPauseTimer();
    }

    componentDidMount() {
      if (this.props.autofocus && !this.props.readonly) { // 自动获取焦点
        this.changeFocus(this.props.branchName);
      }
    }
}

Input.type = {
  TEXT: Forge.TextInputType.TEXT,
  NUMBER: Forge.TextInputType.NUMBER,
  PASSWORD: Forge.TextInputType.PASSWORD,
};

Input.defaultProps = {
  left: 0,
  top: 0,
  width: 100,
  height: 20,
  type: Input.type.TEXT, // 若为number类型，则输入时，非number无法输入
  placeholder: "请输入", // 文字颜色值为灰色
  autofocus: false, // 自动获取焦点
  maxlength: 100, // 最大字符长度, 支持单行最大宽度为1920*2， fontsize为30，则字数大约为1920*2/30 = 100个左右
  readonly: false, // 属性规定输入字段是只读的。
  value: "", // value 的值。
  fontStyle: { // 元素的font style
    textAlign: "left",
    fontSize: 12,
    color: "#000000"
  },
  cursorShow: true,
  cursorColor: "", // 默认与文字颜色相同
  cursorWidth: 2,
};

export {
  Input as JsvInput,
  InputDispatcher as JsvInputDispatcher
};
