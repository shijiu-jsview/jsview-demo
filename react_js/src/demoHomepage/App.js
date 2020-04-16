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
        "class": lazy(() => import('../basic/App')),
    },
    {
        "name": "红包雨",
        "path": "/users/giftRain",
        "class": lazy(() => import('../giftRain/App')),
    },
    {
        "name": "SimpleWidget",
        "path": "/users/simpleMetroWidget",
        "class": lazy(() => import('../simpleMetroWidget/App')),
    },
    {
        "name": "SimpleWidget(进阶)",
        "path": "/users/advanceMetroWidget",
        "class": lazy(() => import('../advanceMetroWidget/App')),
    },
    {
        "name": "视频",
        "path": "/users/videoDemo",
        "class": lazy(() => import('../videoDemo/App')),
    },
    {
        "name": "tabWidget",
        "path": "/users/tabWidgetSample",
        "class": lazy(() => import('../tabWidgetSample/App')),
    },
    {
        "name": "转盘抽奖",
        "path": "/users/turntableDemo",
        "class": lazy(() => import('../turntableDemo/App')),
    },
    {
        "name": "橱窗",
        "path": "/users/showcaseDemo",
        "class": lazy(() => import('../showcaseDemo/App')),
    },
    {
        "name": "界面切换",
        "path": "/users/flowMultiWidget",
        "class": lazy(() => import('../flowMultiWidget/App')),
    },
    {
        "name": "输入界面",
        "path": "/users/inputDemo",
        "class": lazy(() => import('../InputDemo/App')),
    },
    {
        "name": "焦点框",
        "path": "/users/ninePatchDemo",
        "class": lazy(() => import('../ninePatchDemo/App')),
    },
    {
        "name": "router示例",
        "path": "/users/routerDemo",
        "class": lazy(() => import('../routerDemo/App')),
    },
    {
        "name": "精灵图",
        "path": "/users/spriteImage",
        "class": lazy(() => import('../spriteImage/App')),
    },
    {
        "name": "二维码",
        "path": "/users/qrcode",
        "class": lazy(() => import('../qrcodeDemo/qrcode')),
    },
    {
        "name": "焦点切换demo",
        "path": "/users/basicFdivControl",
        "class": lazy(() => import('../basicFdivControl/App')),
    },
    // {
    //     "name": "长文字",
    //     "path": "/users/longText",
    //     "class": lazy(() => import('../longText/App')),
    // },
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

class App extends React.Component {
    constructor(props) {
        super(props);
        this._FocusControl = null;
        this.state = {
            "homepageDisplay": "visible"
        };
    }

    render() {
        return (
            <FdivRoot>
                <FdivRouter controlRef={(ref) => { this._FocusControl = ref }}>
                    <Router history={globalHistory} >
                        <React.Suspense fallback={<div></div>}>
                            <Switch>
                                {
                                    demoInfos.map((item, index) => {
                                        return (
                                            <Route key={index} path={item.path}>
                                                <item.class branchName={item.path} />
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
            </FdivRoot>
        )
    }

    componentDidMount() {
        this._FocusControl.changeFocus("/main");
    }
}

export default App;