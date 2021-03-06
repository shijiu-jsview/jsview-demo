/**
 * Created by ludl on 12/16/20.
 */

// JsvTransparentDiv comes from JsView React Project
/*
 * 【控件介绍】
 * JsvTransparentDiv：创建一个使native界面完全透过的div，注意: 这个层面下所有的div和本div重合的部分都不可见
 *                  style {Object}  布局样式(必须)，必须包含的信息为{left, top, width, height}
 */

import React from "react";
import PropTypes from "prop-types";
import { Forge, ForgeExtension } from "../../dom/jsv-forge-define";
import { JsvWidgetWrapperGroup } from "./BrowserDebugWidget/WidgetWrapper";

class _JsvTransparentDiv extends React.Component {
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

      // 通过内置函数构造定制的LayoutView
      this._JsvMainView = new Forge.LayoutView(textureSetting);
      this._InnerViewId = ForgeExtension.RootActivity.ViewStore.add(
        new Forge.ViewInfo(this._JsvMainView, null)
      );
    }

    // 更新宽高
    this._JsvMainView.ResetLayoutParams({
      width: this.props.style.width,
      height: this.props.style.height,
    });

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

_JsvTransparentDiv.propTypes = {
  style: PropTypes.object,
};

let JsvTransparentDiv = _JsvTransparentDiv;
if (!window.JsView) {
  JsvTransparentDiv = JsvWidgetWrapperGroup.getTransparentDivClass(
    _JsvTransparentDiv
  );
}

export default JsvTransparentDiv;
