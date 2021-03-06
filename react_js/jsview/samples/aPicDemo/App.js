/*
 * @Author: ChenChanghua
 * @Date: 2020-12-10 19:20:08
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2021-05-20 11:18:59
 * @Description: file content
 */
import React from "react";
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";
import { JsvApic, LoopType } from "../../utils/JsViewReactWidget/JsvApic";
import { JsvStyleClass } from "../../utils/JsViewReactTools/JsvStyleClass";
import catRun from "./animated_webp.webp";
import girlRun from "./girl_run.gif";
import quan from "./quan.webp";
import ball from "./ball_3.webp"
import "./App.css";

const sPicTitleTextClass = new JsvStyleClass({
  fontSize: 25,
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
    this._WebpPartPlay = true

    this.state = {
      No1Stop: false,
      No2Stop: false,
      No3Stop: false,
      No4Stop: false
    };
  }

  onKeyDown(ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      if (this._NavigateHome) {
        this._NavigateHome();
      }
    } else if (ev.keyCode === 37) {
      if (this._WebpRef) {
        if (this._WebpPlay) {
          this._WebpRef.stop();
          this.setState({ No1Stop: true });
        } else {
          this._WebpRef.play();
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
    } else if (ev.keyCode === 38) {
      if (this._WebpPartRef) {
        if (this._WebpPartPlay) {
          this._WebpPartRef.stop();
          this.setState({ No4Stop: true });
        } else {
          this._WebpPartRef.play();
          this.setState({ No4Stop: false });
        }
      }
    }
    return true;
  }

  renderContent() {
    return (
      <div style={{ width: 1920, height: 1080, backgroundColor: "#334C4C" }}>
        <div style={{ left: 20, top: 20 }}>
          <JsvApic
            ref={(ele) => {
              this._WebpRef = ele;
            }}
            src={`url(${catRun})`}
            style={{ width: 250, height: 250 }}
            autoPlay={true}
            loopType={LoopType.LOOP_DEFAULT}
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
            style={{ top: 270, width: 250 }}
          >{`WEBP(${this.state.No1Stop ? "??????" : "??????"})\n????????????`}</div>
        </div>

        <div style={{ left: 280, top: 20 }}>
          <JsvApic
            ref={(ele) => {
              this._GifRef = ele;
            }}
            src={`url(${girlRun})`}
            style={{ width: 250, height: 214 }}
            autoPlay={true}
            loopType={LoopType.LOOP_DEFAULT}
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
            style={{ top: 219, width: 250 }}
          >{`GIF(${this.state.No2Stop ? "??????" : "??????"})\nOK?????????`}</div>
        </div>

        <div style={{ left: 540, top: 20 }}>
          <JsvApic
            ref={(ele) => {
              this._WebpOnceRef = ele;
            }}
            src={`url(${quan})`}
            style={{ width: 250, height: 296 }}
            autoPlay={true}
            loopType={LoopType.LOOP_DEFAULT}
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
            style={{ top: 301, width: 250 }}
          >{`????????????WEBP(${this.state.No3Stop ? "??????" : "??????"})\n????????????`}</div>
        </div>

        <div style={{ left: 800, top: 20 }}>
          <JsvApic
            ref={(ele) => {
              this._WebpPartRef = ele;
            }}
            src={`url(${ball})`}
            style={{ width: 300, height: 200 }}
            autoPlay={true}
            loopType={LoopType.LOOP_PART}
            loopInfo={[[3, 2, 4], [5, 7, 10]]}
            onStart={() => {
              this._WebpPartPlay = true;
              console.log(`webp part onstart ${this._WebpPartPlay}`);
            }}
            onEnd={() => {
              this._WebpPartPlay = false;
              console.log(`wepb part onend ${this._WebpPartPlay}`);
              this.setState({ No4Stop: true });
            }}
          />
          <div
            className={sPicTitleTextClass.getName()}
            style={{ top: 205, width: 300, height: 200 }}
          >{`????????????WEBP(${this.state.No4Stop ? "??????" : "??????"})\n?????????2????????????4???\n????????????`}</div>
        </div>

        <div
          style={{
            left: 50,
            top: 590,
            width: 1180,
            textAlign: "center",
            color: "#000000",
            fontSize: "30px",
          }}
        >
          {`(?????????????????????/????????????)`}
        </div>
      </div>
    );
  }

  componentDidMount() { }
}

const App = createStandaloneApp(MainScene);

export {
  App, // ????????????????????????
  MainScene as SubApp, // ??????????????????????????????
};
