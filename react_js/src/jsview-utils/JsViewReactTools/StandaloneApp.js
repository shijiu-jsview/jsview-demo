import React from 'react';
import {FdivRouter} from "../jsview-react/index_widget.js"
import {jJsvRuntimeBridge} from "./JsvRuntimeBridge"

function createStandaloneApp(main_scene_component) {
	return class extends React.Component {
		constructor(props) {
			super(props);
			this._FocusControl = null;
		}

		render() {
			let scene = React.createElement(main_scene_component, {branchName: "/MySelf", standAlone: true});
			return (<FdivRouter controlRef={(ref) => {
				this._FocusControl = ref
			}}>
				{scene}
			</FdivRouter>);
		}

		componentDidMount() {
			this._FocusControl.changeFocus("/MySelf", true);
			jJsvRuntimeBridge.notifyPageLoaded();
		}
	}
}

export default createStandaloneApp;