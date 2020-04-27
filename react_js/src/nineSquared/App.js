import React from 'react';
import './App.css';
import {FocusBlock} from "../demoCommon/BlockDefine"
import {globalHistory} from '../demoCommon/RouterHistory';
import MainPage from "./views/MainPage"
import ConstantVar from "./common/ConstantVar"

class App extends FocusBlock{
	constructor(props) {
		super(props);

	}

	renderContent() {
		return (
			<div>
				<MainPage branchName={this.props.branchName+"/MainPage"}/>
			</div>
		)
	}
    onKeyDown(ev) {
        if (ev.keyCode === ConstantVar.KeyCode.Back || ev.keyCode === ConstantVar.KeyCode.Back2) {
            globalHistory.goBack();
            this.changeFocus("/main");
            return true;
        }
        return false;
    }
	componentDidMount() {
        console.log("NineSquared App componentDidMount in");
		this.changeFocus(this.props.branchName + "/MainPage");
	}
    componentWillUnmount() {
        console.log("NineSquared App componentWillUnmount in");
    }

}
export default App;
