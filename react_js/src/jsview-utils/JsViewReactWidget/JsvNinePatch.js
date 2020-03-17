import React from 'react';
/*
    style { object } (必须)
    animTime { int } transition动画时长
    imageUrl { string } 图片url (必须)
    imageWidth { int } 图片的宽 (必须)
    contentWidth { int } 图片延展区域的宽 (必须)
    borderOutset { int } 边框向外扩展的大小
*/
class SquareNinePatch extends React.Component{
    render() {
        let transition = null;
        if (this.props.animTime) {
            transition = `left ${this.props.animTime}s, top ${this.props.animTime}s, width ${this.props.animTime}s, height ${this.props.animTime}s`
        }
        let slice_w = Math.ceil((this.props.imageWidth - this.props.contentWidth) / 2);
        return (
            <div style={{...this.props.style, transition: transition,
                borderImage: `url(${this.props.imageUrl}) ${slice_w} fill`,
                borderImageWidth: slice_w + 'px',
                borderImageOutset: this.props.borderOutset + "px",
            }}/>
        )
    }
}
SquareNinePatch.defaultProps = {
    top: 0,
    left: 0,
    borderOutset: 0,
}

export{
    SquareNinePatch as JsvSquareNinePatch
}