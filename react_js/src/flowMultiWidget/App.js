import React from 'react';
import './App.css';
import {Router, FdivRoot, Fdiv} from "../jsview-utils/jsview-react/index_widget.js"
import FlowMetroWidget from './views/FlowMetroWidget'
import MenuWidget from './views/MenuWidget'
import {HomePageData, HomePageStyle, MenuPageStyle, MenuPageData} from './DataProvader'
class App extends React.Component{
  constructor(props) {
      super(props);
      this.ChildMap = new Map();
      this._OnKeyDown = this._OnKeyDown.bind(this);
      this._Router = new Router();
      this.state = {
	      menu_visibility:"hidden",
      }
  }
  _ShowMenu() {
      this.setState({
	      menu_visibility:"visible",
	      menu_animation:"menuShow 0.2s"
      })
	  this._Router.focus("menu");
  }

  _HideMenu() {
	  this.setState({
		  menu_visibility:"hidden",
		  menu_animation:"menuHidden 0.2s"

	  })
	  this._Router.focus("flowMetro");
  }

  _OnKeyDown(ev) {
      console.log("ev.keyCode:",ev.keyCode);
      if (ev.keyCode === 10001 || ev.keyCode === 77){//menu key
        this._ShowMenu();
      } else if (ev.keyCode === 10000 || ev.keyCode === 82) {
          this._HideMenu();
      }
      return true;
  }

  render(){
	  console.log("render App");
      return(
          <FdivRoot>
              <Fdiv router={this._Router} key="background" style={{top:0,left:0,width:1280,height:720,backgroundColor:"#123f80"}}
                    onKeyDown={this._OnKeyDown}>
                  <FlowMetroWidget style={{left: 50, top: 50, width: 800, height: 600}} data={HomePageData}
                                   pageTheme={HomePageStyle} branchName="flowMetro"
                                   onWidgetMount={() => {this._Router.focus("flowMetro")}}
                                   />
                  <MenuWidget
                      style={{
		                  visibility: this.state.menu_visibility,
		                  left: (1280 - 300) / 2, top: (720 - 255) / 2, width: 300, height: 255,
		                  backgroundColor: "#000000",
                          animation:this.state.menu_animation
	                  }}
                      branchName="menu"
                      pageTheme={MenuPageStyle}
                      title="菜单"
                      data={MenuPageData}
                      onClose={() => {
                          this._HideMenu();
                      }}/>
              </Fdiv>
          </FdivRoot>
      )
  }
}
export default App;
