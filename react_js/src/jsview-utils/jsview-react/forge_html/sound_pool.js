/*
 * @Author: ChenChanghua
 * @Date: 2020-07-20 09:37:37
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2020-07-20 09:43:33
 * @Description: file content
 */ 
class SoundPool {
    constructor() {}

    load(url, netsetting, priority, callback) {}

    unload(streamId) {}

    autoPause() {}

    autoResume() {}

    play(soundId, leftVolume, rightVolume, priority, loop, rate) {}

    pause(streamId) {}

    resume(streamId) {}

    stop(streamId) {}

    setVolume(streamId, leftVolume, rightVolume) {}

    setPriority(streamId, priority) {}

    setRate(streamId, rate) {}

    setLoop(streamId, loop) {}
}
window.SoundPool = SoundPool;