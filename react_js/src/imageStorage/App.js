import React from 'react';
import { FocusBlock } from "../demoCommon/BlockDefine"
import createStandaloneApp from "../demoCommon/StandaloneApp"
import { SimpleWidget, HORIZONTAL, SlideStyle} from "../jsview-utils/jsview-react/index_widget.js"

import jpgDemo from "./jpgDemo.jpg"
import jpegDemo from "./jpegDemo.jpeg"
import pngDemo from "./pngDemo.png"
import pngNoAlphaDemo from "./pngNoAlphaDemo.png"
import bmpDemo from "./bmpDemo.bmp"

let image_list = [`url(${jpgDemo})`, `url(${jpegDemo})`, `url(${pngDemo})`, `url(${pngNoAlphaDemo})`, `url(${bmpDemo})`]
let data = [];
for (let i = 0; i < 60; i++) {
    data.push({
        id: i,
        width: 300,
        height: 300,
        image: image_list[Math.floor(i / 12)]
    })
}

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);

        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._OnClick = this._OnClick.bind(this);

        this.state = {
            "textureSize": "HTML上无缓存大小",
            "position": 0,
        }

        if (window.JsView) {
            window.JsView.setGlobalConfig({
                texCache: 10 * 1024 * 1024,
                holderCache: 1000
            });
            this.state.textureSize = "10M"
        }
    }


    _Measures(item) {
        return SimpleWidget.getMeasureObj(item.width, item.height, true, false)
    }

    _RenderFocus(item) {
        return (
            <div style={{width: item.width - 10, height: item.height - 10, fontSize: "30px"}}>
                <img style={{width: item.width - 10, height: item.height - 10, borderRadius: '15px 15px 15px 15px'}} jsv_img_color_space={"RGB_565"} src={item.image}/>
                {item.id}
                <div style={{width: 20, height: 20, backgroundColor: "#FF0000"}}/>
            </div>
        )
    }

    _RenderItem(item) {
        return (
            <div style={{width: item.width - 10, height: item.height - 10, fontSize: "30px"}}>
                <img style={{width: item.width - 10, height: item.height - 10,                     borderRadius: '15px 15px 15px 15px'}} jsv_img_color_space={"RGB_565"} src={item.image}/>
                {item.id}
            </div>
        )
    }

    _OnClick(item) {
        if (window.JsView) {
            if (this.state.textureSize == "10M") {
                window.JsView.setGlobalConfig({
                    texCache:  1024,
                    holderCache: 1000
                });
                this.setState({
                    textureSize: "1K"
                })
            } else {
                window.JsView.setGlobalConfig({
                    texCache:  10 * 1024 * 1024,
                    holderCache: 1000
                });
                this.setState({
                    textureSize: "10M"
                })
            }
        }
    }

    onKeyDown(ev) {
        switch(ev.keyCode) {
            case 10000:
            case 27:
                if (this._NavigateHome) {
                    if (window.JsView) {
                        window.JsView.setGlobalConfig({
                            texCache: -1,
                        });
                    }
                    this._NavigateHome();
                }
        }
        return true;
    }

    onFocus() {
        this.changeFocus(this.props.branchName + "/widget1")
    }

    renderContent() {
        return (
            <div style={{width: 1920, height: 1080, backgroundColor: "#FFFFFF"}}>
                <div style={{width: 1920, height: 100, fontSize: "50px", color: "#000000"}}>
                    {`按OK切换缓存大小, 现texture缓存大小为: ${this.state.textureSize}`}
                </div>
                <div style={{top: 80, left: 50}}>
                    <SimpleWidget
                        width={1700}
                        height={700}
                        padding={{left: 20, top: 20, right: 20, bottom: 20}}
                        direction={HORIZONTAL}
                        data={data}
                        onClick={this._OnClick}        
                        renderItem={this._RenderItem}
                        renderFocus={this._RenderFocus}
                        measures={this._Measures}
                        branchName={this.props.branchName + "/widget1"}
                    />
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