/**
 * Created by donglin.lu@qcast.cn on 10/12/20.
 */

/*
 * 【模块 export 内容】
 * SquareNinePatch：React高阶组件，.9图展示控件，该控件的原图要求为正方形，延展后可为长方形
 *      props说明:
 *          style       {Object}    同div的Style，通过width/height来控制.9图片延展后的显示尺寸，另外通过top/left控制坐标
 *          animTime    {int}       (必填)缩放动画的时长(单位毫秒)
 *          imageUrl    {String}    (必填)显示图片的加载地址
 *          imageWidth  {int}       (必填)原图信息: 原图的宽度(由于正方形,宽高相同)
 *          contentWidth {int}      (必填)原图信息: 原图内用来装内容区域的宽度(由于正方形,宽高相同)
 *          borderOutset {int}      在目标显示中，边框的显示宽度，默认值为0(由于正方形,宽高相同)，
 *                                  边框显示在目标区域的外缘，而非内缘
 *          waitForInit {boolean}  尺寸为0时是否进行描画(例如: 首次显示不展示动画的场合，设置为true),默认值为true
 */

import React from 'react';

class SquareNinePatch extends React.Component{
    render() {
        if(this.props.waitForInit && (!this.props.style || this.props.style.width === 0 || this.props.style.height === 0)) {
            return null;
        }

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
    waitForInit: true,
}

export{
    SquareNinePatch as JsvSquareNinePatch
}