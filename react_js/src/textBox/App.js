import React from 'react'
import createStandaloneApp from '../demoCommon/StandaloneApp'
import { FocusBlock } from '../demoCommon/BlockDefine'
import JsvTextBox from '../jsview-utils/JsViewReactWidget/JsvTextBox'
/*
 * 【界面概述】
 * 展示文字垂直对齐方式显示控件的用法
 *
 * 【控件介绍】
 * JsvTextBox：文字的垂直对齐方式显示控件
 *                  verticalAlign {string}  垂直对齐方式 (必需) top、middle、bottom
 *                  style {object}  文字显示样式 (必需){left:0, top:0, width:xxx, height:xxx, fontSize:xxx, lineHeight:xxx,textAlign:xxxx, color:xxx}
 *
 * 【技巧说明】
 * Q: 如何实现文字居中对齐方式显示?
 * A: verticalAlign属性设置为middle
 *
 */
class MainScene extends FocusBlock {
	constructor (props) {
		super(props)
		this.state = {
			offsetX:0,
			offsetY:0
		};
	}

	onKeyDown(ev) {
		//console.log("Get key code=" + ev.keyCode);
		if (ev.keyCode === 37) {
			// 'Left' key down
			this.setState({offsetX: this.state.offsetX + 30})
		} else if (ev.keyCode === 39) {
			// 'Right' key down
			this.setState({offsetX: this.state.offsetX - 30})
		} else if (ev.keyCode === 38) {
			// 'Up' key down
			this.setState({offsetY: this.state.offsetY + 30})
		} else if (ev.keyCode === 40) {
			// 'Down' key down
			this.setState({offsetY: this.state.offsetY - 30})
		} else if (ev.keyCode == 27 || ev.keyCode === 10000) {
			if (this._NavigateHome) {
				this._NavigateHome();
			}
		}
		return true;
	}


	componentWillUnmount () {

	}

	componentDidMount () {

	}
	_RenderLeftContent() {
		const text =
			`静夜思 --唐李白
床前明月光，疑是地上霜；
举头望明月，低头思故乡。`
		return  (<div style={{top: 50}}>
			<div style={{left:0,top:-50,width:400,height:50,fontSize: 20, textAlign: 'left', lineHeight:'50px', backgroundColor:"#00ff00"}}>
				整体向上对齐、文字居左显示
			</div>
			<JsvTextBox verticalAlign="top"
						style={{
							left: 0, top: 0, width: 400, height: 300,
							backgroundColor: 'rgba(255,255,0,0.5)',
							fontSize: 30,
							textAlign: 'left',
							lineHeight: '40px'
						}}>
				{text}
			</JsvTextBox>
			<div style={{left:410,top:-50,width:400,height:50,fontSize: 20, textAlign: 'left', lineHeight:'50px', backgroundColor:"#00ff00"}}>
				整体垂直居中对齐、文字水平居左显示
			</div>
			<JsvTextBox verticalAlign="middle"
						style={{
							left: 410, top: 0, width: 400, height: 300,
							backgroundColor: 'rgba(255,255,0,0.5)',
							fontSize: 30,
							textAlign: 'left',
							lineHeight: '40px'
						}}>
				{text}
			</JsvTextBox>
			<div style={{left:820,top:-50,width:400,height:50,fontSize: 20, textAlign: 'left', lineHeight:'50px', backgroundColor:"#00ff00"}}>
				整体垂直向下对齐、文字水平居左显示
			</div>
			<JsvTextBox verticalAlign="bottom"
						style={{
							left: 820, top: 0, width: 400, height: 300,
							backgroundColor: 'rgba(255,255,0,0.5)',
							fontSize: 30,
							textAlign: 'left',
							lineHeight: '40px'
						}}>
				{text}
			</JsvTextBox>
			<div style={{left:1240,top:-50,width:500,height:50,fontSize: 20, textAlign: 'left', lineHeight:'50px', backgroundColor:"#00ff00"}}>
				整体垂直向上对齐、文字水平居左显示、行高80px
			</div>
			<JsvTextBox verticalAlign="top"
						style={{
							left: 1240, top: 0, width: 500, height: 300,
							backgroundColor: 'rgba(255,255,0,0.5)',
							fontSize: 30,
							textAlign: 'left',
							lineHeight: '80px'
						}}>
				{text}
			</JsvTextBox>
		</div>)
	}
	_RenderCenterContent() {
		const text =
			`静夜思 --唐李白
床前明月光，疑是地上霜；
举头望明月，低头思故乡。`
		return  (<div style={{top: 400}}>
			<div style={{left:0,top:-50,width:400,height:50,fontSize: 20, textAlign: 'left', lineHeight:'50px', backgroundColor:"#00ff00"}}>
				整体垂直向上对齐、文字水平居中显示
			</div>
			<JsvTextBox verticalAlign="top"
						style={{
							left: 0, top: 0, width: 400, height: 300,
							backgroundColor: 'rgba(255,255,0,0.5)',
							fontSize: 30,
							textAlign: 'center',
							lineHeight: '40px'
						}}>
				{text}
			</JsvTextBox>
			<div style={{left:410,top:-50,width:400,height:50,fontSize: 20, textAlign: 'left', lineHeight:'50px', backgroundColor:"#00ff00"}}>
				整体垂直居中对齐、文字水平居中显示
			</div>
			<JsvTextBox verticalAlign="middle"
						style={{
							left: 410, top: 0, width: 400, height: 300,
							backgroundColor: 'rgba(255,255,0,0.5)',
							fontSize: 30,
							textAlign: 'center',
							lineHeight: '40px'
						}}>
				{text}
			</JsvTextBox>
			<div style={{left:820,top:-50,width:400,height:50,fontSize: 20, textAlign: 'left', lineHeight:'50px', backgroundColor:"#00ff00"}}>
				整体垂直向下对齐、文字水平居中显示
			</div>
			<JsvTextBox verticalAlign="bottom"
						style={{
							left: 820, top: 0, width: 400, height: 300,
							backgroundColor: 'rgba(255,255,0,0.5)',
							fontSize: 30,
							textAlign: 'center',
							lineHeight: '40px'
						}}>
				{text}
			</JsvTextBox>

			<div style={{left:1240,top:-50,width:500,height:50,fontSize: 20, textAlign: 'left', lineHeight:'50px', backgroundColor:"#00ff00"}}>
				整体垂直居中对齐、文字水平居中显示、行高80px
			</div>
			<JsvTextBox verticalAlign="middle"
						style={{
							left: 1240, top: 0, width: 500, height: 300,
							backgroundColor: 'rgba(255,255,0,0.5)',
							fontSize: 30,
							textAlign: 'center',
							lineHeight: '80px'
						}}>
				{text}
			</JsvTextBox>
        </div>
        )
	}
	_RenderRightContent() {
		const text =
			`静夜思 --唐李白
床前明月光，疑是地上霜；
举头望明月，低头思故乡。`
		return (<div style={{top: 750}}>
			<div style={{left:0,top:-50,width:400,height:50,fontSize: 20, textAlign: 'left', lineHeight:'50px', backgroundColor:"#00ff00"}}>
				整体垂直向上对齐、文字水平居右显示
			</div>
			<JsvTextBox verticalAlign="top"
						style={{
							left: 0, top: 0, width: 400, height: 300,
							backgroundColor: 'rgba(255,255,0,0.5)',
							fontSize: 30,
							textAlign: 'right',
							lineHeight: '40px'
						}}>
				{text}
			</JsvTextBox>
			<div style={{left:410,top:-50,width:400,height:50,fontSize: 20, textAlign: 'left', lineHeight:'50px', backgroundColor:"#00ff00"}}>
				整体垂直居中对齐、文字水平居右显示
			</div>
			<JsvTextBox verticalAlign="middle"
						style={{
							left: 410, top: 0, width: 400, height: 300,
							backgroundColor: 'rgba(255,255,0,0.5)',
							fontSize: 30,
							textAlign: 'right',
							lineHeight: '40px'
						}}>
				{text}
			</JsvTextBox>
			<div style={{left:820,top:-50,width:400,height:50,fontSize: 20, textAlign: 'left', lineHeight:'50px', backgroundColor:"#00ff00"}}>
				整体垂直向下对齐、文字水平居右显示
			</div>
			<JsvTextBox verticalAlign="bottom"
						style={{
							left: 820, top: 0, width: 400, height: 300,
							backgroundColor: 'rgba(255,255,0,0.5)',
							fontSize: 30,
							textAlign: 'right',
							lineHeight: '40px'
						}}>
				{text}
			</JsvTextBox>

			<div style={{left:1240,top:-50,width:500,height:50,fontSize: 20, textAlign: 'left', lineHeight:'50px', backgroundColor:"#00ff00"}}>
				整体垂直向下对齐、文字水平居右显示、行高80px
			</div>
			<JsvTextBox verticalAlign="bottom"
						style={{
							left: 1240, top: 0, width: 500, height: 300,
							backgroundColor: 'rgba(255,255,0,0.5)',
							fontSize: 30,
							textAlign: 'right',
							lineHeight: '80px'
						}}>
				{text}
			</JsvTextBox>
		</div>)
	}
	_RenderOneLineContent() {
		const text = 'abcdefghigk'
		return (<div style={{top: 750+300+50}}>
			<div style={{left:0,top:-50,width:400,height:50,fontSize: 20, textAlign: 'left', lineHeight:'50px', backgroundColor:"#00ff00"}}>
				整体垂直向上对齐、文字水平居左显示
			</div>
			<JsvTextBox verticalAlign="top"
						style={{
							left: 0, top: 0, width: 400, height: 80,
							backgroundColor: 'rgba(255,255,0,0.5)',
							fontSize: 30,
							textAlign: 'left',
							lineHeight: '80px'
						}}>
				{text}
			</JsvTextBox>
			<div style={{left:410,top:-50,width:400,height:50,fontSize: 20, textAlign: 'left', lineHeight:'50px', backgroundColor:"#00ff00"}}>
				整体垂直居中对齐、文字水平居中显示
			</div>
			<JsvTextBox verticalAlign="middle"
						style={{
							left: 410, top: 0, width: 400, height: 80,
							backgroundColor: 'rgba(255,255,0,0.5)',
							fontSize: 30,
							textAlign: 'center',
							lineHeight: '80px'
						}}>
				{text}
			</JsvTextBox>
			<div style={{left:820,top:-50,width:400,height:50,fontSize: 20, textAlign: 'left', lineHeight:'50px', backgroundColor:"#00ff00"}}>
				整体垂直向下对齐、文字水平居右显示
			</div>
			<JsvTextBox verticalAlign="bottom"
						style={{
							left: 820, top: 0, width: 400, height: 80,
							backgroundColor: 'rgba(255,255,0,0.5)',
							fontSize: 30,
							textAlign: 'right',
							lineHeight: '80px'
						}}>
				{text}
			</JsvTextBox>

		</div>)
	}
	renderContent () {
		return( <div key="ContentArea" style={{top:this.state.offsetY, left:this.state.offsetX}}>
			{this._RenderLeftContent()}
			{this._RenderCenterContent()}
			{this._RenderRightContent()}
			{this._RenderOneLineContent()}
		</div>)
	}
}
let App = createStandaloneApp(MainScene)
export {
	App, // 独立运行时的入口
	MainScene as SubApp, // 作为导航页的子入口时
}
