import React from 'react';
import Game from "../../common/Game";
import GameAppBase from "../base/GameAppBase";
import DataManage from "../../common/DataManage";

class App extends GameAppBase {
  constructor(props) {
    super(props);

    window.dataManage = new DataManage(Game);
  }

  renderContent() {
    return <div></div>;// Boot 不描画任何东西
  }

  componentDidMount() {
    console.log("boot app componentDidMount in");
    Game.state.start("Preload");
  }
}

export default App;
