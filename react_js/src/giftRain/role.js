import React from 'react';
import {Fdiv} from "jsview-react"
import AudioGetUrl from "./audio/get.mp3";
import AudioBoomUrl from "./audio/boom.mp3";
class Role extends React.Component{
    constructor(props) {
        super(props);
	    this._KiMiNormalImg = "http://oss.image.qcast.cn/demo_images/red_packet_rain/kimi_normal.png";
	    this._KiMiBoomImg = "http://oss.image.qcast.cn/demo_images/red_packet_rain/kimi_boom.png";
	    this._KiMiSmileImg = "http://oss.image.qcast.cn/demo_images/red_packet_rain/kimi_smile.png";
	    this._ScoreAdd1 = "http://oss.image.qcast.cn/demo_images/red_packet_rain/add1.png";
	    this._ScoreAdd5 = "http://oss.image.qcast.cn/demo_images/red_packet_rain/add5.png";
	    this._ScoreMin1 = "http://oss.image.qcast.cn/demo_images/red_packet_rain/min1.png";
	    this._AudioGetUrl = AudioGetUrl;
	    console.log("AudioGetUrl:", AudioGetUrl);
	    this._AudioBoomUrl = AudioBoomUrl;
	    console.log("AudioBoomUrl:", AudioBoomUrl);
        this.state = {
            x: 300
        }
        this.score = 0;
        this.score_height = 0;
        this.kimi = this._KiMiNormalImg;
        this._CurrentRain = null;
        this._onKeyDown = this._onKeyDown.bind(this);
	    this._onKeyUp = this._onKeyUp.bind(this);
	    this._KeyDownTimer = null;
        this._Step = 25;
	    this._BoomAudio = null;
	    this._GetAudio = null;

    }

    _clearTimer() {
	    if (this._KeyDownTimer) {
		    clearInterval(this._KeyDownTimer);
		    this._KeyDownTimer = null;
	    }
    }

	_onKeyUp(ev) {
    	console.log("_onKeyUp in : ", ev);
		if (ev.keyCode === 37 || ev.keyCode === 39) {
			this._clearTimer();
			return true;
		}
		return false;
	}

    _onKeyDown(ev) {
	    if (ev.keyCode === 37) {
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
        return false;
    }

    render() {
        console.log("role render");
	    let rain = this.props.rain;
	    let add_score_visible = "none";
	    let min_score_visible = "none";
	    let add_score_image = this._ScoreAdd1;
	    let min_score_image = this._ScoreMin1;
	    if (rain !== null && rain !== this._CurrentRain) {
		    this._CurrentRain = rain;
		    console.log("this.state.x:"+this.state.x+", rain:", rain);
		    let mid_rain_w = rain.left + rain.width/2;
	        if (mid_rain_w > this.state.x && mid_rain_w < this.state.x + 194) {
		        switch(rain.type) {
			        case 0:
				        add_score_visible = "block";
				        this.kimi = this._KiMiNormalImg;
				        add_score_image = this._ScoreAdd1;
				        this.score += 1;
				        if (this._GetAudio) {
					        this._BoomAudio.pause();
					        this._GetAudio.play();
				        }
				        break;
			        case 1:
				        add_score_visible = "block";
				        this.kimi = this._KiMiSmileImg;
				        add_score_image = this._ScoreAdd5;
				        if (this._GetAudio) {
					        this._BoomAudio.pause();
					        this._GetAudio.play();
				        }
				        this.score += 5;
				        break;
			        case 2:
				        add_score_visible = "none";
				        min_score_visible = "block";
				        min_score_image = this._ScoreMin1;
				        this.kimi = this._KiMiBoomImg;
				        this.score -=1;
				        if (this.score < 0) {
					        this.score = 0;
                        }
				        if (this._BoomAudio) {
					        this._BoomAudio.play();
					        this._GetAudio.pause();
				        }
				        break;
		        }
            } else {
		        add_score_visible = "none";
		        min_score_visible = "none";
            }
        }
        this.score_height = (this.score *400/ 200);
	    if (this.score_height > 400) {
		    this.score_height = 400;
	    }
	    let kimi = this.kimi;
	    let process_top = 400-this.score_height;
	    console.log("process_top:", process_top);
        return (
            <Fdiv onKeyDown={this._onKeyDown} onKeyUp={this._onKeyUp} branchName={this.props.branchName}>
                <div key="progress-container" style={{
		            width: 40,
		            height: 400,
		            top: 200,
		            left: 40+70-20,
		            backgroundColor: "rgba(255,255,255,0.2)"
	            }}>
                    <div key="progress"
                         style={{
                         	 top:process_top,
			                 width: 40,
			                 height: this.score_height,
			                 backgroundColor: "#ffd050"
		                 }}>
                    </div>
                </div>
                <div key="score" style={{
		            width: 140,
	                height:40,
	                color: '#ffd050',
		            fontSize: 24,
		            top: 620,
		            left: 40,
	                lineHeight:'40px',
	                textOverflow:"clip",
	                textAlign:"center"
	            }}>{"分数:"+this.score}</div>

                <img key="kimi" src={kimi} style={{top: 476, left: this.state.x, width: 194, height: 244}}/>
                {
	                min_score_visible !== "none"?<img key="scoreMin" src={min_score_image} style={{
		                top: 376,
		                left: this.state.x + 40,
		                width: 81,
		                height: 74,
		                display: {min_score_visible}
	                }} />:null
                }
                {
	                add_score_visible !== "none" ?  <img key="scoreAdd" src={add_score_image} style={{
		                top: 376,
		                left: this.state.x + 40,
		                width: 81,
		                height: 74,
		                display: {add_score_visible}
	                }}/>:null
                }
	            <audio key="AudioGet" src={ this._AudioGetUrl} autoPlay={false} playsInline="true" ref={(ref) => { this._GetAudio = ref; }}/>
	            <audio key="AudioBoom" src={ this._AudioBoomUrl} autoPlay={false} playsInline="true" ref={(ref) => { this._BoomAudio = ref; }} />
            </Fdiv>
        )
    }
}

export default Role;