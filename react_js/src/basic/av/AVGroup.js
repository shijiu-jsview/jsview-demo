import React from 'react';
import PropTypes from "prop-types";
import AVVideo from "./AVVideo";
import AVAudio from "./AVAudio";
import TitleBlock from "../TitleBlock";

class AVGroup extends React.Component {
  render() {
    const titleBlockProps = { ColIndex: 4, itemWidth: this.props.itemWidth, itemHeight: this.props.itemHeight };

    return (<div id='item-root' style={this.props.style}>
            <TitleBlock {...titleBlockProps} LineIndex={0} titleText="视频播放" style={{ top: this.props.itemHeight * 0 }}>
                <AVVideo/>
            </TitleBlock>
            <TitleBlock {...titleBlockProps} LineIndex={1} titleText="音频播放" style={{ top: this.props.itemHeight * 1 }}>
                <AVAudio/>
            </TitleBlock>
        </div>);
  }
}
AVGroup.propTypes = {
  itemWidth: PropTypes.number,
  itemHeight: PropTypes.number
};

export default AVGroup;
