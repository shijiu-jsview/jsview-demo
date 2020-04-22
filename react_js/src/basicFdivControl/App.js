import React, { Suspense } from 'react';
import {MainArea} from './MainArea'
import {SideBarArea} from './SideBarArea'
import { globalHistory } from '../demoCommon/RouterHistory';
import { FocusBlock } from "../demoCommon/BlockDefine"

class App extends FocusBlock{
	constructor(props) {
		super(props);
		this._FocusControl = null;
	}

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            globalHistory.goBack();
            this.changeFocus("/main");
        }
        return true;
    }

	renderContent() {
		return (
			<div>
				<MainArea style={{left:0}}/>
				<SideBarArea style={{left:300}}/>
			</div>
		)
	}

	componentDidMount() {
		// this.changeFocus("/main/L0C0");
		this.changeFocus("/sideBar/L0C0");
	}
}
export default App;
