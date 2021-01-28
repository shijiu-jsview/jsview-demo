/*
 * @Author: ChenChanghua
 * @Date: 2020-12-10 19:20:08
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2021-01-28 16:12:40
 * @Description: file content
 */
import React from "react";
import { FocusBlock } from "../demoCommon/BlockDefine";
import createStandaloneApp from "../demoCommon/StandaloneApp";
import { JsvApic } from "../jsview-utils/JsViewReactWidget/JsvApic";

import catRun from "./animated_webp.webp"
import girlRun from "./girl_run.gif"
import quan from "./quan.webp"
import "./App.css"

class MainScene extends FocusBlock {
  constructor(props) {
    super(props);
    this._WebpPlay = true;
    this._GifPlay = true;
    this._WebpOncePlay = false;
  }

  onKeyDown(ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      if (this._NavigateHome) {
        this._NavigateHome();
      }
    } else if (ev.keyCode === 37) {
      if (this._WebPRef) {
        if (this._WebpPlay) {
          this._WebPRef.stop();
        } else {
          this._WebPRef.play();
        }
      }
    } else if (ev.keyCode === 13) {
      if (this._GifRef) {
        if (this._GifPlay) {
          this._GifRef.stop();
        } else {
          this._GifRef.play();
        }
      }
    } else if (ev.keyCode === 39) {
      console.log("cchtest onkey")
      if (this._WebpOnceRef) {
        if (this._WebpOncePlay) {
          this._WebpOnceRef.stop();
        } else {
          this._WebpOnceRef.play();
        }
      }
    }
    return true;
  }

  renderContent() {
    return (
      <div style={{ width: 1920, height: 1080, backgroundColor: "#FFFFFF" }}>
        <div style={{ left: 50, top: 50 }}>
          <JsvApic
            ref={ele => this._WebPRef = ele}
            src={`url(${catRun})`}
            style={{ width: 400, height: 400 }}
            autoPlay={true}
            onStart={() => { this._WebpPlay = true; console.log("webp onstart") }}
            onEnd={() => { this._WebpPlay = false; console.log("webp onend") }} />
          <div style={{ top: 440, color: "#000000", fontSize: "50px" }}>WEBP</div>
        </div>
        <div style={{ left: 500, top: 50 }}>
          <JsvApic
            ref={ele => this._GifRef = ele}
            src={`url(${girlRun})`}
            style={{ width: 350, height: 300 }}
            autoPlay={true}
            onStart={() => { this._GifPlay = true; console.log("gif onstart") }}
            onEnd={() => { this._GifPlay = false; console.log("gif onend") }} />
          <div style={{ top: 440, color: "#000000", fontSize: "50px" }}>GIF</div>
        </div>
        <div style={{ left: 900, top: 50 }}>
          <JsvApic
            ref={ele => this._WebpOnceRef = ele}
            src={`url(${quan})`}
            style={{ width: 380, height: 450 }}
            autoPlay={true}
            onStart={() => { this._WebpOncePlay = true; console.log("webp2 onstart") }}
            onEnd={() => { this._WebpOncePlay = false; console.log("wepb2 onend") }} />
          <div style={{ top: 440, color: "#000000", fontSize: "50px" }}>WEBP</div>
        </div>
        <div style={{ left: 50, top: 600, color: "#000000", fontSize: "50px" }}>左键控制左图, OK键控制中图, 右键控制右图</div>
      </div >
    )
  }

  componentDidMount() {
  }
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
