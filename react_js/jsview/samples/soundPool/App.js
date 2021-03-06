/*
 * 【控件介绍】
 * JsvSoundPool: 效果音控件
 *
 * 【技巧说明】
 * Q: 注意事项
 * A: 1.JsvSoundPool只支持文件较小的效果音，背景音请放在audio标签播放
 *    2.退出时注意释放JsvSoundPool
 */

import React from 'react';
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";

import { JsvSoundPool } from '../../utils/JsViewReactWidget/JsvSoundPool';

import coin from "./coin.mp3";
import lose from "./lose.mp3";
import bgm from "./bgmusic.mp3";

class MainScene extends FocusBlock {
  constructor(props) {
    super(props);
    this._SoundPool = new JsvSoundPool(10);
    this._SoundPool.request(`url(${coin})`, null, 1, (state, audioController) => {
      if (state === 0) {
        this._CoinController1 = audioController;
      }
    });
    this._SoundPool.request(`url(${coin})`, null, 1, (state, audioController) => {
      if (state === 0) {
        this._CoinController2 = audioController;
        this._CoinController2.setLoop(0);
      }
    });

    this._SoundPool.request(`url(${lose})`, null, 1, (state, audioController) => {
      if (state === 0) {
        this._LoseController1 = audioController;
      }
    });
    this._SoundPool.request(`url(${lose})`, null, 1, (state, audioController) => {
      if (state === 0) {
        this._LoseController2 = audioController;
      }
    });
    this._BgmHalder = null;
    this._BgmPlaying = false;
    this.state = {
      ready: false,
    };
  }

  onKeyDown(ev) {
    if (!this.state.ready) { return true; }
    switch (ev.keyCode) {
      case 37:
        if (this._LoseController1) {
          this._LoseController1.play();
        }
        break;
      case 38:
        if (this._CoinController1) {
          this._CoinController1.play();
        }
        break;
      case 39:
        if (this._LoseController2) {
          this._LoseController2.play();
        }
        break;
      case 40:
        if (this._CoinController2) {
          this._CoinController2.play();
        }
        break;
      case 13:
        if (this._BgmHalder) {
          console.log(this._BgmHalder);
          this._BgmHalder.play();
        }
        break;
      case 10000:
      case 27:
        if (this._NavigateHome) {
          this._NavigateHome();
        }
        break;
      default:
        break;
    }
    return true;
  }

  renderContent() {
    const info = "[确定]: 播放背景音乐\n[左]: 播放失败音乐1\n[右]: 播放失败音乐2\n[上]: 播放硬币音乐1\n[下]: 播放硬币音乐2";
    return (
            <div style={{ width: 1920, height: 1080, backgroundColor: "#FFFFFF" }}>
                <div style={{
                  textAlign: "center",
                  fontSize: "30px",
                  lineHeight: "50px",
                  color: "#ffffff",
                  left: 100,
                  top: 20,
                  width: (1280 - 200),
                  height: 50,
                  backgroundColor: "rgba(27,38,151,0.8)"
                }}>{`适合游戏场景的多音效混音效果`}</div>
                <div style={{ left: 400, top: 300, width: 500, height: 500, color: "#000000", textAlign: "center", fontSize: 30 }}>
                    {info}
                </div>
                <audio ref={(ele) => { this._BgmHalder = ele; }} src={`${bgm}`} loop="loop"/>
            </div>
    );
  }

  componentDidMount() {
    this.setState({ ready: true });
  }

  componentWillUnmount() {
    this._CoinController1 = null;
    this._CoinController2 = null;
    this._LoseController1 = null;
    this._LoseController2 = null;
    this._SoundPool.destroy();
    if (this._BgmHalder) {
      this._BgmHalder.pause();
      this._BgmHalder.unload();
    }
  }
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
