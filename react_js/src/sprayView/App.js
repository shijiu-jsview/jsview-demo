/*
 * @Author: ChenChanghua
 * @Date: 2020-06-01 10:14:08
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2020-06-18 16:37:47
 * @Description: file content
 */ 

import React from 'react';
import pointImg from './texture_32.png'
import JsvSpray from '../jsview-utils/JsViewReactWidget/JsvSpray'
import createStandaloneApp from "../demoCommon/StandaloneApp"
import { FocusBlock } from "../demoCommon/BlockDefine"
import './App.css'

class MainScene extends FocusBlock{
    constructor(props) {
        super(props);
        this._Count = 0;
        this.state = {
            count: this._Count
        }
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            if (this._NavigateHome) {
                this._NavigateHome();
            }
            return true;
        } else if (ev.keyCode == 13) {
            this._Count++;
            console.log("on ok");
            this.setState({
                count: this._Count
            });
        }
        return false;
    }
    
    renderContent() {
        let spray_style1 = {
            type:0,
            particleNum: 100,
            deltaAngle: 180,
            deltaWidth: 50,
            deltaHeight: 50,
            pointSizeMin: 20,
            pointSizeMax: 30,
            speedMin: 1,
            speedMax: 7,
            lifeMin: 1000,
            lifeMax: 2000,
            accelerateX: 0,
            accelerateY: 0,
            addNumSpeed: 0.001,
            enableFade: true,
            enableShrink: true
        }

        let spray_style2 = {
            type:1,
            particleNum: 100,
            deltaAngle: 0,
            deltaWidth: 0,
            deltaHeight: 50,
            pointSizeMin: 10,
            pointSizeMax: 20,
            speedMin: 5,
            speedMax: 10,
            lifeMin: 1000,
            lifeMax: 3000,
            accelerateX: 0,
            accelerateY: -100,
            addNumSpeed: 0.001,
            enableFade: true,
            enableShrink: false
        }

        let spray_style3 = {
            type:1,
            particleNum: 100,
            deltaAngle: 20,
            deltaWidth: 50,
            deltaHeight: 50,
            pointSizeMin: 10,
            pointSizeMax: 20,
            speedMin: 5,
            speedMax: 10,
            lifeMin: 1000,
            lifeMax: 3000,
            accelerateX: -50,
            accelerateY: -120,
            addNumSpeed: 0.001,
            enableFade: true,
            enableShrink: true
        }

        let spray_style4 = {
            type:1,
            particleNum: 200,
            deltaAngle: 20,
            deltaWidth: 20,
            deltaHeight: 20,
            pointSizeMin: 10,
            pointSizeMax: 20,
            speedMin: 0,
            speedMax: 0,
            lifeMin: 1000,
            lifeMax: 3000,
            accelerateX: 0,
            accelerateY: 0,
            addNumSpeed: 0.001,
            enableFade: true,
            enableShrink: true
        }
        return(
            <div style={{left: 0, top: 0, width: 1920, height: 1080, backgroundColor: "#334C4C"}}>
                <div style={{left: 200, top: 400, width: 100, height:100, backgroundColor: "#00FF00"}}>
                    {
                        this.state.count > 0 ? <JsvSpray key={this.state.count} pointRes={window.location.origin + pointImg} sprayStyle={spray_style1}/> : null
                    }
                    <div style={{left: 0, top: 110, width: 200, height: 30, color: "#00AA00", fontSize: "20px"}}>
                        按ok键显示爆炸效果
                    </div>
                </div>
                <div style={{left: 600, top: 400, width: 10, height:100, animation: "AnimRotate 3s linear infinite", backgroundColor: "#00FF00"}}>
                    <JsvSpray pointRes="rgba(0, 255, 0, 1)" sprayStyle={spray_style2}/>
                </div>
                <div style={{left: 1000, top: 400, width: 100, height:100, animation: "AnimTranslate 10s linear infinite", backgroundColor: "#00FF00"}}>
                    <JsvSpray pointRes={window.location.origin + pointImg} sprayStyle={spray_style3}/>
                </div>
                <div style={{left: 400, top: 20, width: 40, height:40, animation: "Cycle 3s linear infinite"}}>
                    <JsvSpray pointRes={window.location.origin + pointImg} sprayStyle={spray_style4}/>
                </div>
                <div style={{left: 400, top: 40, width: 500, height: 100, lineHeight: "100px", textAlign: "center", fontSize: "50px", color: "#FFFFFF"}}>
                    粒子效果
                </div>
            </div>
        );
    }
}
let App = createStandaloneApp(MainScene);

export {
    App,
    MainScene as SubApp
}