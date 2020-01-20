import React, { Component } from 'react';
import "./App.css"
import {Router, FdivRoot, Fdiv, HORIZONTAL, SimpleWidget, EdgeDirection, VERTICAL, SlideStyle } from "../jsview-js-react/src/text_index"
import {JsvNinePatch} from '../common/JsViewReactWidget/JsvNinePatch'

import borderImgPath from './border.png';
let data = [
    {
        "blocks":{
            "w":170,
            "h":170
        },
        "focusable":true,
        "color": "#FF9900",
        "content": 0
    },
    {
        "blocks":{
            "w":300,
            "h":300
        },
        "focusable":true,
        "color": "#0099FF",
        "content": 1
    },
    {
        "blocks":{
            "w":170,
            "h":170
        },
        "focusable":true,
        "color": "#FF9900",
        "content": 2
    },
]

class App extends Component {
    constructor(props) {
        super(props);
        this._Router = new Router();

        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._RenderBlur = this._RenderBlur.bind(this);
        this._onWidgetMount = this._onWidgetMount.bind(this);
        this._onItemFocus = this._onItemFocus.bind(this);

        this.state = {
            focusFrameX: 50,
            focusFrameY: 50,
            focusFrameW: 100,
            focusFrameH: 100,
        }
    }

    _Measures(item) {
        return item;
    }

    _RenderFocus(item) {
        let x = -5 + (item.blocks.w - 10 - (item.blocks.w - 10) * 1.05) / 2
        let y = -5 + (item.blocks.h - 10 - (item.blocks.h - 10) * 1.05) / 2
        return (
            <div style={{animation: "focusScale 0.2s", backgroundColor: item.color, left: x, top: y, width: (item.blocks.w - 10) * (1/ 0.9), height: (item.blocks.h - 10)* (1/ 0.9), color: "#FF0000"}}>
                { item.content }
            </div>
        )
    }

    _RenderBlur(item, callback) {
        return (
            <div style={{animation: "blurScale 0.2s",backgroundColor: item.color, width: item.blocks.w - 10, height: item.blocks.h - 10, color: "#FF00FF"}}
            onAnimationEnd={callback}>
                { item.content }
            </div>
        )
    }

    _RenderItem(item) {
        return (
            <div style={{backgroundColor: item.color, width: item.blocks.w - 10, height: item.blocks.h - 10, color: "#FFFFFF"}}>
                { item.content }
            </div>
        )
    }

    _onItemFocus(item) {
        console.log("haha", item)
        let x = 50 + item.xPos + -5 + (item.blocks.w - 10 - (item.blocks.w - 10) * 1.05) / 2
        let y = 50 + item.yPos + -5 + (item.blocks.h - 10 - (item.blocks.h - 10) * 1.05) / 2
        this.setState({
            focusFrameX: x,
            focusFrameY: y,
            focusFrameW: (item.blocks.w - 10) * (1/ 0.9),
            focusFrameH: (item.blocks.h - 10) * (1/ 0.9),
        })
    }

    render() {
        return(
            <FdivRoot>
                <Fdiv style={{width: 1280, height: 720, backgroundColor: '#009999'}} router={this._Router}>
                    <SimpleWidget 
                    width={ 1000 } 
                    height={ 400 } 
                    direction={ HORIZONTAL } 
                    data={ data } 
                    onClick={ (item) => {} }
                    renderBlur={ this._RenderBlur }
                    slideStyle={SlideStyle.seamLess}
                    renderItem={ this._RenderItem }
                    renderFocus={ this._RenderFocus }
                    onItemFocus={ this._onItemFocus }
                    measures={ this._Measures }
                    onWidgetMount={ this._onWidgetMount }
                    padding={{left: 50, right: 50, top: 50, height: 50}}
                    branchName={ "widget1" }/>
                </Fdiv>
                <JsvNinePatch
                        top={ this.state.focusFrameY }
                        left={ this.state.focusFrameX }
                        width={ this.state.focusFrameW }
                        height={ this.state.focusFrameH }
                        imageUrl={ borderImgPath }
                        sliceWidth={ 30 }
                        borderOutset={ "10px 10px 10px 10px"}
                        animTime={ 0.2 }
                    />
            </FdivRoot>
        )
    }

    _onWidgetMount() {
        this._Router.focus('widget1')
    }
}

export default App