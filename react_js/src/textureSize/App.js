import React from 'react';
import { FocusBlock } from "../demoCommon/BlockDefine"
import createStandaloneApp from "../demoCommon/StandaloneApp"

import jpgDemo from "./jpgDemo.jpg"
import jpegDemo from "./jpegDemo.jpeg"
import pngDemo from "./pngDemo.png"
import pngNoAlphaDemo from "./pngNoAlphaDemo.png"
import bmpDemo from "./bmpDemo.bmp"

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);
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
            <div style={{width: 1920, height: 1080, backgroundColor: "#005500"}}>
                <img style={{left: 0, top: 50, width: 200, height: 200, borderRadius: '15px 15px 15px 15px'}} src={bmpDemo}/>
                <img style={{left: 220, top: 50, width: 200, height: 200, borderRadius: '15px 15px 15px 15px'}} src={jpegDemo}/>
                <img style={{left: 440, top: 50, width: 200, height: 200, borderRadius: '15px 15px 15px 15px'}} src={jpgDemo}/>
                <img style={{left: 660, top: 50, width: 200, height: 200, borderRadius: '15px 15px 15px 15px'}} src={pngDemo}/>
                <img style={{left: 880, top: 50, width: 200, height: 200, borderRadius: '15px 15px 15px 15px'}} src={pngNoAlphaDemo}/>

                <img style={{left: 0, top: 300, width: 200, height: 200, borderRadius: '15px 15px 15px 15px'}} jsv_img_scaledown_tex="true" src={bmpDemo}/>
                <img style={{left: 220, top: 300, width: 200, height: 200, borderRadius: '15px 15px 15px 15px'}} jsv_img_scaledown_tex="true" src={jpegDemo}/>
                <img style={{left: 440, top: 300, width: 200, height: 200, borderRadius: '15px 15px 15px 15px'}} jsv_img_scaledown_tex="true" src={jpgDemo}/>
                <img style={{left: 660, top: 300, width: 200, height: 200, borderRadius: '15px 15px 15px 15px'}} jsv_img_scaledown_tex="true" src={pngDemo}/>
                <img style={{left: 880, top: 300, width: 200, height: 200, borderRadius: '15px 15px 15px 15px'}} jsv_img_scaledown_tex="true" src={pngNoAlphaDemo}/>

            </div>
        )
    }
}

let App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};