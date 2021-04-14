import React from 'react';
import { MainAreaRightBlock } from './MainAreaRightBlock';
import { MainAreaLeftBlock } from './MainAreaLeftBlock';
import { convertToFocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";
import { EventCenter } from "./EventCenter";

class MainAreaBasic extends React.Component {
  constructor(prop) {
    super(prop);
    this._column = 0;
    this._line = 0;
  }

  onKeyDown(ev) {
    // 子节点未处理的按键事件会流向此节点
    let key_used = true;
    switch (ev.keyCode) {
      case 38: // Up
        if (this._line > 0) this._line--;
        break;
      case 40: // Down
        if (this._line < 1) this._line++;
        break;
      case 37: // Left
        if (this._column > 0) this._column--;
        break;
      case 39: // Right
        if (this._column < 1) this._column++;
        break;
      default:
        key_used = false;
    }

    if (key_used) {
      // 焦点与之前相同时也可以重复调用，焦点管理系统内容有是否变更的判断处理
      this.changeFocus(`/main/L${this._line}C${this._column}`);
    }
  }

  render() {
    return (
            <div style={this.props.style}>
                <MainAreaLeftBlock branchName="/main/L0C0" style={{ left: 0, top: 0 }}/>
                <MainAreaRightBlock branchName="/main/L0C1" style={{ left: 120, top: 0 }}/>
                <MainAreaLeftBlock branchName="/main/L1C0" style={{ left: 0, top: 120 }}/>
                <MainAreaRightBlock branchName="/main/L1C1" style={{ left: 120, top: 120 }}/>
            </div>);
  }

  componentDidMount() {
    const that = this;
    EventCenter.setLisener("ResetMainPosition", () => {
      that._column = 0;
      that._line = 0;
    });
  }

  componentWillUnmount() {
    // 释放引用，解除对this实体的引用
    EventCenter.removeListener("ResetMainPosition");
  }
}

const MainArea = convertToFocusBlock(MainAreaBasic);

export {
  MainArea
};
