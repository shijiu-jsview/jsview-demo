import React from 'react';
import iconImgPath from '../resources/icon.png';
import { ContentFont } from '../CommonFontStyle';

class DivRadius extends React.Component {
  render() {
    const block_width = 65;
    const block_height = 65;
    const gap = 5;

    return <div id='layout-root' style={this.props.style}>
                <div style={{ ...ContentFont,
                  width: block_width,
                  height: block_height,
                  backgroundColor: 'rgba(255, 255, 0, 1)',
                  borderRadius: '10px',
                }}>各角相同</div>
                <div style={{ ...ContentFont,
                  left: block_width + gap,
                  width: block_width,
                  height: block_height,
                  backgroundColor: 'rgba(255, 255, 0, 1)',
                  borderRadius: '0 10px 20px 30px',
                }}>各角不同</div>
                <div style={{ ...ContentFont,
                  top: block_height + gap,
                  width: block_width,
                  height: block_height,
                  backgroundImage: `url(${iconImgPath})`,
                  borderRadius: '10px',
                }}>各角相同</div>
                <div style={{ ...ContentFont,
                  left: block_width + gap,
                  top: block_height + gap,
                  width: block_width,
                  height: block_height,
                  backgroundImage: `url(${iconImgPath})`,
                  borderRadius: '0 10px 20px 30px',
                }}>各角不同</div>
            </div>;
  }
}

export default DivRadius;
