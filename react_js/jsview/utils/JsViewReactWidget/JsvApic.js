/**
 * Created by changhua.chen@qcast.cn on 11/13/2020.
 */

/*
 * 【模块 export 内容】
 * JsvApic：React高阶组件，控制动图播放
 *      prop说明:
 *          src {string} 对应img标签的src
 *          style {object} 对应img标签的style
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
          ForgeExtension.TextureManager.DispatchCommand(
            target_view.TextureSetting.Texture.RenderTexture.IdToken,
            0,
            ""
          );
          if (this.props.onStart) {
            target_view.TextureSetting.Texture.registerOnStart(
              this.props.onStart
            );
          }
          if (this.props.onEnd) {
            target_view.TextureSetting.Texture.registerOnEnd(this.props.onEnd);
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
        jsv_auto_play="false"
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

_JsvApic.defaultProps = {
  autoPlay: true,
};

let JsvApic = _JsvApic;
if (!window.JsView) {
  JsvApic = JsvWidgetWrapperGroup.getApic(_JsvApic);
}

export { JsvApic };
