import React from 'react';

/*
    left { int } 组件的left
    top { int } 组件的top
    width { int } 组件的宽
    height { int } 组件的高
    animTime { int } transition动画时长
    imageUrl { string } 图片url
    sliceWidth { int } 图片作为边框部分的宽度
    borderOutset { string } 边框向外扩展的大小 "10px 10px 10px 10px"
*/
class NinePatch extends React.Component{
    render() {
        let transition = null;
        if (this.props.animTime) {
            transition = 'width ' + this.props.animTime + 's, height ' + this.props.animTime + 's';
        }
        return (
            <div style={{transition: transition, top: this.props.top, left: this.props.left, width: this.props.width, height: this.props.height,
                borderImage: `url(${this.props.imageUrl}) ${this.props.sliceWidth} fill`,
                borderImageWidth: this.props.sliceWidth + 'px',
                borderImageOutset: this.props.borderOutset,
            }}/>
        )
    }
}
NinePatch.defaultProps = {
    top: 0,
    left: 0,
}

export{
    NinePatch as JsvNinePatch
}