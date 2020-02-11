import React from 'react';
import DivLayout from "./DivLayout.js";
import DivBackground from "./DivBackground.js";
import DivClip from "./DivClip";
import TitleBlock from "../TitleBlock"

class DivGroup extends React.Component {
    render() {
        const titleBlockProps = {ColIndex:0, itemWidth:this.props.itemWidth, itemHeight:this.props.itemHeight};

        return <div id='item-root' style={this.props.style}>
            <TitleBlock {...titleBlockProps} LineIndex={0} titleText="Layout(布局定位)" style={{top:this.props.itemHeight * 0}}>
                <DivLayout/>
            </TitleBlock>
            <TitleBlock {...titleBlockProps} LineIndex={1} titleText="Background(加载图片)" style={{top:this.props.itemHeight * 1}}>
                <DivBackground/>
            </TitleBlock>
            <TitleBlock {...titleBlockProps} itemHeight={this.props.itemHeight * 2} LineIndex={2} titleText="Clip(裁剪)" style={{top:this.props.itemHeight * 2}}>
                <DivClip/>
            </TitleBlock>
        </div>
    }
}

export default DivGroup;
