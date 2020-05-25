import React, { Suspense, lazy } from 'react';
import {
    Switch,
    Router,
    Route,
    useHistory
} from "react-router-dom";
import Game from "./common/Game"
import createStandaloneApp from "../demoCommon/StandaloneApp"
import GameAppBase from "./views/base/GameAppBase"

class MainScene extends GameAppBase {
    constructor(props) {
        super(props);
        this.game = Game;
        this.game.state.goHome = this._NavigateHome;
        this.game.state.add({
            "name": "Boot",//name 随意命名
            "path": "/state/boot",
            "class": lazy(() => import('./views/boot/App')),
        });
        this.game.state.add({
            "name": "Preload",
            "path": "/state/preload",
            "class": lazy(() => import('./views/preload/App')),
        });
        this.game.state.add({
            "name": "Difficult",
            "path": "/state/difficult",
            "class": lazy(() => import('./views/difficult/App')),
        });
        this.game.state.add({
            "name": "GamePlay",
            "path": "/state/gameplay",
            "class": lazy(() => import('./views/gameplay/App')),
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
                                console.log("index:" + index + ",item.path:" + item.path + ",item.class:", item.class);
                                return (
                                    <Route key={index} path={item.path}>
                                        <item.class branchName={item.path}/>
                                    </Route>)
                            })
                        }
                    </Switch>
                </React.Suspense>
            </Router>
        )
    }

    componentDidMount() {
        this.game.state.start("Boot");
    }
}

let App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};
