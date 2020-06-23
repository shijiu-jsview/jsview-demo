/**
 * Created by ludl on 5/15/20.
 */

import React from 'react';
import { FdivRouter } from "../jsview-utils/jsview-react/index_widget.js"

function createStandaloneApp(main_scene_component) {
	return class extends React.Component {
		constructor(props) {
			super(props);
			this._FocusControl = null;
		}

		render() {
			let scene = React.createElement(main_scene_component, {branchName:"MySelf"});
			return (<FdivRouter controlRef={(ref) => { this._FocusControl = ref }}>
				{scene}
			</FdivRouter>);
		}

		componentDidMount() {
			this._FocusControl.changeFocus("MySelf", true);
		}
	}
}

export default createStandaloneApp;