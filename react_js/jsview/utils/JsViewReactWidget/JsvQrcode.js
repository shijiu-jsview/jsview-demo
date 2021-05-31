/**
 * Created by chunfeng.luo@qcast.cn on 10/13/2020.
 */

/*
 * 【模块 export 内容】
 * QRCode：React高阶组件，描绘二维码，
 *      props说明:
 *            value {string} (必须)     二维码代表的字符串
 *            size {number} (必须)      二维码展示尺寸，二维码为正方形，所以改值代表宽和高，默认值：128
 *            fgColor {string}          二维码前景色，默认值"#000000"，黑色
 *            bgColor {string}          二维码背景色，默认值"#ffffff"，白色
 *            level {string}            二维码的容错能力，可选值{'L':低, 'M':中, 'H':高, 'Q':最精细}，默认值'L'
 *            imageSettings {Object}    设置中心logo图片，默认值为null，设置格式为：
 *                       {
 *                              src {string}        logo的url地址
 *                              height {number}     logo的宽度
 *                              height {number}     logo的高度
 *                       }
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Forge, ForgeExtension } from "../../dom/jsv-forge-define";
import { JsvWidgetWrapperGroup } from "./BrowserDebugWidget/WidgetWrapper";

const DEFAULT_PROPS = {
  size: 128,
  level: "L",
  bgColor: "#FFFFFF",
  fgColor: "#000000",
  imageSettings: null,
};

const PROP_TYPES =
  process.env.NODE_ENV !== "production"
    ? {
        value: PropTypes.string.isRequired,
        size: PropTypes.number,
        level: PropTypes.oneOf(["L", "M", "Q", "H"]),
        bgColor: PropTypes.string,
        fgColor: PropTypes.string,
        imageSettings: PropTypes.shape({
          src: PropTypes.string.isRequired,
          height: PropTypes.number.isRequired,
          width: PropTypes.number.isRequired,
          x: PropTypes.number,
          y: PropTypes.number,
        }),
      }
    : {};

class _QRCodeSVG extends Component {
  constructor() {
    super();
    this._OldProps = null;

    // info of JsView
    this._InnerViewId = -1;
    this._JsvBaseView = null;
    this._QRCodeView = null;
  }

  getImageSettings(props) {
    const { imageSettings, size } = props;
    if (!imageSettings) {
      return null;
    }
    const w = imageSettings.width;
    const h = imageSettings.height;
    const x = !imageSettings.x ? size / 2 - w / 2 : imageSettings.x;
    const y = !imageSettings.y ? size / 2 - h / 2 : imageSettings.y;

    return { x, y, h, w };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const pre_image = this.props.imageSettings;
    const new_image = nextProps.imageSettings;
    const image_changed = !(
      (!pre_image && !new_image) ||
      (pre_image &&
        new_image &&
        pre_image.src === new_image.src &&
        pre_image.height === new_image.height &&
        pre_image.width === new_image.width)
    );

    return (
      nextProps.value !== this.props.value ||
      nextProps.size !== this.props.size ||
      nextProps.level !== this.props.level ||
      nextProps.bgColor !== this.props.bgColor ||
      nextProps.fgColor !== this.props.fgColor ||
      image_changed
    );
  }

  render() {
    return this.jsvQRcode();
  }

  _renderJsvQRCode() {
    // Remove old QRCode
    if (this._QRCodeView !== null) {
      this._JsvBaseView.RemoveView(this._QRCodeView);
    }

    // Configure new QRCode
    const { value, size, level, bgColor, fgColor, imageSettings } = this.props;
    let view = null;
    let lp_params = null;

    const texture_manager = ForgeExtension.TextureManager;
    const qrcode_texture = texture_manager.GetQRCodeTexture(
      value,
      size,
      size,
      Forge.QRCodeLevel[level],
      bgColor,
      fgColor
    );
    view = new Forge.LayoutView(new Forge.TextureSetting(qrcode_texture));
    const calculatedImageSettings = this.getImageSettings(this.props);
    if (imageSettings && calculatedImageSettings) {
      let url = imageSettings.src;
      if (typeof url === "string") {
        url = new window.JsView.React.UrlRef(imageSettings.src).href;
      }
      const img_texture = texture_manager.GetImage(url);
      const img_view = new Forge.LayoutView(
        new Forge.TextureSetting(img_texture)
      );
      view.AddView(
        img_view,
        new Forge.LayoutParams({
          x: calculatedImageSettings.x,
          y: calculatedImageSettings.y,
          width: calculatedImageSettings.w,
          height: calculatedImageSettings.h,
        })
      );
    }
    lp_params = new Forge.LayoutParams({
      x: 0,
      y: 0,
      width: size,
      height: size,
    });

    // Add new QRCode
    this._QRCodeView = view;
    this._JsvBaseView.AddView(this._QRCodeView, lp_params);
  }

  jsvQRcode() {
    // 构建二维码父View
    if (this._JsvBaseView === null) {
      this._JsvBaseView = new Forge.LayoutView();
      this._InnerViewId = ForgeExtension.RootActivity.ViewStore.add(
        new Forge.ViewInfo(this._JsvBaseView, { x: 0, y: 0 })
      );
    }

    // 构建QRCdoe view
    if (this._oldProps !== this.props) {
      this._renderJsvQRCode();
    }

    return <div jsv_innerview={this._InnerViewId}></div>;
  }

  componentWillUnmount() {
    if (this._InnerViewId !== -1) {
      ForgeExtension.RootActivity.ViewStore.remove(this._InnerViewId);
      this._InnerViewId = -1;
      this._JsvBaseView = null;
    }
  }
}

if (process.env.NODE_ENV !== "production") {
  _QRCodeSVG.propTypes = PROP_TYPES;
}

let QRCodeSVG = _QRCodeSVG;
if (!window.JsView) {
  QRCodeSVG = JsvWidgetWrapperGroup.getQRCode(_QRCodeSVG);
}

const QRCode = (props) => {
  const { ...otherProps } = props;
  return <QRCodeSVG {...otherProps} />;
};

QRCode.defaultProps = DEFAULT_PROPS;

export default QRCode;
