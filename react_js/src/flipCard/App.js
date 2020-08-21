import React, { lazy } from 'react';
import './App.css';
import {FocusBlock} from "../demoCommon/BlockDefine"
import createStandaloneApp from "../demoCommon/StandaloneApp"
import {FlipCard} from "./FilpCard"

import blue_egg from "./blue_egg.png"
import red_egg from "./red_egg.png"

import { SimpleWidget, HORIZONTAL, SlideStyle} from "../jsview-utils/jsview-react/index_widget.js"

let homeData = []
for (let i = 0; i < 12; i++) {
    homeData.push({
        w: 200,
        h: 300,
        id: i
    })
}

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._onItemFocus = this._onItemFocus.bind(this);
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(item.w, item.h, true, true)
    }

    _RenderItem(item) {
        return (
            <FlipCard 
                branchName={this.props.branchName + "/card" + item.id} 
                width={191} 
                height={252}
                backImg={red_egg}
                foreImg={blue_egg}
                perspective={300}/>
        )
    }

    _onItemFocus(item) {
        this.changeFocus(this.props.branchName + "/card" + item.id)
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
            <div style={{width: 1920, height: 1080, backgroundColor: "#FFFFFF"}}>
                <SimpleWidget
                    width={1280}
                    height={720}
                    padding={{left: 50, top: 100, right: 20, bottom: 20}}
                    direction={HORIZONTAL}
                    data={homeData}
                    onClick={(item) => {console.log("onclick" + item.content)}}
                    renderItem={this._RenderItem}
                    measures={this._Measures}
                    onItemFocus={this._onItemFocus}
                    branchName={this.props.branchName + "/widget1"}
                />
            </div>
        )
    }

    onFocus() {
        this.changeFocus(this.props.branchName + "/widget1")
    }
}

let App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};