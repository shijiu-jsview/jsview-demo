/*
 * 【界面概述】
 * 展示transition, rotate, scale, skew四种动画下的碰撞检测
 *
 * 【控件介绍】
 * createImpactTracer：创建碰撞检测对象
 *                          @params {object} 第一个碰撞div
 *                          @params {object} 第二个碰撞div
 *                          @params {object} 回调对象，由createImpactCallback生成
 * createImpactCallback：创建碰撞回调对象
 *                          @params onContact {function} 碰撞回调
 *                          @params onDisContact {function} 碰撞结束回调
 *
 * 【技巧说明】
 */

import React from 'react';
import { createImpactTracer, createImpactCallback } from "../jsview-utils/jsview-react/index_widget.js"
import './App.css'
import {globalHistory} from '../demoCommon/RouterHistory';
import {FocusBlock} from "../demoCommon/BlockDefine"

class App extends FocusBlock{
    constructor(props) {
        super(props);
        this._TranslateEle1;
        this._TranslateEle2;
        
        this._RotateEle1;
        this._RotateEle2;
        
        this._ScaleEle1;
        this._ScaleEle2;
        
        this._SkewEle1;
        this._SkewEle2;

        this.state = {
            "tLeftColor": "#FF0000",
            "tRightColor": "#00FF00",
            "rLeftColor": "#FF0000",
            "rRightColor": "#00FF00",
            "sLeftColor": "#FF0000",
            "sRightColor": "#00FF00",
            "skLeftColor": "#FF0000",
            "skRightColor": "#00FF00"
        }
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            globalHistory.goBack();
            this.changeFocus("/main");
            return true;
        }
        return false;
    }

    renderContent() {
        return(
            <div>
                <div style={{top: 100, left: 100}}>
                    <div ref={ele => this._TranslateEle1 = ele} style={{left: 0, width: 100, height: 100, backgroundColor: this.state.tLeftColor, animation: "toRight 5s"}}>
                        view1
                    </div>
	                <div style={{left: 300}}>
	                    <div ref={ele => this._TranslateEle2 = ele} style={{width: 100, height: 100, backgroundColor: this.state.tRightColor, animation: "toLeft 5s"}}>
	                        view2
	                    </div>
		            </div>
                </div>

                <div style={{top: 400, left: 100}}>
                    <div ref={ele => this._RotateEle1 = ele} style={{left: 100, width: 20, height: 150, backgroundColor: this.state.rLeftColor, animation: "rotate1 5s"}}>
                        view1
                    </div>
                    <div ref={ele => this._RotateEle2 = ele} style={{left: 200, width: 20, height: 150, backgroundColor: this.state.rRightColor, animation: "rotate2 5s"}}>
                        view2
                    </div>
                </div>

                <div style={{top: 100, left: 500}}>
                    <div ref={ele => this._ScaleEle1 = ele} style={{left: 100, width: 100, height: 100, backgroundColor: this.state.sLeftColor, animation: "scale1 5s"}}>
                        view1
                    </div>
                    <div ref={ele => this._ScaleEle2 = ele} style={{left: 250, width: 100, height: 100, backgroundColor: this.state.sRightColor, animation: "scale2 5s"}}>
                        view2
                    </div>
                </div>

                <div style={{top: 400, left: 500}}>
                    <div ref={ele => this._SkewEle1 = ele} style={{left: 100, width: 100, height: 100, backgroundColor: this.state.skLeftColor, animation: "skew1 5s"}}>
                        view1
                    </div>
                    <div ref={ele => this._SkewEle2 = ele} style={{left: 300, width: 100, height: 100, backgroundColor: this.state.skRightColor, animation: "skew2 5s"}}>
                        view2
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {       
        let translate_sensor = createImpactTracer(this._TranslateEle1, this._TranslateEle2,
            createImpactCallback(
                () => {
                    this.setState({
                        "tLeftColor": "#00FFFF",
                        "tRightColor": "#FFFF00"
                    })
                },
                () => {
                    translate_sensor.Recycle();
                    this.setState({
                        "tLeftColor": "#FF0000",
                        "tRightColor": "#00FF00"
                    })
                }
            )
        );

        let rotate_count = {count:0};
        let rotate_sensor = createImpactTracer(this._RotateEle1, this._RotateEle2,
            createImpactCallback(
                () => {
                    this.setState({
                        "rLeftColor": "#00FFFF",
                        "rRightColor": "#FFFF00"
                    })
                },
                () => {
                    rotate_count.count++;
                    if (rotate_count.count >= 2) {
                        // 旋转有头尾连续两次碰撞
                        rotate_sensor.Recycle();
                    }
                    this.setState({
                        "rLeftColor": "#FF0000",
                        "rRightColor": "#00FF00"
                    })
                }
            )
        );

        let scale_sensor = createImpactTracer(this._ScaleEle1, this._ScaleEle2, createImpactCallback(
            () => {
                this.setState({
                    "sLeftColor": "#00FFFF",
                    "sRightColor": "#FFFF00"
                })
            },
            () => {
                scale_sensor.Recycle();
                this.setState({
                    "sLeftColor": "#FF0000",
                    "sRightColor": "#00FF00"
                })
            })
        );

        let skew_sensor = createImpactTracer(this._SkewEle1, this._SkewEle2, createImpactCallback(
            () => {
                this.setState({
                    "skLeftColor": "#00FFFF",
                    "skRightColor": "#FFFF00"
                })
            },
            () => {
                skew_sensor.Recycle();
                this.setState({
                    "skLeftColor": "#FF0000",
                    "skRightColor": "#00FF00"
                })
            })
        );
    }
}

export default App;