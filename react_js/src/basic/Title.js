import React from 'react';
//import PropTypes from 'prop-types';
import {TitleFont as titleFont} from './CommonFontStyle'

class Title extends React.Component {
    render() {
        console.log("style=", this.props.style);
        console.log("contentLeft=", this.props.contentLeft, " contentTop=", this.props.contentTop);
        console.log("itemWidth=", this.props.itemWidth, " itemHeight=", this.props.itemHeight);
        const itemWidth = this.props.itemWidth;
        const itemHeight = this.props.itemHeight;
        const rowStyle = {...this.props.style, width: itemWidth, textAlign: 'center'};
        const colStyle = {...this.props.style, left:this.props.contentLeft, height: itemHeight, lineHeight: itemHeight + 'px'};

        return <div id='title-root' style={this.props.style}>
                <div style={{width:1280, height:720, backgroundColor: 'rgba(255, 255, 255, 1.0)'}}/>

                <div style={{...this.props.style, left: this.props.contentLeft}}>
                    <div style={{...titleFont, ...rowStyle, left: itemWidth * 0}}>div标签1</div>
                    <div style={{...titleFont, ...rowStyle, left: itemWidth * 1}}>div标签2</div>
                    <div style={{...titleFont, ...rowStyle, left: itemWidth * 2}}>div文本</div>
                    <div style={{...titleFont, ...rowStyle, left: itemWidth * 3}}>动画</div>
                    <div style={{...titleFont, ...rowStyle, left: itemWidth * 4}}>Video/Audio</div>
                </div>
            </div>
    }
}

export default Title;
