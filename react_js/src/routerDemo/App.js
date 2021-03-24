/*
 * 【界面概述】
 * 用于检验JsView-react可以兼容react标准router模块的样例
 *
 * 【控件介绍】
 * 无
 *
 * 【技巧说明】
 * Q: history如何设置？
 * A: 由于jsview并不是浏览器，所以无法使用浏览器的history功能，所以history需要使用react-router提供的接口
 *    createMemoryHistory来创建。
 */

import React, { lazy } from 'react';
import {
  Switch,
  Router,
  Route,
} from "react-router-dom";
import { createMemoryHistory } from 'history';
import createStandaloneApp from "../jsview-utils/JsViewReactTools/StandaloneApp";
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";

const LazyGreen = lazy(() => import('./green'));
const LazyRed = lazy(() => import('./red'));

const global_history = createMemoryHistory();

class MainScene extends FocusBlock {
  constructor(props) {
    super(props);

    setTimeout(() => {
      console.log("Switch to green ...");
      global_history.replace('/users/green');
      setTimeout(() => {
        console.log("Switch red ...");
        global_history.replace('/users/red');
        setTimeout(() => {
          console.log("Switch to blank...");
          global_history.replace('/');
        }, 2000);
      }, 2000);
    }, 2000);
  }

  onKeyDown(ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      if (this._NavigateHome) {
        this._NavigateHome();
      }
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

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
