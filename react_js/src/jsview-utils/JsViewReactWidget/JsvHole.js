/**
 * Created by chunfeng.luo@qcast.cn on 12/04/2020.
 */

/*
 * 【模块 export 内容】
 * JsvHole video显示--挖洞
 *      props说明:
 *            style {Object} (必须)
 *               {
 *                   width {number}     宽度
 *                   height {number}     高度
 *               }
 */
import React from "react";
import PropTypes from "prop-types";
import { Forge, ForgeExtension } from "../jsview-react/index_widget";

class JsvHole extends React.Component {
  constructor() {
    super();
    // info of JsView
    this._InnerViewId = -1;
    this._JsvMainView = null;
  }

  render() {
    if (!window.JsView || !this.props.style) {
      return null;
    }

    if (this._JsvMainView === null) {
      const videoTexture = ForgeExtension.TextureManager.GetColorTexture("rgba(0,0,0,0)");
      // 组合TextureSetting并设置view的texture
      const textureSetting = new Forge.TextureSetting(videoTexture, null, null, false);
      const holeView = new Forge.LayoutView(textureSetting);
      this._JsvMainView = new Forge.LayoutView();
      this._JsvMainView.AddView(holeView, new Forge.LayoutParams({ x: 0, y: 0, width: this.props.style.width, height: this.props.style.height }));
      this._InnerViewId = ForgeExtension.RootActivity.ViewStore.add(
        new Forge.ViewInfo(this._JsvMainView, { x: 0, y: 0 })
      );
    }
    return (<div jsv_innerview={this._InnerViewId}></div>);
  }

  componentWillUnmount() {
    if (this._InnerViewId !== -1) {
      ForgeExtension.RootActivity.ViewStore.remove(this._InnerViewId);
      this._InnerViewId = -1;
      this._JsvMainView = null;
    }
  }
}
JsvHole.propTypes = {
  style: PropTypes.object
};

export default JsvHole;
