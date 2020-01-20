import React from 'react';
import {ContentFont} from '../CommonFontStyle'

class TextFontStyle extends React.Component {
    render() {
        const blockWidth = 70;
        const gap = 5;

        const blockStyle = {
            ...ContentFont,
            width:blockWidth,
            height:20
        };

        return <div id='layout-root' style={this.props.style}>
                <div>
                    <div style={{...blockStyle}}>[字体]</div>
                    <div style={{...blockStyle, top: 25, fontFamily: '宋体'}}>宋体</div>
                    <div style={{...blockStyle, top: 25, left: blockWidth + gap, fontFamily: '黑体'}}>黑体</div>

                    <div style={{...blockStyle, top: 50, fontWeight: 'bold'}}>粗体</div>
                    <div style={{...blockStyle, top: 50, left: blockWidth + gap, fontStyle: 'italic'}}>斜体</div>
                </div>

                <div style={{top:75}}>
                    <div style={{...blockStyle}}>[其他]</div>
                    <div style={{width: 60, top: 25, height: 35, fontSize:'30px'}}>字号</div>
                    <div style={{width: 60, top: 25, height: 35, left: 70,
                        color: 'rgba(255, 0, 0, 1)',
                        fontFamily: "sans-serif",
                        fontSize:'30px',
                        fontStyle: 'italic',
                        fontWeight: 'bold' }}>综合</div>
                </div>
            </div>
    }
}

export default TextFontStyle;
