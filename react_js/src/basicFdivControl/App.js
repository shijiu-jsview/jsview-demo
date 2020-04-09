import React, { Suspense } from 'react';
import {MainArea} from './MainArea'
import {SideBarArea} from './SideBarArea'
import { FdivRoot, FdivRouter } from "../jsview-utils/jsview-react/index_widget.js"

class App extends React.Component{
	constructor(props) {
		super(props);
		this._FocusControl = null;
	}

	render() {
		var that = this;
		return (
			<FdivRoot>
				<FdivRouter controlRef={(ref)=>{that._FocusControl = ref}}>
					<MainArea style={{left:0}}/>
					<SideBarArea style={{left:300}}/>
				</FdivRouter>
			</FdivRoot>
		)
	}

	componentDidMount() {
		// this._FocusControl.changeFocus("/main/L0C0");
		this._FocusControl.changeFocus("/sideBar/L0C0");
	}
}
export default App;
