/**
 * Created by ludl on 12/16/20.
 */

// JsvNativeSharedDiv comes from JsView React Project
/*
 * 【控件介绍】
 * JsvNativeSharedDiv：创建一个Native端可以跟进显示位置的div，用于Native端外挂插件的开发
 *                  style {Object}  布局样式(必须)，必须包含的信息为{left, top, width, height}
 *                  getId {function} 回调函数，用于接收ID信息，ID信息用于Native端对该view进行跟踪的标识
 */

import React from "react";
import PropTypes from "prop-types";
import { Forge, ForgeExtension } from "../JsViewEngineWidget/index_widget";

class JsvNativeSharedDiv extends React.Component {
  constructor(props) {
    super(props);

    this._CurrentStyle = {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    };

    this._JsvMainView = null;
    this._InnerViewId = -1;
  }

  shouldComponentUpdate(nextProps, nextState) {
    // 只关心left, top, width, height的变更
    const new_style = nextProps.style;
    return (
      this._CurrentStyle.left !== new_style.left ||
      this._CurrentStyle.top !== new_style.top ||
      this._CurrentStyle.width !== new_style.width ||
      this._CurrentStyle.height !== new_style.height
    );
  }

  render() {
    if (!window.JsView || !this.props.style) {
      // 非JsView场景，以黑色区域代替，没有可描画的内容
      return (
        <div
          style={{
            left: this.props.style.left,
            top: this.props.style.top,
            width: this.props.style.width,
            height: this.props.style.height,
            backgroundColor: "#000000",
          }}
          children={this.props.children}
        />
      );
    }

    if (this._JsvMainView === null) {
      // 初始化View

      // 创建JsView图层穿透的texture，抠洞处理
      const seeThroughTexture = ForgeExtension.TextureManager.GetColorTexture(
        "rgba(0,0,0,0)"
      );
      const textureSetting = new Forge.TextureSetting(
        seeThroughTexture,
        null,
        null,
        false
      );

      // 通过内置函数构造定制的NativeSharedView
      this._JsvMainView = new Forge.NativeSharedView(textureSetting);
      this._InnerViewId = ForgeExtension.RootActivity.ViewStore.add(
        new Forge.ViewInfo(this._JsvMainView, null)
      );
    }

    // 更新宽高
    this._JsvMainView.ResetLayoutParams({
      width: this.props.style.width,
      height: this.props.style.height,
    });

    // 回报Id信息
    if (this.props.getId) {
      this.props.getId(this._JsvMainView.GetTrackId());
    }

    return (
      <div
        jsv_innerview={this._InnerViewId}
        children={this.props.children}
        style={{ left: this.props.style.left, top: this.props.style.top }}
      ></div>
    );
  }

  componentWillUnmount() {
    // 清理View管理缓存
    if (this._InnerViewId !== -1) {
      ForgeExtension.RootActivity.ViewStore.remove(this._InnerViewId);
      this._InnerViewId = -1;
      this._JsvMainView = null;
    }
  }
}
JsvNativeSharedDiv.propTypes = {
  style: PropTypes.object,
  getId: PropTypes.func,
};

export default JsvNativeSharedDiv;
