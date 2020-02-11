import React from 'react';
import testImgPath from '../resources/test.jpg';

class DivLayout extends React.Component {
    render() {
        let imageShowWidth = 80;
        let imageShowHeight = 64;
        let clipWidth = 50;
        let clipHeight = 40;

        let FontBase = {
            fontFamily: '黑体',
            fontSize: '12px',
        };

        let titleHeight = 16;

        return (<div id='layout-root' style={this.props.style}>
                <div style={{top:0}}>
                    <div style={{...FontBase, width:50, height:titleHeight }}>原图</div>
                    <div style={{top:titleHeight,
                            width:imageShowWidth + 4, height:imageShowHeight + 4,
                            backgroundColor: 'rgba(0, 255, 0, 1)'}}>
                        <div style={{left:2, top:2,
                            width:imageShowWidth, height:imageShowHeight,
                            backgroundImage: `url(${testImgPath})`}}/>
                    </div>
                </div>
                <div style={{top:imageShowHeight + titleHeight + 4}}>
                    <div style={{...FontBase, width:120, height:titleHeight }}>右上Overflow</div>
                    <div style={{top:titleHeight,
                        width: imageShowWidth + 4, height:imageShowHeight + 4,
                        backgroundColor: 'rgba(0, 255, 0, 1)'}}>
                        <div key="clipArea" style={{left:2, top:2,
                            width: clipWidth, height: clipHeight,
                            overflow:"hidden"}}>
                            <div style={{width:imageShowWidth, height:imageShowHeight,
                                backgroundImage: `url(${testImgPath})`}}/>
                        </div>
                    </div>
                </div>
                <div style={{top:(imageShowHeight + titleHeight + 4) * 2}}>
                    <div style={{...FontBase, width:120, height:titleHeight }}>左下Overflow</div>
                    <div style={{top:titleHeight,
                        width: imageShowWidth + 4, height:imageShowHeight + 4,
                        backgroundColor: 'rgba(0, 255, 0, 1)'}}>
                        <div key="clipArea" style={{top: 2 + (imageShowHeight - clipHeight), left:2 + (imageShowWidth - clipWidth),
                            width: clipWidth, height: clipHeight,
                            overflow:"hidden"}}>
                            <div style={{top:-((imageShowHeight - clipHeight)), left:-(imageShowWidth - clipWidth),
                                width:imageShowWidth, height:imageShowHeight,
                                backgroundImage: `url(${testImgPath})`}}/>
                        </div>
                    </div>
                </div>
                <div style={{top:(imageShowHeight + titleHeight + 4), left:imageShowWidth + 16}}>
                    <div style={{...FontBase, width:100, height:titleHeight }}>ClipPath</div>
                    <div style={{top:titleHeight,
                        width: imageShowWidth + 4, height:imageShowHeight + 4,
                        backgroundColor: 'rgba(0, 255, 0, 1)'}}>
                        <div key="clipArea" style={{left:2, top:2,
                            width: imageShowWidth, height: imageShowHeight,
                            clipPath: 'inset(5px 10px 15px 20px)'/* margin of top, right, bottom, left */}}>
                            <div style={{width:imageShowWidth, height:imageShowHeight,
                                backgroundImage: `url(${testImgPath})`}}/>
                        </div>
                    </div>
                </div>
            </div>);
    }
}

export default DivLayout;
