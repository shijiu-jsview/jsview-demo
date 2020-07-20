/*
 * @Author: ChenChanghua
 * @Date: 2020-07-17 11:09:01
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2020-07-20 09:36:44
 * @Description: file content
 */ 

class AudioController{
    constructor(soundPool, soundId, url) {
        this._SoundPool = soundPool;
        this._SoundId = soundId;
        this._Url = url;
        this._StreamId = -1;

        this._Rate = 1;
        this._Loop = 0;
        this._LeftVolume = 1;
        this._RightVolume = 1;
        this._Priority = 0;
    }

    play() {
        if (this._StreamId !== -1) {
            this._SoundPool.stop(this._StreamId);
        }
        this._StreamId = this._SoundPool.play(this._SoundId, this._LeftVolume, this._RightVolume, this._Priority, this._Loop, this._Rate);
    }

    pause() {
        this._SoundPool.pause(this._StreamId);
    }

    resume() {
        this._SoundPool.resume(this._StreamId);
    }

    stop() {
        this._SoundPool.stop(this._StreamId);
    }

    setRate(rate) {
        this._Rate = rate;
        if (this._Streamid != -1) {
            this._SoundPool.setRate(this._StreamId, this._Rate);
        }
    }

    setVolume(leftVolume, rightVolume) {
        this._LeftVolume = leftVolume;
        this._RightVolume =  rightVolume;
        if (this._StreamId != -1) {
            this._SoundPool.setVolume(this._StreamId, this._LeftVolume, this._RightVolume);
        }
    }

    setLoop(loop) {
        this._Loop = loop;
        if (this._StreamId != -1) {
            this._SoundPool.setLoop(this._StreamId, this._Loop);
        }
    }

    setPriority(priority) {
        this._Priority = priority;
        if (this._StreamId != -1) {
            this._SoundPool.setPriority(this._StreamId, this._Priority);
        }
    }
}

class JsvSoundPool{
    constructor(max) {
        this._SoundPool = new window.SoundPool(max);
        this._SoundIdMap = {};
        this._StreamIdMap = new Set();
    }

    request(url, netSetting, priority, callback) {
        let realUrl;
        if (window.JsView) {
            //jsview上
            realUrl = new window.JsView.React.UrlRef(url).href;
        } else {
            realUrl = url;
        }
        if (this._SoundIdMap[realUrl]) {
            this._SoundIdMap[realUrl].referCount++;
            let controller = new AudioController(this._SoundPool, ths._SoundIdMap[realUrl].soundId);
            this._StreamIdMap.add(controller);
            callback(0, controller);
        } else {
            this._SoundPool.load(realUrl, netSetting, priority, (sound_id, state) => {
                if (state == 0) {
                    this._SoundIdMap[realUrl] = {
                        soundId: sound_id,
                        referCount: 1
                    };
                    let controller = new AudioController(this._SoundPool, sound_id, realUrl);
                    this._StreamIdMap.add(controller);
                    callback(state, controller);
                } else {
                    callback(state, null);
                    console.error("load " + realUrl + " failed");
                }
            });
        }
    }

    release(controller) {
        this._StreamIdMap.delete(controller);
        if (this._SoundIdMap[controller._Url]) {
            let item = this._SoundIdMap[controller._Url];
            item.referCount--;
            if (item.referCount <= 0) {
                this._SoundPool.unload(item.soundId);
            }
        }
    }

    autoPaues() {
        this._SoundPool.autoPause();
    }

    autoResume() {
        this._SoundPool.autoResume();
    }
}

export {
    JsvSoundPool
}