import React from 'react';
import './App.css';
import {Router, FdivRoot, Fdiv, SimpleWidget, HROIZONTAL, EdgeDirection, VERTICAL} from "jsview-react"

let frameTemplate = [
    {
        "blocks":{
            "w":330,
            "h":330
        },
        "focusable":true,
        "itemFocusable": true,
        "id": 0,
    },
    {
        "blocks":{
            "w":330,
            "h":330
        },
        "focusable":true,
        "itemFocusable": true,
        "id": 1,
    },
    {
        "blocks":{
            "w":330,
            "h":330
        },
        "focusable":true,
        "itemFocusable": true,
        "id": 2,
    },
    {
        "blocks":{
            "w":330,
            "h":330
        },
        "focusable":true,
        "itemFocusable": true,
        "id": 3,
    },
]

let template = [
    {
        "blocks":{
            "w":300,
            "h":100
        },
        "focusable":true,
        "color": "#000022",
        "content": 0
    },
    {
        "blocks":{
            "w":150,
            "h":100
        },
        "focusable":true,
        "color": "#003300",
        "content": 1
    },
    {
        "blocks":{
            "w":150,
            "h":100
        },
        "focusable":true,
        "color": "#000044",
        "content": 2
    },
    {
        "blocks":{
            "w":50,
            "h":200
        },
        "focusable":true,
        "color": "#000055",
        "content": 3
    },
    {
        "blocks":{
            "w":50,
            "h":200
        },
        "focusable":true,
        "color": "#000066",
        "content": 4
    },
    {
        "blocks":{
            "w":50,
            "h":200
        },
        "focusable":true,
        "color": "#0000CD",
        "content": 5
    },
]

let content = 6;
for (let i = 0; i < 4; i++) {
    template.push({
        "blocks":{
            "w":100,
            "h":150
        },
        "focusable":true,
        "color": "#000022",
        "content": content++
    });
    template.push({
            "blocks":{
                "w":100,
                "h":150
            },
            "focusable":true,
            "color": "#003300",
            "content": content++
    });
    template.push({
        "blocks":{
            "w":100,
            "h":150
        },
        "focusable":true,
        "color": "#003300",
        "content": content++
    })
    template.push({
        "blocks":{
            "w":100,
            "h":150
        },
        "focusable":true,
        "color": "#000022",
        "content": content++
    })
}

class BorderEdge{
    constructor(f_p, inf_p, width) {
        this.FP = f_p;
        this.InfP = inf_p;
        this.Width = width;
    }

    divide(width, length) {
        let result = [];
        let left = null
        if (this.Width - width > 0) {
            left = new BorderEdge(this.FP + width, this.InfP, this.Width - width);
        } 
        result.push(left)
        result.push(new BorderEdge(this.FP, this.InfP + length, width));
        return result;
    }
}

class BorderInfo {
    constructor(total_width) {
        this.TotalWidth = total_width;
        this.Edges = [new BorderEdge(0, 0, total_width)];
    }

    addBlock(width, length) {
        console.log("add block")
        let can_add_edge = null;
        let changed_index = -1;
        for (let i = 0; i < this.Edges.length; i++) {
            let edge = this.Edges[i];
            if (edge.Width >= width) {
                changed_index = i;
                can_add_edge = this.Edges.splice(i, 1)[0];
                break;
            }
        }
        if (changed_index < 0) {
            can_add_edge = new BorderEdge(0, this.Edges[this.Edges.length - 1].InfP, this.TotalWidth);
            this.Edges = [];
            changed_index = 0;
        }

        let c_edges = can_add_edge.divide(width, length);
        if (c_edges[0]) {
            this.Edges.splice(changed_index, 0, c_edges[0])
        }

        let added = false;
        for (let i = changed_index; i < this.Edges.length; i++) {
            if (c_edges[1].InfP < this.Edges[i].InfP) {
                this.Edges.splice(i, 0, c_edges[1])
                added = true;
                break;
            } else if (c_edges[1].InfP == this.Edges[i].InfP) {}
        }
        if (!added) {
            this.Edges.push(c_edges[1])
        }
        return [can_add_edge.FP, can_add_edge.InfP];
    }
}

class App extends React.Component{
    constructor(props) {
        super(props);
        this.ChildMap = new Map();
        this._OnKeyDown = this._OnKeyDown.bind(this);
        this._Router = new Router();


        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._OnEdge1 = this._OnEdge1.bind(this);
        this._OnEdge2 = this._OnEdge2.bind(this);

        this._FrameMeasure = this._FrameMeasure.bind(this);
        this._FrameRenderFocus = this._FrameRenderFocus.bind(this);
        this._FrameRenderItem = this._FrameRenderItem.bind(this);
        this._FrameOnItemFocus = this._FrameOnItemFocus.bind(this);
        this._FrameOnItemBlur = this._FrameOnItemBlur.bind(this);

        this.BorderInfo = new BorderInfo(600);

        this.state = {
            show: true,
            w: 30,
            h: 30,
            data: template
        }
    }

    _OnKeyDown(ev) {
        if (ev.keyCode == 38) {
            this._Router.focus("scene1");
        } else if (ev.keyCode == 40) {
            this._Router.focus("scene2");
        }
        return true;
    }

    parseTemplate(template) {
        let list = template.list;
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            let position = this.BorderInfo.addBlock(item.h, item.w)
            item.x = position[1];
            item.y = position[0];
        }
    }

    _Measures(item) {
        return item;
    }

    _RenderFocus(item) {
        return (
            <div style={{animation: "focusScale 0.2s", backgroundColor: item.color, width: (item.blocks.w - 10) * (1/ 0.9), height: (item.blocks.h - 10)* (1/ 0.9), color: "#FF0000"}}>
                { item.content }
            </div>
        )
    }

    _RenderBlur(item, callback) {
        setTimeout(callback, 1000);
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

    _FrameRenderItem(item, onedge, enter_react) {
        let direction = HROIZONTAL;
        return (
            <SimpleWidget 
                width={ 300 } 
                height={ 300 } 
                direction={ direction } 
                data={ template } 
                onEdge = { onedge }
                onClick={ (item) => {console.log("click", item)} }
                enterRect={ enter_react }
                renderBlur={ this._RenderBlur }
                renderItem={ this._RenderItem }
                renderFocus={ this._RenderFocus }
                measures={ this._Measures }
                branchName={ "item"+item.id }
            />
        )
    }

    _FrameRenderFocus(item) {

    }

    _FrameMeasure(item) {
        return item;
    }

    _FrameOnItemFocus(item) {
        let result = this._Router.focus("item" + item.id)
        console.log("frame item focus " + item.id);
    }

    _FrameOnItemBlur(item) {
        console.log("frame item blur " + item.id);
    }

    _OnEdge1(react_info) {
        console.log("on edge 1", react_info)
        if (react_info.direction == EdgeDirection.right) {
            react_info.react.x = react_info.react.x - 600
            this.setState({"w2EnterReact": react_info})
            this._Router.focus("widget2")
        }
    }

    _OnEdge2(react_info) {
        if (react_info.direction == EdgeDirection.left) {
            console.log("on edge 2", react_info)
            react_info.react.x = react_info.react.x + 600
            this.setState({"w1EnterReact": react_info})
            this._Router.focus("widget1")
        } 
    }

    render(){
        return(
            <FdivRoot>
                <Fdiv style={{top: 50, left: 50}} router={this._Router}>
                    <SimpleWidget 
                        width={ 660 } 
                        height={ 660 } 
                        direction={ HROIZONTAL } 
                        data={ frameTemplate } 
                        onItemFocus={ this._FrameOnItemFocus }
                        onItemBlur={ this._FrameOnItemBlur }
                        onFocus={ () => {console.log("widget 1 on focus")}}
                        renderItem={ this._FrameRenderItem }
                        renderFocus={ this._FrameRenderFocus }
                        measures={ this._FrameMeasure }
                        branchName="widget1"
                    />

                </Fdiv>
            </FdivRoot>
        )
    }

    componentDidMount() {
        this._Router.focus("widget1")
    }
}
export default App;