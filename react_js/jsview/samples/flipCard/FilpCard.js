import React from 'react';
import './FlipCard.css';
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";

class FlipCard extends FocusBlock {
  constructor(props) {
    super(props);
    this.onFlipped = this.onFlipped.bind(this);
    this._KeyLock = false;
    this.state = {
      flipped: this.props.initFlipped,
      flipAnim: "",
      focused: false
    };
  }

  onFocus() {
    console.log(`${this.props.branchName} onfoucs`);
    this.setState({
      focused: true
    });
  }

  onBlur() {
    this.setState({
      focused: false
    });
  }

  onKeyDown(ev) {
    if (this._KeyLock) {
      return true;
    }

    if (ev.keyCode === 13) {
      this._KeyLock = true;
      const anim = this.state.flipped ? "flip 1s" : "flipBack 1s";
      this.setState({
        flipAnim: anim
      });
      return true;
    }
    return false;
  }

  onFlipped() {
    this._KeyLock = false;
    this.setState({
      flipped: !this.state.flipped
    });
  }

  renderContent() {
    return (
            <div>
                <div style={{ width: this.props.width, height: this.props.height, perspective: this.props.perspective }}>
                    <div style={{ width: this.props.width, height: this.props.height, animation: this.state.flipAnim, transformStyle: "preserve-3d", backgroundColor: "#FFFF00" }} onAnimationEnd={this.onFlipped}>
                        <div style={{ width: this.props.width, height: this.props.height, backgroundImage: `url(${this.props.backImg})`, backfaceVisibility: "hidden", transform: this.state.flipped ? "" : "rotate3d(0,1,0,180deg)" }}/>
                        <div style={{ width: this.props.width, height: this.props.height, backgroundImage: `url(${this.props.foreImg})`, backfaceVisibility: "hidden", transform: this.state.flipped ? "rotate3d(0,1,0,180deg)" : "" }}/>
                    </div>
                </div>
                {this.state.focused ? <div style={{ width: 10, height: 10, backgroundColor: "#FF0000" }}/> : null}
            </div>
    );
  }
}
FlipCard.defaultProps = {
  initFlipped: false,
};

export {
  FlipCard,
};
