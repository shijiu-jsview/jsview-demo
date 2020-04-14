import React, { Component } from 'react';
import QRCode from "../jsview-utils/JsViewReactWidget/JsvQrcode"
import { globalHistory } from '../demoCommon/RouterHistory';
import { FocusBlock } from "../demoCommon/BlockDefine"

class App extends FocusBlock {
    constructor() {
        super();
        this.state = {
            value: 'http://www.baidu.com/',
            size: 128,
            fgColor: '#000000',
            bgColor: '#ffffff',
            level: 'L',
            includeMargin: false,
            includeImage: true,
            imageH: 24,
            imageW: 24,
            imageX: 0,
            imageY: 0,
            imageSrc: 'http://oss.image.51vtv.cn/homepage/20191224/0fdcdc8b258fe7baac16b73f58f8989d.jpg',
            centerImage: true,
        };
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            globalHistory.goBack();
            this.changeFocus("/main");
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
                    includeMargin={this.state.includeMargin}
                    imageSettings={
                        this.state.includeImage
                            ? {
                                src: this.state.imageSrc,
                                height: this.state.imageH,
                                width: this.state.imageW,
                                x: this.state.centerImage ? null : this.state.imageX,
                                y: this.state.centerImage ? null : this.state.imageY,
                            }
                            : null
                    }
                />
            </div>
        );
    }
}

export default App;