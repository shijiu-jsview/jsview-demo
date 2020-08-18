import React from 'react';
import createStandaloneApp from "../demoCommon/StandaloneApp"
import {FocusBlock} from "../demoCommon/BlockDefine"
import {SimpleWidget, VERTICAL, EdgeDirection} from "../jsview-utils/jsview-react/index_widget.js"
import {getGlobalHistory} from "../demoCommon/RouterHistoryProxy"
import {
	Switch,
	Router,
	Route,
} from "react-router-dom";
import {
	MainPage,
	SubPageFirst,
	SubPageSecond
} from "./SwitchPages"

let globalHistory = getGlobalHistory();

class RouterRootWrap extends React.Component {
	render() {
		if (this.props.standAlone) {
			// 单独运行模式时，套上Router Root
			return (
				<Router history={globalHistory.getReference()} >
					<React.Suspense fallback={<div></div>}>
						<React.Fragment children={this.props.children}/>
					</React.Suspense>
				</Router>
			);
		} else {
			return (<React.Fragment children={this.props.children}/>);
		}
	}
}

class MainScene extends FocusBlock{
	constructor(props) {
		super(props);

		this._BaseRoutePath = this.props.branchName;
		this._RouterPathMap = {
			main: this.props.branchName + "/MainPage",
			subFirst: this.props.branchName + "/SubPageFirst",
			subSecond: this.props.branchName + "/SubPageSecond",
		}
		this._BaseFdivName = this.props.branchName;
		this._Unlisten = null;

		this.state = {
			displayUrl: window.location.href,
		};
	}

	onKeyDown(ev) {
		if (ev.keyCode === 10000 || ev.keyCode === 27) {
			if (this._NavigateHome) {
				this._NavigateHome();
			}
		}
		return true;
	}

	componentDidMount() {
		// 注册history变化通知
		this._Unlisten = globalHistory.listen(()=>{
			console.log("Found url change to [" + window.location.href + "]")
			this.setState({
				displayUrl: window.location.href,
			});
		});

		if (window.location.hash === "#" + this._BaseRoutePath || window.location.hash === "#/") {
			// 主动切换到主界面
			globalHistory.replace(this._RouterPathMap.main);
		}
	}

	componentWillUnmount() {
		// 注销history变化通知
		if (this._Unlisten) {
			this._Unlisten();
			this._Unlisten = null;
		}
	}

	renderContent() {
		return(
			<React.Fragment>
				<div key="background" style={{width:1280, height:1080, backgroundColor:"rgb(222,211,140)"}} />
				<div style={{top: 80, left: 40, width: 1200, height:50, lineHeight:50, fontSize:20}}>
					{"当前URL:" + this.state.displayUrl}
				</div>
				<div key="split-line" style={{top:150, left:40, height:3, width: 1200, backgroundColor:"#00F000"}} />
				<div key="page-area" style={{top:150}}>
					<RouterRootWrap standAlone={!!this.props.standAlone}>
						<Switch>
							<Route path={this._RouterPathMap.main}>
								<MainPage pathMap={this._RouterPathMap} branchName={this._BaseFdivName + "/MainPage"}/>
							</Route>
							<Route path={this._RouterPathMap.subFirst}>
								<SubPageFirst pathMap={this._RouterPathMap} branchName={this._BaseFdivName + "/SubPageFirst"}/>
							</Route>
							<Route path={this._RouterPathMap.subSecond}>
								<SubPageSecond pathMap={this._RouterPathMap} branchName={this._BaseFdivName + "/SubPageSecond"}/>
							</Route>
							<Route path="/" />
						</Switch>
					</RouterRootWrap>
				</div>
			</React.Fragment>
		)
	}
}

let App = createStandaloneApp(MainScene);

export {
	App, // 独立运行时的入口
	MainScene as SubApp, // 作为导航页的子入口时
};