import React from 'react';
import './App.css';
import TipsPage from "./views/not_support/TipsPage";
import MainPage from "./views/smash_eggs/MainPage";
import SubPageBgUrl from "./images/subpage_bg.png";
import CommonApi from "./common/CommonApi";
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";

class MainScene extends FocusBlock {
  constructor(props) {
    super(props);
    this._FocusControl = null;
    this.state = {
      info: null
    };
    console.log("smash eggs in");
  }

  _requestFocus(branchName, keep_child_focus) {
    this.changeFocus(branchName, keep_child_focus);
  }

  componentDidMount() {
    if (window.JsView) {
      console.log(`window.JsView Forge.Version:${window.Forge.Version}`);
      console.log(`window.JsView.CodeRevision:${window.JsView.CodeRevision}`);
      console.log(`window.JsView.ForgeNativeRevision:${window.JsView.ForgeNativeRevision}`);
    }

    // 修改中转页，判断如果不是已购用户并且当日未提醒（按日期记录到localStorage中），则跳转到活动引导页
    CommonApi.reportLog('201000');
    // 根据机型判断是否支持此活动
    if (CommonApi.ifSupportActivity()) { // TODO 判断机型是否支持该活动、默认为true
      console.log("isSubcribed:", 1);
      const promise = CommonApi.getInfo();// 获取活动信息
      promise.then((info) => {
        this.setState({ info });
        this._requestFocus("smash/MainPage", true);
      }).catch((error) => {
        console.log(`error:${error}`);
        this._requestFocus("smash/TipsPage", true);
      });
    } else {
      this._requestFocus("smash/TipsPage", true);
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
          <div style={{
            width: 1920,
            height: 1080,
            backgroundImage: SubPageBgUrl,
            left: (1280 - 1920) / 2,
            top: (720 - 1080) / 2,
            transform: 'scale3d(0.67,0.67,1.0)'
          }}>
            <TipsPage branchName="smash/TipsPage"/>
            <MainPage branchName="smash/MainPage" info={this.state.info}/>
          </div>
    );
  }
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
