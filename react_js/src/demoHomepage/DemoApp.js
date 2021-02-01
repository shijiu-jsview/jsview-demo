import React, { lazy } from 'react';
import {
    Switch,
    Router,
    Route,
} from "react-router-dom";
import Home from './Homepage';
import { FdivRouter } from "../jsview-utils/jsview-react/index_widget";
import { JSBridge } from '../demoCommon/DebugContentShellJBridge';

import { getGlobalHistory } from '../demoCommon/RouterHistoryProxy';

const globalHistory = getGlobalHistory();

const demoFuncInfos = [
    // 功能
    {
        name: "基础示例合集",
        path: "/users/basic",
        class: lazy(() => import('../basic/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "SimpleWidget",
        path: "/users/simpleMetroWidget",
        class: lazy(() => import('../simpleMetroWidget/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "SimpleWidget(进阶)",
        path: "/users/advanceMetroWidget",
        class: lazy(() => import('../advanceMetroWidget/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "视频",
        path: "/users/videoDemo",
        class: lazy(() => import('../videoDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "tabWidget",
        path: "/users/tabWidgetSample",
        class: lazy(() => import('../tabWidgetSample/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "橱窗",
        path: "/users/showcaseDemo",
        class: lazy(() => import('../showcaseDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "纵向布局+界面切换",
        path: "/users/flowMultiWidget",
        class: lazy(() => import('../flowMultiWidget/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "数字字母录入界面",
        path: "/users/inputDemo",
        class: lazy(() => import('../InputDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: ".9图片动画展示",
        path: "/users/ninePatchDemo",
        class: lazy(() => import('../ninePatchDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "精灵图",
        path: "/users/spriteImage",
        class: lazy(() => import('../spriteImage/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "二维码",
        path: "/users/qrcode",
        class: lazy(() => import('../qrcodeDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "焦点切换demo",
        path: "/users/basicFdivControl",
        class: lazy(() => import('../basicFdivControl/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "碰撞",
        path: "/users/collision",
        class: lazy(() => import('../collision/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "粒子效果",
        path: "/users/particle",
        class: lazy(() => import('../sprayView/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "动态KeyFrame",
        path: "/users/keyframeSerial",
        class: lazy(() => import('../keyframeSerial/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "SoundPool",
        path: "/users/soundPool",
        class: lazy(() => import('../soundPool/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "滚动的长图片",
        path: "/users/LongImage",
        class: lazy(() => import('../longImage/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "Hash方式路由切换",
        path: "/users/hashHistoryLike",
        class: lazy(() => import('../hashHistoryLike/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "子页面启动(openBlank)",
        path: "/users/openBlank",
        class: lazy(() => import('../openBlank/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "子页面启动(openSelf)",
        path: "/users/openSelf",
        class: lazy(() => import('../openSelf/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "ScrollNum",
        path: "/users/scrollNum",
        class: lazy(() => import('../scrollNum/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "多行文字区域内对齐",
        path: "/users/TextBox",
        class: lazy(() => import('../textBox/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "文字清晰度自适应描画区域",
        path: "/users/textScale",
        class: lazy(() => import('../textScale/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "图片预加载",
        path: "/users/preload",
        class: lazy(() => import('../preload/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "ClassName写法样例",
        path: "/users/classNameDemo",
        class: lazy(() => import('../classNameDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "抛物运动写法样例",
        path: "/users/throwMoveDemo",
        class: lazy(() => import('../throwMoveDemo/App').then(m => ({ default: m.SubApp })))
    },
    {
        name: "texture缓存示例",
        path: "/users/imageStorage",
        class: lazy(() => import('../imageStorage/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "碰撞即停测试用例",
        path: "/users/impactStopDemo",
        class: lazy(() => import('../impactStopDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "长文本显示\n(用户协议界面Demo)",
        path: "/users/longText",
        class: lazy(() => import('../longText/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "翻牌游戏",
        path: "/users/flipCard",
        class: lazy(() => import('../flipCard/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "格式混排文字",
        path: "/users/multiStyleText",
        class: lazy(() => import('../multiStyleText/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "设置颜色空间",
        path: "/users/colorSpace",
        class: lazy(() => import('../colorSpace/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "指定texture尺寸",
        path: "/users/textureSize",
        class: lazy(() => import('../textureSize/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "触控--滑动",
        path: "/users/touchDemo",
        class: lazy(() => import('../touchDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "拼图demo",
        path: "/users/maskClipDemo",
        class: lazy(() => import('../maskClipDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "Web/Gif播放控制",
        path: "/users/apicDemo",
        class: lazy(() => import('../aPicDemo/App').then(m => ({ default: m.SubApp }))),
    }
];
const demoSceneInfos = [
    // 场景
    {
        name: "直播间",
        path: "/users/liveRoom",
        class: lazy(() => import('../liveRoom/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "红包雨",
        path: "/users/giftRain",
        class: lazy(() => import('../giftRain/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "转盘抽奖",
        path: "/users/turntableDemo",
        class: lazy(() => import('../turntableDemo/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "砸金蛋活动",
        path: "/users/smashEggs",
        class: lazy(() => import('../smashEggs/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "幸运九宫格",
        path: "/users/nineSquared",
        class: lazy(() => import('../nineSquared/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "小狗跨栏游戏",
        path: "/users/games1",
        class: lazy(() => import('../games/tappingFlying/apps/dog/App').then(m => ({ default: m.SubApp }))),
    },
    {
        name: "小鸟",
        path: "/users/games2",
        params: "appname=birdflying&difficult=hard",
        class: lazy(() => import('../games/tappingFlying/gameengine/App').then(m => ({ default: m.SubApp }))),
    }
];
const color = ["#89BEB2", "#C9BA83", "#DED38C", "#DE9C53"];
let index = 0;
for (const item of demoFuncInfos) {
    item.color = color[index];
    index = index === color.length - 1 ? 0 : index + 1;
}
for (const item of demoSceneInfos) {
    item.color = color[index];
    index = index === color.length - 1 ? 0 : index + 1;
}

class DemoApp extends React.Component {
    constructor(props) {
        super(props);
        this._FocusControl = null;

        this._NavigateHome = (() => {
            if (globalHistory.length > 1) {
                globalHistory.goBack();
                this._FocusControl.changeFocus("/");
                return true;
            }
            return false;
        });

        this.focusId = 0;
        this.state = {
            homepageDisplay: "visible",

        };
    }

    getFocusId = () => {
        return this.focusId;
    }

    changeFocusId = (focus_id) => {
        this.focusId = focus_id;
    }

    getRenderData = () => {
        if (this.focusId === 0) {
            return demoFuncInfos;
        }
        return demoSceneInfos;
    }

    render() {
        return (
            <div style={{ width: 1920, height: 1080, backgroundColor: "#000000" }}>
                <FdivRouter controlRef={(ref) => {
                    this._FocusControl = ref;
                }}>
                    <Router history={globalHistory.getReference()}>
                        <React.Suspense fallback={<div></div>}>
                            <Switch>
                                {
                                    demoFuncInfos.map((item, index) => {
                                        return (
                                            <Route key={`func_${index}`} path={item.path}>
                                                <item.class branchName={item.path} navigateHome={this._NavigateHome} />
                                            </Route>);
                                    })

                                }
                                {
                                    demoSceneInfos.map((item, index) => {
                                        return (
                                            <Route key={`scene_${index}`} path={item.path}>
                                                <item.class branchName={item.path} navigateHome={this._NavigateHome} />
                                            </Route>);
                                    })
                                }
                                <Route path="/">
                                    <Home branchName="/" funcData={demoFuncInfos} sceneData={demoSceneInfos}
                                        getRenderData={this.getRenderData} changeFocusId={this.changeFocusId}
                                        getFocusId={this.getFocusId} />
                                </Route>
                            </Switch>
                        </React.Suspense>
                    </Router>
                    <div style={{ visibility: this.state.homepageDisplay }}>
                    </div>
                </FdivRouter>
            </div>
        );
    }

    componentDidMount() {
        if (globalHistory.location.pathname && globalHistory.location.pathname.indexOf("/users") >= 0) {
            this._FocusControl.changeFocus(globalHistory.location.pathname);
        } else {
            this._FocusControl.changeFocus("/");
        }

        // 调试接口，对接JSCenter平台去掉启动图的处理
        JSBridge.indicateHomePageLoadDone();
    }
}

export default DemoApp;
