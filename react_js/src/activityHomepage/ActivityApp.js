import React, { Suspense, lazy } from 'react';
import {
    Switch,
    Router,
    Route,
    Link,
    useHistory
} from "react-router-dom";
import Home from './Homepage'
import { FdivRoot, FdivRouter } from "../jsview-utils/jsview-react/index_widget.js"
import { globalHistory } from '../demoCommon/RouterHistory';
import giftrain_bg from "./images/giftrain_bg.jpg";
import giftrain_icon from "./images/giftrain_icon.jpg"
import smash_eggs_bg from "./images/smash_eggs_bg.jpg"
import smash_eggs_icon from "./images/smash_eggs_icon.jpg"
import turntable_bg from "./images/turntable_bg.jpg"
import turntable_icon from "./images/turntable_icon.jpg"
import ninesquared_bg from "./images/ninesquared_bg.jpg"
import ninesquared_icon from "./images/ninesquared_icon.jpg"
import dog_bg from "./images/dog_bg.jpg"
import dog_icon from "./images/dog_icon.jpg"
let demoInfos = [
    {
        "name": "红包雨",
        "path": "/users/giftRain",
        "background":giftrain_bg,
        "class": lazy(() => import('../giftRain/App').then(m => ({ default: m.SubApp }))),
        "icon":giftrain_icon,
    },
    {
        "name": "砸金蛋活动",
        "path": "/users/smashEggs",
        "background":smash_eggs_bg,
        "class": lazy(() => import('../smashEggs/App').then(m => ({ default: m.SubApp }))),
        "icon":smash_eggs_icon,
    },
    {
        "name": "转盘抽奖",
        "path": "/users/turntableDemo",
        "background":turntable_bg,
        "class": lazy(() => import('../turntableDemo/App').then(m => ({ default: m.SubApp }))),
        "icon":turntable_icon,
    },
    {
        "name": "幸运九宫格",
        "path": "/users/nineSquared",
        "background":ninesquared_bg,
        "class": lazy(() => import('../nineSquared/App').then(m => ({ default: m.SubApp }))),
        "icon":ninesquared_icon,
    },
    {
        "name": "小狗跨栏游戏",
        "path": "/users/games",
        "background":dog_bg,
        "icon":dog_icon,
        "class": lazy(() => import('../tappingFlying/App').then(m => ({ default: m.SubApp }))),
    },
]

class HomePageProxy extends React.Component{
    render() {
        return(<div></div>);
    }
    componentWillMount() {
        this.props.callback("visible")
    }
    componentWillUnmount() {
        this.props.callback("hidden")
    }
}

class ActivityApp extends React.Component {
    constructor(props) {
        super(props);
        this._FocusControl = null;

        this._NavigateHome = (()=>{
            globalHistory.goBack();
            this._FocusControl.changeFocus("/main");
        }).bind(this);

        this.state = {
            "homepageDisplay": "visible"
        };
    }

    render() {
        return (
            <FdivRouter controlRef={(ref) => { this._FocusControl = ref }}>
                <Router history={globalHistory} >
                    <React.Suspense fallback={<div></div>}>
                        <Switch>
                            {
                                demoInfos.map((item, index) => {
                                    return (
                                        <Route key={index} path={item.path}>
                                            <item.class branchName={item.path} navigateHome={this._NavigateHome}/>
                                        </Route>)
                                })
                            }
                            <Route path="/">
                                <HomePageProxy callback={(v) => { this.setState({"homepageDisplay": v})}}/>
                            </Route>
                        </Switch>
                    </React.Suspense>
                </Router>
                <div style={{"visibility": this.state.homepageDisplay}}>
                    <Home branchName="/main" data={demoInfos} />
                </div>
            </FdivRouter>
        )
    }

    componentDidMount() {
        this._FocusControl.changeFocus("/main");
    }
}

export default ActivityApp;