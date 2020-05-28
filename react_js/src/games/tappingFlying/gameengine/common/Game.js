/**
 * Created by luocf on 2020/5/12.
 */
import React from 'react';
import State from "./State"
import math from "./math"
class AudioProxy {
    constructor(audio, name) {
        this.audio = audio;
        this.audiopath = null;
        try {
            this.audiopath =require("../../"+Game.apppath+"/assets/audio/"+name);
        } catch(e) {
            console.log("AudioProxy file not exist:", "../../"+Game.apppath+"/assets/audio/"+name);
        }

    }

    play() {
        if (this.audiopath) {
            this.audio.src = this.audiopath;
            console.log("audio play src:"+this.audiopath);
            this.audio.play();//TODO 调整声音
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

//Game session
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
        return new AudioProxy(Game.Audio, audio_name);//jsview 系统支持2个audio标签。其中一个作为背景音使用，另一个用于效果音
    }
}

Game.Math = math;
Game.Audio = null;
Game.roundIndex = 0;
Game.stageIndex = 0;
Game.Config = null;
Game.assetData = null;
Game.state = State;
Game.apppath = "";
Game.env = "production";

export default Game;

window.GameSource = window.GameSource?window.GameSource:{};
