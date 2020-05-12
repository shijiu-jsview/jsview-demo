import React from 'react';

import {FocusBlock} from "../demoCommon/BlockDefine"

class Score extends FocusBlock{
    constructor(props) {
        super(props);
        this.score_height = 0;
    }

	onKeyUp(ev) {
		return false;
	}

    onKeyDown(ev) {

        return false;
    }

    renderContent() {
        console.log("Score render");
	    let score = this.props.score;
        this.score_height = (score *400/ 200);
	    if (this.score_height > 400) {
		    this.score_height = 400;
	    }
	    let process_top = 400-this.score_height;
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
	            }}>{"分数:"+score}</div>
            </div>
        )
    }

    componentDidMount() {
        console.log("Score componentDidMount in");

    }
    componentWillUnmount() {
        console.log("Score componentWillUnmount in");
    }
}

export default Score;