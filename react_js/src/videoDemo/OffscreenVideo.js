/*
 * 【界面概述】
 * 视频播放和控制样例
 *
 * 【控件介绍】
 * Fdiv：参照本地另一个demo: basicFdivConrol
 *
 * 【技巧说明】
 * Q: 如何加入播放视频？
 * A: render时使用H5的video标签即可
 *
 * Q: 视频播放控制？
 * A: video标签中通过ref拿到标签对象，通过H5视频标签标准接口进行控制
 *    起播：video标签.play()
 *    暂停：video标签.pause()
 *    改变播放进度：video标签.currentTime = 新的播放时间(毫秒)
 */

import React from 'react';
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";
import JsvVideo from "../jsview-utils/JsViewReactWidget/JsvVideo";
import "./App.css";

function throttle(callback, limit) {
  let wait = false;
  return () => {
    if (!wait) {
      // eslint-disable-next-line prefer-rest-params
      callback(...arguments);
      wait = true;
      setTimeout(() => {
        wait = false;
      }, limit);
    }
  };
}
class OffscreenVideo extends FocusBlock {
  constructor(props) {
    super(props);
    this._autoPlay = !!window.JsView;// jsview自动播放该视频 TODO h5需做相应调整
    this.state = {
      visible: "hidden",
      play_state: this._autoPlay ? "pause" : "play",
      focus_id: 0,
      currentTime: 0,
      objectFitIdx: 0,
      animation: null,
      animAct: "Start",
    };
    this.video = null; // the html5 video
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.seek = this.seek.bind(this);
    this.forward = this.forward.bind(this);
    this.replay = this.replay.bind(this);
    this.handleLoadStart = this.handleLoadStart.bind(this);
    this.handleCanPlay = this.handleCanPlay.bind(this);
    this.handleCanPlayThrough = this.handleCanPlayThrough.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePlaying = this.handlePlaying.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleEnded = this.handleEnded.bind(this);
    this.handleWaiting = this.handleWaiting.bind(this);
    this.handleSeeking = this.handleSeeking.bind(this);
    this.handleSeeked = this.handleSeeked.bind(this);
    this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleSuspend = this.handleSuspend.bind(this);
    this.handleAbort = this.handleAbort.bind(this);
    this.handleEmptied = this.handleEmptied.bind(this);
    this.handleStalled = this.handleStalled.bind(this);
    this.handleLoadedMetaData = this.handleLoadedMetaData.bind(this);
    this.handleLoadedData = this.handleLoadedData.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.handleRateChange = this.handleRateChange.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleProgress = throttle(this.handleProgress.bind(this), 250);

    this._ObjectFitData = [
      {
        name: "contain-horizontal",
        objectFit: "contain",
        width: 1200,
      },
      {
        name: "contain-vertical",
        objectFit: "contain",
        width: 400,
      },
      {
        name: "fill",
        objectFit: "fill",
        width: 1200,
      },
      {
        name: "none-horizontal",
        objectFit: "none",
        width: 1200,
      },
      {
        name: "none-vertical",
        objectFit: "none",
        width: 400,
      },
      {
        name: "cover-horizontal",
        objectFit: "cover",
        width: 1200,
      },
      {
        name: "cover-vertical",
        objectFit: "cover",
        width: 400,
      },
    ];
  }

  // get playback rate
  get playbackRate() {
    return this.video.playbackRate;
  }

  // set playback rate
  // speed of video
  set playbackRate(rate) {
    this.video.playbackRate = rate;
  }

  get muted() {
    return this.video.muted;
  }

  set muted(val) {
    this.video.muted = val;
  }

  get volume() {
    return this.video.volume;
  }

  set volume(val) {
    if (val > 1) {
      val = 1;
    }
    if (val < 0) {
      val = 0;
    }
    this.video.volume = val;
  }

  // video width
  get videoWidth() {
    return this.video.videoWidth;
  }

  // video height
  get videoHeight() {
    return this.video.videoHeight;
  }

  // play the video
  play() {
    const promise = this.video.play();
    if (promise !== undefined) {
      promise.catch(() => { }).then(() => { });
    }
  }

  // pause the video
  pause() {
    const promise = this.video.pause();
    if (promise !== undefined) {
      promise.catch(() => { }).then(() => { });
    }
  }

  // Change the video source and re-load the video:
  load() {
    this.video.load();
  }

  // Add a new text track to the video
  addTextTrack(...args) {
    console.log("addTextTrack");
    this.video.addTextTrack(...args);
  }

  // Check if your browser can play different types of video:
  canPlayType(...args) {
    this.video.canPlayType(...args);
  }

  // toggle play
  togglePlay() {
    if (this.video.paused === null || this.video.paused) {
      this.setState({ play_state: "pause" });
      // this.seek(1);
      this.play();
    } else {
      this.setState({ play_state: "play" });
      this.pause();
    }
  }

  // seek video by time
  seek(time) {
    try {
      this.video.currentTime = time;
    } catch (e) {
      // console.log(e, 'Video is not ready.')
    }
  }

  // jump forward x seconds
  forward(seconds) {
    this.seek(this.video.currentTime + seconds);
  }

  // jump back x seconds
  replay(seconds) {
    this.forward(-seconds);
  }

  // Fired when the user agent
  // begins looking for media data
  handleLoadStart(...args) {
    console.log("handleLoadStart");
  }

  // A handler for events that
  // signal that waiting has ended
  handleCanPlay(...args) {
    console.log("handleCanPlay");
  }

  // A handler for events that
  // signal that waiting has ended
  handleCanPlayThrough(...args) {
    console.log("handleCanPlayThrough");
  }

  // A handler for events that
  // signal that waiting has ended
  handlePlaying(...args) {
    console.log("handlePlaying");
  }

  // Fired whenever the media has been started
  handlePlay(...args) {
    console.log("handlePlay");
  }

  // Fired whenever the media has been paused
  handlePause(...args) {
    console.log("handlePause");
  }

  // Fired when the duration of
  // the media resource is first known or changed
  handleDurationChange(...args) {
    console.log("handleDurationChange");
  }

  // Fired while the user agent
  // is downloading media data
  handleProgress(...args) {
    console.log("handleProgress");
  }

  // Fired when the end of the media resource
  // is reached (currentTime === duration)
  handleEnded(...args) {
    console.log("handleEnded");
    this.setState({ play_state: "play" });
  }

  // Fired whenever the media begins waiting
  handleWaiting(...args) {
    console.log("handleWaiting");
  }

  // Fired whenever the player
  // is jumping to a new time
  handleSeeking(...args) {
    console.log("handleSeeking");
  }

  // Fired when the player has
  // finished jumping to a new time
  handleSeeked(...args) {
    console.log("handleSeeked");
    if (this.video.currentTime > this.video.duration) {
      this.video.currentTime = this.video.duration;
    }
    this.setState({ currentTime: this.video.currentTime });
  }

  // Handle Fullscreen Change
  handleFullscreenChange() {
    console.log("handleFullscreenChange");
  }

  // Fires when the browser is
  // intentionally not getting media data
  handleSuspend(...args) {
    console.log("handleSuspend");
  }

  // Fires when the loading of an audio/video is aborted
  handleAbort(...args) {
    console.log("handleAbort");
  }

  // Fires when the current playlist is empty
  handleEmptied(...args) {
    console.log("handleEmptied");
  }

  // Fires when the browser is trying to
  // get media data, but data is not available
  handleStalled(...args) {
    console.log("handleStalled");
  }

  // Fires when the browser has loaded
  // meta data for the audio/video
  handleLoadedMetaData(...args) {
    console.log("handleLoadedMetaData");
  }

  // Fires when the browser has loaded
  // the current frame of the audio/video
  handleLoadedData(...args) {
    console.log("handleLoadedData");
  }

  // Fires when the current
  // playback position has changed
  handleTimeUpdate(...args) {
    // console.log("handleTimeUpdate")
    this.setState({ currentTime: this.video.currentTime });
  }


  /**
     * Fires when the playing speed of the audio/video is changed
     */
  handleRateChange(...args) {
    console.log("handleRateChange");
  }

  // Fires when the volume has been changed
  handleVolumeChange(...args) {
    console.log("handleVolumeChange");
  }

  // Fires when an error occurred
  // during the loading of an audio/video
  handleError(...args) {
    console.log("handleError");
  }

  handleResize(...args) {
    console.log("handleResize");
  }

  _ToggleAnim() {
    if (!this.state.animation) {
      this.setState({ animation: "offscreenAnim 3s infinite", animAct: "Stop" });
    } else {
      this.setState({ animation: null, animAct: "Start" });
    }
  }

  onKeyDown(ev) {
    let key_used = false;
    switch (ev.keyCode) {
      case 13:
        switch (this.state.focus_id) {
          case 0:
            if (this.props.changeMode) {
              this.props.changeMode(false);
            }
            break;
          case 1:
            this.togglePlay();
            break;
          case 2:
            this.forward(5);
            break;
          case 3:
            this.replay(5);
            break;
          case 4:
            this._ToggleObjectFitChange();
            break;
          case 5:
            this._ToggleAnim();
            break;
          default:
            break;
        }
        key_used = true;
        break;
      case 39:
        switch (this.state.focus_id) {
          case 0:
            this.setState({ focus_id: 1 });
            break;
          case 1:
            this.setState({ focus_id: 2 });
            break;
          case 2:
            this.setState({ focus_id: 3 });
            break;
          case 3:
            this.setState({ focus_id: 4 });
            break;
          case 4:
            this.setState({ focus_id: 5 });
            break;
          case 5:
            break;
          default:
            break;
        }
        key_used = true;
        break;
      case 37:
        switch (this.state.focus_id) {
          case 0:
            break;
          case 1:
            this.setState({ focus_id: 0 });
            break;
          case 2:
            this.setState({ focus_id: 1 });
            break;
          case 3:
            this.setState({ focus_id: 2 });
            break;
          case 4:
            this.setState({ focus_id: 3 });
            break;
          case 5:
            this.setState({ focus_id: 4 });
            break;
          default:
            break;
        }
        key_used = true;
        break;
      default:
        break;
    }

    return key_used;
  }

  _Measures(item) {
    return item;
  }

    _RefVideo = (ele) => {
      console.log("video:", ele);
      this.video = ele;
    }

    onFocus() {
      this.setState({ visible: "visible" });
    }

    onBlur() {
      this.setState({
        visible: "hidden",
        play_state: this._autoPlay ? "pause" : "play",
        focus_id: 0,
        currentTime: 0,
        objectFitIdx: 0,
        animation: null,
        animAct: "Start" });
    }

    renderContent() {
      const object_fit_set = this._ObjectFitData[this.state.objectFitIdx];
      if (this.state.visible === "hidden") {
        return null;
      }
      return (
            <div style={{ top: 0, left: 0, width: 1280, height: 720, backgroundColor: "rgb(222,211,140)" }} >
                <div style={{
                  top: 50,
                  left: (1280 - object_fit_set.width) / 2,
                  width: object_fit_set.width,
                  height: 500,
                  backgroundColor: "rgb(200,100,100)"
                }} />
                <JsvVideo
                    usetexture={true}
                    style={{
                      top: 50,
                      left: (1280 - object_fit_set.width) / 2,
                      width: object_fit_set.width,
                      height: 500,
                      objectFit: object_fit_set.objectFit,
                      animation: this.state.animation,
                      borderRadius: '0 80px 160px 240px' }}
                    src="http://qcast-image.oss-cn-qingdao.aliyuncs.com/homepage/20190726/4cc4e6a8fd7d9d9c707ed4c4da27ca9d.mp4"
                    videoref={this._RefVideo}
                    onLoadStart={this.handleLoadStart}
                    onWaiting={this.handleWaiting}
                    onCanPlay={this.handleCanPlay}
                    onCanPlayThrough={this.handleCanPlayThrough}
                    onPlaying={this.handlePlaying}
                    onEnded={this.handleEnded}
                    onSeeking={this.handleSeeking}
                    onSeeked={this.handleSeeked}
                    onPlay={this.handlePlay}
                    onPause={this.handlePause}
                    onProgress={this.handleProgress}
                    onDurationChange={this.handleDurationChange}
                    onError={this.handleError}
                    onSuspend={this.handleSuspend}
                    onAbort={this.handleAbort}
                    onEmptied={this.handleEmptied}
                    onStalled={this.handleStalled}
                    onLoadedMetadata={this.handleLoadedMetaData}
                    onLoadedData={this.handleLoadedData}
                    onTimeUpdate={this.handleTimeUpdate}
                    onRateChange={this.handleRateChange}
                    onVolumeChange={this.handleVolumeChange}
                />
                <div style={{
                  textAlign: "left",
                  fontSize: "24px",
                  lineHeight: "30px",
                  color: "#ffffff",
                  left: 10,
                  top: 10,
                  width: 400,
                  height: 180,
                  backgroundColor: "rgba(27,38,151,0.8)"
                }}>{
                    `名称:OffscreenVideo(自动播放）
功能描述:
1.离屏视频播放、支持前进/后退控制
2.支持圆角设置
3.支持平移、缩放、旋转等动画
4.支持ObjectFit调整`}</div>

                <div style={{
                  color: "#FF0000",
                  textAlign: "right",
                  fontSize: "24px",
                  left: (1280 - 800) / 2 + 800 + 20,
                  top: 550,
                  width: 60,
                  height: 40
                }}>{Math.ceil(this.state.currentTime)}</div>
                <div style={{
                  color: "#FF0000",
                  textAlign: "left",
                  fontSize: "24px",
                  left: (1280 - 800) / 2 + 800 + 20 + 60,
                  top: 550,
                  width: 60,
                  height: 40
                }}>{`/${this.video ? Math.ceil(this.video.duration) : 0}`}</div>

                <div style={{
                  textAlign: "center",
                  fontSize: "20px",
                  lineHeight: "40px",
                  left: (1280 - 800) / 2 - 200,
                  top: 600,
                  width: 180,
                  height: 40,
                  backgroundColor: `${this.state.focus_id === 0 ? "#FFFF00" : "#a8a8a8"}`
                }}>ToVideoMode</div>

                <div style={{
                  textAlign: "center",
                  fontSize: "30px",
                  left: (1280 - 800) / 2,
                  top: 600,
                  width: 120,
                  height: 40,
                  backgroundColor: `${this.state.focus_id === 1 ? "#FFFF00" : "#a8a8a8"}`
                }}>{this.state.play_state}</div>

                <div style={{
                  textAlign: "center",
                  fontSize: "30px",
                  left: (1280 - 800) / 2 + 140,
                  top: 600,
                  width: 120,
                  height: 40,
                  backgroundColor: `${this.state.focus_id === 2 ? "#FFFF00" : "#a8a8a8"}`
                }}>forward</div>

                <div style={{
                  textAlign: "center",
                  fontSize: "30px",
                  left: (1280 - 800) / 2 + 140 * 2,
                  top: 600,
                  width: 120,
                  height: 40,
                  backgroundColor: `${this.state.focus_id === 3 ? "#FFFF00" : "#a8a8a8"}`
                }}>replay</div>

                <div style={{
                  textAlign: "center",
                  fontSize: "30px",
                  left: (1280 - 800) / 2 + 140 * 3,
                  top: 600,
                  width: 150,
                  height: 40,
                  backgroundColor: `${this.state.focus_id === 4 ? "#FFFF00" : "#a8a8a8"}`
                }}>ObjectFit</div>

                <div style={{
                  color: "#FF0000",
                  textAlign: "center",
                  fontSize: "24px",
                  left: (1280 - 800) / 2 + 140 * 3 - 75,
                  top: 560,
                  width: 300,
                  height: 40
                }}>{object_fit_set.name}</div>

                <div style={{
                  textAlign: "center",
                  fontSize: "24px",
                  left: (1280 - 800) / 2 + 140 * 4 + 40,
                  top: 600,
                  width: 240,
                  height: 40,
                  backgroundColor: `${this.state.focus_id === 5 ? "#FFFF00" : "#a8a8a8"}`
                }}>{`${this.state.animAct}Animation`}</div>

            </div>
      );
    }

    componentWillUnmount() {
      console.log("OffScreenVideo App componentWillUnmount in");
    }

    componentDidMount() {
      console.log("OffScreenVideo App componentDidMount in");
    }

    _ToggleObjectFitChange() {
      this.setState({
        objectFitIdx: ((this.state.objectFitIdx + 1) % this._ObjectFitData.length),
        animation: null,
        animAct: "Start"
      });
    }
}

export default OffscreenVideo;
