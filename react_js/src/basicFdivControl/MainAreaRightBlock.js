import React from 'react';
import { convertToFocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";
import { EventCenter } from "./EventCenter";

class MainAreaRightBlockBasic extends React.Component {
  constructor() {
    super();
    this.state = {
      focused: false
    };
  }

  onFocus() {
    this.setState({ focused: true });
  }

  onBlur() {
    this.setState({ focused: false });
  }

  onKeyDown(ev) {
    if (ev.keyCode === 39) {
      // Left key
      this.changeFocus("/sideBar/L0C0");
      EventCenter.emitEvent("ResetSideBarPosition", null);
      return true;
    }
    return false;
  }

  render() {
    return <div style={{
      ...this.props.style,
      width: 100,
      height: 100,
      backgroundColor: (this.state.focused ? "rgba(255,0,0,1)" : "rgba(0,255,0,1)")
    }}>
            {this.props.branchName}
        </div>;
  }
}

const MainAreaRightBlock = convertToFocusBlock(MainAreaRightBlockBasic);

export {
  MainAreaRightBlock
};
