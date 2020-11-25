/**
 * Created by luocf on 2020/5/12.
 */
import State from "./State";
import math from "./math";

class AudioProxy {
  constructor(audio, name) {
    this.audio = audio;
    this.audiopath = null;
    try {
      this.audiopath = require(`../../${Game.apppath}/assets/audio/${name}`);
    } catch (e) {
      console.log("AudioProxy file not exist:", `../../${Game.apppath}/assets/audio/${name}`);
    }
  }

  play() {
    if (this.audiopath) {
      this.audio.src = this.audiopath;
      console.log(`audio play src:${this.audiopath}`);
      this.audio.play();// TODO 调整声音
    }
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.pause();
    this.audio.unload();
  }
}

// Game session
class Game {
  static restart() {
    this.state.restart();
  }

  static enableAudio() {
    if (!Game.Audio) {
      Game.Audio = new window.Audio();
    }
  }

  static audio(audio_name) {
    Game.enableAudio();
    return new AudioProxy(Game.Audio, audio_name);// jsview 系统支持2个audio标签。其中一个作为背景音使用，另一个用于效果音
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

  static Math = math;

  static Audio = null;

  static roundIndex = 0;

  static stageIndex = 0;

  static Config = null;

  static assetData = null;

  static state = State;

  static apppath = "";

  static env = "production";
}

export default Game;

window.GameSource = window.GameSource ? window.GameSource : {};
