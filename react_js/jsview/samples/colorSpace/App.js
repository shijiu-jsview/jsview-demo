import React from 'react';
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";
import createStandaloneApp from "../jsview-utils/JsViewReactTools/StandaloneApp";

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
            <div style={{ width: 1920, height: 1080, backgroundColor: "#005500" }}>
                <div style={{ width: 300, height: 50, fontSize: "30px" }}>RGB_8888</div>
                <img alt="" style={{ left: 0, top: 50, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} src={bmpDemo}/>
                <img alt="" style={{ left: 220, top: 50, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} src={jpegDemo}/>
                <img alt="" style={{ left: 440, top: 50, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} src={jpgDemo}/>
                <img alt="" style={{ left: 660, top: 50, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} src={pngDemo}/>
                <img alt="" style={{ left: 880, top: 50, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} src={pngNoAlphaDemo}/>

                <div style={{ top: 250, width: 300, height: 50, fontSize: "30px" }}>RGB_565</div>
                <img alt="" style={{ left: 0, top: 300, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} jsv_img_color_space={"RGB_565"} src={bmpDemo}/>
                <img alt="" style={{ left: 220, top: 300, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} jsv_img_color_space={"RGB_565"} src={jpegDemo}/>
                <img alt="" style={{ left: 440, top: 300, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} jsv_img_color_space={"RGB_565"} src={jpgDemo}/>
                <img alt="" style={{ left: 660, top: 300, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} jsv_img_color_space={"RGB_565"} src={pngDemo}/>
                <img alt="" style={{ left: 880, top: 300, width: 200, height: 200, borderRadius: '15px 15px 15px 15px' }} jsv_img_color_space={"RGB_565"} src={pngNoAlphaDemo}/>

            </div>
    );
  }
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
