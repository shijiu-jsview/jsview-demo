import React from 'react';
import {Fdiv} from "jsview-react"

class Turntable extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
			aaa : "",
        }
		this._onKeyDown = this._onKeyDown.bind(this);
		this.aaa = "App-logo-spin 1s linear 1.5";
		this._agImage = 'http://111.32.138.57/cms/loong/prize/2019-10-24/b390f264-d3da-4cf9-bfe0-1ed540c03d70.png';
		this.PrizeA = 'http://111.32.138.57/cms/loong/prize/2019-10-24/1827a207-a384-4756-9cec-67f15edb80fb.png';
		this.PrizeB ='http://111.32.138.57/cms/loong/prize/2019-10-30/44b8a4b0-308c-404a-b1ac-d1c3396ecc59.png';
		this.PrizeC ='http://111.32.138.57/cms/loong/prize/2019-10-24/c1d880f3-60fe-42ec-8a6a-d6d58b48ce96.png';
		this.PrizeD ='http://111.32.138.57/cms/loong/prize/2019-10-24/8f649d79-d603-4a85-bada-feed5f8b48dd.png';
		this.PrizeE ='http://111.32.138.57/cms/loong/prize/2019-10-24/4c9b42ec-90e7-4010-9f03-8c4066c430a2.png';
		this.PrizeF ='http://111.32.138.57/cms/loong/prize/2019-12-25/7ddcddfe-fd31-47d2-a2a2-e16aa049d5e4.png';
		this.indicator = 'http://111.32.138.57/cms/loong/prize/2019-10-25/0bffaf6b-95bd-42cb-b55e-1f8d2d2ed543.png';
    }

	_onKeyDown(ev) {
		this.aaa = "App-logo-spin 1s linear 1.5";
		let x = "App-logo-spin 1s linear 1.5";
		this.setState({aaa: x})
	}
	
	render(){
		return (
			<Fdiv onKeyDown={this._onKeyDown} branchName={this.props.branchName}>
				<div style={{animation:this.state.aaa,WebkitAnimation:this.state.aaa,backgroundImage: `url(${this._agImage})`,width: "740px", height: "740px"}}>
					<div style={{ position: 'absolute',top:"140px",left:"150px",width: "444px",height:"444px"}}>,
						<div style={{transform:'rotate3d(0,0,1,0deg)',backgroundImage: `url(${this.PrizeA})`, position: 'absolute',top:"-70px",left:"165px",width: "120px",height:"120px"}}></div>
						<div style={{transform:'rotate3d(0,0,1,30deg)',backgroundImage: `url(${this.PrizeB})`, position: 'absolute',top:"-30px",left:"310px",width: "120px",height:"120px"}}></div>
						<div style={{transform:'rotate3d(0,0,1,70deg)',backgroundImage: `url(${this.PrizeC})`, position: 'absolute',top:"120px",left:"390px",width: "120px",height:"120px"}}></div>
						<div style={{transform:'rotate3d(0,0,1,110deg)',backgroundImage: `url(${this.PrizeB})`, position: 'absolute',top:"260px",left:"370px",width: "120px",height:"120px"}}></div>
						<div style={{transform:'rotate3d(0,0,1,130deg)',backgroundImage: `url(${this.PrizeD})`, position: 'absolute',top:"370px",left:"290px",width: "120px",height:"120px"}}></div>
						<div style={{transform:'rotate3d(0,0,1,180deg)',backgroundImage: `url(${this.PrizeB})`, position: 'absolute',top:"410px",left:"165px",width: "120px",height:"120px"}}></div>
						<div style={{transform:'rotate3d(0,0,1,220deg)',backgroundImage: `url(${this.PrizeE})`, position: 'absolute',top:"360px",left:"30px",width: "120px",height:"120px"}}></div>
						<div style={{transform:'rotate3d(0,0,1,250deg)',backgroundImage: `url(${this.PrizeB})`, position: 'absolute',top:"240px",left:"-50px",width: "120px",height:"120px"}}></div>
						<div style={{transform:'rotate3d(0,0,1,280deg)',backgroundImage: `url(${this.PrizeF})`, position: 'absolute',top:"90px",left:"-50px",width: "120px",height:"120px"}}></div>
						<div style={{transform:'rotate3d(0,0,1,310deg)',backgroundImage: `url(${this.PrizeB})`, position: 'absolute',top:"-30px",left:"20px",width: "120px",height:"120px"}}></div>
					</div>
				</div>	
				<div style={{backgroundImage: `url(${this.indicator})`, position: 'absolute',top:"230px",left:"276px",width: "180px",height:"230px"}}></div>
			</Fdiv>
		)
	}
}

export default Turntable;