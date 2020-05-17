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
import createStandaloneApp from "../demoCommon/StandaloneApp"
import { FocusBlock } from "../demoCommon/BlockDefine"

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
class MainScene extends FocusBlock {
	constructor(props) {
		super(props);
		this._autoPlay = false;
		this.state = {
			play_state: this._autoPlay ? "pause" : "play",
			focus_id: 0,
            currentTime:0,
		}
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
		if (this.video.paused == null || this.video.paused) {
			this.setState({ play_state: "pause" });
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
		console.log("handlePause")
	}

	// Fired when the duration of
	// the media resource is first known or changed
	handleDurationChange(...args) {
		console.log("handleDurationChange")
	}

	// Fired while the user agent
	// is downloading media data
	handleProgress(...args) {
		console.log("handleProgress")
	}

	// Fired when the end of the media resource
	// is reached (currentTime == duration)
	handleEnded(...args) {
		console.log("handleEnded");
		this.setState({ play_state: "play" });
	}

	// Fired whenever the media begins waiting
	handleWaiting(...args) {
		console.log("handleWaiting")
	}

	// Fired whenever the player
	// is jumping to a new time
	handleSeeking(...args) {
		console.log("handleSeeking")
	}

	// Fired when the player has
	// finished jumping to a new time
	handleSeeked(...args) {
		console.log("handleSeeked")
	}

	// Handle Fullscreen Change
	handleFullscreenChange() {
		console.log("handleFullscreenChange")
	}

	// Fires when the browser is
	// intentionally not getting media data
	handleSuspend(...args) {
		console.log("handleSuspend")
	}

	// Fires when the loading of an audio/video is aborted
	handleAbort(...args) {
		console.log("handleAbort")
	}

	// Fires when the current playlist is empty
	handleEmptied(...args) {
		console.log("handleEmptied")
	}

	// Fires when the browser is trying to
	// get media data, but data is not available
	handleStalled(...args) {
		console.log("handleStalled")
	}

	// Fires when the browser has loaded
	// meta data for the audio/video
	handleLoadedMetaData(...args) {
		console.log("handleLoadedMetaData")
	}

	// Fires when the browser has loaded
	// the current frame of the audio/video
	handleLoadedData(...args) {
		console.log("handleLoadedData")
	}

	// Fires when the current
	// playback position has changed
	handleTimeUpdate(...args) {
		console.log("handleTimeUpdate")
		this.setState({currentTime:this.video.currentTime});
	}


	/**
	 * Fires when the playing speed of the audio/video is changed
	 */
	handleRateChange(...args) {
		console.log("handleRateChange")
	}

	// Fires when the volume has been changed
	handleVolumeChange(...args) {
		console.log("handleVolumeChange")
	}

	// Fires when an error occurred
	// during the loading of an audio/video
	handleError(...args) {
		console.log("handleError")
	}

	handleResize(...args) {
		console.log("handleResize")
	}

	onKeyDown(ev) {
		switch (ev.keyCode) {
			case 13:
				switch (this.state.focus_id) {
					case 0:
						this.togglePlay();
						break;
					case 1:
						this.forward(5);
						break;
					case 2:
						this.replay(5);
						break;
				}
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
						break;
				}
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
				}
				break;
			case 27:
			case 10000:
				if (this._NavigateHome) {
					this._NavigateHome();
				}
				break;
			default:
				break;
		}

		return true;
	}

	_Measures(item) {
		return item;
	}

	renderContent() {
		return (
			<div style={{ top: 0, left: 0 }} >
				<video style={{ top: 50, left: (1280 - 800) / 2, width: 800, height: 500 }}
					src="http://oss.image.51vtv.cn/homepage/20190726/4cc4e6a8fd7d9d9c707ed4c4da27ca9d.mp4"
					ref={(c) => {
						console.log("video:", c);
						this.video = c;
					}}
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
				<div style={{ textAlign: "right", fontSize: "24px", left: (1280 - 800) / 2 + 800+20, top: 550, width: 60, height: 40}}>{parseInt(this.state.currentTime)}</div>
				<div style={{ textAlign: "left", fontSize: "24px", left: (1280 - 800) / 2 + 800+20+60, top: 550, width: 60, height: 40}}>{"/"+(this.video?parseInt(this.video.duration):0)}</div>

				<div style={{ textAlign: "center", fontSize: "30px", left: (1280 - 800) / 2, top: 600, width: 120, height: 40, backgroundColor: `${this.state.focus_id == 0 ? "#FFFF00" : "#a8a8a8"}` }}>{this.state.play_state}</div>

				<div style={{ textAlign: "center", fontSize: "30px", left: (1280 - 800) / 2 + 140, top: 600, width: 120, height: 40, backgroundColor: `${this.state.focus_id == 1 ? "#FFFF00" : "#a8a8a8"}` }}>forward</div>

				<div style={{ textAlign: "center", fontSize: "30px", left: (1280 - 800) / 2 + 140 + 140, top: 600, width: 120, height: 40, backgroundColor: `${this.state.focus_id == 2 ? "#FFFF00" : "#a8a8a8"}` }}>replay</div>
			</div>
		)
	}

	componentWillUnmount() {
        console.log("Video App componentWillUnmount in");

    }
	componentDidMount() {
        console.log("Video App componentDidMount in");

    }
}
let App = createStandaloneApp(MainScene);

export {
	App, // 独立运行时的入口
	MainScene as SubApp, // 作为导航页的子入口时
};

