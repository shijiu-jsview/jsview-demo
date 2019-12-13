import React from 'react';
import './App.css';
import Role from "./role"
import RedPacket from "./red_packet.js"
import {Router, Fdiv, FdivRoot} from "jsview-react"

class App extends React.Component{
	constructor(props) {
		super(props);
		this._Router = new Router();
		this.state = {rain:null}
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
	}
	onRainDown(rain) {
		this.setState({rain:rain});
	}

	render() {
		return (
			<FdivRoot style={{width: "1280px", height: "720px"}}>
				{/*preload image */}
				<div key="pre_KiMiNormalImg" style={{backgroundImage: `url(${this._KiMiNormalImg})`, width: 1, height: 1}}></div>
				<div key="pre_KiMiSmileImg" style={{backgroundImage: `url(${this._KiMiSmileImg})`, width: 1, height: 1}}></div>
				<div key="pre_KiMiBoomImg" style={{backgroundImage: `url(${this._KiMiBoomImg})`, width: 1, height: 1}}></div>
				<div key="pre_RedImage" style={{backgroundImage: `url(${this._RedImage})`, width: 1, height: 1}}></div>
				<div key="pre_BigRedImage" style={{backgroundImage: `url(${this._BigRedImage})`, width: 1, height: 1}}></div>
				<div key="pre_BoomImage" style={{backgroundImage: `url(${this._BoomImage})`, width: 1, height: 1}}></div>
				<div style={{backgroundImage: `url(${this._bgImage})`, width: "1280px", height: "720px"}}>

					<Fdiv router={this._Router}>
						<Role branchName="role" rain={this.state.rain}/>
					</Fdiv>
					<RedPacket onRainDown={(rain) => {
						this.onRainDown(rain)
					}}/>
				</div>
			</FdivRoot>
		)
	}

	componentDidMount() {
		this._Router.focus("role")
	}
}
export default App;
