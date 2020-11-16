/**
 * Created by changhua.chen@qcast.cn on 11/13/2020.
 */

/**
 * 【模块 export 内容】
 * JsvSpriteStatic: React高阶组件，静态切图的插件，用于整张切图显示部分
 *  prop说明:
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
 */
import React from 'react';


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

class JsvSpriteStatic extends React.Component {
    constructor(props) {
        super(props);
    }

    _updateFrozeFrameCache(image_url, frame_info_list,
        canvas_width, canvas_height,
        source_width, source_height) {
        let result = {};

        const tr = _getTransformInfo(
            frame_info_list[0].source,
            frame_info_list[0].target,
            canvas_width,
            canvas_height);

            result.clipStyle = {
            transform: _createTransformStyle(tr.csw, tr.csh, tr.cx, tr.cy),
            transformOrigin: "left top",
            overflow: "hidden",
            left: 0,
            top: 0,
            width: canvas_width,
            height: canvas_height,
        };

        result.imageStyle = {
            backgroundImage: image_url,
            transformOrigin: "left top",
            transform: _createTransformStyle(tr.sw, tr.sh, tr.x, tr.y),
            width: source_width,
            height: source_height,
        };
        return result;
    }

    render() {
        let style = this._updateFrozeFrameCache(
            this.props.imageUrl,
            this.props.spriteInfo.frames,
            this.props.viewSize.w,
            this.props.viewSize.h,
            this.props.spriteInfo.meta.size.w,
            this.props.spriteInfo.meta.size.h);
        return (
            <div id="clip" style={{ ...style.clipStyle }}>
                <div id="image" style={{ ...style.imageStyle }}></div>
            </div>
        )
    }
}

export {
    JsvSpriteStatic
}