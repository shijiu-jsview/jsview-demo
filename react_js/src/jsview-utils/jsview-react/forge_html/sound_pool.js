/*
 * @Author: ChenChanghua
 * @Date: 2020-07-20 09:37:37
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2020-07-22 16:35:44
 * @Description: file content
 */ 
import URL from "./url"

let AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext = new AudioContext();
let soundIdCount = 0;
let streamIdCount = 0;

class Stream{
    constructor(context, bufferSource, gain) {
        this._Context = context;
        this._BufferSource = bufferSource;
        this._Gain = gain;
        this._BufferSource.connect(this._Gain)
        this._Gain.connect(this._Context.destination);
    }

    start(when, offset, duration) {
        this._BufferSource.start(when, offset, duration);
    }

    setVolume(volume) {
        this._Gain.gain.setValueAtTime(volume, this._Context.currentTime);
    }

    stop(when) {
        this._BufferSource.stop(when);
    }
}

class SoundPool {
    constructor() {
        this._SoundBufferMap = {};
        this._StreamMap = {};
    }

    load(url, netsetting, priority, callback) {
        let realUrl = new URL(url).href;
        let soundId = soundIdCount++;
        this._requestBuffer(realUrl, (status, response) => {
            if (status === 0) {
                audioContext.decodeAudioData(response, (buffer) => {
                    this._SoundBufferMap[soundId] = buffer;
                    callback(soundId, 0);
                });
            } else {
                callback(-1, -1);
            }
        });
        return soundId;
    }

    unload(soundId) {
        delete this._SoundBufferMap[soundId];
    }

    autoPause() {}

    autoResume() {}

    play(soundId, leftVolume, rightVolume, priority, loop, rate) {
        if (this._SoundBufferMap[soundId]) {
            let streamId = streamIdCount++;
            let bufferSource = audioContext.createBufferSource();
            bufferSource.buffer = this._SoundBufferMap[soundId];
            bufferSource.playbackRate.value = rate;
            bufferSource.onended = (event) => {
                this.stop(streamId);
            };
            if (loop > 0) {
                bufferSource.loop = true;
            }
            let gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(leftVolume, audioContext.currentTime);
            let stream = new Stream(audioContext, bufferSource, gainNode);
            this._StreamMap[streamId] = stream;
            console.log("loop test", (loop + 1) * this._SoundBufferMap[soundId].duration)
            stream.start(0, 0, (loop + 1) * this._SoundBufferMap[soundId].duration);
            return streamId;
        } else {
            return -1;
        }
    }

    pause(streamId) {}

    resume(streamId) {}

    stop(streamId) {
        if (this._StreamMap[streamId]) {
            this._StreamMap[streamId].stop();
            delete this._StreamMap[streamId];
        }
    }

    release() {
        this._SoundBufferMap = {};
        this._StreamMap = {};
    }

    setVolume(streamId, leftVolume, rightVolume) {
        if (this._StreamMap[streamId]) {
            this._StreamMap[streamId].setVolume(leftVolume);
        }
    }

    setPriority(streamId, priority) {}

    setRate(streamId, rate) {}

    setLoop(streamId, loop) {}

    _requestBuffer(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer'
        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log("http request succeed");
                callback(0, xhr.response);
            } else {
                console.error("download audio " + url + " failed.", xhr.status)
                callback(-1, null);
            }
        }
        xhr.send();
    }
}
window.SoundPool = SoundPool;