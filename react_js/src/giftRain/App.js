import React from 'react';
import './App.css';
import Role from "./role"
import RedPacket from "./red_packet.js"
import { globalHistory } from '../demoCommon/RouterHistory';
import { FocusBlock } from "../demoCommon/BlockDefine"
import AudioGetUrl from "./audio/get.mp3";
import AudioBoomUrl from "./audio/boom.mp3";
import AudioBgUrl from "./audio/bgMusic.mp3";

class App extends FocusBlock {
	constructor(props) {
		super(props);

		this._bgImage = 'http://oss.image.qcast.cn/demo_images/red_packet_rain/bg.jpg';
		this._RedImage = 'http://oss.image.qcast.cn/demo_images/red_packet_rain/red.png';
		this._BigRedImage = 'http://oss.image.qcast.cn/demo_images/red_packet_rain/bigred.png';
		this._BoomImage = 'http://oss.image.qcast.cn/demo_images/red_packet_rain/boom.png';
		this._KiMiNormalImg = "http://oss.image.qcast.cn/demo_images/red_packet_rain/kimi_normal.png";
		this._KiMiBoomImg = "http://oss.image.qcast.cn/demo_images/red_packet_rain/kimi_boom.png";
		this._KiMiSmileImg = "http://oss.image.qcast.cn/demo_images/red_packet_rain/kimi_smile.png";
		this._ScoreAdd1 = "http://oss.image.qcast.cn/demo_images/red_packet_rain/add1.png";
		this._ScoreAdd5 = "http://oss.image.qcast.cn/demo_images/red_packet_rain/add5.png";
		this._ScoreMin1 = "http://oss.image.qcast.cn/demo_images/red_packet_rain/min1.png";
        this._AudioGetUrl = AudioGetUrl;
        this._AudioBoomUrl = AudioBoomUrl;
        this._CurrentRain = null;
        this._KeyDownTimer = null;
        this._Step = 25;
        this.score = 0;
        this._Audio = null;
        this._AudioBgUrl = AudioBgUrl;
        this._BgAudio = null;
        this.state = {raininfo: {kimi: this._KiMiNormalImg,
            score: this.score,
            add_score_visible: "none",
            min_score_visible: "none",
            min_score_image: null,
            add_score_image:null}, x: 300}
	}

    _clearTimer() {
        if (this._KeyDownTimer) {
            clearInterval(this._KeyDownTimer);
            this._KeyDownTimer = null;
        }
    }

	onRainDown(rain) {
        let add_score_visible = "none";
        let min_score_visible = "none";
        let add_score_image = this._ScoreAdd1;
        let min_score_image = this._ScoreMin1;
        if (rain !== null && rain !== this._CurrentRain) {
            this._CurrentRain = rain;
            let mid_rain_w = rain.left + rain.width/2;
            let  kimi = this._KiMiNormalImg;
            if (mid_rain_w > this.state.x && mid_rain_w < this.state.x + 194) {
                switch(rain.type) {
                    case 0:
                        add_score_visible = "block";
                        kimi = this._KiMiNormalImg;
                        add_score_image = this._ScoreAdd1;
                        this.score += 1;
                        if (this._Audio) {
                            this._Audio.src = this._AudioGetUrl;
                            this._Audio.play();
                        }
                        break;
                    case 1:
                        add_score_visible = "block";
                        kimi = this._KiMiSmileImg;
                        add_score_image = this._ScoreAdd5;
                        if (this._Audio) {
                            this._Audio.src = this._AudioGetUrl;
                            this._Audio.play();
                        }
                        this.score += 5;
                        break;
                    case 2:
                        add_score_visible = "none";
                        min_score_visible = "block";
                        min_score_image = this._ScoreMin1;
                        kimi = this._KiMiBoomImg;
                        this.score -=1;
                        if (this.score < 0) {
                            this.score = 0;
                        }
                        if (this._Audio) {
                            this._Audio.src = this._AudioBoomUrl;
                            this._Audio.play();
                        }
                        break;
                }
            } else {
                add_score_visible = "none";
                min_score_visible = "none";
            }
            this.setState({
                raininfo: {
                    kimi: kimi,
                    score: this.score,
                    add_score_visible: add_score_visible,
                    min_score_visible: min_score_visible,
                    min_score_image: min_score_image,
                    add_score_image:add_score_image
                }
            });
        }

	}

    onKeyUp(ev) {
        console.log("onKeyUp in : ", ev);
        if (ev.keyCode === 37 || ev.keyCode === 39) {
            this._clearTimer();
            return true;
        }
        return false;
    }

	onKeyDown(ev) {
		if (ev.keyCode === 10000 || ev.keyCode === 27) {
            globalHistory.goBack();
            this.changeFocus("/main");
        } else if (ev.keyCode === 37) {
            if(this._KeyDownTimer== null) {
                this._KeyDownTimer = setInterval(()=>{
                    let x = this.state.x - this._Step;
                    x = x < 0 ? 0 : x;
                    this.setState({x: x})
                }, 40)
            }
            return true;
        } else if (ev.keyCode === 39) {
            if(this._KeyDownTimer== null) {
                this._KeyDownTimer = setInterval(() => {
                    let x = this.state.x + this._Step;
                    x = x > 1080 ? 1080 : x;
                    this.setState({x: x})
                }, 40);
            }
            return true;
        }
        return true;
	}

	renderContent() {
		return (
			<div style={{ width: "1280px", height: "720px" }}>
				{/*preload image */}
				<div key="pre_KiMiNormalImg" style={{ backgroundImage: `url(${this._KiMiNormalImg})`, width: 1, height: 1 }}></div>
				<div key="pre_KiMiSmileImg" style={{ backgroundImage: `url(${this._KiMiSmileImg})`, width: 1, height: 1 }}></div>
				<div key="pre_KiMiBoomImg" style={{ backgroundImage: `url(${this._KiMiBoomImg})`, width: 1, height: 1 }}></div>
				<div key="pre_RedImage" style={{ backgroundImage: `url(${this._RedImage})`, width: 1, height: 1 }}></div>
				<div key="pre_BigRedImage" style={{ backgroundImage: `url(${this._BigRedImage})`, width: 1, height: 1 }}></div>
				<div key="pre_BoomImage" style={{ backgroundImage: `url(${this._BoomImage})`, width: 1, height: 1 }}></div>
				<div style={{ backgroundImage: `url(${this._bgImage})`, width: "1280px", height: "720px" }}>

					<Role branchName={ this.props.branchName + "/role" } raininfo={this.state.raininfo} x={this.state.x} />

					<RedPacket onRainDown={(rain) => {
						this.onRainDown(rain)
					}} />
				</div>
				<audio key="AudioBg" src={ this._AudioBgUrl} ref={(ref) => { this._BgAudio = ref; }} />
				<audio ref={(ref) => { this._Audio = ref; }}/>
			</div>
		)
	}

	componentDidMount() {
        console.log("giftRain App componentDidMount in");
        if (this._BgAudio != null) {
            this._BgAudio.play();
        }
        window.BgAudio = this._BgAudio;
		this.changeFocus(this.props.branchName + "/role" )
	}

    componentWillUnmount() {
		console.log("giftRain App componentWillUnmount in");

    }

}
export default App;
