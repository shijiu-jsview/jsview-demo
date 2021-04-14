import React from 'react';
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";

class Scroll extends React.Component {
  render() {
    return (
            <div style={{ ...this.props.scrollStyle }}>
                <div style={{ top: this.props.top }}>
                    <div style={{ ...this.props.scrollBlockStyle }}/>
                </div>
            </div>
    );
  }
}

/**
 * @description:
 * @param width
 * @return:
 */

class LongImageScroll extends FocusBlock {
  constructor(props) {
    super(props);
    // this._Element;
    this.state = {
      scrollY: 0,
      textY: 0,
    };
  }

  onKeyDown(ev) {
    const valid = this._Element && this._Element.clientHeight && this._Element.clientHeight > this.props.style.height;
    if (valid) {
      let text_y;
      if (ev.keyCode === 38) {
        if (this.state.textY !== 0) {
          text_y = this.state.textY + this.props.step >= 0 ? 0 : this.state.textY + this.props.step;
          this.setState({
            textY: text_y,
            scrollY: -text_y / (this._Element.clientHeight - this.props.style.height) * (this.props.scrollStyle.height - this.props.scrollBlockStyle.height)
          });
          return true;
        }
      } else if (ev.keyCode === 40) {
        if (this.state.textY !== this.props.style.height - this._Element.clientHeight) {
          text_y = this.state.textY - this.props.step <= this.props.style.height - this._Element.clientHeight ? this.props.style.height - this._Element.clientHeight : this.state.textY - this.props.step;
          this.setState({
            textY: text_y,
            scrollY: -text_y / (this._Element.clientHeight - this.props.style.height) * (this.props.scrollStyle.height - this.props.scrollBlockStyle.height)
          });
          return true;
        }
      }
    }
    return false;
  }

    _OnLoad = () => {
      // 图片加载完成的回调
      console.log("Image loaded!");
    };

    renderContent() {
      const { imageSrc, style, scrollStyle, scrollBlockStyle } = this.props;
      return (
            <React.Fragment>
                <div style={{ overflow: "hidden", ...style }}>
                    <img alt=""
                        ref={(ele) => { this._Element = ele; }}
                        src={imageSrc}
                        style={{ top: this.state.textY, width: style.width }}
                        onLoad={this._OnLoad}
                    />
                </div>
                <Scroll top={this.state.scrollY} scrollStyle={scrollStyle} scrollBlockStyle={scrollBlockStyle}/>
            </React.Fragment>
      );
    }
}

export default LongImageScroll;
