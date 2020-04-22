import React from 'react';
import './App.css';
import { Router, FdivRoot, Fdiv, SimpleWidget, HORIZONTAL, EdgeDirection, VERTICAL } from "../jsview-utils/jsview-react/index_widget"
import { globalHistory } from '../demoCommon/RouterHistory';
import { FocusBlock } from "../demoCommon/BlockDefine"

let frameTemplate = [
    {
        "blocks": {
            "w": 330,
            "h": 330
        },
        "focusable": true,
        "hasSub": true,
        "id": 0,
    },
    {
        "blocks": {
            "w": 330,
            "h": 330
        },
        "focusable": true,
        "hasSub": true,
        "id": 1,
    },
    {
        "blocks": {
            "w": 330,
            "h": 330
        },
        "focusable": true,
        "hasSub": true,
        "id": 2,
    },
    {
        "blocks": {
            "w": 330,
            "h": 330
        },
        "focusable": true,
        "hasSub": true,
        "id": 3,
    },
]

let template = [
    {
        "blocks": {
            "w": 300,
            "h": 100
        },
        "focusable": true,
        "color": "#000022",
        "content": 0
    },
    {
        "blocks": {
            "w": 150,
            "h": 100
        },
        "focusable": true,
        "color": "#003300",
        "content": 1
    },
    {
        "blocks": {
            "w": 150,
            "h": 100
        },
        "focusable": true,
        "color": "#000044",
        "content": 2
    },
    {
        "blocks": {
            "w": 50,
            "h": 200
        },
        "focusable": true,
        "color": "#000055",
        "content": 3
    },
    {
        "blocks": {
            "w": 50,
            "h": 200
        },
        "focusable": true,
        "color": "#000066",
        "content": 4
    },
    {
        "blocks": {
            "w": 50,
            "h": 200
        },
        "focusable": true,
        "color": "#0000CD",
        "content": 5
    },
]

let content = 6;
for (let i = 0; i < 4; i++) {
    template.push({
        "blocks": {
            "w": 100,
            "h": 150
        },
        "focusable": true,
        "color": "#000022",
        "content": content++
    });
    template.push({
        "blocks": {
            "w": 100,
            "h": 150
        },
        "focusable": true,
        "color": "#003300",
        "content": content++
    });
    template.push({
        "blocks": {
            "w": 100,
            "h": 150
        },
        "focusable": true,
        "color": "#003300",
        "content": content++
    })
    template.push({
        "blocks": {
            "w": 100,
            "h": 150
        },
        "focusable": true,
        "color": "#000022",
        "content": content++
    })
}

class App extends FocusBlock {
    constructor(props) {
        super(props);
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);

        this._FrameMeasure = this._FrameMeasure.bind(this);
        this._FrameRenderFocus = this._FrameRenderFocus.bind(this);
        this._FrameRenderItem = this._FrameRenderItem.bind(this);
        this._FrameOnItemFocus = this._FrameOnItemFocus.bind(this);
        this._FrameOnItemBlur = this._FrameOnItemBlur.bind(this);

        this._onWidgetMount = this._onWidgetMount.bind(this);
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _RenderFocus(item) {
        return (
            <div style={{ animation: "focusScale 0.2s", backgroundColor: item.color, width: (item.blocks.w - 10) * (1 / 0.9), height: (item.blocks.h - 10) * (1 / 0.9), color: "#FF0000" }}>
                {item.content}
            </div>
        )
    }

    _RenderBlur(item, callback) {
        return (
            <div style={{ animation: "blurScale 0.2s", backgroundColor: item.color, width: item.blocks.w - 10, height: item.blocks.h - 10, color: "#FF00FF" }}
                onAnimationEnd={callback}>
                {item.content}
            </div>
        )
    }

    _RenderItem(item) {
        return (
            <div style={{ backgroundColor: item.color, width: item.blocks.w - 10, height: item.blocks.h - 10, color: "#FFFFFF" }}>
                {item.content}
            </div>
        )
    }

    _FrameRenderItem(item, onedge, enter_react) {
        let direction = HORIZONTAL;
        return (
            <SimpleWidget
                width={300}
                height={300}
                direction={direction}
                data={template}
                onEdge={onedge}
                onClick={(item) => { console.log("click", item) }}
                enterRect={enter_react}
                renderBlur={this._RenderBlur}
                renderItem={this._RenderItem}
                renderFocus={this._RenderFocus}
                measures={this._Measures}
                branchName={this.props.branchName + "/item" + item.id}
            />
        )
    }

    _FrameRenderFocus(item) {

    }

    _FrameMeasure(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _FrameOnItemFocus(item) {
        this.changeFocus(this.props.branchName + "/item" + item.id)
        console.log("frame item focus " + item.id);
    }

    _FrameOnItemBlur(item) {
        console.log("frame item blur " + item.id);
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
            <div style={{ top: 50, left: 50 }}>
                <SimpleWidget
                    width={660}
                    height={660}
                    direction={HORIZONTAL}
                    data={frameTemplate}
                    onItemFocus={this._FrameOnItemFocus}
                    onItemBlur={this._FrameOnItemBlur}
                    onFocus={() => { console.log("widget 1 on focus") }}
                    renderItem={this._FrameRenderItem}
                    renderFocus={this._FrameRenderFocus}
                    measures={this._FrameMeasure}
                    branchName={this.props.branchName + "/widget"}
                    onWidgetMount={this._onWidgetMount}
                />
            </div>
        )
    }

    _onWidgetMount() {
        this.changeFocus(this.props.branchName + "/widget");
    }
}
export default App;