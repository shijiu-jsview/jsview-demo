import React from 'react';
import { TitleFont as baseFont } from './CommonFontStyle';

class TitleBlock extends React.Component {
  render() {
    const title = this.props.titleText;
    const block_top = ((this.props.style && this.props.style.top) ? this.props.style.top : 0);
    const block_left = ((this.props.style && this.props.style.left) ? this.props.style.left : 0);
    const title_height = 18;
    const block_opacity = (((this.props.ColIndex + this.props.LineIndex) % 2 === 0) ? 0.3 : 0.5);

    return (
      <div style={{ top: block_top, left: block_left }}>
        <div style={{ ...baseFont, lineHeight: `${title_height}px`, width: this.props.itemWidth, height: title_height, backgroundColor: "rgba(0,0,255,0.7)" }}>
          {title}
        </div>
        <div key="blockColor" style={{ top: title_height, width: this.props.itemWidth, height: this.props.itemHeight - title_height, backgroundColor: `rgba(0,0,255,${block_opacity})` }}>
        </div>
        <div key="container" style={{ top: title_height }} children={this.props.children}/>
      </div>
    );
  }
}

export default TitleBlock;
