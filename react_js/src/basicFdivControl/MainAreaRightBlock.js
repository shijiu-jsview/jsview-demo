import React from 'react'
import { enableFocusable } from "../jsview-utils/jsview-react/index_widget.js"
import { EventCenter } from "./EventCenter"

class MainAreaRightBlockBasic extends React.Component {
	constructor() {
		super();
		this.ControlRef = null;
		this.state = {
			focused: false
		}
	}

	setControl(control_ref) {
		this.ControlRef = control_ref;
	}

	onFocus() {
		this.setState({focused:true});
	}

	onBlur() {
		this.setState({focused:false});
	}

	onKeyDown(ev) {
		if (ev.keyCode == 39) {
			// Left key
			this.ControlRef.changeFocus("/sideBar/L0C0");
			EventCenter.emitEvent("ResetSideBarPosition", null);
			return true;
		} else {
			return false;
		}
	}

	render() {
		return <div style={{
			width:100,
			height:100,
			backgroundColor:(this.state.focused?"rgba(255,0,0,1)":"rgba(0,255,0,1)")
		}}>
			{this.props.branchName}
		</div>
	}
}

var MainAreaRightBlock = enableFocusable(MainAreaRightBlockBasic);

export {
	MainAreaRightBlock
}