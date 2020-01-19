/**
 * Created by luocf on 2019/12/3.
 */
import React, {Component} from 'react';
import AudioBgUrl from "./audio/bgMusic.mp3";


class RedPacket extends Component {
	constructor(props) {
		super(props);
		this._Index = 0;
		//随机生成列表
		this._RedImage = 'http://oss.image.qcast.cn/demo_images/red_packet_rain/red.png';
		this._BigRedImage = 'http://oss.image.qcast.cn/demo_images/red_packet_rain/bigred.png';
		this._BoomImage = 'http://oss.image.qcast.cn/demo_images/red_packet_rain/boom.png';
		this._ScoreBg = "http://oss.image.qcast.cn/demo_images/red_packet_rain/score_bg.png";
		this.state = {itemList: [], timer:60, score:0};
		this._onRainDown = props.onRainDown;
		this.addRandomItemList();
		this._TimerOutId = null;
		this._GameTimerID = null;
		this._IsRunning = false;
		this._Count = 0;
		this._AudioBgUrl = AudioBgUrl;
		this._BgAudio = null;
	}

	componentDidMount() {

		this.startGame();
		this.startTimer();
	}

	componentWillUnmount() {
		if (this._GameTimerID != null) {
			clearInterval(this._GameTimerID);
			this._GameTimerID = null;
		}

		if (this._TimerOutId != null){
			clearInterval(this._TimerOutId);
			this._TimerOutId=null;
		}
	}

	addRandomItemList() {
		let total_num = 1;
		let ret_obj ="";
		console.log("initRandomItemList total_num:" + total_num);
		for (let i = 0; i < total_num; i++) {
			let random_index = Math.floor(Math.random() * 3);
			let duration = 2 + Math.floor(Math.random() * 2) + "s";
			let index = ++this._Index;
			let left = 300+Math.floor(Math.random() * (1280-500));
			let top = 600;
			switch (random_index) {
				case 0:
					ret_obj = {key: index.toString(), type:0,src: this._RedImage, left: left, top:top,width: 87, height: 118, duration: duration
					};
					break;
				case 1:
					ret_obj = {key: index.toString(), type:1,src: this._BigRedImage, left: left, top:top,width: 210, height: 114, duration: duration
					};
					break;
				case 2:
					ret_obj = {key: index.toString(), type:2,src: this._BoomImage, left: left, top:top, width: 100, height: 116, duration: duration
					};
					break;
				default:
					break;
			}
			console.log("initRandomItemList ret_obj:",ret_obj);
			this.state.itemList.push(ret_obj);
		}
	}

	startTimer() {
		this._TimerOutId = setInterval(()=>{
			let timer = this.state.timer-1;
			this.setState({
				timer: timer
			});

			if (timer === 0) {
				this.stopGame();
			}
		}, 1000)
	}

	startGame() {
		if (this._BgAudio != null) {
			this._BgAudio.play();
		}
		this._IsRunning = true;
		this._Refresh();
	}

	stopGame() {
		this._IsRunning = false;
		this.setState({itemList:[]});
		if (this._TimerOutId != null){
			clearInterval(this._TimerOutId);
			this._TimerOutId=null;
		}
		if (this._onRainDown) {
			this._onRainDown(null);
		}
		if (this._BgAudio != null) {
			this._BgAudio.pause();
		}
	}

	_RemoveItem(key) {
		let itemList = this.state.itemList;
		for(let i=0; i<itemList.length;i++) {
			if (itemList[i].key === key) {
				let rain = itemList.splice(i,1);
				if (this._onRainDown) {
					this._onRainDown(rain[0]);
				}
				break;
			}
		}
	}

	_Refresh() {
		if (this._IsRunning === false) {
			return;
		}
		let delay = 500;//Math.floor(Math.random()*600);
		this._GameTimerID = setTimeout(()=>{
			if (this._IsRunning === true) {
				this.addRandomItemList();
				let itemList = this.state.itemList;
				this.setState({
					itemList: itemList
				});
				this._Refresh();
			}
		}, delay)
	}

	render() {
		const itemList = this.state.itemList;
		return (
			<div>
				<div key="timer" style={{'width': 140,'height': 140,
					backgroundImage: `url(${this._ScoreBg})`,'top': 40,'left': 40,'textAlign': "center",
					'lineHeight': '140px','color': "rgba(255,0,0,1.0)",'fontSize': 72}}>{this.state.timer}</div>
				{
					itemList.map((item) => {
						return (
							<div key={item.key} style={{backgroundImage:`url(${item.src})`, left: item.left, top:item.top, width: item.width,
								height: item.height, animation: "rainDown " + item.duration + " linear",
							}} onAnimationEnd={
								()=>{
									if (this._IsRunning === true) {
										this._RemoveItem(item.key);
									}

								}
							}/>
						)
					})
				}
				<audio key="AudioBg" src={ this._AudioBgUrl} autoPlay={false} playsInline={true} ref={(ref) => { this._BgAudio = ref; }} />
			</div>
		);
	}
}

export default RedPacket;