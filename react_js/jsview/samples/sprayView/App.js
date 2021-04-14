/*
 * 【界面概述】
 * 展示精灵图的用法，包含动图和切图
 *
 * 【控件介绍】
 * JsvSpray：粒子控件
 *                  pointRes {string} (必需)粒子图案 可选值: 绝对路径url|url(相对路径url)|#FFFFFF|rbga(255,0,0,1.0)
 *                  sprayStyle {object}  (必需)粒子效果配置
 * sprayStyle
 *      type {int} (必需)喷射类型 0: 一次喷射 1: 持续喷射
 *      particleNum {int} (必需)粒子个数
 *      deltaAngle {int} (必需)粒子喷射角度范围。如设30则粒子喷射范围为div上边法向正负30度
 *      deltaWidth {int} (必需)粒子喷射位置宽度范围
 *      deltaHeight {int} (必需)粒子喷射位置高度范围
 *      pointSizeMin {int} (必需)粒子尺寸下限(像素)
 *      pointSizeMax {int} (必需)粒子尺寸上限(像素)
 *      speedMin {float} (必需)粒子速度下限
 *      speedMax {float} (必需)粒子速度上限
 *      lifeMin {int} (必需)粒子生命周期下限(ms)
 *      lifeMax {int} (必需)粒子生命周期上限(ms)
 *      accelerateX {float} (必需)水平方向加速度
 *      accelerateY {float} (必需)垂直方向加速度
 *      addNumSpeed {float} 持续喷射时，起始粒子添加速度(个/ms), 默认为0.001
 *      enableFade {boolean} 粒子淡出开关, 默认为false
 *      enableShrink {boolean} 粒子缩小开关, 默认为false
 *
 * 【技巧说明】
 * Q: 具体参数如何配置?
 * A: sprayStyle的数值并不直观，需要在示例中调整参数来获得理想效果
 */

import React from 'react';
import pointImg from './texture_32.png';
import JsvSpray from '../jsview-utils/JsViewReactWidget/JsvSpray';
import createStandaloneApp from "../jsview-utils/JsViewReactTools/StandaloneApp";
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";
import './App.css';

class MainScene extends FocusBlock {
  constructor(props) {
    super(props);
    this._Count = 0;
    this.state = {
      count: this._Count
    };
  }

  onKeyDown(ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      if (this._NavigateHome) {
        this._NavigateHome();
      }
      return true;
    } if (ev.keyCode === 13) {
      this._Count++;
      console.log("on ok");
      this.setState({
        count: this._Count
      });
    }
    return false;
  }

  renderContent() {
    const spray_style1 = {
      type: 0,
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
    };

    const spray_style2 = {
      type: 1,
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
    };

    const spray_style3 = {
      type: 1,
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
    };

    const spray_style4 = {
      type: 1,
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
      enableShrink: false
    };
    return (
            <div style={{ left: 0, top: 0, width: 1920, height: 1080, backgroundColor: "#334C4C" }}>
                <div style={{ left: 200, top: 400, width: 100, height: 100, backgroundColor: "#00FF00" }}>
                    {
                        this.state.count > 0 ? <JsvSpray key={this.state.count} pointRes={`url(${pointImg})`} sprayStyle={spray_style1}/> : null
                    }
                    <div style={{ left: 0, top: 110, width: 200, height: 30, color: "#00AA00", fontSize: "20px" }}>
                        按ok键显示爆炸效果
                    </div>
                </div>
                <div style={{ left: 600, top: 400, width: 10, height: 100, animation: "SprayAnimRotate 3s linear infinite", backgroundColor: "#00FF00" }}>
                    <JsvSpray pointRes="rgba(0, 255, 0, 1)" sprayStyle={spray_style2}/>
                </div>
                <div style={{ left: 1000, top: 400, width: 100, height: 100, animation: "SprayAnimTranslate 10s linear infinite", backgroundColor: "#00FF00" }}>
                    <JsvSpray pointRes={`url(${pointImg})`} sprayStyle={spray_style3}/>
                </div>
                <div style={{ left: 400, top: 20, width: 40, height: 40, animation: "SprayCycle 3s linear infinite" }}>
                    <JsvSpray pointRes={`url(${pointImg})`} sprayStyle={spray_style4}/>
                </div>
                <div style={{ left: 400, top: 40, width: 500, height: 100, lineHeight: "100px", textAlign: "center", fontSize: "50px", color: "#FFFFFF" }}>
                    粒子效果
                </div>
            </div>
    );
  }
}
const App = createStandaloneApp(MainScene);

export {
  App,
  MainScene as SubApp
};
