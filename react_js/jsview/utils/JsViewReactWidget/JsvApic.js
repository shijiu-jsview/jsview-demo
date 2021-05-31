/**
 * Created by changhua.chen@qcast.cn on 11/13/2020.
 */

/*
 * 【模块 export 内容】
 * JsvApic：React高阶组件，控制动图播放
 *      prop说明:
 *          src {string} 对应img标签的src
 *          style {object} 对应img标签的style
 *          loopType {enum} 循环播放类型 LOOP_DEFAULT(默认)/LOOP_INFINITE(无限)/LOOP_FINITE(有限)/LOOP_PART(部分帧循环)
 *          loopInfo {int[][3]} loopType为LOOP_PART时的循环设置, 
 *                              格式[[循环次数1,循环开始帧1,循环结束帧1], [循环次数2,循环开始帧2,循环结束帧2], ...]
 *      方法说明
 *          stop: 停止播放
 *          play: 开始播放
 */

import React from "react";
import { ForgeExtension } from "../../dom/jsv-forge-define";

let Token = 0;
class _JsvApic extends React.Component {
  constructor(props) {
    super(props);
    this._Element = null;
    this._CanvasId = "JsvApic" + Token++;

    this._OnStartId = -1;
    this._OnEndId = -1;
  }

  stop() {
    if (this._Element) {
      let main_view = this._Element.jsvMainView;
      if (main_view && main_view.ChildViews.length > 0) {
        let target_view = main_view.ChildViews[0];
        if (
          target_view.TextureSetting &&
          target_view.TextureSetting.Texture &&
          target_view.TextureSetting.Texture.RenderTexture
        ) {
          ForgeExtension.TextureManager.DispatchCommand(
            target_view.TextureSetting.Texture.RenderTexture.IdToken,
            1,
            ""
          );
        }
      }
    }
  }

  play() {
    if (this._Element) {
      let main_view = this._Element.jsvMainView;
      if (main_view && main_view.ChildViews.length > 0) {
        let target_view = main_view.ChildViews[0];
        if (
          target_view.TextureSetting &&
          target_view.TextureSetting.Texture &&
          target_view.TextureSetting.Texture.RenderTexture
        ) {
          let params = {
            "LT": this.props.loopType,
            "LI": this.props.loopInfo,
          }
          ForgeExtension.TextureManager.DispatchCommand(
            target_view.TextureSetting.Texture.RenderTexture.IdToken,
            0,
            JSON.stringify(params)
          );
          target_view.TextureSetting.Texture.unregisterOnStart(this._OnStartId);
          if (this.props.onStart) {
            this._OnStartId = target_view.TextureSetting.Texture.registerOnStart(this.props.onStart);
          }
          target_view.TextureSetting.Texture.unregisterOnEnd(this._OnEndId);
          if (this.props.onEnd) {
            this._OnEndId = target_view.TextureSetting.Texture.registerOnEnd(this.props.onEnd);
          }
        }
      }
    }
  }

  render() {
    return (
      <img
        alt=""
        ref={(ele) => {
          this._Element = ele;
        }}
        src={this.props.src}
        style={this.props.style}
      />
    );
  }

  componentDidMount() {
    if (this.props.autoPlay) {
      this.play();
    }
  }

  componentWillUnmount() {
    this.stop();
    if (this._Element) {
      let main_view = this._Element.jsvMainView;
      if (main_view && main_view.ChildViews.length > 0) {
        let target_view = main_view.ChildViews[0];
        if (
          target_view.TextureSetting &&
          target_view.TextureSetting.Texture &&
          target_view.TextureSetting.Texture.RenderTexture
        ) {
          if (this.props.onStart) {
            target_view.TextureSetting.Texture.unregisterOnStart(this._OnStartId);
          }
          if (this.props.onEnd) {
            target_view.TextureSetting.Texture.unregisterOnEnd(this._OnEndId);
          }
        }
      }
    }
  }

  getUrl(base_url) {
    let url_trim = base_url.trim();
    if (url_trim.indexOf("http") === 0) {
      return url_trim;
    } else if (url_trim.indexOf("url") === 0) {
      let index_1 = url_trim.indexOf("(");
      let index_2 = url_trim.indexOf(")");
      return url_trim.substring(index_1 + 1, index_2);
    } else {
      return url_trim;
    }
  }
}

let LOOP_DEFAULT = 0;
let LOOP_INFINITE = 1;
let LOOP_FINITE = 2;
let LOOP_PART = 3;
let LoopType = {
  "LOOP_DEFAULT": LOOP_DEFAULT,
  "LOOP_INFINITE": LOOP_INFINITE,
  "LOOP_FINITE": LOOP_FINITE,
  "LOOP_PART": LOOP_PART
}

_JsvApic.defaultProps = {
  autoPlay: true,
  loopType: LOOP_DEFAULT,
  loopInfo: [[-1, -1, -1]]
};

let JsvApic = _JsvApic;
if (!window.JsView) {
  JsvApic = JsvWidgetWrapperGroup.getApic(_JsvApic);
}

export { 
  JsvApic,
  LoopType
};
