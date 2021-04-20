import React, { lazy } from 'react';
import {
  Switch,
  Router,
  Route,
} from "react-router-dom";
import Home from './Homepage';
import { FdivRouter } from "../../utils/JsViewEngineWidget/index_widget";
import giftrainBg1 from "./images/giftrain_bg.jpg";
import giftrain_icon from "./images/giftrain_icon.jpg";
import smash_eggs_bg from "./images/smash_eggs_bg.jpg";
import smash_eggs_icon from "./images/smash_eggs_icon.jpg";
import turntable_bg from "./images/turntable_bg.jpg";
import turntable_icon from "./images/turntable_icon.jpg";
import ninesquared_bg from "./images/ninesquared_bg.jpg";
import ninesquared_icon from "./images/ninesquared_icon.jpg";
import dog_bg from "./images/dog_bg.jpg";
import dog_icon from "./images/dog_icon.jpg";
import { JSBridge } from '../../utils/JsViewReactTools/DebugContentShellJBridge';
import { DebugObjectRefer } from "../../utils/JsViewReactTools/DebugTool";

import { getGlobalHistory } from '../../utils/JsViewReactTools/RouterHistoryProxy';

const globalHistory = getGlobalHistory();

const demoInfos = [
  {
    name: "红包雨",
    path: "/users/giftRain",
    background: giftrainBg1,
    class: lazy(() => import('../giftRain/App').then(m => ({ default: m.SubApp }))),
    icon: giftrain_icon,
  },
  {
    name: "砸金蛋活动",
    path: "/users/smashEggs",
    background: smash_eggs_bg,
    class: lazy(() => import('../smashEggs/App').then(m => ({ default: m.SubApp }))),
    icon: smash_eggs_icon,
  },
  {
    name: "转盘抽奖",
    path: "/users/turntableDemo",
    background: turntable_bg,
    class: lazy(() => import('../turntableDemo/App').then(m => ({ default: m.SubApp }))),
    icon: turntable_icon,
  },
  {
    name: "幸运九宫格",
    path: "/users/nineSquared",
    background: ninesquared_bg,
    class: lazy(() => import('../nineSquared/App').then(m => ({ default: m.SubApp }))),
    icon: ninesquared_icon,
  },
  {
    name: "小狗跨栏游戏",
    path: "/users/games1",
    background: dog_bg,
    icon: dog_icon,
    class: lazy(() => import('../games/tappingFlying/apps/dog/App').then(m => ({ default: m.SubApp }))),
  },
];

class HomePageProxy extends React.Component {
  render() {
    return (<div></div>);
  }

  componentWillMount() {
    this.props.callback("visible");
  }

  componentWillUnmount() {
    this.props.callback("hidden");
  }
}

class ActivityApp extends React.Component {
  constructor(props) {
    super(props);
    this._FocusControl = null;

    this._NavigateHome = (() => {
      globalHistory.goBack();
      this._FocusControl.changeFocus("/main");
    });

    this.state = {
      homepageDisplay: "visible"
    };
  }

  render() {
    return (
            <FdivRouter controlRef={(ref) => { this._FocusControl = ref; }} debugRefContainer={DebugObjectRefer}>
                <Router history={globalHistory} >
                    <React.Suspense fallback={<div></div>}>
                        <Switch>
                            {
                                demoInfos.map((item, index) => {
                                  return (
                                        <Route key={index} path={item.path}>
                                            <item.class branchName={item.path} navigateHome={this._NavigateHome}/>
                                        </Route>);
                                })
                            }
                            <Route path="/">
                                <HomePageProxy callback={(v) => { this.setState({ homepageDisplay: v }); }}/>
                            </Route>
                        </Switch>
                    </React.Suspense>
                </Router>
                <div style={{ visibility: this.state.homepageDisplay }}>
                    <Home branchName="/main" data={demoInfos} />
                </div>
            </FdivRouter>
    );
  }

  componentDidMount() {
    this._FocusControl.changeFocus("/main");

    // 调试接口，对接JSCenter平台去掉启动图的处理
    JSBridge.indicateHomePageLoadDone();
  }
}

export default ActivityApp;
