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
            size: 400,
            fgColor: '#0000FF',
            bgColor: '#ffff00',
            level: 'H',//，容错级别，分别是L(7%)、M(15%)、Q(25%)、H(30%),
            includeImage: true,
            imageH: 64,
            imageW: 64,
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
        let tipsInfo = `功能：二维码展示
可配置项：
1.前景色
2.背景色
3.指定小图标
4.容错级别：'L', 'M', 'Q', 'H'`;
        return (
            <div>
                <div style={{
					textAlign: "left",
					fontSize: "30px",
					lineHeight: "50px",
					color: "#ffffff",
					left: 200 + 420,
					top: 100,
					width: 400,
					height: 50*8,
					backgroundColor: "rgba(27,38,151,0.8)"
				}}>{tipsInfo}</div>
                <div style={{left:200, top:100 }}>
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

            </div>
        );
    }
}

let App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};