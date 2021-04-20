import React, { lazy } from 'react';
import {
  Switch,
  Router,
  Route,
} from "react-router-dom";
import { createMemoryHistory } from 'history';
import Game from "./common/Game";
import createStandaloneApp from "../../../../utils/JsViewReactTools/StandaloneApp";
import GameAppBase from "./views/base/GameAppBase";
import PreloadTheme from "./common/PreloadTheme";
import GamePlayTheme from "./common/GamePlayTheme";
import { getHashQuery } from "./common/Utils";

const globalHistory = createMemoryHistory();
class MainScene extends GameAppBase {
  constructor(props) {
    super(props);
    this.game = Game;
    this.game.init();
    this._InitGame();
  }

  _InitGame() {
    const query = getHashQuery(window.location.href);
    this.game.PreloadTheme = PreloadTheme;// 预加载页面
    this.game.GamePlayTheme = GamePlayTheme;// 游戏主页面
    this.game.appname = query.appname;// hash 参数 传入
    this.game.difficult = query.difficult;// hash 参数 传入
    this.game.apppath = "";
    this.game.state.goHome = this._NavigateHome;
    this.game.state.globalHistory = globalHistory;
    this.game.state.add({
      name: "Boot", // name 随意命名
      path: "/state/gameengine/boot",
      class: lazy(() => import('./views/boot/App')),
    });
    this.game.state.add({
      name: "Preload",
      path: "/state/gameengine/preload",
      class: lazy(() => import('./views/preload/App')),
    });
    this.game.state.add({
      name: "Difficult",
      path: "/state/gameengine/difficult",
      class: lazy(() => import('./views/difficult/App')),
    });
    this.game.state.add({
      name: "GamePlay",
      path: "/state/gameengine/gameplay",
      class: lazy(() => import('./views/gameplay/App')),
    });
  }

  onKeyDown(ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      this.game.close();
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
