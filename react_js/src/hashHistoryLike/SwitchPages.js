/**
 * Created by ludl on 8/18/20.
 */

import React from 'react';
import {FocusBlock} from "../demoCommon/BlockDefine"
import HorizontalButtonList from "./HorizontalButtonList"
import {getGlobalHistory} from "../demoCommon/RouterHistoryProxy"

const CONST_BUTTON_WIDTH = 400;
const CONST_BUTTON_HEIGHT = 80;

const common_font_style = {
	textAlign: "center"
};

let globalHistory = getGlobalHistory();

class MainPage extends FocusBlock {
	constructor(props) {
		super(props);

		this._BaseFdivName = this.props.branchName;

		this._MainButtons = [
			{
				w: CONST_BUTTON_WIDTH,
				h: CONST_BUTTON_HEIGHT,
				name: "启动子界面-First",
				click: ()=>{
					console.log("Open sub First");
					globalHistory.push(this.props.pathMap.subFirst + "?from=main");
				}
			},
			{
				w: CONST_BUTTON_WIDTH,
				h: CONST_BUTTON_HEIGHT,
				name: "启动子界面-Second",
				click: ()=>{
					console.log("Open sub Second");
					globalHistory.push(this.props.pathMap.subSecond + "?from=main");
				}
			}
		];
	}

	renderContent() {
		return (
			<React.Fragment>
				<div style={{top: 100, width:1280, height:100,
					lineHeight:"100px",
					...common_font_style,
					fontSize: 55,
				}}>
					{"这是主界面"}
				</div>
				<div style={{top: 330}}>
					<HorizontalButtonList
						data={this._MainButtons}
						gap={50}
						branchName={this._BaseFdivName + "/buttons"}
						maxWidth={1280} />
				</div>
			</React.Fragment>
		)
	}

	componentDidMount() {
		// 自动获焦
		console.log("focus to fdiv:" + this._BaseFdivName + "/buttons");
		this.changeFocus(this._BaseFdivName + "/buttons", true/* 不抢自己子View的焦点 */);
	}
}

class SubPageFirst extends FocusBlock {
	constructor(props) {
		super(props);

		this._MainButtons = [
			{
				w: CONST_BUTTON_WIDTH,
				h: CONST_BUTTON_HEIGHT,
				name: "跳转子界面-Second",
				click: ()=>{
					console.log("Open sub Second in sub");
					globalHistory.push(this.props.pathMap.subSecond + "?from=sub_first");
				}
			}
		];
	}

	onKeyDown(ev) {
		if (ev.keyCode === 10000 || ev.keyCode === 27) {
			// 返回键收到时返回上一级菜单
			globalHistory.goBack();
			return true;
		}
	}

	renderContent() {
		return (
			<React.Fragment>
				<div style={{top: 100, width:1280, height:100,
					lineHeight:"100px",
					...common_font_style,
					fontSize: 55,
				}}>
					{"这是子界面First"}
				</div>
				<div style={{top: 230}}>
					<HorizontalButtonList
						data={this._MainButtons}
						gap={50}
						branchName={this.props.branchName + "/buttons"}
						maxWidth={1280} />
				</div>
				<div style={{top: 330, width:1280, height:100,
					lineHeight:"100px",
					...common_font_style,
					fontSize: 30,
				}}>
					{"按返回键返回前一页"}
				</div>
			</React.Fragment>
		)
	}

	componentDidMount() {
		// 自动获焦
		this.changeFocus(this.props.branchName + "/buttons", true/* 不抢自己子View的焦点 */);
	}
}

class SubPageSecond extends FocusBlock {
	constructor(props) {
		super(props);

		this._MainButtons = [
			{
				w: CONST_BUTTON_WIDTH,
				h: CONST_BUTTON_HEIGHT,
				name: "跳转子界面-First",
				click: ()=>{
					console.log("Open sub First in sub");
					globalHistory.push(this.props.pathMap.subFirst + "?from=sub_second");
				}
			}
		];
	}

	onKeyDown(ev) {
		if (ev.keyCode === 10000 || ev.keyCode === 27) {
			// 返回键收到时返回上一级菜单
			globalHistory.goBack();
			return true;
		}
	}

	renderContent() {
		return (
			<React.Fragment>
				<div style={{top: 100, width:1280, height:100,
					lineHeight:"100px",
					...common_font_style,
					fontSize: 55,
				}}>
					{"这是子界面Second"}
				</div>
				<div style={{top: 230}}>
					<HorizontalButtonList
						data={this._MainButtons}
						gap={50}
						branchName={this.props.branchName + "/buttons"}
						maxWidth={1280} />
				</div>
				<div style={{top: 330, width:1280, height:100,
					lineHeight:"100px",
					...common_font_style,
					fontSize: 30,
				}}>
					{"按返回键返回前一页"}
				</div>
			</React.Fragment>
		)
	}

	componentDidMount() {
		// 自动获焦
		this.changeFocus(this.props.branchName + "/buttons", true/* 不抢自己子View的焦点 */);
	}
}

export {
	MainPage,
	SubPageFirst,
	SubPageSecond
}