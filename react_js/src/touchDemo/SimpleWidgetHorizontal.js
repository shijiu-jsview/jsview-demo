import React from 'react';
import { FocusBlock } from "../demoCommon/BlockDefine"
import JsvTouchContainer from "../jsview-utils/JsViewReactWidget/JsvTouchContainer";
import {SimpleWidget, HORIZONTAL} from "../jsview-utils/jsview-react/index_widget.js"
let CONST_ITEM_WIDTH = 100;
let CONST_ITEM_HEIGHT = 300;
class SimpleWidgetHorizontal extends FocusBlock {
	constructor(props) {
		super(props);
		this.state = {
			data:this._getDataList()
		}

	}
	_getDataList() {
		let data_list = [];
		for(let i=0; i<500; i++) {
			data_list.push({
				name:i,
				id:i,
				color:"rgba("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+",1.0)"
			})
		}
		return data_list;
	}

	onKeyDown(ev) {
		return true;
	}

	onFocus() {
		console.log("touch Demo onfocus");
	}

	onBlur() {
		console.log("touch Demo onblur");
	}

	_onClick=(item)=>{
		console.log("_onClick id:"+item.id);
	}

	_Measures=(item)=> {
		return SimpleWidget.getMeasureObj(CONST_ITEM_WIDTH, CONST_ITEM_HEIGHT, true, false);
	}

	_RenderFocus=(item)=> {
		return (
			<div>
				<div style={{backgroundColor: "#0000FF", top: -5, left: -5, width: CONST_ITEM_WIDTH, height: CONST_ITEM_HEIGHT}}></div>
				<div style={{backgroundColor: item.color, width: CONST_ITEM_WIDTH - 10, height: CONST_ITEM_HEIGHT - 10, color: "#000000", fontSize: 30}}>
					{ item.name }
				</div>
			</div>
		)
	}

	_RenderItem=(item)=> {
		return (
			<div style={{backgroundColor: item.color, width: CONST_ITEM_WIDTH - 10, height: CONST_ITEM_HEIGHT - 10, color: "#000000", fontSize: 30}}>
				{ item.name }
			</div>
		)
	}
	renderContent() {
		return (
			<div style={{ width: 1280, height: 720, overflow:"hidden"}}>
				<JsvTouchContainer style={{ width: 1280, height: 720*2, backgroundColor: "#ffb915"}}
								   direction={JsvTouchContainer.DIRECTION_VERTICAL}
								   dragLimitArea={{ x: 0, y: 0, width: 1280, height: 720 }}>
					<div style={{top:0,width:CONST_ITEM_WIDTH, height:40,fontSize:25, lineHeight:"40px",color:"#fff753"}}>整页滑动</div>
					<div style={{top:50, width:CONST_ITEM_WIDTH*10 + 20, height:CONST_ITEM_HEIGHT + 20, backgroundColor:"#ff0000"}}>
						<SimpleWidget
							width={ CONST_ITEM_WIDTH*10+20 }
							height={ CONST_ITEM_HEIGHT + 20 }
							direction={ HORIZONTAL }
							data={ this.state.data }
							renderItem={ this._RenderItem }
							renderFocus={ this._RenderFocus }
							onClick={ this._onClick }
							measures={ this._Measures }
							padding={{top: 10, left: 10, right: 10, bottom: 10}}
							branchName={ "simpleWidgetHorizontal1" }
							enableTouch={true}
							flingPageWidth={CONST_ITEM_WIDTH*10}
						/>

					</div>
					<div style={{top:CONST_ITEM_HEIGHT + 100, width:CONST_ITEM_WIDTH, height:40,fontSize:25, lineHeight:"40px",color:"#fff753"}}>普通滑动</div>
					<div style={{top:CONST_ITEM_HEIGHT + 100 + 50, width:CONST_ITEM_WIDTH*10 + 20, height:CONST_ITEM_HEIGHT + 20, backgroundColor:"#ff0000", fontSize:25, lineHeight:"40px",color:"#fff753"}}>
						<SimpleWidget
							width={ CONST_ITEM_WIDTH*10 + 20 }
							height={ CONST_ITEM_HEIGHT + 20 }
							direction={ HORIZONTAL }
							data={ this.state.data }
							renderItem={ this._RenderItem }
							renderFocus={ this._RenderFocus }
							onClick={ this._onClick }
							measures={ this._Measures }
							padding={{top: 10, left: 10, right: 10, bottom: 10}}
							branchName={ "simpleWidgetHorizontal2" }
							enableTouch={true}
						/>
					</div>
				</JsvTouchContainer>
			</div>
		)
	}
}

export default SimpleWidgetHorizontal;
