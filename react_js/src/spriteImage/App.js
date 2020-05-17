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
import sprite from './images/sprite.png'
import cat_run from './images/cat_run.png'
import createStandaloneApp from "../demoCommon/StandaloneApp"
import { FocusBlock } from "../demoCommon/BlockDefine"

let sprite_info = {
    "frames": [

        {
            "frame": { "x": 0, "y": 0, "w": 512, "h": 256 },
        },
        {
            "frame": { "x": 512, "y": 0, "w": 512, "h": 256 },
        },
        {
            "frame": { "x": 1024, "y": 0, "w": 512, "h": 256 },
        },
        {
            "frame": { "x": 1536, "y": 0, "w": 512, "h": 256 },
        },
        {
            "frame": { "x": 0, "y": 256, "w": 512, "h": 256 },
        },
        {
            "frame": { "x": 512, "y": 256, "w": 512, "h": 256 },
        },
        {
            "frame": { "x": 1024, "y": 256, "w": 512, "h": 256 },
        },
        {
            "frame": { "x": 1536, "y": 256, "w": 512, "h": 256 },
        }
    ],
    "meta": {
        "size": { "w": 2048, "h": 512 },
    }
}

let static_info = {
    "frames": [

        {
            "frame": { "x": 0, "y": 0, "w": 512, "h": 256 },
        }
    ],
    "meta": {
        "size": { "w": 2048, "h": 512 },
    }
}

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);

        this.state = {
            stop: false
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

    renderContent() {
        return (
            <div style={{top: 20, left: 20}}>
                <JsvSpriteImg
                    spriteInfo={sprite_info}
                    loop="infinite"
                    viewSize={{ w: 1024, h: 512 }}
                    duration={0.8}
                    onAnimEnd={function () { console.log("anim end") }}
                    stop={this.state.stop}
                    imageUrl={cat_run} />
                <div style={{left: 1050, top: 20}}>
                    <JsvSpriteImg
                        spriteInfo={static_info}
                        viewSize={{ w: 256, h: 128 }}
                        imageUrl={cat_run} />
                </div>
            </div>
        )

    }
}
let App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};
