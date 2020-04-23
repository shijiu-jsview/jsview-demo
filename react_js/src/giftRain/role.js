import React from 'react';

import {FocusBlock} from "../demoCommon/BlockDefine"

class Role extends FocusBlock{
    constructor(props) {
        super(props);
	    this._KiMiNormalImg = "http://oss.image.qcast.cn/demo_images/red_packet_rain/kimi_normal.png";
	    this._KiMiBoomImg = "http://oss.image.qcast.cn/demo_images/red_packet_rain/kimi_boom.png";
	    this._KiMiSmileImg = "http://oss.image.qcast.cn/demo_images/red_packet_rain/kimi_smile.png";
	    this._ScoreAdd1 = "http://oss.image.qcast.cn/demo_images/red_packet_rain/add1.png";
	    this._ScoreAdd5 = "http://oss.image.qcast.cn/demo_images/red_packet_rain/add5.png";
	    this._ScoreMin1 = "http://oss.image.qcast.cn/demo_images/red_packet_rain/min1.png";
        this.score_height = 0;
    }

	onKeyUp(ev) {
		return false;
	}

    onKeyDown(ev) {

        return false;
    }

    renderContent() {
        console.log("role render");
	    let raininfo = this.props.raininfo;
	    if (!raininfo) {
	    	return null;
		}

	    let x = this.props.x;
        this.score_height = (raininfo.score *400/ 200);
	    if (this.score_height > 400) {
		    this.score_height = 400;
	    }
	    let kimi = raininfo.kimi;
	    let process_top = 400-this.score_height;
	    console.log("process_top:", process_top);
        return (
            <div>
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
	            }}>{"分数:"+raininfo.score}</div>

                <img key="kimi" src={kimi} style={{top: 476, left: x, width: 194, height: 244}}/>
                {
                    raininfo.min_score_visible !== "none"?<img key="scoreMin" src={raininfo.min_score_image} style={{
		                top: 376,
		                left: x + 40,
		                width: 81,
		                height: 74,
		                display: raininfo.min_score_visible
	                }} />:null
                }
                {
                    raininfo.add_score_visible !== "none" ?  <img key="scoreAdd" src={raininfo.add_score_image} style={{
		                top: 376,
		                left: x + 40,
		                width: 81,
		                height: 74,
		                display:raininfo.add_score_visible
	                }}/>:null
                }

            </div>
        )
    }

    componentDidMount() {
        console.log("Role componentDidMount in");

    }
    componentWillUnmount() {
        console.log("Role componentWillUnmount in");
    }
}

export default Role;