import React from 'react';
import { ContentFont } from '../CommonFontStyle';

class TextAlign extends React.Component {
  render() {
    const itemWidth = 90;
    const itemHeight = 40;

    const baseStyle = {
      ...ContentFont,
      width: itemWidth,
      height: itemHeight,
      backgroundColor: 'rgba(255, 255, 0, 0.5)',
      color: 'rgba(255, 0, 0, 1)',
    };

    return <div id='layout-root' style={this.props.style}>
                <div style={{ ...baseStyle, width: itemWidth * 1.5 }}>左上(默认)</div>
                <div style={{ ...baseStyle, top: itemHeight + 5, textAlign: 'center' }}>中上</div>
                <div style={{ ...baseStyle, top: itemHeight + 5, left: itemWidth + 5, textAlign: 'right' }}>右上</div>

                <div style={{ ...baseStyle, top: (itemHeight + 5) * 2, lineHeight: `${itemHeight}px` }}>垂直中</div>
                <div style={{ ...baseStyle,
                  top: (itemHeight + 5) * 2,
                  left: itemWidth + 5,
                  lineHeight: `${itemHeight}px`,
                  textAlign: 'center' }}>中</div>
            </div>;
  }
}

export default TextAlign;
