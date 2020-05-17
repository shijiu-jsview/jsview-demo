/*
 * 【界面概述】
 * 绘制一个带有中心logo的二维码
 *
 * 【控件介绍】
 * QRCode：描绘二维码
 *      value {string} (必须) 二维码代表的字符串
 *      size {int} (必须) 二维码展示尺寸，二维码为正方形，所以改值代表宽和高，默认值：128
 *      fgColor {string} 二维码前景色，默认值"#000000"，黑色
 *      bgColor {string} 二维码背景色，默认值"#ffffff"，白色
 *      level {string} 二维码的辨析度，可选值{'L':低, 'M':中, 'H':高, 'Q':最精细}，默认值'L'
 *      imageSettings {Object} 设置中心logo图片，默认值为null，设置格式为：
 *                          {
 *                              src: logo的url地址
 *                              height: logo的宽度
 *                              height: logo的高度
 *                          }
 *
 * 【技巧说明】
 * 无
 */

import React, { Component } from 'react';
import QRCode from "../jsview-utils/JsViewReactWidget/JsvQrcode"
import createStandaloneApp from "../demoCommon/StandaloneApp"
import { FocusBlock } from "../demoCommon/BlockDefine"

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);
        this.state = {
            value: 'http://www.baidu.com/',
            size: 128,
            fgColor: '#0000FF',
            bgColor: '#ffff00',
            level: 'L',
            includeImage: true,
            imageH: 24,
            imageW: 24,
            imageSrc: 'http://oss.image.51vtv.cn/homepage/20191224/0fdcdc8b258fe7baac16b73f58f8989d.jpg',
        };
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            if (this._NavigateHome) {
                this._NavigateHome();
            }
        }
        return true;
    }

    renderContent() {
        return (
            <div>
                <QRCode
                    value={this.state.value}
                    size={this.state.size}
                    fgColor={this.state.fgColor}
                    bgColor={this.state.bgColor}
                    level={this.state.level}
                    imageSettings={
                        this.state.includeImage
                            ? {
                                src: this.state.imageSrc,
                                height: this.state.imageH,
                                width: this.state.imageW,
                            }
                            : null
                    }
                />
            </div>
        );
    }
}

let App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};