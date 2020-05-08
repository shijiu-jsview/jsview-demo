import React from 'react';
import './App.css';
import Score from "./score"
import RedPacket from "./red_packet.js"
import {JsvSpriteTranslate, TranslateControl} from "../jsview-utils/JsViewReactWidget/JsvSpriteTranslate"
import {globalHistory} from '../demoCommon/RouterHistory';
import {FocusBlock} from "../demoCommon/BlockDefine"
import AudioGetUrl from "./audio/get.mp3";
import AudioBoomUrl from "./audio/boom.mp3";
import AudioBgUrl from "./audio/bgMusic-1.mp3";

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
        this.score = 0;
        this._Audio = null;
        this._AudioBgUrl = AudioBgUrl;
        this._BgAudio = null;
        this._IsRunning = false;
        this.state = {
            kimi: this._KiMiNormalImg,
            score: this.score,
            min_score_image: null,
            add_score_image: null,
            scoreAddAnim: null,
            scoreMinAnim: null,
            moneyBag: null
        };

        this._ScoreAddAnimationEnd = this._ScoreAddAnimationEnd.bind(this);
        this._ScoreMinAnimationEnd = this._ScoreMinAnimationEnd.bind(this);

        this._TranslateControl = new TranslateControl();
        this._TranslateControl.speed(400);
    }

    _onImpactTracer(rain) {
        if (rain !== null && rain !== this._CurrentRain) {
            this._CurrentRain = rain;
            console.log("_onImpactTracer rain:", rain);

            let kimi = this._KiMiNormalImg;
            let add_score_anim = null;
            let min_score_anim = null;
            let add_score_image = this._ScoreAdd1;
            let min_score_image = this._ScoreMin1;
            switch (rain.type) {
                case 0:
                    add_score_anim = "scoreUp 0.2s";
                    kimi = this._KiMiNormalImg;
                    add_score_image = this._ScoreAdd1;
                    this.score += 1;
                    if (this._Audio) {
                        this._Audio.src = this._AudioGetUrl;
                        this._Audio.play();
                    }
                    break;
                case 1:
                    add_score_anim = "scoreUp 0.2s";
                    kimi = this._KiMiSmileImg;
                    add_score_image = this._ScoreAdd5;
                    if (this._Audio) {
                        this._Audio.src = this._AudioGetUrl;
                        this._Audio.play();
                    }
                    this.score += 5;
                    break;
                case 2:
                    min_score_anim = "scoreUp 0.2s";
                    min_score_image = "block";
                    min_score_image = this._ScoreMin1;
                    kimi = this._KiMiBoomImg;
                    this.score -= 1;
                    if (this.score < 0) {
                        this.score = 0;
                    }
                    if (this._Audio) {
                        this._Audio.src = this._AudioBoomUrl;
                        this._Audio.play();
                    }
                    break;
            }

            this.setState({
                kimi: kimi,
                score: this.score,
                scoreAddAnim: add_score_anim,
                scoreMinAnim: min_score_anim,
                min_score_image: min_score_image,
                add_score_image: add_score_image
            });
        }
    }

    onKeyUp(ev) {
        console.log("onKeyUp in : ", ev);
        if (ev.keyCode === 37 || ev.keyCode === 39) {
            this._IsRunning = false;
            this._TranslateControl.pause((x,y)=>{
                console.log("_TranslateControl pause x:"+x);

            });
            return true;
        }

        return false;
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            globalHistory.goBack();
            this.changeFocus("/main");
        } else if (ev.keyCode === 37) {
            console.log(" ev.keyCode === 37 !this.state.moveAnim ");
            if (!this._IsRunning ) {
                this._TranslateControl.targetX(0).start();
                this._IsRunning = true;
            }

        } else if (ev.keyCode === 39) {
            console.log(" ev.keyCode === 39 !this.state.moveAnim ");
            if (!this._IsRunning) {
                this._TranslateControl.targetX(1280 - 220 - 194).start();
                this._IsRunning = true;
            }
        }
        return true;
    }

    _ScoreAddAnimationEnd(event) {
        event.stopPropagation();
        this.setState({
            scoreAddAnim: null,
        });
        console.log(" _ScoreAddAnimationEnd event:", event);

    }

    _ScoreMinAnimationEnd(event) {
        event.stopPropagation();
        this.setState({
            scoreMinAnim: null,
        });
        console.log(" _ScoreMinAnimationEnd event:", event);
    }

    _InitMoneyBag(ele) {
        if (this.state.moneyBag === null) {
            this.setState({moneyBag:ele});
        }
    }

    renderContent() {
        return (
            <div style={{width: "1280px", height: "720px"}}>
                {/*preload image */}
                <div key="pre_KiMiNormalImg"
                     style={{backgroundImage: `url(${this._KiMiNormalImg})`, width: 1, height: 1}}></div>
                <div key="pre_KiMiSmileImg"
                     style={{backgroundImage: `url(${this._KiMiSmileImg})`, width: 1, height: 1}}></div>
                <div key="pre_KiMiBoomImg"
                     style={{backgroundImage: `url(${this._KiMiBoomImg})`, width: 1, height: 1}}></div>
                <div key="pre_RedImage" style={{backgroundImage: `url(${this._RedImage})`, width: 1, height: 1}}></div>
                <div key="pre_BigRedImage"
                     style={{backgroundImage: `url(${this._BigRedImage})`, width: 1, height: 1}}></div>
                <div key="pre_BoomImage"
                     style={{backgroundImage: `url(${this._BoomImage})`, width: 1, height: 1}}></div>

                <div style={{backgroundImage: `url(${this._bgImage})`, width: "1280px", height: "720px"}}>
                    <Score branchName={ (this.props.branchName ? this.props.branchName : "") + "/score" } score={this.state.score}/>
                    <JsvSpriteTranslate key="JsvSpriteTranslate" style={{
                        top: 476,
                        left: 220,
                        width: 194,
                        height: 244,
                    }} control={this._TranslateControl}>
                        <div key="kimi" style={{
                            top: 0,
                            left: 0,
                            width: 194,
                            height: 244,
                            backgroundImage: `url(${this.state.kimi})`,
                        }}>
                            <div key="MoneyBag" ref={ele => this._InitMoneyBag(ele)} style={{
                                top: 22,
                                left: 7,
                                width: 180,
                                height: 100,
                                backgroundColor: "rgba(0,0,0,0.8)"
                            }}></div>
                            {
                                this.state.min_score_visible !== "none" ?
                                    <div style={{
                                        top: 0,
                                        left: 40,
                                        width: 81,
                                        height: 74,
                                        visibility: this.state.scoreMinAnim != null ? "visible" : "hidden",
                                        backgroundImage: `url(${this.state.min_score_image})`,
                                        animation: this.state.scoreMinAnim,
                                    }} onAnimationEnd={this._ScoreMinAnimationEnd}/> : null
                            }
                            {
                                this.state.add_score_visible !== "none" ?
                                    <div style={{
                                        top: 0,
                                        left: 40,
                                        width: 81,
                                        height: 74,
                                        visibility: this.state.scoreAddAnim != null ? "visible" : "hidden",
                                        backgroundImage: `url(${this.state.add_score_image})`,
                                        animation: this.state.scoreAddAnim,
                                    }} onAnimationEnd={this._ScoreAddAnimationEnd}/> : null
                            }
                        </div>
                    </JsvSpriteTranslate>

                    {
                        <RedPacket MoneyBag={this.state.moneyBag} onImpactTracer={(rain) => {
                            this._onImpactTracer(rain)
                        }}/>
                    }
                </div>

                <audio key="AudioBg" src={ this._AudioBgUrl} ref={(ref) => {
                    this._BgAudio = ref;
                }}/>
                <audio ref={(ref) => {
                    this._Audio = ref;
                }}/>
            </div>
        )
    }

    componentDidMount() {
        console.log("giftRain App componentDidMount in");
        if (this._BgAudio != null) {
            this._BgAudio.play();
        }
        window.BgAudio = this._BgAudio;
        let focus_name = this.props.branchName ? this.props.branchName : "";
        this.changeFocus(focus_name + "/score")
    }

    componentWillUnmount() {
        console.log("giftRain App componentWillUnmount in");
    }
}
export default App;
