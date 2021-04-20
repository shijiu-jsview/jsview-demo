/*
 * 【界面概述】
 * 一个简易的输入界面，介绍JsvInput控件的用法
 *
 * 【控件介绍】
 * JsvInput：带有光标的输入框
 *      left {int} 组件的x，默认为0
 *      top {int} 组件的y 默认为0
 *      width {int} (必选)组件的宽
 *      height {int} (必选)组件的高
 *      fontStyle {object} 文字的style
 *      defaultText {string} 提示文字，默认为“请输入”
 *      cursorColor {string} 光标颜色，默认为白色
 *      cursorWidth {int} 光标宽度，默认1像素
 *      dispatcher {JsvInputDispatcher} (必选)向组件发送增删事件的对象, 支持add/delete/clear三种事件
 *      branchName {string} (必选)焦点管理所需的branchName
 *      charList {array} 可输入的字符串列表, 默认为大写字母+数字
 *      onTextOverflow {function} 文字过长回调，文字最长为3倍的width
 *      onEdge {function} 方向键到达边缘回调
 *          @params edge_info 边缘信息{direction: EdgeDirection, rect: {x: value,y: value, widht: value,height: value}}
 *      onTextChange {function} 文字改动回调
 *          @params string 当前文字
 *
 * 【技巧说明】
 * Q: 如何修改输入框中的文字?
 * A: 通过JsvInputDispatcher，具体的三个事件的示例可见App的_keyboardOnClick函数
 *
 * Q: 如何获取输入框中的文字?
 * A: 通过onTextChange回调，输入框中的文字变化时都会调用该回调
 */
import React from 'react';
import { EdgeDirection } from "../../utils/JsViewEngineWidget/index_widget";
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import { JsvInput } from '../../utils/JsViewReactWidget/JsvInput';
import InputPanel from "./InputPanel";


class MainScene extends FocusBlock {
  constructor(props) {
    super(props);
    this._FocusName = "InputPanel1";
  }

    _OnEdge=(edge_info) => {
      let used = false;
      switch (edge_info.direction) {
        case EdgeDirection.left:
          if (this._FocusName === "InputPanel2") {
            this._FocusName = "InputPanel1";
            this.changeFocus(`${this.props.branchName}/${this._FocusName}`);
            used = true;
          } else if (this._FocusName === "InputPanel3") {
            this._FocusName = "InputPanel2";
            this.changeFocus(`${this.props.branchName}/${this._FocusName}`);
            used = true;
          }
          break;
        case EdgeDirection.right:
          if (this._FocusName === "InputPanel1") {
            this._FocusName = "InputPanel2";
            this.changeFocus(`${this.props.branchName}/${this._FocusName}`);
            used = true;
          } else if (this._FocusName === "InputPanel2") {
            this._FocusName = "InputPanel3";
            this.changeFocus(`${this.props.branchName}/${this._FocusName}`);
            used = true;
          }
          break;
        default:
          break;
      }

      return used;
    }

    onKeyDown(ev) {
      if (ev.keyCode === 10000 || ev.keyCode === 27) {
        if (this._NavigateHome) {
          this._NavigateHome();
        }
        return true;
      }
      return false;
    }

    renderContent() {
      return (
            <div style={{ backgroundColor: "#0e0f5a", width: 1280, height: 720 }}>
                <div style={{ textAlign: "center",
                  fontSize: "30px",
                  lineHeight: "50px",
                  color: "#ffffff",
                  left: 50,
                  top: 50,
                  width: 300,
                  height: 50,
                  backgroundColor: "rgba(27,38,151,0.8)"
                }}>{`文字输入--左对齐`}</div>
                <div style={{ left: 50, top: 100 }}>
                    <InputPanel
                        type={JsvInput.type.TEXT}
                        textAlign="left"
                        placeholder="请输入文字"
                        branchName={`${this.props.branchName}/InputPanel1`}
                        onEdge={this._OnEdge}
                    />
                </div>

                <div style={{ textAlign: "center",
                  fontSize: "30px",
                  lineHeight: "50px",
                  color: "#ffffff",
                  left: 400,
                  top: 50,
                  width: 400,
                  height: 50,
                  backgroundColor: "rgba(27,38,151,0.8)"
                }}>{`文字输入--右对齐(密码）`}</div>
                <div style={{ left: 400, top: 100 }}>
                    <InputPanel
                        type={JsvInput.type.PASSWORD}
                        textAlign="right"
                        placeholder="请输入密码"
                        branchName={`${this.props.branchName}/InputPanel2`}
                        onEdge={this._OnEdge}
                    />
                </div>

                <div style={{ textAlign: "center",
                  fontSize: "30px",
                  lineHeight: "50px",
                  color: "#ffffff",
                  left: 850,
                  top: 50,
                  width: 400,
                  height: 50,
                  backgroundColor: "rgba(27,38,151,0.8)"
                }}>{`文字输入--右对齐(数字）`}</div>
                 <div style={{
                   textAlign: "center",
                   fontSize: "24px",
                   lineHeight: "30px",
                   color: "#ffffff",
                   left: 850,
                   top: 550,
                   width: 400,
                   height: 30,
                   backgroundColor: "rgba(0,0,0,0.5)"
                 }}>{`（提示：只能输入数字）`}</div>
                <div style={{ left: 850, top: 100 }}>
                    <InputPanel
                        type={JsvInput.type.NUMBER}
                        textAlign="right"
                        placeholder="请输入数字"
                        branchName={`${this.props.branchName}/InputPanel3`}
                        onEdge={this._OnEdge}
                    />
                </div>

            </div>
      );
    }

    componentDidMount() {
      this.changeFocus(`${this.props.branchName}/${this._FocusName}`);
    }
}
const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
