import React from 'react';
import './App.css';
import Turntable from "./turntable"
import {Router, Fdiv, FdivRoot} from "../jsview-utils/jsview-react/index_widget.js"

class App extends React.Component{
	constructor(props) {
		super(props);
		this._Router = new Router();
		this.state = {rain:null}

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
