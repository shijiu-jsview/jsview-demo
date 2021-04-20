/**
 * Created by luocf on 2020/5/12.
 */
import State from "./State";
import math from "./math";
import { JsvSoundPool } from '../../../../../utils/JsViewReactWidget/JsvSoundPool';

class AudioProxy {
  constructor(name) {
    this.audioController = null;
    try {
      const assets = Game.apppath ? `${Game.apppath}/assets` : `assets`;
      Game.SoundPool.request(`url(${require(`../../${assets}/audio/${name}`)})`, null, 1, (state, audioController) => {
        if (state === 0) {
          this.audioController = audioController;
        }
      });
    } catch (e) {
      console.log("AudioProxy request error:", e);
    }
  }

  play() {
    if (this.audioController) {
      this.audioController.play();
    }
  }

  pause() {
    if (this.audioController) {
      this.audioController.pause();
    }
  }

  stop() {
    if (this.audioController) {
      this.audioController.stop();
      this.audioController = null;
    }
  }
}

// Game session
class Game {
  static restart() {
    this.state.restart();
  }

  static enableAudio() {
    if (!Game.SoundPool) {
      Game.SoundPool = new JsvSoundPool(10);
    }
  }

  static audio(audio_name) {
    Game.enableAudio();
    return new AudioProxy(audio_name);// jsview 系统支持2个audio标签。其中一个作为背景音使用，另一个用于效果音
  }

  static convertToSpriteInfo(config_json) {
    const info = {
      viewSize: config_json.frames[0].sourceSize,
      frames: [],
      meta: {
        size: config_json.meta.size
      } };
    const frames_ref = info.frames;
    for (let i = 0; i < config_json.frames.length; i++) {
      frames_ref.push({
        target: config_json.frames[i].spriteSourceSize,
        source: config_json.frames[i].frame,
      });
    }
    return info;
  }

  static close() {
    Game.state.close();
    Game.init();
  }

  static init() {
    Game.roundIndex = 0;
    Game.stageIndex = 0;
    Game.Config = null;
    Game.assetData = null;
    Game.apppath = "";
    Game.appname = "";
    Game.activityId = "";
    Game.difficult = "easy";
    Game.deviceModel = "";
    Game.env = "production";
    Game.SoundPool = null;
  }

  static requireUrl(fileName, path) {
    const pathInner = path || "atlas";
    const assets = Game.apppath ? `${Game.apppath}/assets` : `assets`;
    const url = require(`../../${assets}/${pathInner}/${fileName}`);
    return url;
  }
}
Game.serverUrl = "http://mp.einsim.com/upload_assets/game";

Game.Math = math;

Game.roundIndex = 0;

Game.stageIndex = 0;

Game.Config = null;

Game.assetData = null;

Game.state = State;

Game.apppath = "";
Game.appname = "";
Game.activityId = "";
Game.difficult = "easy";
Game.deviceModel = "";
Game.env = "production";

Game.SoundPool = null;

export default Game;

window.GameSource = window.GameSource ? window.GameSource : {};
