import React, { lazy } from 'react';
import {
  Switch,
  Router,
  Route,
} from "react-router-dom";
import { createMemoryHistory } from 'history';
import Game from "../../gameengine/common/Game";
import createStandaloneApp from "../../../../demoCommon/StandaloneApp";
import GameAppBase from "../../gameengine/views/base/GameAppBase";
import Until from "../../gameengine/common/Until";
import PreloadTheme from "./common/PreloadTheme";
import GamePlayTheme from "./common/GamePlayTheme";

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
    this.game.apppath = "apps/birdflying";
    this.game.state.goHome = this._NavigateHome;
    this.game.state.globalHistory = globalHistory;
    this.game.assetData = Until.dataFromatAsstes(Game.Config);
    this.game.state.add({
      name: "Boot", // name 随意命名
      path: "/state/bird/boot",
      class: lazy(() => import('../../gameengine/views/boot/App')),
    });
    this.game.state.add({
      name: "Preload",
      path: "/state/bird/preload",
      class: lazy(() => import('../../gameengine/views/preload/App')),
    });
    this.game.state.add({
      name: "Difficult",
      path: "/state/bird/difficult",
      class: lazy(() => import('../../gameengine/views/difficult/App')),
    });
    this.game.state.add({
      name: "GamePlay",
      path: "/state/bird/gameplay",
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
  }
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
