import React from 'react';
import ImgLayout from "./ImgLayout.js";
import ImgBackground from "./ImgBackground.js";
import ImgClippath from "./ImgClippath.js";
import ImgBorder from "./ImgBorder.js";
import ImgRadius from "./ImgRadius.js";


class ImgGroup extends React.Component {
    render() {
        const itemStyle = {...this.props.style,
            left: 0,
            width: this.props.itemWidth, height: this.props.itemHeight,
        };

        return <div id='item-root' style={this.props.style}>
            <ImgLayout     style={{...itemStyle, top: this.props.itemHeight * 0, backgroundColor: 'rgba(0, 0, 255, 0.1)'}}/>
            <ImgBackground style={{...itemStyle, top: this.props.itemHeight * 1, backgroundColor: 'rgba(0, 0, 255, 0.1)'}}/>
            <ImgClippath   style={{...itemStyle, top: this.props.itemHeight * 2, backgroundColor: 'rgba(0, 0, 255, 0.1)'}}/>
            <ImgBorder     style={{...itemStyle, top: this.props.itemHeight * 3, backgroundColor: 'rgba(0, 0, 255, 0.1)'}}/>
            <ImgRadius     style={{...itemStyle, top: this.props.itemHeight * 4, backgroundColor: 'rgba(0, 0, 255, 0.1)'}}/>
            </div>
    }
}

export default ImgGroup;
