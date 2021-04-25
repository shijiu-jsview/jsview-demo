import React from 'react';
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";

import jpgDemo from "./jpgDemo.jpg";
import jpegDemo from "./jpegDemo.jpeg";
import pngDemo from "./pngDemo.png";
import pngNoAlphaDemo from "./pngNoAlphaDemo.png";
import bmpDemo from "./bmpDemo.bmp";

class MainScene extends FocusBlock {
  onKeyDown(ev) {
    switch (ev.keyCode) {
      case 10000:
      case 27:
        if (this._NavigateHome) {
          if (window.JsView) {
            window.JsView.setGlobalConfig({
              texCache: -1,
            });
          }
          this._NavigateHome();
        }
        break;
      default:
        break;
    }
    return true;
  }

  onFocus() {
    this.changeFocus(`${this.props.branchName}/widget1`);
  }

  renderContent() {
    return (
      <div style={{ width: 1920, height: 1080, backgroundColor: "#334C4C" }}>
        <div style={{ left: 20, top: 50 }}>

          <div style={{ left: 0, top: 0 }}>
            <div style={{ left: 0, top: 0, width: 200, height: 200, color: "#FFFFFF", fontSize: "30px" }}>
              {`RBG_8888\n透明区域透明\n色彩不失真`}
            </div>
            <div style={{ left: 0, top: 250, width: 200, height: 200, color: "#FFFFFF", fontSize: "30px" }}>
              {`RBG_565\n透明区域为黑色\n色彩略失真`}
            </div>
          </div>

          <div style={{ left: 220, top: 0 }}>
            <img alt="" style={{ left: 0, top: 0, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} src={bmpDemo} />
            <img alt="" style={{ left: 0, top: 250, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} jsv_img_color_space={"RGB_565"} src={bmpDemo} />
            <div style={{ left: 0, top: 500, width: 200, height: 200, color: "#FFFFFF", fontSize: "20px" }}>
              {`bmp图片`}
            </div>
          </div>

          <div style={{ left: 440, top: 0 }}>
            <img alt="" style={{ left: 0, top: 0, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} src={jpegDemo} />
            <img alt="" style={{ left: 0, top: 250, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} jsv_img_color_space={"RGB_565"} src={jpegDemo} />
            <div style={{ left: 0, top: 500, width: 200, height: 200, color: "#FFFFFF", fontSize: "20px" }}>
              {`jpg/jpeg图片`}
            </div>
          </div>

          <div style={{ left: 660, top: 0 }}>
            <img alt="" style={{ left: 0, top: 0, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} src={pngDemo} />
            <img alt="" style={{ left: 0, top: 250, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} jsv_img_color_space={"RGB_565"} src={pngDemo} />
            <div style={{ left: 0, top: 500, width: 200, height: 200, color: "#FFFFFF", fontSize: "20px" }}>
              {`png有透明图片\nRGB_565下透明部分为黑色`}
            </div>
          </div>

          <div style={{ left: 880, top: 0 }}>
            <img alt="" style={{ left: 0, top: 0, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} src={pngNoAlphaDemo} />
            <img alt="" style={{ left: 0, top: 250, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} jsv_img_color_space={"RGB_565"} src={pngNoAlphaDemo} />
            <div style={{ left: 0, top: 500, width: 200, height: 200, color: "#FFFFFF", fontSize: "20px" }}>
              {`png无透明图片`}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
