import React from 'react';
import './JsvSpriteAnim.css';
import {getKeyFramesGroup} from './JsvDynamicKeyFrames'

function _getTransformInfo(source_obj, target_obj, canvas_width, canvas_height) {
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

function _createTransformStyle(w_scale, h_scale, x, y) {
    let output = "";
    output = output + 'scale3d('
        + parseFloat(w_scale).toPrecision(5) + ','
        + parseFloat(h_scale).toPrecision(5) + ',1) '
        + 'translate3d('
        + parseFloat(x).toPrecision(5) +'px,'
        + parseFloat(y).toPrecision(5) + 'px,0)'
    return output;
}

class SpriteController{
    /**
     * 方法说明
     *      start() 启动动图
     *      stop(end_frame) 停止动图 end_frame: "start", "end"
     */
    constructor() {
        this._SpriteImage = null;
        this.Used = false;
    }

    _setSpriteImg(sprite) {
        this._SpriteImage = sprite;
    }

    start() {
        if (!this.Used) { this.Used = true; }
        if (this._SpriteImage) {
            this._SpriteImage.start();
        }
    }

    stop(end_frame) {
        if (!this.Used) { this.Used = true; }
        if (this._SpriteImage) {
            this._SpriteImage.stop(end_frame);
        }
    }
}

let sAnimationToken = 0;
class JsvSpriteAnim extends React.Component{
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
     *      imageUrl {string}  (必需)图片地址，另外，为了减小无效的解析处理，规定只有image的URL变更时才重新解析spriteInfo
     *      duration {float}  (动图必需)动图的时间
     *      onAnimEnd {function} 动图结束回调
     *      autostart {boolean} 启动动图，默认false
     *      loop {string} 动图的循环次数 infinite/数字，默认为infinite
     *      spriteName {string} 动图的名称，默认为null
     *      controller {SpriteController} 控制动图start,stop的对象
     */
    constructor(props) {
        super(props);
        if (this.props.controller) {
            this.props.controller._setSpriteImg(this);
            this.props.controller.Used = false;
        }
        this._KeyFrameNames = {
            clip: null,
            image: null,
            valid: false
        };

        this._FrozeFrameCache = {
            clipStyle: {},
            imageStyle: {
                backgroundImage: null,
            }
        };

        this._AnimateFrameCache = {
            clipStyle: {},
            imageStyle: {
                backgroundImage: null,
            },
            clipAnimName: null,
            imageAnimName: null,
        };

        this._KeyFrameStyleSheet = getKeyFramesGroup("sprite-tag");
        this.state = {
            innerId: 0,
            stopped: false,
            stopFrame: "start",
        }
    }

    stop(end_frame) {
        if (this.props.spriteInfo.frames && this.props.spriteInfo.frames.length === 1) {
            return;
        }
        this.setState({
            stopped: true,
            stopFrame: end_frame ? end_frame : "start",
        })
    }

    start() {
        if (this.props.spriteInfo.frames && this.props.spriteInfo.frames.length === 1) {
            return;
        }
        this.setState({
            innerId: this.state.innerId + 1,
            stopped: false
        })
    }

    _getAnimNameBase() {
        return this.props.spriteName ? this.props.spriteName : "sprite-anim-name-" + (sAnimationToken++);
    }

    _updateFrozeFrameCache(image_url, frame_info_list,
                           canvas_width, canvas_height,
                           source_width, source_height) {
        let cache = this._FrozeFrameCache;

        let index = this.state.stopFrame === "start" ? 0 : frame_info_list.length - 1; 
        const tr = _getTransformInfo(
            frame_info_list[index].source,
            frame_info_list[index].target,
            canvas_width,
            canvas_height);

        cache.clipStyle = {
            transform: _createTransformStyle(tr.csw, tr.csh, tr.cx, tr.cy),
            transformOrigin: "left top",
            overflow: "hidden",
            left: 0,
            top: 0,
            width: canvas_width,
            height: canvas_height,
        };

        cache.imageStyle = {
            backgroundImage: image_url,
            transformOrigin: "left top",
            transform: _createTransformStyle(tr.sw, tr.sh, tr.x, tr.y),
            width: source_width,
            height: source_height,
        };
    }

    _updateAnimateFrameCache(image_url, frame_info_list,
                     canvas_width, canvas_height,
                     source_width, source_height) {
        this._clearExpiredKeyFrames();

        if (!frame_info_list) { return; }
        let anim_name_base = this._getAnimNameBase();
        let frame_percent = 1 / (frame_info_list.length);
        let anim_name_clip = anim_name_base + '-clip';
        let anim_name_image = anim_name_base + '-image'
        let image_keyframs = '@keyframes ' + anim_name_image + ' {'
        let clip_keyframs =  '@keyframes ' + anim_name_clip + ' {'

        for (let i = 0; i < frame_info_list.length + 1; i++) {
            let item;
            if (i !== frame_info_list.length) {
                item = frame_info_list[i];
            } else {
                item = frame_info_list[0];
            }

            // Header
            let header;
            if (i != frame_info_list.length) {
                header = parseFloat(frame_percent * i * 100).toFixed(2) + '% {';
            } else {
                header = '100% {';
            }
            image_keyframs += header;
            clip_keyframs += header;

            if (item.source) {
                const tr = _getTransformInfo(item.source, item.target, canvas_width, canvas_height);
                let clip_trans = _createTransformStyle(tr.csw, tr.csh, tr.cx, tr.cy);
                let image_trans = _createTransformStyle(tr.sw, tr.sh, tr.x, tr.y);

                let tr_str = "";
                tr_str = tr_str + "transform:" + clip_trans + ';transform-origin:left top;';
                clip_keyframs += tr_str;

                tr_str = "";
                tr_str = tr_str + "transform:" + image_trans + ';transform-origin:left top;';
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
        let cache = this._AnimateFrameCache;

        cache.clipAnimName = anim_name_base + '-clip';
        cache.imageAnimName = anim_name_base + '-image';

        cache.clipStyle = {
            overflow: "hidden",
            width: canvas_width,
            height: canvas_height,
            animation: null, // 外部设置，需要时间和loop信息
        };

        cache.imageStyle = {
            backgroundImage: image_url,
            width: source_width,
            height: source_height,
            animation: null, // 外部设置，需要时间和loop信息
        };
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
        let used = this.props.controller && this.props.controller.Used;
        if (this.props.spriteInfo.frames.length == 1 || (!used && !this.props.autostart) || this.state.stopped) {
            // 单图模式
            // 解析图片信息
            this._updateFrozeFrameCache(
                this.props.imageUrl,
                this.props.spriteInfo.frames,
                this.props.viewSize.w,
                this.props.viewSize.h,
                this.props.spriteInfo.meta.size.w,
                this.props.spriteInfo.meta.size.h
            );

            return {
                clipStyle: this._FrozeFrameCache.clipStyle,
                imageStyle: this._FrozeFrameCache.imageStyle,
            }
        } else {
            // 动画模式
            if (this._AnimateFrameCache.imageStyle.backgroundImage != this.props.imageUrl) {
                // 解析图片信息
                this._updateAnimateFrameCache(
                    this.props.imageUrl,
                    this.props.spriteInfo.frames,
                    this.props.viewSize.w,
                    this.props.viewSize.h,
                    this.props.spriteInfo.meta.size.w,
                    this.props.spriteInfo.meta.size.h
                );
            }

            // 使用duration和loop信息更新动画设定
            this._AnimateFrameCache.clipStyle.animation =
            this._AnimateFrameCache.clipAnimName + " " + this.props.duration + "s steps(1,start) " + this.props.loop;
            this._AnimateFrameCache.imageStyle.animation =
            this._AnimateFrameCache.imageAnimName + " " + this.props.duration + "s steps(1,start) " + this.props.loop;

            return {
                clipStyle: this._AnimateFrameCache.clipStyle,
                imageStyle: this._AnimateFrameCache.imageStyle,
            }
        }
    }

    shouldComponentUpdate(next_props, next_state) {
        return (
            (this.props.imageUrl != next_props.imageUrl)
            || (this.props.onAnimEnd != next_props.onAnimEnd)
            || (this.props.duration != next_props.duration)
            || (this.props.loop != next_props.loop)
            || (this.props.autostart != next_props.autostart)
            || this.state.innerId !== next_state.innerId
            || this.state.stopped !== next_state.stopped
        );
    }

    render() {
        let transform_style = this._AnalyzeProp();
        return (
            <div id="canvas">
                <div key={this.state.innerId} id="clip" style={{...transform_style.clipStyle}}>
                    <div key={this.state.innerId} id="image" style={{...transform_style.imageStyle}} onAnimationEnd={this.props.onAnimEnd}></div>
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        // 清理掉残存的keyFrame信息
        this._clearExpiredKeyFrames();
    }
}

JsvSpriteAnim.defaultProps = {
    autostart: false,
    loop: 'infinite',
    onAnimEnd: function() {},
    duration: 0.5
};

export {
    JsvSpriteAnim,
    SpriteController
};