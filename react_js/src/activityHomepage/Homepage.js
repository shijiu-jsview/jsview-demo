/*
 * @Author: ChenChanghua
 * @Date: 2020-04-13 17:00:41
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2020-04-16 13:52:32
 * @Description: file content
 */
import React from 'react';
import {FdivWrapper, SimpleWidget, HORIZONTAL, VERTICAL} from "../jsview-utils/jsview-react/index_widget.js"
import {globalHistory} from '../demoCommon/RouterHistory';
import "./homepage.css"
import shadow_big_img from "./images/shadow_big.png"
import shadow_small_img from "./images/shadow_small.png"
const PingPongBg = ({animation, background, preBackground, animationEnd}) => {
    if (preBackground) {
        return (<div>
            <div style={{width: 1280, height: 480, backgroundImage: `url(${preBackground})`}}/>
            <div style={{width: 1280, height: 480, backgroundImage: `url(${background})`, animation: animation}} onAnimationEnd={animationEnd}/>
        </div>)
    } else {
        return (<div>
            <div style={{width: 1280, height: 480, backgroundImage: `url(${background})`, animation: animation}} onAnimationEnd={animationEnd}/>
        </div>)
    }
}

class Home extends FdivWrapper {
	constructor(prop) {
        super(prop);
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._RenderBlur = this._RenderBlur.bind(this);
        this._onWidgetMount = this._onWidgetMount.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onItemFocus = this._onItemFocus.bind(this);
        this._onItemBlur = this._onItemBlur.bind(this);
        this._BgInAnimationEnd = this._BgInAnimationEnd.bind(this);
        this.ItemWidth = parseInt(1280/this.props.data.length);
        this.ItemHeight = 240;
        this.state = {
            preBackground:null,
            background:null,
            bgAnimation:null,
            scaleAnim:null,
            blurScaleAnim:null,
            pingPongToken:0,
        }
	}

    _BgInAnimationEnd() {
        //nothing to do
    }

    _onItemBlur(item) {
        this._preBackground = item.background;
    }

    _onItemFocus(item) {
	    console.log("_onItemFocus item:", item);
	    let pingpong_token = this.state.pingPongToken;
	    let animation = "bgInOpacity"+(pingpong_token)+" 0.5s";
	    let scale_animation = "itemScale 0.2s";
        let blur_scale_animation = "itemBlurScale 0.2s";
	    if (++pingpong_token > 1) {
            pingpong_token = 0;
        }

	    this.setState({background:item.background, bgAnimation:animation,
            scaleAnim:scale_animation, blurScaleAnim:blur_scale_animation,pingPongToken:pingpong_token})
    }

    _onClick(item) {
        console.log(globalHistory)
        globalHistory.push(item.path);
        this.changeFocus(item.path, true); // 若子节点已经focus，则不改变focus状态
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(this.ItemWidth, this.ItemHeight, true, false);
    }

    _RenderFocus(item) {
        return (
            <div>
                <div style={{left: (this.ItemWidth - 248) / 2, top: 27,width: 248, height: 150,animation:this.state.scaleAnim}}>
                    <div style={{left: (248-317)/2, top: 0, width: 317, height: 219, backgroundImage: `url(${shadow_big_img})`}}/>
                    <div style={{left: 0, top: 4, width: 248, height: 150, borderRadius:4, backgroundImage: `url(${item.icon})`}}/>
                </div>
                <div style={{left: (this.ItemWidth - 248) / 2, top: 185, width: 248, height: 34,
                    lineHeight: 34, fontSize:24, verticalAlign: "middle", textAlign: "center", color: "#ffffff"
                }}>{item.name}</div>
            </div>
        )
    }

    _RenderItem(item) {
        return (
            <div >
                <div style={{left: (this.ItemWidth - 208) / 2, top: (this.ItemHeight - 130) / 2, width: 208, height: 130,
                    backgroundImage: `url(${shadow_small_img})`}}/>
                <div style={{left: (this.ItemWidth - 202) / 2, top: (this.ItemHeight - 120) / 2, width: 202, height: 120,
                        borderRadius:4, backgroundImage: `url(${item.icon})`}}/>
            </div>
        )
    }

    _RenderBlur(item) {
        return (
            <div>
                <div style={{left: (this.ItemWidth - 202) / 2, top: (this.ItemHeight - 120) / 2,width: 202, height: 120,
                    animation:this.state.blurScaleAnim}}>
                <div style={{left: (202 - 208) / 2, top: (120 - 130) / 2, width: 208, height: 130,
                        backgroundImage: `url(${shadow_small_img})`}}/>
                <div style={{left: 0, top: 0, width: 202, height: 120,
                        borderRadius:4, backgroundImage: `url(${item.icon})`}}/>
                </div>
            </div>
        )
    }

    _onWidgetMount() {
        //
    }

	// 直接集成自FdivWrapper的场合，使用renderContent而不是render进行布局
	renderContent() {
        return (
            <div style={{left:0,top:0}}>
                <PingPongBg preBackground={this._preBackground} background={this.state.background}
                            animation={this.state.bgAnimation} animationEnd={this._BgInAnimationEnd}/>
                <div style={{top: 480, left: 0, width:1280,height:this.ItemHeight, backgroundColor:"#D2DCE0"}}>
                    <SimpleWidget
                        width={ 1280 }
                        height={ this.ItemHeight }
                        direction={ HORIZONTAL }
                        data={ this.props.data }
                        onItemFocus = {this._onItemFocus}
                        onItemBlur = {this._onItemBlur}
                        renderItem={ this._RenderItem }
                        renderFocus={ this._RenderFocus }
                        renderBlur={ this._RenderBlur }
                        onClick={ this._onClick }
                        measures={ this._Measures }
                        padding={{top: 0, left: 0}}
                        branchName={ "home_page" }
                        onWidgetMount={ this._onWidgetMount }
                    />
                </div>
            </div>
        )
	}

	onKeyDown(ev) {
		return false;
	}

	onKeyUp(ev) {
		return false;
	}

	onDispatchKeyDown(ev) {
		return false;
	}

	onDispatchKeyUp(ev) {
		return false;
	}

	onFocus() {
        this.changeFocus("home_page")
	}

	onBlur() {
        this._preBackground = null;
	}
}

export default Home;