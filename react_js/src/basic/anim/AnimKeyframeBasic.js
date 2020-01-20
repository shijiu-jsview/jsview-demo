import React from 'react';
import './AnimKeyframeBasic.css';
import {ContentFont} from '../CommonFontStyle'

class AnimKeyframeBasic extends React.Component {
    render() {
        const subItemWidth = 70;
        const subItemHeight = 70;
        const titleStyle = {
            ...ContentFont,
            width: 60,
            height: 20,
            textAlign: 'center',
            lineHeight: '20px'
        };

        const blockStyle = {
            top:20,
            width:50,
            height:50,
            backgroundColor:'rgba(255, 0, 0, 1)'
        };

        return <div id='layout-root' style={this.props.style}>
                <div>
                    <div style={{...titleStyle}}>Translate3d</div>
                    <div style={{...blockStyle, animation: 'AnimTranslate 3s infinite'}}/>
                </div>
                <div style={{left:subItemWidth}}>
                    <div style={{...titleStyle}}>Scale3d</div>
                    <div style={{...blockStyle, animation: 'AnimScale 3s infinite linear'}}/>
                </div>
                <div style={{left:subItemWidth * 2}}>
                    <div style={{...titleStyle}}>Rotate3d</div>
                    <div style={{...blockStyle, animation: 'AnimRotate 3s infinite linear'}}/>
                </div>
                <div style={{left:subItemWidth, top:subItemHeight}}>
                    <div style={{...titleStyle}}>Skew</div>
                    <div style={{...blockStyle, animation: 'AnimSkew 3s infinite ease-in'}}/>
                </div>
                <div style={{left:subItemWidth * 2, top:subItemHeight}}>
                    <div style={{...titleStyle}}>Opacity</div>
                    <div style={{...blockStyle, width:20, animation: 'AnimOpacityOut 3s infinite ease-out'}}/>
                    <div style={{...blockStyle, left:25, width:20, animation: 'AnimOpacityIn 3s infinite ease-in-out'}}/>
                </div>
            </div>
    }
}

export default AnimKeyframeBasic;
