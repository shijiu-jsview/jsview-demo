import React from 'react';
import './App.css';
import Turntable from "./turntable"
import {FocusBlock} from "../demoCommon/BlockDefine"

class App extends FocusBlock{
	constructor(props) {
		super(props);
		this.state = {rain:null}

	}
	renderContent() {
		return (
			<div style={{width: "1280px", height: "720px"}}>
				<Turntable branchName={ this.props.branchName + "/Turntable" }/>
			</div>
		)
	}

	componentDidMount() {
		this.changeFocus(this.props.branchName + "/Turntable");
	}
}
export default App;
