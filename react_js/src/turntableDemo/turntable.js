import React from 'react';
import {globalHistory} from '../demoCommon/RouterHistory';
import {FocusBlock} from "../demoCommon/BlockDefine"

class Turntable extends FocusBlock{
    constructor(props) {
        super(props);
        this._PreviousRadian = "";
        this._OkUrl = 'http://111.32.138.57/cms/loong/prize/2019-10-25/0bffaf6b-95bd-42cb-b55e-1f8d2d2ed543.png';
        this._BgUrl = 'http://111.32.138.57/cms/loong/prize/2019-10-24/b390f264-d3da-4cf9-bfe0-1ed540c03d70.png'
        this.state = {
            awards: [
                {id: 1, name: '一等奖', level: '1', url:'http://111.32.138.57/cms/loong/prize/2019-10-24/1827a207-a384-4756-9cec-67f15edb80fb.png'},
                {id: 2, name: '五等奖', level: '2', url:'http://111.32.138.57/cms/loong/prize/2019-10-30/44b8a4b0-308c-404a-b1ac-d1c3396ecc59.png'},
                {id: 3, name: '二等奖', level: '3', url:'http://111.32.138.57/cms/loong/prize/2019-10-24/c1d880f3-60fe-42ec-8a6a-d6d58b48ce96.png'},
                {id: 4, name: '五等奖', level: '4', url:'http://111.32.138.57/cms/loong/prize/2019-10-30/44b8a4b0-308c-404a-b1ac-d1c3396ecc59.png'},
                {id: 5, name: '三等奖', level: '5', url:'http://111.32.138.57/cms/loong/prize/2019-10-24/8f649d79-d603-4a85-bada-feed5f8b48dd.png'},
                {id: 6, name: '五等奖', level: '6', url:'http://111.32.138.57/cms/loong/prize/2019-10-30/44b8a4b0-308c-404a-b1ac-d1c3396ecc59.png'},
                {id: 7, name: '四等奖', level: '7', url:'http://111.32.138.57/cms/loong/prize/2019-10-24/4c9b42ec-90e7-4010-9f03-8c4066c430a2.png'},
                {id: 8, name: '五等奖', level: '8', url:'http://111.32.138.57/cms/loong/prize/2019-10-30/44b8a4b0-308c-404a-b1ac-d1c3396ecc59.png'},
            ],//大转盘的奖品列表
            currentPrizeIndex:0,
            animation:null,
            contentVisible:"hidden",
            content: '',
        }
    }

    // 处理旋转的关键方法
    rotatePanel(distance) {
        let radian = distance;
        let animation_name = "rotate"+radian;
        let animation = animation_name +" 4s cubic-bezier(0,0.55,0.55,0.78)";
        this.state.radian = radian;

        const ballRunKeyframes = this.getkeyframes('rotate'+this._PreviousRadian);
        if (ballRunKeyframes != null) {
            ballRunKeyframes.styleSheet.deleteRule(ballRunKeyframes.index);
            const runkeyframes = ` @keyframes rotate${radian} {
                              from {
                                transform: rotate3d(0,0,1,0deg);
                              }
                              to {
                                transform: rotate3d(0,0,1,${radian}deg);
                              }
                            }`;
            if (ballRunKeyframes.styleSheet) {
                ballRunKeyframes.styleSheet.insertRule(runkeyframes, ballRunKeyframes.index);
            }
            this._PreviousRadian = radian;
        }

        this.setState({animation:animation});
    }

    distanceToStop() {
        let degrees = 0;
        let distance = 0;
        // 映射出每个奖品的degrees
        let awardsToDegreesList = this.state.awards.map((data, index) => {
            let awardRadian = 360 / this.state.awards.length;
            return awardRadian * index;
        });

        // 随机生成一个索引值，来表示此次抽奖应该中的奖品
        const currentPrizeIndex = Math.floor(Math.random() * this.state.awards.length);

        degrees = awardsToDegreesList[currentPrizeIndex];
        distance = 360-degrees;
        this.state.content = "当前奖品应该中的奖品是：" + this.state.awards[currentPrizeIndex].name;
        console.log(this.state.content+", currentPrizeIndex:"+currentPrizeIndex+", distance:"+(distance+ 360*8));
        // 这里额外加上后面的值，是为了让转盘多转动几圈
        return distance + 360*8;
    }

    getkeyframes(name) {
        var animation = null;
        // 获取所有的style
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; ++i) {
            const item = ss[i];
            if (item.cssRules[0] && item.cssRules[0].name && item.cssRules[0].name === name) {
                animation = {};
                animation.cssRule = item.cssRules[0];
                animation.styleSheet = ss[i];
                animation.index = 0;
            }
        }
        return animation;
    }
    getCoordByAngle(angle) {
        let radian =  (Math.PI/180.0)*angle;
        //以正北面为0度起点计算指定角度所对应的圆周上的点的坐标：
        let center = {
            x:371,//中心点为742/2
            y:371
        }
        let radius = 260;//内圆半径
        let x = center.x + Math.sin(radian)*radius;
        let y = center.y - Math.cos(radian)*radius;
        return {x:x, y:y};
    }

	onKeyDown(ev) {
    	console.log("ev", ev);
    	if (ev.keyCode === 13) {
            // 只要抽奖没有结束，就不让再次抽奖
            this.setState({contentVisible:"hidden"});

            const distance = this.distanceToStop();
            this.rotatePanel(distance);//调用处理旋转的方法

		} else if (ev.keyCode === 10000 || ev.keyCode === 27) {
            globalHistory.goBack();
            this.changeFocus("/main");
        }
        return true;
	}

	renderContent(){
		return (
			<div>
				<div style={{
                    transform: 'rotate3d(0,0,1,'+this.state.radian+'deg)',
                    animation: this.state.animation,
                    backgroundImage: `url(${this._BgUrl})`,
                    left:(1280-742)/2,
                    top:0,
                    width: 742,
                    height: 742
                }} onAnimationEnd={()=>{
                    this.setState({contentVisible:"visible"});
                }}>
				<div style={{position: 'absolute', top: -60, left: -60, width: 742, height: 742}}>,
						<div style={{transform: 'rotate3d(0,0,1,0deg)', backgroundImage: `url(${ this.state.awards[0].url })`, position: 'absolute', left: this.getCoordByAngle(0).x, top: this.getCoordByAngle(0).y, width: 120, height: 120}}></div>
						<div style={{transform: 'rotate3d(0,0,1,45deg)', backgroundImage: `url(${ this.state.awards[1].url })`, position: 'absolute', left: this.getCoordByAngle(45).x, top: this.getCoordByAngle(45).y, width: 120, height: 120}}></div>
						<div style={{transform: 'rotate3d(0,0,1,90deg)', backgroundImage: `url(${ this.state.awards[2].url })`, position: 'absolute', left: this.getCoordByAngle(90).x, top: this.getCoordByAngle(90).y, width: 120, height: 120}}></div>
						<div style={{transform: 'rotate3d(0,0,1,135deg)', backgroundImage: `url(${ this.state.awards[3].url })`, position: 'absolute', left: this.getCoordByAngle(135).x, top: this.getCoordByAngle(135).y, width: 120, height: 120}}></div>
						<div style={{transform: 'rotate3d(0,0,1,180deg)', backgroundImage: `url(${ this.state.awards[4].url })`, position: 'absolute', left: this.getCoordByAngle(180).x, top: this.getCoordByAngle(180).y, width: 120, height: 120}}></div>
						<div style={{transform: 'rotate3d(0,0,1,225deg)', backgroundImage: `url(${ this.state.awards[5].url })`, position: 'absolute', left: this.getCoordByAngle(225).x, top: this.getCoordByAngle(225).y, width: 120, height: 120}}></div>
						<div style={{transform: 'rotate3d(0,0,1,270deg)', backgroundImage: `url(${ this.state.awards[6].url })`, position: 'absolute', left: this.getCoordByAngle(270).x, top: this.getCoordByAngle(270).y, width: 120, height: 120}}></div>
						<div style={{transform: 'rotate3d(0,0,1,315deg)', backgroundImage: `url(${ this.state.awards[7].url })`, position: 'absolute', left: this.getCoordByAngle(315).x, top: this.getCoordByAngle(315).y, width: 120, height: 120}}></div>
					</div>
				</div>
                <div style={{backgroundImage: `url(${this._OkUrl})`, position: 'absolute', top: 200, left: (1280-180)/2, width: 180, height: 230
                }}/>
                <div style={{
                    visibility:this.state.contentVisible,
                    position: 'absolute',
                    top:(720-100)/2,
                    left:(1280-700)/2,
                    width: 700,
                    height: 100,
                    backgroundColor:"#bdbdbd",
                    textAlign:"center",
                    verticalAlign:"middle",
                    lineHeight:"100px",
                    color: "#fff753",
                    fontSize:40,
                }}>
                    {this.state.content}
                </div>
                <div style={{
                    position: 'absolute',
                    top: 660,
                    left: 900,
                    width: 240,
                    height: 100,
                    color: "#0916ff",
                    fontSize:20,
                }}>
                    按【OK】键或PC上的【Enter】键，启动抽奖
                </div>
			</div>
		)
	}
}

export default Turntable;