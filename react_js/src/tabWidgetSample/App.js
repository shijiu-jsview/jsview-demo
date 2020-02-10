import React from 'react';
import './App.css';

import {Router, FdivRoot, Fdiv, HORIZONTAL, SimpleWidget, EdgeDirection, VERTICAL, SlideStyle } from "jsview-react"

import {JsvTabWidget} from "../common/JsViewReactWidget/JsvTabWidget"
import {bodyData, tabData} from "./Data"
import focusBg from "./images/focus_bg.png"
import foucsNinePatch from "./images/nine_patch_focus.png"

class App extends React.Component{
    constructor(props) {
        super(props);
        this._Router = new Router();

        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._RenderBlur = this._RenderBlur.bind(this)

        this._TabMeasures = this._TabMeasures.bind(this);
        this._TabRenderFocus = this._TabRenderFocus.bind(this);
        this._TabRenderItem = this._TabRenderItem.bind(this);
        this._TabOnItemFocus = this._TabOnItemFocus.bind(this);
        this._TabRenderCur = this._TabRenderCur.bind(this);
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _RenderFocus(item) {
        let x = -5 + (item.blocks.w - 10 - (item.blocks.w - 10) * 1.05) / 2
        let y = -5 + (item.blocks.h - 10 - (item.blocks.h - 10) * 1.05) / 2
        return (
            <div style={{ animation: "focusScale 0.2s", backgroundImage: `url(${item.img})`,
             borderRadius: '8px 8px 8px 8px',
             borderImage: `url(${foucsNinePatch}) 40 fill`,
             borderImageWidth: '40px',
             borderImageOutset: "28px 28px 28px 28px",
             left: x, top: y, width: (item.blocks.w - 10) * 1.05, height: (item.blocks.h - 10) * 1.05}}>
            </div>
        )
    }

    _RenderBlur(item, callback) {
        return (
            <div style={{ animation: "blurScale 0.2s", backgroundImage: `url(${item.img})`, 
            borderRadius: '8px 8px 8px 8px',
            left: -5, top: -5, width: item.blocks.w - 10, height: item.blocks.h - 10 }}
                onAnimationEnd={callback}>
            </div>
        )
    }

    _RenderItem(item) {
        return (
            <div style={{ backgroundImage: `url(${item.img})`, 
            borderRadius: '8px 8px 8px 8px',
             left: -5, top: -5, width: item.blocks.w - 10, height: item.blocks.h - 10 }}>
            </div>
        )
    }

    _TabMeasures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _TabRenderItem(item) {
        return (
            <div style={{width: item.blocks.w, height: item.blocks.h, color: "#FFFFFF", fontSize: "24px", textAlign: "center", lineHeight: item.blocks.h + "px" }}>
                {item.content}
            </div>
        )
    }

    _TabRenderFocus(item) {
        return (
            <div>
                <div style={{width: item.blocks.w, height: item.blocks.h, color: "#0000FF", fontSize: "24px", textAlign: "center", lineHeight: item.blocks.h + "px" }}>
                    {item.content}
                </div>
                <div style={{width: item.blocks.w, height: 5, top: item.blocks.h - 5, backgroundColor: "#FFFFFF"}}/>
            </div>
        )
    }

    _TabRenderCur(item) {
        return (
            <div style={{width: item.blocks.w, height: item.blocks.h, color: "#0000FF", fontSize: "24px", textAlign: "center", lineHeight: item.blocks.h + "px" }}>
                {item.content}
            </div>  
        )
    }

    _TabOnItemFocus(item) {
        this.setState({ curTab: item.id })
    }

    render() {
        return (
            <FdivRoot>
                <Fdiv style={{backgroundColor: "#005500", width: 1280, height: 720}} router={this._Router}>
                    <JsvTabWidget
                        flowDirection={ HORIZONTAL }
                        branchName={ "tabwidget" }

                        tabStyle={{left: 64, top: 100, width: 1280, height: 50}}
                        tabRenderItem={ this._TabRenderItem }
                        tabRenderFocus={ this._TabRenderFocus }
                        tabMeasures={ this._TabMeasures }
                        tabRenderCurItem={this._TabRenderCur}
                        tabData={ tabData }

                        bodyStyle={{left: 0, top: 170, width: 1280, height: 496}}
                        bodyRenderItem={ this._RenderItem }
                        bodyRenderFocus={ this._RenderFocus }
                        bodyRenderBlur={ this._RenderBlur }
                        bodyMeasures={ this._Measures }
                        bodyPadding={{left: 64, right: 64, top: 20, height: 20}}
                        bodyData={ bodyData }
                        onWidgetMount={ () => { this._Router.focus("tabwidget") }}
                    />
                </Fdiv>
            </FdivRoot>
        )
    }
}
export default App;