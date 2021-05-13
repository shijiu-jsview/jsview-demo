/**
 * Created by ludl on 5/13/21.
 */

import React from "react";
import QRCodeImpl from "qr.js/lib/QRCode";
import { JsvWidgetWrapperGroup } from "./WidgetWrapper";

const ErrorCorrectLevel = require("qr.js/lib/ErrorCorrectLevel");

const MARGIN_SIZE = 4;

console.log("Loading BrowserDebug JsvQrcode");

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

JsvWidgetWrapperGroup.getQRCode = (base_class) => {
  return class extends base_class {
    // Override
    render() {
      // 非JsView场景，以蓝区域代替，没有可描画的内容
      return this.htmlQRCode();
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
  };
};
