import React from 'react';
import createStandaloneApp from "../demoCommon/StandaloneApp";
import { FocusBlock } from "../demoCommon/BlockDefine";
import { jJsvRuntimeBridge } from "../demoCommon/JsvRuntimeBridge";
import { PageSwitcher } from "../demoCommon/PageSwitcher";

class MainScene extends FocusBlock {
  onKeyDown(ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      if (this._NavigateHome) {
        const result = this._NavigateHome();
        if (!result) {
          jJsvRuntimeBridge.closePage();
        }
      } else {
        jJsvRuntimeBridge.closePage();
      }
      return true;
    } if (ev.keyCode === 13) {
    //   const index = window.location.href.indexOf("?");
    //   let url;
    //   if (index >= 0) {
    //     url = window.location.href.substring(0, index);
    //   } else {
    //     url = window.location.href;
    //   }
      PageSwitcher.openSelf("http://cdn.release.51vtv.cn/JsViewExportDemo/release_build/391/homepage/static/js/main.jsv.b6406306.js#/", null);
      return true;
    }
    return false;
  }

  renderContent() {
    return (
            <div style={{ width: 1920, height: 720, backgroundColor: " #000000", color: "#FFFFFF", fontSize: "40px" }}>
                按OK键打开新页面
            </div>
    );
  }
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
