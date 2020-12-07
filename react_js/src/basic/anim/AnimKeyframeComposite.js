import React from 'react';
import './AnimKeyframeComposite.css';
import { ContentFont } from '../CommonFontStyle';

class AnimKeyframeComposite extends React.Component {
  render() {
    const titleStyle = {
      ...ContentFont,
      width: 100,
      height: 20,
      textAlign: 'center',
      lineHeight: '20px'
    };

    const blockStyle = {
      top: 20,
      width: 50,
      height: 50,
      backgroundColor: 'rgba(255, 0, 0, 1)'
    };

    return (<div id='layout-root' style={this.props.style}>
            <div>
                <div style={{ ...titleStyle }}>四种变形动画</div>
                <div style={{ ...blockStyle, animation: 'AnimComposite1 3s infinite' }}/>
            </div>
            <div style={{ left: 100 }}>
                <div style={{ ...titleStyle }}>变形+透明动画</div>
                <div style={{ ...blockStyle, animation: 'AnimComposite2 3s infinite' }}/>
            </div>
        </div>);
  }
}

export default AnimKeyframeComposite;
