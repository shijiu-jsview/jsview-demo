import React from 'react';
import './App.css';
import {Router, FdivRoot, Fdiv, SimpleWidget, HROIZONTAL, EdgeDirection, VERTICAL} from "jsview-react"
import JsvMarquee from "../common/JsViewReactWidget/JsvMarquee"
import {HomePageData,PAGE_THEME_ITEM_GAP, PAGE_THEME_ITEM_SCALE, PAGE_THEME_ITEM_TEXT_HEIGHT} from "./DataProvader"
import borderImgPath from './images/nine_patch_focus.png';

class App extends React.Component{
  constructor(props) {
      super(props);
      this.ChildMap = new Map();
      this._OnKeyDown = this._OnKeyDown.bind(this);
      this._Router = new Router();
      this._Measures = this._Measures.bind(this);
      this._RenderItem = this._RenderItem.bind(this);
      this._RenderFocus = this._RenderFocus.bind(this);
      this._RenderBlur = this._RenderBlur.bind(this);

      this.state = {
          show: true,
          w: 30,
          h: 30,
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

  _Measures(item) {
      return item;
  }

  _RenderFocus(item) {
	  let image_width = item.blocks.w - PAGE_THEME_ITEM_GAP;
      let scale_width = parseInt(image_width* PAGE_THEME_ITEM_SCALE);
      let left = -parseInt((scale_width - image_width)/2);
	  let image_height = item.blocks.h - PAGE_THEME_ITEM_GAP - PAGE_THEME_ITEM_TEXT_HEIGHT;
	  let scale_height = parseInt(image_height* PAGE_THEME_ITEM_SCALE);
	  let top = -parseInt((scale_height - image_height)/2);
	  console.log("left:"+left+", top:"+top+",width:"+scale_width+", height:"+scale_height);
      return (
          <div>
              <div style={{
			      animation: "focusScale 0.25s",
			      backgroundImage: `url(${item.content.url})`,
			      left: left,
			      top: top,
			      width: scale_width,
			      height: scale_height,
	              borderRadius: '8px 8px 8px 8px',
	              borderImage: `url(${borderImgPath}) 40 fill`,
	              borderImageWidth: '40px',
	              borderImageOutset: "28px 28px 28px 28px",
		      }}>

	          </div>

              <JsvMarquee text={item.content.title} style={{
	              color: "#ffffff",
	              fontSize: 20,
	              left:0,
	              top: image_height,
	              width: image_width,
	              height: PAGE_THEME_ITEM_TEXT_HEIGHT
	          }}/>
          </div>
      )
  }

  _RenderBlur(item, callback) {
      return (
          <div>
              <div style={{
		          animation: "blurScale 0.25s",
		          backgroundImage: `url(${item.content.url})`,
		          width: item.blocks.w - PAGE_THEME_ITEM_GAP,
		          height: item.blocks.h - PAGE_THEME_ITEM_GAP - PAGE_THEME_ITEM_TEXT_HEIGHT,
	          }}
                 onAnimationEnd={callback}>
              </div>
	          <div style={{
		          color: "#ffffff",
		          fontSize:20,
		          whiteSpace: 'nowrap',
		          textOverflow:"ellipsis",
		          overflow:"hidden",
		          left:0,
		          top: item.blocks.h - PAGE_THEME_ITEM_GAP - PAGE_THEME_ITEM_TEXT_HEIGHT,
		          lineHeight:PAGE_THEME_ITEM_TEXT_HEIGHT+"px",
		          width: item.blocks.w - PAGE_THEME_ITEM_GAP,
		          height: PAGE_THEME_ITEM_TEXT_HEIGHT
	          }}>
		          {item.content.title}
	          </div>
          </div>
      ) 
  }

  _RenderItem(item) {
	  return (
          <div>
              <div style={{
				  backgroundImage: `url(${item.content.url})`,
				  width: item.blocks.w - PAGE_THEME_ITEM_GAP,
				  height: item.blocks.h - PAGE_THEME_ITEM_GAP - PAGE_THEME_ITEM_TEXT_HEIGHT,
			  }}>
              </div>
              <div style={{
		          color: "#ffffff",
		          fontSize:20,
	              whiteSpace: 'nowrap',
	              textOverflow:"ellipsis",
	              overflow:"hidden",
	              left:0,
		          top: item.blocks.h - PAGE_THEME_ITEM_GAP - PAGE_THEME_ITEM_TEXT_HEIGHT,
	              lineHeight:PAGE_THEME_ITEM_TEXT_HEIGHT+"px",
		          width: item.blocks.w - PAGE_THEME_ITEM_GAP,
		          height: PAGE_THEME_ITEM_TEXT_HEIGHT
	          }}>
                  {item.content.title}
              </div>
          </div>
	  )
  }

  render(){
      return(
          <FdivRoot>
              <div key="background" style={{top:0,left:0,width:1280,height:720,backgroundColor:"#123f80"}}>
                  <div key="title" style={{top:30,left:80, width:80,height:PAGE_THEME_ITEM_TEXT_HEIGHT,fontSize:24,color:"#369cc4", whiteSpace:"nowrap",textAlign:"center"}}>影音</div>
                  <div key="sub_line" style={{top:70,left:80, width:80,height:5,backgroundColor:"#2b6da1"}}></div>
                  <Fdiv style={{top: 100, left: 40}} router={this._Router}>
                      <SimpleWidget
                          width={ 1280 }
                          height={ 580+40}
                          padding={{left:20,top:20}}
                          direction={ VERTICAL }
                          data={ HomePageData }
                          renderBlur={ this._RenderBlur }
                          renderItem={ this._RenderItem }
                          renderFocus={ this._RenderFocus }
                          measures={ this._Measures }
                          branchName={ "widget1" }
                      />
                  </Fdiv>
              </div>
          </FdivRoot>
      )
  }

  componentDidMount() {
      this._Router.focus("widget1")
  }
}
export default App;
