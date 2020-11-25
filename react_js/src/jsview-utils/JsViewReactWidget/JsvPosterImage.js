/**
 * Created by donglin.lu@qcast.cn on 10/12/20.
 */

/*
 * 【模块 export 内容】
 * JsvPosterImage：同JsvPosterDiv，用于海报图展示的控件，为海报添加了三个效果:
 *              1. 海报(JsvPosterImage的src属性)加载出来前，显示place holder的内容(JsvPosterImage的子节点)
 *              2. 海报完毕进行显示的时候，有淡出效果
 *              3. 在JsView引擎中，海报加载完毕后，place holder内容自动隐藏以节省描画资源(PC环境不会自动隐藏)
 *              【区别点】JsvPosterImage可以配置的是scaleDown(节省内存)切指定色空间的海报图
 *      props说明:
 *          style       {Object}    同<img>的Style，通过top/left/width/height控制坐标和宽高，宽高值也作为scaleDown的参数
 *          src         {String}    海报图url
 *          color_space {String}    颜色空间，默认为"RGBA_8888"，可以指定为"RGB_565"以节省一半内存
 */

import React from 'react';

class JsvPosterImage extends React.Component {
  render() {
    const { children, color_space, ...other_props } = this.props; // Remove holders from children
    const jsv_img_color_space = color_space || "RGBA_8888";
    return (
            <div>
                <div children={children}/>
                <img jsv_enable_fade="true" jsv_poster_on_top="true" jsv_img_scaledown_tex="true" jsv_img_color_space={jsv_img_color_space}
                     {...other_props} />
            </div>
    );
  }
}

export {
  JsvPosterImage
};
