import React from 'react';
import './App.css';
import {Router, FdivRoot, Fdiv, SimpleWidget, HORIZONTAL, EdgeDirection, VERTICAL} from "jsview-react"

let homePageData = [
  {
      "blocks":{
          "w":200,
          "h":160
      },
      "focusable":true,
      "color": "#000022",
      "content": 0
  },
  {
      "blocks":{
          "w":200,
          "h":160
      },
      "focusable":true,
      "color": "#003300",
      "content": 1
  },
  {
      "blocks":{
          "w":200,
          "h":160
      },
      "focusable":true,
      "color": "#000044",
      "content": 2
  },
  {
      "blocks":{
          "w":400,
          "h":320
      },
      "focusable":true,
      "color": "#000055",
      "content": 3
  },
  {
      "blocks":{
          "w":200,
          "h":160
      },
      "focusable":true,
      "color": "#000066",
      "content": 4
  },
  {
      "blocks":{
          "w":200,
          "h":160
      },
      "focusable":true,
      "color": "#0000CD",
      "content": 5
  },
]

let content = 6;
for (let i = 0; i < 5; i++) {
  homePageData.push({
      "blocks":{
          "w":200,
          "h":320
      },
      "focusable":true,
      "color": "#000022",
      "content": content++
  });
  homePageData.push({
          "blocks":{
              "w":200,
              "h":160
          },
          "focusable":true,
          "color": "#003300",
          "content": content++
  });
}

class App extends React.Component{
  constructor(props) {
      super(props);
      this._Router = new Router();
      this._Measures = this._Measures.bind(this);
      this._RenderItem = this._RenderItem.bind(this);
      this._RenderFocus = this._RenderFocus.bind(this);
      this._RenderBlur = this._RenderBlur.bind(this);
      this._onWidgetMount = this._onWidgetMount.bind(this);
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

  render(){
      return(
          <FdivRoot>
              <Fdiv style={{top: 120, left: 0}} router={this._Router}>
                  <SimpleWidget 
                      width={ 1280 } 
                      height={ 480 } 
                      direction={ HORIZONTAL } 
                      data={ homePageData } 
                      renderBlur={ this._RenderBlur }
                      renderItem={ this._RenderItem }
                      renderFocus={ this._RenderFocus }
                      measures={ this._Measures }
                      branchName={ "widget1" }
                      onWidgetMount={ this._onWidgetMount }
                    />
              </Fdiv>
          </FdivRoot>
      )
  }

  _onWidgetMount() {
      this._Router.focus("widget1")
  }
}
export default App;
