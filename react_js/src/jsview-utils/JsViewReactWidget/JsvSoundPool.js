/**
 * Created by changhua.chen@qcast.cn on 11/13/2020.
 */

/**
 * 【模块 export 内容】
 * JsvSoundPool: 面向对象的类，用于播放效果音，创建JsvSoundPool对象后通过request的回调获得AudioController句柄后进行控制
 *      功能函数: (参数说明见函数本体)
 *          constructor(max)
 *              功能: 构造JsvSoundPool，构造后需要destroy进行资源释放
 *          request(url, netSetting, priority, callback)
 *              功能: 创建加载指定音轨(url)的控制器(AudioController)，在回调中获得AudioController
 *          release(controller)
 *              功能: 释放指定AudioController资源
 *          destroy()
 *              功能: 释放JsvSoundPool管理的所有资源
 *          autoPause()
 *              功能: 暂停当前Pool中所有正在播放的音轨
 *          autoResume()
 *              功能: 播放当前Pool中所有暂停掉的音轨
 * AudioController:
 *      功能函数: (参数说明见函数本体)
 *          play()
 *              功能: 播放当前音轨，与stop()配套
 *          pause()
 *              功能: 暂停当前音轨，与resume()配套
 *          stop()
 *              功能: 停止当前音轨，与play()配套
 *          resume()
 *              功能: 恢复当前音轨播放，与pause()配套
 *          setRate(rate)
 *              功能: 当前播放速率
 *          setVolume(leftVolume, rightVolume)
 *              功能: 调整音量
 *          setLoop(loop)
 *              功能: 设置是否进行循环和循环次数
 *          setPriority(priority)
 *              功能: 设置播放优先级
 */

const supportSoundPool = !!window.SoundPool;
class AudioController {
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
    if (this._StreamId !== -1) {
      this._SoundPool.pause(this._StreamId);
    }
  }

  /**
     * @description: 恢复播放音频(Android4.0不支持)
     */
  resume() {
    if (this._StreamId !== -1) {
      this._SoundPool.resume(this._StreamId);
    }
  }

  /**
     * @description: 停止音频(Android4.0不支持)
     */
  stop() {
    if (this._StreamId !== -1) {
      this._SoundPool.stop(this._StreamId);
      this._StreamId = -1;
    }
  }

  /**
     * @description: 设置播放速度
     * @param {float} rate 播放的倍率
     */
  setRate(rate) {
    this._Rate = rate;
    if (this._Streamid !== -1) {
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
    this._RightVolume = rightVolume;
    if (this._StreamId !== -1) {
      this._SoundPool.setVolume(this._StreamId, this._LeftVolume, this._RightVolume);
    }
  }

  /**
     * @description: 设置循环次数, 注意: 循环一次表示总共播两次
     * @param {int} loop 循环次数
     */
  setLoop(loop) {
    this._Loop = loop;
    if (this._StreamId !== -1) {
      this._SoundPool.setLoop(this._StreamId, this._Loop);
    }
  }

  /**
     * @description: 设置优先级
     * @param {int} priority 优先级
     */
  setPriority(priority) {
    this._Priority = priority;
    if (this._StreamId !== -1) {
      this._SoundPool.setPriority(this._StreamId, this._Priority);
    }
  }
}

class JsvSoundPool {
  /**
     * @param {int} max max streams
     */
  constructor(max) {
    if (!supportSoundPool) return;
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
    if (!supportSoundPool) {
      callback(-1, null);
      console.log("not support sound pool.");
      return;
    }

    let realUrl;
    if (window.JsView) {
      // jsview上
      realUrl = new window.JsView.React.UrlRef(url).href;
    } else {
      realUrl = url;
    }
    if (this._SoundIdMap[realUrl]) {
      this._SoundIdMap[realUrl].referCount++;
      const controller = new AudioController(this._SoundPool, this._SoundIdMap[realUrl].soundId);
      this._StreamIdMap.add(controller);
      callback(0, controller);
    } else {
      this._SoundPool.load(realUrl, netSetting, priority, (sound_id, state) => {
        if (state === 0) {
          this._SoundIdMap[realUrl] = {
            soundId: sound_id,
            referCount: 1
          };
          const controller = new AudioController(this._SoundPool, sound_id, realUrl);
          this._StreamIdMap.add(controller);
          callback(state, controller);
        } else {
          callback(state, null);
          console.error(`load ${realUrl} failed`);
        }
      });
    }
  }

  /**
     * @description: 释放音频资源
     * @param {AudioController} controller 控制句柄
     */
  release(controller) {
    if (!supportSoundPool) return;
    controller.stop();
    this._StreamIdMap.delete(controller);
    if (this._SoundIdMap[controller._Url]) {
      const item = this._SoundIdMap[controller._Url];
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
    if (!supportSoundPool) return;
    this._SoundPool.release();
  }

  /**
     * @description: 全部暂停
     */
  autoPause() {
    if (!supportSoundPool) return;
    this._SoundPool.autoPause();
  }

  /**
     * @description: 全部开始
     */
  autoResume() {
    if (!supportSoundPool) return;
    this._SoundPool.autoResume();
  }
}

export {
  JsvSoundPool
};
