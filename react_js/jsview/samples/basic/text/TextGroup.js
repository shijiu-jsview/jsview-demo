import React from 'react';
import TextAlign from "./TextAlign";
import TextFontStyle from "./TextFontStyle";
import TextOverflow from "./TextOverflow";
import TitleBlock from "../TitleBlock";

class TextGroup extends React.Component {
  render() {
    const titleBlockProps = { ColIndex: 2, itemWidth: this.props.itemWidth, itemHeight: this.props.itemHeight };

    return <div id='item-root' style={this.props.style}>
            <TitleBlock {...titleBlockProps} LineIndex={0} titleText="文字对齐" style={{ top: this.props.itemHeight * 0 }}>
                <TextAlign/>
            </TitleBlock>
            <TitleBlock {...titleBlockProps} LineIndex={1} titleText="字体和字号" style={{ top: this.props.itemHeight * 1 }}>
                <TextFontStyle/>
            </TitleBlock>
            <TitleBlock {...titleBlockProps} itemHeight={this.props.itemHeight * 2} LineIndex={2} titleText="文字折行" style={{ top: this.props.itemHeight * 2 }}>
                <TextOverflow/>
            </TitleBlock>
        </div>;
  }
}

export default TextGroup;
