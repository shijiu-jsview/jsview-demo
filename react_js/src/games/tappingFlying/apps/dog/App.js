import React, { lazy } from 'react';
import {
  Switch,
  Router,
  Route,
} from "react-router-dom";
import { createMemoryHistory } from 'history';
import Game from "../../gameengine/common/Game";
import createStandaloneApp from "../../../../jsview-utils/JsViewReactTools/StandaloneApp";
import GameAppBase from "../../gameengine/views/base/GameAppBase";
import PreloadTheme from "../../gameengine/common/PreloadTheme";
import GamePlayTheme from "../../gameengine/common/GamePlayTheme";
import Utils from "../../gameengine/common/Utils";

const globalHistory = createMemoryHistory();

class MainScene extends GameAppBase {
  constructor(props) {
    super(props);
    this.game = Game;
    this._InitGame();
  }

  _InitGame() {
    this.game.PreloadTheme = PreloadTheme;// 预加载页面
    this.game.GamePlayTheme = GamePlayTheme;// 游戏主页面
    this.game.Config = require("./config/config.json");
    this.game.apppath = "apps/dog";
    this.game.assetData = Utils.dataFromatAsstes(Game.Config);
    this.game.state.goHome = this._NavigateHome;
    this.game.state.globalHistory = globalHistory;
    this.game.state.add({
      name: "Boot", // name 随意命名
      path: "/state/dog/boot",
      class: lazy(() => import('../../gameengine/views/boot/App')),
    });
    this.game.state.add({
      name: "Preload",
      path: "/state/dog/preload",
      class: lazy(() => import('../../gameengine/views/preload/App')),
    });
    this.game.state.add({
      name: "Difficult",
      path: "/state/dog/difficult",
      class: lazy(() => import('../../gameengine/views/difficult/App')),
    });
    this.game.state.add({
      name: "GamePlay",
      path: "/state/dog/gameplay",
      class: lazy(() => import('../../gameengine/views/gameplay/App')),
    });
  }

  onKeyDown(ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      this.game.state.close();
    }
    return true;
  }

  renderContent() {
    return (
            <Router history={this.game.state.globalHistory}>
                <React.Suspense fallback={<div></div>}>
                    <Switch>
                        {
                            this.game.state.list.map((item, index) => {
                              console.log(`index:${index},item.path:${item.path},item.class:`, item.class);
                              return (
                                    <Route key={index} path={item.path}>
                                        <item.class branchName={item.path}/>
                                    </Route>);
                            })
                        }
                    </Switch>
                </React.Suspense>
            </Router>
    );
  }

  componentDidMount() {
    this.game.state.start("Boot");
    console.log("Dog app componentDidMount");
  }

  componentWillUnMount() {
    console.log("Dog app componentWillUnMount");
  }
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
