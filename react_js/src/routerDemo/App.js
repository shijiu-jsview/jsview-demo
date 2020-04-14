import React, { Suspense, lazy } from 'react';
import {
	Switch,
	Router,
	Route,
	Link,
	useHistory
} from "react-router-dom";
import { createMemoryHistory } from 'history';

const global_history = createMemoryHistory();

const LazyGreen = lazy(() => import('./green'));
const LazyRed = lazy(() => import('./red'));
import { globalHistory } from '../demoCommon/RouterHistory';
import { FocusBlock } from "../demoCommon/BlockDefine"

class App extends FocusBlock {
	constructor(props) {
		super(props);

		setTimeout(()=>{
			console.log("Switch to green ...");
			global_history.replace('/users/green')
			setTimeout(()=>{
				console.log("Switch red ...");
				global_history.replace('/users/red')
				setTimeout(()=>{
					console.log("Switch to blank...");
					global_history.replace('/')
				}, 2000);
			}, 2000);
		}, 2000);
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
			<Router history={global_history} >
				<div>
					<React.Suspense fallback={<div></div>}>
						<Switch>
							<Route path="/users/green">
								<LazyGreen />
							</Route>
							<Route path="/users/red">
								<LazyRed/>
							</Route>
							<Route path="/">
							</Route>
						</Switch>
					</React.Suspense>
				</div>
			</Router>
		);
	}
}

export default App;