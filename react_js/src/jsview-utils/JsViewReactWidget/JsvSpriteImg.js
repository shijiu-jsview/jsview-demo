import React from 'react';
import './JsvSpriteImg.css';

let anim_name_token = 0;
class JsvSpriteImg extends React.Component{
    /**
     * @description: 属性说明
     * @param {Object: {frames:[], meta:{}}} spriteInfo 必需
     * @param {Object: {w:0, h:0}} viewSize 必需
     * @param {string} imageUrl 必需
     * @param {float} duration 必需
     * @param {fucntion} onAnimEnd
     * @param {boolean} stop
     * @param {string} loop
     * @param {string} spriteName
     */
    constructor(props) {
        super(props);
        this._getAnimation = this._getTransAnimation.bind(this);
        this._getSizeAnimation = this._getSizeAnimation.bind(this);
        this._getScaleInfo = this._getScaleInfo.bind(this);
        this.state = {
            animToken: anim_name_token++,
            staticImg: true
        };
        if (this.props.spriteInfo.frames.length > 1) {
            this._createKeyframes(this.props.spriteInfo.frames);
            this.state.staticImg = false;
        }
    }

    _getScaleInfo() {
        let scale_w = 1;
        let scale_h = 1;
        if (this.props.spriteInfo.frames && this.props.spriteInfo.frames[0].frame) {
            scale_w = this.props.viewSize.w / this.props.spriteInfo.frames[0].frame.w;
            scale_h = this.props.viewSize.h / this.props.spriteInfo.frames[0].frame.h;
        }
        return { scaleW: scale_w, scaleH: scale_h }
    }

    _getAnimNameBase() {
        return this.props.spriteName ? this.props.spriteName : "sprite-anim-name-" + this.state.animToken;
    }

    _createKeyframes(frame_info_list) {
        if (!frame_info_list) { return; }
        let scale_info = this._getScaleInfo();
        let anim_name_base = this._getAnimNameBase();
        let frame_percent = 1 / frame_info_list.length * 100;
        let translate_keyframes_str = '@keyframes ' + anim_name_base + '-trans' + ' {'
        let size_keyframes_str =  '@keyframes ' + anim_name_base + '-size' + ' {'
        let has_size_anim = false;
        let base_size = {};
        for (let i = 0; i < frame_info_list.length; i++) {
            let item = frame_info_list[i];
            translate_keyframes_str += frame_percent * i + '% {';
            size_keyframes_str += frame_percent * i + '% {';
            if (item.frame) {
                translate_keyframes_str += this._translateKeyframeItem(-item.frame.x * scale_info.scaleW, -item.frame.y * scale_info.scaleH);

                if (typeof base_size.w !== 'undefined' && typeof base_size.h !== 'undefined') {
                    has_size_anim = has_size_anim || (base_size.w != item.frame.w || base_size.h != item.frame.h)
                } else {
                    base_size.w = item.frame.w;
                    base_size.h = item.frame.h;
                }
                size_keyframes_str += this._resizeKeyframeItem(item.frame.w * scale_info.scaleW, item.frame.h * scale_info.scaleH);

                // TODO: 本版本不支持size变化
                has_size_anim = false;
            }
            translate_keyframes_str += '}'
            size_keyframes_str += '}'
        }
        translate_keyframes_str += '}';
        size_keyframes_str += '}';

        let style_info = this._getStyleInfo();
        this._HasSizeAnim = has_size_anim;
        if (style_info.styleSheet) {
            style_info.styleSheet.insertRule(translate_keyframes_str, style_info.index);
            if (has_size_anim) {
                style_info.styleSheet.insertRule(size_keyframes_str, style_info.index + 1);
            }
        }
    }

    _translateKeyframeItem(x, y) {
        return 'transform:translate3d(' + x + 'px,' + y + 'px,0);'
    }

    _resizeKeyframeItem(w, h) {
        return 'width:' + w + 'px;height:' + h +'px;'
    }

    _getStyleInfo() {
        var animation = null;
        // 获取所有的style
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; ++i) {
            const item = ss[i];
            if (item.cssRules[0] && item.cssRules[0].name && item.cssRules[0].name === 'sprite-tag') {
                animation = {};
                animation.styleSheet = ss[i];
                animation.index = item.cssRules.length;
                break;
            }
        }
        return animation;
    }

    _getTransAnimation() {
        return this.props.stop && !this.state.staticImg ? null : this._getAnimNameBase() +'-trans ' + this.props.duration + "s steps(1,start) " + this.props.loop;
    }

    _getSizeAnimation() {
        return this._HasSizeAnim && !this.props.stop && !this.state.staticImg ? this._getAnimNameBase() + '-size ' + this.props.duration + "s steps(1,start) " + this.props.loop : null;
    }

    render() {
        let scale_info = this._getScaleInfo();
        let image_view_style = {
            backgroundImage: this.props.imageUrl,
            width: this.props.spriteInfo.meta.size.w * scale_info.scaleW,
            height: this.props.spriteInfo.meta.size.h * scale_info.scaleH,
            animation: this._getTransAnimation()
        }
        if (this.state.staticImg) {
            image_view_style.left = -this.props.spriteInfo.frames[0].frame.x * scale_info.scaleW;
            image_view_style.top = -this.props.spriteInfo.frames[0].frame.y * scale_info.scaleH;
        }
        return (
            <div style={{overflow: "hidden", width: this.props.viewSize.w, height: this.props.viewSize.h, animation: this._getSizeAnimation()}}>
                <div style={image_view_style} onAnimationEnd={this.props.onAnimEnd}></div>
            </div>
        )
    }
}
JsvSpriteImg.defaultProps = {
    loop: 'infinite',
    onAnimEnd: function() {},
    duration: 0.5
}

export default JsvSpriteImg;