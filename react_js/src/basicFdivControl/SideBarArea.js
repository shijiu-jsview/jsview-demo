import React from 'react'
import {SideBarBlock} from './SideBarBlock'
import {FocusBlock} from './BlockDefine'
import { EventCenter } from "./EventCenter"

class SideBarArea extends FocusBlock {
	constructor() {
		super();
		this._column = 0;
		this._line = 0;
	}

	onKeyDown(ev) {
		// 子节点未处理的按键事件会流向此节点
		var key_used = true;
		switch (ev.keyCode) {
			case 38: // Up
				if (this._line > 0) this._line --;
				break;
			case 40: // Down
				if (this._line < 1) this._line ++;
				break;
			default:
				key_used = false;
		}

		if (key_used) {
			// 焦点与之前相同时也可以重复调用，焦点管理系统内容有是否变更的判断处理
			this.changeFocus("/sideBar/L" + this._line + "C" + this._column);
		}

		return key_used;
	}

	// FocusBlock: 使用renderContent函数进行布局，而不是render
	renderContent() {
		return (
			<div style={this.props.style}>
				<SideBarBlock branchName="/sideBar/L0C0" style={{left:0,top:0}}/>
				<SideBarBlock branchName="/sideBar/L1C0" style={{left:0,top:120}}/>
			</div>
		);
	}

	componentDidMount() {
		var that = this;
		EventCenter.setLisener("ResetSideBarPosition", ()=>{
			that._column = 0;
			that._line = 0;
		});
	}

	componentWillUnmount() {
		// 释放引用，解除对this实体的引用
		EventCenter.removeListener("ResetSideBarPosition");
	}
}

export {
	SideBarArea
}