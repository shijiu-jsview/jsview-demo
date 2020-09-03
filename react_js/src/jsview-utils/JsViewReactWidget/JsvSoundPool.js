/**
 * @description: 控制音频的对象
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

    /**
     * @description: 播放音频
     */
    play() {
        if (this._StreamId !== -1) {
            this._SoundPool.stop(this._StreamId);
        }
        this._StreamId = this._SoundPool.play(this._SoundId, this._LeftVolume, this._RightVolume, this._Priority, this._Loop, this._Rate);
    }

    /**
     * @description: 暂停音频(Android4.0不支持)
     */
    pause() {
        this._SoundPool.pause(this._StreamId);
    }

    /**
     * @description: 恢复播放音频(Android4.0不支持)
     */
    resume() {
        this._SoundPool.resume(this._StreamId);
    }

    /**
     * @description: 停止音频(Android4.0不支持)
     */
    stop() {
        this._SoundPool.stop(this._StreamId);
    }

    /**
     * @description: 设置播放速度
     * @param {float} rate 播放的倍率
     */
    setRate(rate) {
        this._Rate = rate;
        if (this._Streamid != -1) {
            this._SoundPool.setRate(this._StreamId, this._Rate);
        }
    }

    /**
     * @description: 设置音量
     * @param {float} leftVolume 左声道音量
     * @param {float} rightVolume 右声道音量
     */
    setVolume(leftVolume, rightVolume) {
        this._LeftVolume = leftVolume;
        this._RightVolume =  rightVolume;
        if (this._StreamId != -1) {
            this._SoundPool.setVolume(this._StreamId, this._LeftVolume, this._RightVolume);
        }
    }

    /**
     * @description: 设置循环次数, 注意: 循环一次表示总共播两次
     * @param {int} loop 循环次数
     */
    setLoop(loop) {
        this._Loop = loop;
        if (this._StreamId != -1) {
            this._SoundPool.setLoop(this._StreamId, this._Loop);
        }
    }

    /**
     * @description: 设置优先级
     * @param {int} priority 优先级
     */
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

    /**
     * @description: 准备音频资源
     * @param {string} url 音频url
     * @param {string} netSetting http请求配置
     * @param {int} priority 优先级
     * @param {function} callback 资源加载完成回调 function(int state, AudioController controller) {}
     */
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
            let controller = new AudioController(this._SoundPool, this._SoundIdMap[realUrl].soundId);
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

    /**
     * @description: 释放音频资源
     * @param {AudioController} controller 控制句柄
     */
    release(controller) {
        controller.stop();
        this._StreamIdMap.delete(controller);
        if (this._SoundIdMap[controller._Url]) {
            let item = this._SoundIdMap[controller._Url];
            item.referCount--;
            if (item.referCount <= 0) {
                this._SoundPool.unload(item.soundId);
            }
        }
    }

    /**
     * @description: 销毁SoundPool
     */
    destroy() {
        this._SoundPool.release();
    }

    /**
     * @description: 全部暂停
     */
    autoPaues() {
        this._SoundPool.autoPause();
    }

    /**
     * @description: 全部开始
     */
    autoResume() {
        this._SoundPool.autoResume();
    }
}

export {
    JsvSoundPool
}