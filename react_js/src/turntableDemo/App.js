import React from 'react';
import './App.css';
import Turntable from "./turntable"
import {Router, Fdiv, FdivRoot} from "jsview-react"

class App extends React.Component{
	constructor(props) {
		super(props);
		this._Router = new Router();
		this.state = {rain:null}

	}
	onRainDown(rain) {
		alert(this.state)
	}

	render() {
		return (
			<FdivRoot style={{width: "1920px", height: "920px"}}>
				<div style={{width: "1920px", height: "920px"}}>
					<Fdiv router={this._Router}>
						<Turntable branchName="Turntable"/>
					</Fdiv>
				</div>
			</FdivRoot>
		)
	}

	componentDidMount() {
		this._Router.focus("Turntable")
	}
}
export default App;