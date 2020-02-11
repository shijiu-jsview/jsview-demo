import React from 'react';
import {ContentFont} from '../CommonFontStyle'

class AnimTransition extends React.Component {
    render() {
        const titleStyle = {
            ...ContentFont,
            width: 100,
            height: 20,
            textAlign: 'left',
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
                    <div style={{...titleStyle}}>坐标变化</div>
                    <div style={{...blockStyle,
                        left:this.props.timeCount * 10 % 200,
                        transition: "left 1s linear"}}/>
                </div>
                <div style={{top:70}}>
                    <div style={{...titleStyle}}>坐标和尺寸变化</div>
                    <div style={{...blockStyle,
                        left:this.props.timeCount * 10 % 200,
                        width:this.props.timeCount * 10 % 100 + 10,
                        transition: "left 0.5s linear, width 1s linear 1s"}}/>
                </div>
            </div>
    }
}

export default AnimTransition;
