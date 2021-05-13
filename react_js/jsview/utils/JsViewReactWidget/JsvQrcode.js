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
import QRCodeImpl from "qr.js/lib/QRCode";
import { Forge, ForgeExtension } from "../../dom/jsv-forge-define";

const ErrorCorrectLevel = require("qr.js/lib/ErrorCorrectLevel");

function convertStr(str) {
  let out = "";
  for (let i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode < 0x0080) {
      out += String.fromCharCode(charcode);
    } else if (charcode < 0x0800) {
      out += String.fromCharCode(0xc0 | (charcode >> 6));
      out += String.fromCharCode(0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      out += String.fromCharCode(0xe0 | (charcode >> 12));
      out += String.fromCharCode(0x80 | ((charcode >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | (charcode & 0x3f));
    } else {
      // This is a surrogate pair, so we'll reconsitute the pieces and work
      // from that
      i++;
      charcode =
        0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      out += String.fromCharCode(0xf0 | (charcode >> 18));
      out += String.fromCharCode(0x80 | ((charcode >> 12) & 0x3f));
      out += String.fromCharCode(0x80 | ((charcode >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | (charcode & 0x3f));
    }
  }
  return out;
}

const DEFAULT_PROPS = {
  size: 128,
  level: "L",
  bgColor: "#FFFFFF",
  fgColor: "#000000",
  includeMargin: false,
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
        includeMargin: PropTypes.bool,
        imageSettings: PropTypes.shape({
          src: PropTypes.string.isRequired,
          height: PropTypes.number.isRequired,
          width: PropTypes.number.isRequired,
          x: PropTypes.number,
          y: PropTypes.number,
        }),
      }
    : {};

const MARGIN_SIZE = 4;

// This is *very* rough estimate of max amount of QRCode allowed to be covered.
// It is "wrong" in a lot of ways (area is a terrible way to estimate, it
// really should be number of modules covered), but if for some reason we don't
// get an explicit height or width, I'd rather default to something than throw.
function generatePath(modules, margin = 0) {
  const ops = [];
  modules.forEach((row, y) => {
    let start = null;
    row.forEach((cell, x) => {
      if (!cell && start !== null) {
        // M0 0h7v1H0z injects the space with the move and drops the comma,
        // saving a char per operation
        ops.push(
          `M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`
        );
        start = null;
        return;
      }

      // end of row, clean up or skip
      if (x === row.length - 1) {
        if (!cell) {
          // We would have closed the op above already so this can only mean
          // 2+ light modules in a row.
          return;
        }
        if (start === null) {
          // Just a single dark module.
          ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`);
        } else {
          // Otherwise finish the current line.
          ops.push(
            `M${start + margin},${y + margin} h${x + 1 - start}v1H${
              start + margin
            }z`
          );
        }
        return;
      }

      if (cell && start === null) {
        start = x;
      }
    });
  });
  return ops.join("");
}

class QRCodeSVG extends Component {
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
      nextProps.includeMargin !== this.props.includeMargin ||
      image_changed
    );
  }

  render() {
    if (window.JsView) {
      return this.jsvQRcode();
    }
    return this.htmlQRCode();
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

  htmlQRCode() {
    const {
      value,
      size,
      level,
      bgColor,
      fgColor,
      includeMargin,
      imageSettings,
      ...otherProps
    } = this.props;
    const qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[level]);
    qrcode.addData(convertStr(value));
    qrcode.make();

    const cells = qrcode.modules;
    if (cells === null) {
      return null;
    }

    const margin = includeMargin ? MARGIN_SIZE : 0;
    const numCells = cells.length + margin * 2;
    const calculatedImageSettings = this.getImageSettings(this.props);
    let image = null;
    if (imageSettings) {
      image = (
        <div
          style={{
            backgroundImage: `url(${imageSettings.src})`,
            height: calculatedImageSettings.h,
            width: calculatedImageSettings.w,
            left: calculatedImageSettings.x + margin,
            top: calculatedImageSettings.y + margin,
          }}
        />
      );
    }
    const fgPath = generatePath(cells, margin);

    if (window.JsvDisableReactWrapper) {
      return (
        <div>
          <svg
            type="qrcode"
            shapeRendering="crispEdges"
            height={size}
            width={size}
            viewBox={`0 0 ${numCells} ${numCells}`}
            {...otherProps}
          >
            <path fill={bgColor} d={`M0,0 h${numCells}v${numCells}H0z`} />
            <path fill={fgColor} d={fgPath} />
          </svg>
          {image}
        </div>
      );
    }
    // 含有react wrapper的场合，需要为dom标签加上jsv前缀以绕开Wrapper
    return (
      <div>
        <jsvsvg
          type="qrcode"
          shapeRendering="crispEdges"
          height={size}
          width={size}
          viewBox={`0 0 ${numCells} ${numCells}`}
          {...otherProps}
        >
          <jsvpath fill={bgColor} d={`M0,0 h${numCells}v${numCells}H0z`} />
          <jsvpath fill={fgColor} d={fgPath} />
        </jsvsvg>
        {image}
      </div>
    );
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
  QRCodeSVG.propTypes = PROP_TYPES;
}

const QRCode = (props) => {
  const { ...otherProps } = props;
  return <QRCodeSVG {...otherProps} />;
};

QRCode.defaultProps = DEFAULT_PROPS;

export default QRCode;
