import React from 'react';
import './JsvSpriteImg.css';
import {getKeyFramesGroup} from './JsvDynamicKeyFrames'

let sAnimationToken = 0;
class JsvSpriteImg extends React.Component{
    /**
     * @description: 属性说明
     *      spriteInfo {object}  (必需)精灵图配置信息
     *                          { frames: [
     *                              {
     *                                  source:{w,h},
     *                                  target:{w,h},
     *                              },
     *                              ...
     *                            ],
     *                            meta:{w,h}
     *                          }
     *      viewSize {object}  (必需){w:0, h:0}
     *      imageUrl {string}  (必需)图片地址
     *      duration {float}  (动图必需)动图的时间
     *      onAnimEnd {function} 动图结束回调
     *      stop {boolean} 停止动图，默认false
     *      loop {string} 动图的循环次数 infinite/数字，默认为infinite
     *      spriteName {string} 动图的名称，默认为null
     */
    constructor(props) {
        super(props);

        this._KeyFrameNames = {
            clip: null,
            image: null,
            valid: false
        };

        this._KeyFrameStyleSheet = getKeyFramesGroup("sprite-tag");
    }

    _getAnimNameBase() {
        return this.props.spriteName ? this.props.spriteName : "sprite-anim-name-" + (sAnimationToken++);
    }

    _createStaticFrameStyle(frame_info_list, canvas_width, canvas_height) {
        let style = {
            clipStyle: {
                transform: null,
                transformOrigin: null,
            },
            imageStyle: {
                transform: null,
                transformOrigin: null,
            }
        };

        const tr = this._getTransformInfo(
            frame_info_list[0].source,
            frame_info_list[0].target,
            canvas_width,
            canvas_height);

        style.clipStyle.transform = this._createTransformStyle(tr.csw, tr.csh, tr.cx, tr.cy);
        style.clipStyle.transformOrigin = "left top";

        style.imageStyle.transform = this._createTransformStyle(tr.csw, tr.csh, tr.cx, tr.cy);
        style.imageStyle.transformOrigin = "left top";

        return style;
    }

    _createKeyframes(frame_info_list, canvas_width, canvas_height) {
        this._clearExpiredKeyFrames();

        if (!frame_info_list) { return; }
        let anim_name_base = this._getAnimNameBase();
        let frame_percent = 1 / (frame_info_list.length - 1);
        let anim_name_clip = anim_name_base + '-clip';
        let anim_name_image = anim_name_base + '-image'
        let image_keyframs = '@keyframes ' + anim_name_image + ' {'
        let clip_keyframs =  '@keyframes ' + anim_name_clip + ' {'

        for (let i = 0; i < frame_info_list.length; i++) {
            let item = frame_info_list[i];

            // Header
            let header;
            if (i != frame_info_list.length - 1) {
                header = parseFloat(frame_percent * i * 100).toFixed(2) + '% {';
            } else {
                header = '100% {';
            }
            image_keyframs += header;
            clip_keyframs += header;

            if (item.source) {
                const tr = this._getTransformInfo(item.source, item.target, canvas_width, canvas_height);

                let tr_str = "";
                tr_str = tr_str + "transform:" + this._createTransformStyle(tr.csw, tr.csh, tr.cx, tr.cy)
                        + ';transform-origin:left top;';
                clip_keyframs += tr_str;

                tr_str = "";
                tr_str = tr_str + "transform:" + this._createTransformStyle(tr.sw, tr.sh, tr.x, tr.y)
                        + ';transform-origin:left top;';
                image_keyframs += tr_str;
            }

            image_keyframs += '}'
            clip_keyframs += '}'
        }

        image_keyframs += '}';
        clip_keyframs += '}';

        if (this._KeyFrameStyleSheet) {
            this._KeyFrameStyleSheet.insertRule(image_keyframs);
            this._KeyFrameStyleSheet.insertRule(clip_keyframs);

            // 记录Keyframe设置，以便于界面关闭时进行清理
            this._KeyFrameNames.clip = anim_name_clip;
            this._KeyFrameNames.image = anim_name_image;
            this._KeyFrameNames.valid = true;
        }

        // console.log("image transform=" + image_keyframs);
        // console.log("clip transform=" + clip_keyframs);

        return {clip: anim_name_base + '-clip', image: anim_name_base + '-image'};
    }

    _getTransformInfo(source_obj, target_obj, canvas_width, canvas_height) {
        let result = {csw:1, csh:1, cx:0, cy:0, sw:1, sh:1, x:0, y:0};

        // Clip在Canvas div之内，以Canvas为基准进行缩放和平移
        // 图形左上角远离原点后再缩放，所以需要进行缩放补偿
        let clip_scale_w = target_obj.w / canvas_width;
        let clip_scale_h = target_obj.h / canvas_height;
        result.csw = clip_scale_w;
        result.csh = clip_scale_h;
        result.cx = target_obj.x / clip_scale_w;
        result.cy = target_obj.y / clip_scale_h;

        // Image在Clip div之内，所以以Clip为基准进行缩放和平移, 对clip的缩放进行反处理以还原尺寸
        // 将子图左上角对齐原点后再缩放，所以x,y不需要进行举例缩放补偿
        result.sw = source_obj.w / target_obj.w / clip_scale_w;
        result.sh = source_obj.h / target_obj.h / clip_scale_h;
        result.x = -source_obj.x;
        result.y = -source_obj.y;

        return result;
    }

    _createTransformStyle(w_scale, h_scale, x, y) {
        let output = "";
        output = output + 'scale3d('
            + parseFloat(w_scale).toPrecision(5) + ','
            + parseFloat(h_scale).toPrecision(5) + ',1) '
            + 'translate3d('
            + parseFloat(x).toPrecision(5) +'px,'
            + parseFloat(y).toPrecision(5) + 'px,0)'
        return output;
    }

    _clearExpiredKeyFrames() {
        if (this._KeyFrameNames.valid) {
            this._removeKeyFrame([this._KeyFrameNames.clip, this._KeyFrameNames.image]);
            this._KeyFrameNames.valid = false;
        }
    }

    _removeKeyFrame(names_array) {
        if (this._KeyFrameStyleSheet) {
            this._KeyFrameStyleSheet.removeMultiRules(names_array);
        }
    }

    _AnalyzeProp() {
        if (this.props.spriteInfo.frames.length == 1 || this.props.stop) {
            // 单图模式
            return this._createStaticFrameStyle(
                this.props.spriteInfo.frames,
                this.props.viewSize.w,
                this.props.viewSize.h
            );
        } else {
            // 动画模式
            let animate_names = this._createKeyframes(
                this.props.spriteInfo.frames,
                this.props.viewSize.w,
                this.props.viewSize.h
            );

            const clip_animation = animate_names.clip + " " + this.props.duration + "s steps(1,start) " + this.props.loop;
            const image_animation = animate_names.image + " " + this.props.duration + "s steps(1,start) " + this.props.loop;

            return {
                clipStyle: {
                    animation: clip_animation,
                },
                imageStyle: {
                    animation: image_animation,
                }};
        }
    }

    render() {
        let transform_style = this._AnalyzeProp();

        let image_view_style = {
            backgroundImage: this.props.imageUrl,
            width: this.props.spriteInfo.meta.size.w,
            height: this.props.spriteInfo.meta.size.h,
            ...transform_style.imageStyle,
        };

        return (
            <div id="canvas">
                <div id="clip" style={{
                        overflow: "hidden",
                        width: this.props.viewSize.w,
                        height: this.props.viewSize.h,
                        ...transform_style.clipStyle}}>
                    <div id="image" style={image_view_style} onAnimationEnd={this.props.onAnimEnd}></div>
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        // 清理掉残存的keyFrame信息
        this._clearExpiredKeyFrames();
    }
}

JsvSpriteImg.defaultProps = {
    stop: false,
    loop: 'infinite',
    onAnimEnd: function() {},
    duration: 0.5
};

export default JsvSpriteImg;