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

let demoInfos = [
    {
        "name": "基础示例合集",
        "path": "/users/basic",
        "class": lazy(() => import('../basic/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "红包雨",
        "path": "/users/giftRain",
        "class": lazy(() => import('../giftRain/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "SimpleWidget",
        "path": "/users/simpleMetroWidget",
        "class": lazy(() => import('../simpleMetroWidget/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "SimpleWidget(进阶)",
        "path": "/users/advanceMetroWidget",
        "class": lazy(() => import('../advanceMetroWidget/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "视频",
        "path": "/users/videoDemo",
        "class": lazy(() => import('../videoDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "tabWidget",
        "path": "/users/tabWidgetSample",
        "class": lazy(() => import('../tabWidgetSample/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "转盘抽奖",
        "path": "/users/turntableDemo",
        "class": lazy(() => import('../turntableDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "橱窗",
        "path": "/users/showcaseDemo",
        "class": lazy(() => import('../showcaseDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "纵向布局+界面切换",
        "path": "/users/flowMultiWidget",
        "class": lazy(() => import('../flowMultiWidget/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "数字字母录入界面",
        "path": "/users/inputDemo",
        "class": lazy(() => import('../InputDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": ".9图片动画展示",
        "path": "/users/ninePatchDemo",
        "class": lazy(() => import('../ninePatchDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "router示例",
        "path": "/users/routerDemo",
        "class": lazy(() => import('../routerDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "精灵图",
        "path": "/users/spriteImage",
        "class": lazy(() => import('../spriteImage/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "二维码",
        "path": "/users/qrcode",
        "class": lazy(() => import('../qrcodeDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "焦点切换demo",
        "path": "/users/basicFdivControl",
        "class": lazy(() => import('../basicFdivControl/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "砸金蛋活动",
        "path": "/users/smashEggs",
        "class": lazy(() => import('../smashEggs/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "幸运九宫格",
        "path": "/users/nineSquared",
        "class": lazy(() => import('../nineSquared/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "长文本显示\n(用户协议界面Demo)",
        "path": "/users/longText",
        "class": lazy(() => import('../longText/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "碰撞",
        "path": "/users/collision",
        "class": lazy(() => import('../collision/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "小狗跨栏游戏",
        "path": "/users/games1",
        "class": lazy(() => import('../games/tappingFlying/apps/dog/App').then(m => ({ default: m.SubApp }))),
    },
    {
        "name": "小鸟飞翔游戏",
        "path": "/users/games2",
        "class": lazy(() => import('../games/tappingFlying/apps/birdflying/App').then(m => ({ default: m.SubApp }))),
    },
]
let color = ["#89BEB2", "#C9BA83", "#DED38C", "#DE9C53"];
let index = 0;
for (let item of demoInfos) {
    item.color = color[index];
    index = index == color.length - 1 ? 0 : index + 1;
}

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

class DemoApp extends React.Component {
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
                                            <item.class branchName={item.path} navigateHome={this._NavigateHome} />
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

export default DemoApp;
