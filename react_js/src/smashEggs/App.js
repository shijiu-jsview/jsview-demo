import React from 'react';
import './App.css';
import TipsPage from "./views/not_support/TipsPage"
import MainPage from "./views/smash_eggs/MainPage"
import SubPageBgUrl from "./images/subpage_bg.png"
import CommonApi from "./common/CommonApi"
import createStandaloneApp from "../demoCommon/StandaloneApp"
import { FocusBlock } from "../demoCommon/BlockDefine"
class MainScene extends FocusBlock {
    constructor(props) {
        super(props);
        this._FocusControl = null;
        this._goMainPage = this._goMainPage.bind(this);
        this.state = {
            AlreadyPurchased: false
        };
        console.log("smash eggs in")
    }

    _requestFocus(branchName, keep_child_focus) {
        this.changeFocus(branchName, keep_child_focus);
    }

    _goMainPage() {
        this.setState({AlreadyPurchased: 1});
        this._requestFocus("smash/MainPage", false)
    }

    componentDidMount() {
        //修改中转页，判断如果不是已购用户并且当日未提醒（按日期记录到localStorage中），则跳转到活动引导页
        CommonApi.reportLog('201000');

        //根据机型判断是否支持此活动
        if (CommonApi.ifSupportActivity()) {
            /*let promise = CommonApi.isAlreadyBought();//ajax请求是否已经购买
            promise.then((data) => {*/
                console.log("isSubcribed:",1);
                this.setState({AlreadyPurchased: 1});
                this._requestFocus("smash/MainPage", true)
            /*})
                .catch((error) => {
                    console.log("App error:", error);
                    this._requestFocus("smash/MainPage")
                });*/
        } else {
            this._requestFocus("smash/TipsPage", true)
        }
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
            <div style={{width: 1920, height: 1080, backgroundImage: SubPageBgUrl,
                left:(1280-1920)/2,top:(720-1080)/2,
                transform:"scale3d(0.67,0.67,1.0)"}}>
                {/*preload image */}
                <div key="pre_bg" style={{backgroundImage: SubPageBgUrl, width: 1, height: 1}}></div>
                <TipsPage branchName="smash/TipsPage"/>
                <MainPage branchName="smash/MainPage" AlreadyPurchased={this.state.AlreadyPurchased}/>
            </div>
        )
    }
}

let App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};
