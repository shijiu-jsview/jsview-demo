/*
 * @Author: ChenChanghua
 * @Date: 2020-12-10 19:20:08
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2021-01-29 14:51:25
 * @Description: file content
 */
import React from "react";
import { FocusBlock } from "../demoCommon/BlockDefine";
import createStandaloneApp from "../demoCommon/StandaloneApp";
import { JsvApic } from "../jsview-utils/JsViewReactWidget/JsvApic";
import { JsvStyleClass } from "../jsview-utils/JsViewReactTools/JsvStyleClass";
import catRun from "./animated_webp.webp";
import girlRun from "./girl_run.gif";
import quan from "./quan.webp";
import "./App.css";

const sPicTitleTextClass = new JsvStyleClass({
  fontSize: 32,
  height: 68,
  lineHeight: 34,
  color: "#000000",
  textAlign: "center",
});

class MainScene extends FocusBlock {
  constructor(props) {
    super(props);
    this._WebpPlay = true;
    this._GifPlay = true;
    this._WebpOncePlay = false;

    this.state = {
      No1Stop: false,
      No2Stop: false,
      No3Stop: false,
    };
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
          this.setState({ No1Stop: true });
        } else {
          this._WebPRef.play();
          this.setState({ No1Stop: false });
        }
      }
    } else if (ev.keyCode === 13) {
      if (this._GifRef) {
        if (this._GifPlay) {
          this._GifRef.stop();
          this.setState({ No2Stop: true });
        } else {
          this._GifRef.play();
          this.setState({ No2Stop: false });
        }
      }
    } else if (ev.keyCode === 39) {
      if (this._WebpOnceRef) {
        if (this._WebpOncePlay) {
          this._WebpOnceRef.stop();
          this.setState({ No3Stop: true });
        } else {
          this._WebpOnceRef.play();
          this.setState({ No3Stop: false });
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
            ref={(ele) => {
              this._WebPRef = ele;
            }}
            src={`url(${catRun})`}
            style={{ width: 400, height: 400 }}
            autoPlay={true}
            onStart={() => {
              this._WebpPlay = true;
              console.log(`webp onstart ${this._WebpPlay}`);
            }}
            onEnd={() => {
              this._WebpPlay = false;
              console.log(`webp onend ${this._WebpPlay}`);
            }}
          />
          <div
            className={sPicTitleTextClass.getName()}
            style={{ top: 440, width: 400 }}
          >{`WEBP\n(${this.state.No1Stop ? "停止" : "运行"})`}</div>
        </div>
        <div style={{ left: 500, top: 50 }}>
          <JsvApic
            ref={(ele) => {
              this._GifRef = ele;
            }}
            src={`url(${girlRun})`}
            style={{ width: 350, height: 300 }}
            autoPlay={true}
            onStart={() => {
              this._GifPlay = true;
              console.log(`gif onstart ${this._GifPlay}`);
            }}
            onEnd={() => {
              this._GifPlay = false;
              console.log(`gif onend ${this._GifPlay}`);
            }}
          />
          <div
            className={sPicTitleTextClass.getName()}
            style={{ top: 440, width: 350 }}
          >{`GIF\n(${this.state.No2Stop ? "停止" : "运行"})`}</div>
        </div>
        <div style={{ left: 900, top: 50 }}>
          <JsvApic
            ref={(ele) => {
              this._WebpOnceRef = ele;
            }}
            src={`url(${quan})`}
            style={{ width: 380, height: 450 }}
            autoPlay={true}
            onStart={() => {
              this._WebpOncePlay = true;
              console.log(`webp2 onstart ${this._WebpOncePlay}`);
            }}
            onEnd={() => {
              this._WebpOncePlay = false;
              console.log(`wepb2 onend ${this._WebpOncePlay}`);
              this.setState({ No3Stop: true });
            }}
          />
          <div
            className={sPicTitleTextClass.getName()}
            style={{ top: 440, width: 380 }}
          >{`单次播放WEBP\n(${this.state.No3Stop ? "停止" : "运行"})`}</div>
        </div>
        <div
          style={{
            left: 50,
            top: 590,
            width: 1180,
            textAlign: "center",
            color: "#000000",
            fontSize: "40px",
          }}
        >
          {`左键控制左图, OK键控制中图, 右键控制右图\n\
(按键可进行停止/重播操作)`}
        </div>
      </div>
    );
  }

  componentDidMount() {}
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
