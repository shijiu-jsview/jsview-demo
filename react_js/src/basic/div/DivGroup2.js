import React from 'react';
import DivBorder from "./DivBorder.js";
import DivRadius from "./DivRadius.js";
import TitleBlock from "../TitleBlock"

class DivGroup extends React.Component {
    render() {
        const itemStyle = {...this.props.style,
            left: 0,
            width: this.props.itemWidth, height: this.props.itemHeight,
        };

        const titleBlockProps = {ColIndex:1, itemWidth:this.props.itemWidth, itemHeight:this.props.itemHeight};

        return <div id='item-root' style={this.props.style}>
            <TitleBlock {...titleBlockProps} LineIndex={0} titleText="Radius(实现圆角)" style={{top:this.props.itemHeight * 0}}>
                <DivRadius/>
            </TitleBlock>
        </div>
    }
}

export default DivGroup;
