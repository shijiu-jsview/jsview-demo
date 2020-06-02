/*
 * 【界面概述】
 * 展示精灵图的用法，包含动图和切图
 *
 * 【控件介绍】
 * JsvSpriteImg：精灵图控件
 *                  spriteInfo {object}  (必需)精灵图配置信息{frames:[], meta:{}}
 *                  viewSize {object}  (必需){w:0, h:0}
 *                  imageUrl {string}  (必需)图片地址
 *                  duration {float}  (动图必需)动图的时间
 *                  onAnimEnd {fucntion} 动图结束回调
 *                  stop {boolean} 停止动图，默认false
 *                  loop {string} 动图的循环次数 infinite/数字，默认为infinite
 *                  spriteName {string} 动图的名称，默认为null
 *   
 *
 * 【技巧说明】
 * Q: 动图和切图如何实现?
 * A: spriteInfo中的frame有多个时为动图，只有一个时为切图
 * 
 * Q: spriteInfo中属性的含义?
 * A: meta.size为整张切图的大小；frames中为每一帧的位置和大小信息，目前仅支持统一大小的帧
 */

import React from 'react';
import JsvSpriteImg from '../jsview-utils/JsViewReactWidget/JsvSpriteImg'
import createStandaloneApp from "../demoCommon/StandaloneApp"
import { FocusBlock } from "../demoCommon/BlockDefine"

// 从JSON中加载精灵图的配置，该配置文件由工具 https://www.codeandweb.com/texturepacker 生成
import spriteImage from './images/egg_break.png'
import config_json from "./images/egg_break.json"

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);

        this.state = {
            stop: false, // 配置动图还是静图
            show: true
        }
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            if (this._NavigateHome) {
                this._NavigateHome();
            }
            return true;
        }
        return false;
    }

    _formatInfo() {
        /*
         * "frames": [
         *      {
         *          "source": {"x": XXXX,"y": XXXX,"w": XXXX,"h": XXXX},
         *          "target": {"x": XXXX,"y": XXXX,"w": XXXX,"h": XXXX},
         *      },
         *      ...
         *  ],
         *  "meta": {
         *      "size": { "w": XXXX, "h": XXXX},
         *  }
         */

        let info = {
            frames:[],
            meta:{
                size: config_json.meta.size,
            }};

        let frames_ref = info.frames;

        for (let i = 0; i < config_json.frames.length; i++) {
            frames_ref.push({
                "target": config_json.frames[i].spriteSourceSize,
                "source": config_json.frames[i].frame,
            });
        }

        return info;
    }

    renderContent() {
        if (this.state.show) {
            // 展示精灵图
            let sprite_info = this._formatInfo();

            /* 精灵图绘图区域尺寸，格式: {w:XXXXX, h:XXXX} */
            let view_size = {
                w: config_json.frames[0].sourceSize.w,
                h: config_json.frames[0].sourceSize.h,
            };

            let that = this;
            return (<div style={{top: 20, left: 20}}>
                <JsvSpriteImg
                    spriteInfo={sprite_info}
                    loop={10}
                    viewSize={view_size}
                    duration={0.8}
                    onAnimEnd={function () { console.log("anim end");that.setState({show:false}) }}
                    stop={this.state.stop}
                    imageUrl={spriteImage} />
            </div>);
        } else {
            // 清理精灵图，用于验证精灵图清理后，StyleSheet中cssRules的keyFrame清理工作能正常完成
            return (<div/>);
        }
    }
}
let App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};
