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
 *                  loop {string} 动图的循环次数 infinite/数字，默认为infinite
 *                  spriteName {string} 动图的名称，默认为null
 *                  autostart{boolean} 是否自动播放动图
 *                  controller {SpriteController} 控制动图的对象
 *                      stop(end_frame) 停止动画 end_frame: "start", "end"
 *                      start() 开始动画
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
import {JsvSpriteAnim, SpriteController} from '../jsview-utils/JsViewReactWidget/JsvSpriteAnim'
import createStandaloneApp from "../demoCommon/StandaloneApp"
import { FocusBlock } from "../demoCommon/BlockDefine"

// 从JSON中加载精灵图的配置，该配置文件由工具 https://www.codeandweb.com/texturepacker 生成
import spriteImage from './images/egg_break.png'
import config_json from "./images/egg_break.json"

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);
        this._Controller = new SpriteController();

        this.state = {
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
        let max_width = 0;
        let max_height = 0;

        for (let i = 0; i < config_json.frames.length; i++) {
            let target = config_json.frames[i].spriteSourceSize;
            frames_ref.push({
                "target": target,
                "source": config_json.frames[i].frame,
            });
            let sprite_with = target.x + target.w;
            let sprite_height = target.y + target.h;
            if (sprite_with > max_width) {
                max_width = sprite_with;
            }
            if (sprite_height > max_height) {
                max_height = sprite_height;
            }
        }

        return {info:info, maxW:max_width, maxH:max_height };
    }

    renderContent() {
        // 展示精灵图
        let sprite_info = this._formatInfo();

        /* 精灵图绘图区域尺寸，格式: {w:XXXXX, h:XXXX} */
        let view_size = {
            w: sprite_info.maxW,
            h: sprite_info.maxH
        };

        let that = this;
        return (<div>

            <div style={{
                textAlign: "center",
                fontSize: "30px",
                lineHeight: "50px",
                color: "#ffffff",
                left: 200,
                top: 100,
                width: 434,
                height: 50,
                backgroundColor: "rgba(27,38,151,0.8)"
            }}>{`精灵图效果`}</div>
            {   //通过show进行 清理精灵图，用于验证精灵图清理后，StyleSheet中cssRules的keyFrame清理工作能正常完成
                this.state.show ?
                <div style={{ left: 200, top: 150, transform: "scale3d(2.5, 2.5, 1)" }}>
                <JsvSpriteAnim
                    spriteInfo={sprite_info.info}
                    loop={10}
                    viewSize={view_size}
                    duration={0.8}
                    controller={this._Controller}
                    autostart={true}
                    onAnimEnd={function () {
                        console.log("anim end");
                        that.setState({ show: false })
                    }}
                    imageUrl={spriteImage}/>
            </div> : null}
            
            <div style={{
                textAlign: "center",
                fontSize: "30px",
                lineHeight: "50px",
                color: "#ffffff",
                left: 700,
                top: 100,
                width: 434,
                height: 50,
                backgroundColor: "rgba(27,38,151,0.8)"
            }}>{`原始图片`}</div>
            <div style={{
                left: 700,
                top: 150,
                width: 434,
                height: 372,
                backgroundImage:`url(${spriteImage})`
            }}/>
        </div>);
    }
}
let App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};
