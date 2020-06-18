import React from 'react';
import Game from "../../common/Game"
import GameAppBase from "../base/GameAppBase"
class App extends GameAppBase{
	constructor(props) {
		super(props);
	}

	renderContent() {
		return <div></div>;//Boot 不描画任何东西
	}

	componentDidMount() {
		console.log("boot app componentDidMount in");
        Game.state.start("Preload");
	}
}

export default App;
