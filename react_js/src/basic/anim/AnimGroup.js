import React from 'react';
import AnimKeyframeBasic from "./AnimKeyframeBasic.js";
import AnimKeyframeComposite from "./AnimKeyframeComposite.js";
import AnimTransition from "./AnimTransition.js";
import TitleBlock from "../TitleBlock"

class AnimGroup extends React.Component {
    constructor(props) {
        super(props);
        console.log("AnimGroup.constructor().");

        this.state = {timeCount: 0};
        setInterval(() => {
            const count = this.state.timeCount + 5;
            //console.log('change timeCount: ' + count);
            this.setState({timeCount: count})
        }, 2000)
    }

    render() {
        const titleBlockProps = {ColIndex:3, itemWidth:this.props.itemWidth, itemHeight:this.props.itemHeight};

        return <div id='item-root' style={this.props.style}>
                <TitleBlock {...titleBlockProps} LineIndex={0} titleText="Keyframe基础动画集合" style={{top:this.props.itemHeight * 0}}>
                    <AnimKeyframeBasic/>
                </TitleBlock>
                <TitleBlock {...titleBlockProps} LineIndex={1} titleText="Keyframe组合示例" style={{top:this.props.itemHeight * 1}}>
                    <AnimKeyframeComposite/>
                </TitleBlock>
                <TitleBlock {...titleBlockProps} LineIndex={2} titleText="Transition动画示例" style={{top:this.props.itemHeight * 2}}>
                    <AnimTransition timeCount={this.state.timeCount}/>
                </TitleBlock>
            </div>
    }
}

export default AnimGroup;
