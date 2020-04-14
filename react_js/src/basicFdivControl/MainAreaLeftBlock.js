import React from 'react'
import { enableFocusable } from "../jsview-utils/jsview-react/index_widget.js"

class MainAreaLeftBlockBasic extends React.Component {
	constructor() {
		super();

		this.state = {
			focused: false
		}
	}

	setControl() {

	}

	onFocus() {
		this.setState({focused:true});
	}

	onBlur() {
		this.setState({focused:false});
	}

	render() {
		return <div style={{
            ...this.props.style,
			width:100,
			height:100,
			backgroundColor:(this.state.focused ? "rgba(255,0,0,1)" : "rgba(0,255,0,1)")
		}}>
			{this.props.branchName}
		</div>
	}
}

var MainAreaLeftBlock = enableFocusable(MainAreaLeftBlockBasic);

export {
	MainAreaLeftBlock
}