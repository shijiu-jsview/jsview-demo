import React from 'react';
import Game from "../../common/Game";
import GameAppBase from "../base/GameAppBase";

class App extends GameAppBase {
  renderContent() {
    return <div></div>;// 该模式下 不描画任何东西，若有难度选择页面的话，需要作相应的处理
  }

  componentDidMount() {
    Game.state.start("GamePlay");
  }
}

export default App;
