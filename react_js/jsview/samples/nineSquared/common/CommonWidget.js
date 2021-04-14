/**
 * Created by luocf on 2020/3/21.
 */
import React from 'react';
import { FocusBlock } from "../../../utils/JsViewReactTools/BlockDefine";

class Button extends FocusBlock {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: false
    };
  }

  onFocus() {
    this.setState({ isFocus: true });
  }

  onBlur() {
    this.setState({ isFocus: false });
  }

  renderContent() {
    let style = this.props.theme.style;
    if (this.state.isFocus) {
      style = { ...style, ...this.props.theme.focusStyle };
    }
    return (<div style={style}>{this.props.text}</div>);
  }

  componentDidMount() {
    //
  }
}

export { Button };
