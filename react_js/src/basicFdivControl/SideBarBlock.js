import React from 'react'
import {FocusBlock} from "./BlockDefine"
import { EventCenter } from "./EventCenter"

class SideBarBlock extends FocusBlock {
	constructor() {
		super();

		this.state = {
			focused: false
		}
	}

	onFocus() {
		this.setState({focused:true});
	}

	onBlur() {
		this.setState({focused:false});
	}

	onKeyDown(ev) {
		if (ev.keyCode == 37) {
			// Left key
			this.changeFocus("/main/L0C0");
			EventCenter.emitEvent("ResetMainPosition", null);
			return true;
		} else {
			return false;
		}
	}

	// FocusBlock: 使用renderContent函数进行布局，而不是render
	renderContent() {
		return <div style={{
			width:100,
			height:100,
			backgroundColor:(this.state.focused ? "rgba(255,0,0,1)":"rgba(0,255,0,1)")
		}}>
			{this.props.branchName}
		</div>
	}
}

export {
	SideBarBlock
}