import React from 'react';
import PageTheme from "../../common/PageTheme";
import ConstantVar from "../../common/ConstantVar";
import { FocusBlock } from "../../../jsview-utils/JsViewReactTools/BlockDefine";

class TipsPage extends FocusBlock {
  constructor(props) {
    super(props);
    this._PageTheme = PageTheme.get().TipsPage;
    this.state = {
      visible: "hidden",
      focusBranchName: "GetWelfare"
    };
  }

  onFocus() {
    this.setState({ visible: "visible" });
  }

  onBlur() {
    this.setState({ visible: "hidden" });
  }

  onKeyDown(ev) {
    let use_key = true;
    switch (ev.keyCode) {
      case ConstantVar.KeyCode.Back:
        use_key = false;
        break;
      default:
        break;
    }
    return use_key;
  }

  renderContent() {
    return (
            <div style={{ visibility: this.state.visible }}>
                <div style={this._PageTheme.bgStyle}/>
                <div style={this._PageTheme.tips.style}>{this._PageTheme.tips.text}</div>
            </div>
    );
  }

  componentDidMount() {
    // nothing to do
  }
}


export default TipsPage;
