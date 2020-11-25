/*
 * 【界面概述】
 * 视频播放和控制样例
 *
 * 【控件介绍】
 * Fdiv：参照本地另一个demo: basicFdivConrol
 *
 * 【技巧说明】
 * Q: 如何加入播放视频？
 * A: render时使用H5的video标签即可
 *
 * Q: 视频播放控制？
 * A: video标签中通过ref拿到标签对象，通过H5视频标签标准接口进行控制
 *    起播：video标签.play()
 *    暂停：video标签.pause()
 *    改变播放进度：video标签.currentTime = 新的播放时间(毫秒)
 */
import React from 'react';
import createStandaloneApp from "../demoCommon/StandaloneApp";
import { FocusBlock } from "../demoCommon/BlockDefine";
import NormalVideo from "./NormalVideo";
import OffscreenVideo from "./OffscreenVideo";

class MainScene extends FocusBlock {
  changeMode=(use_texture) => {
    if (use_texture) {
      this.changeFocus("useTexture");
    } else {
      this.changeFocus("useSurface");
    }
  }

  onKeyDown(ev) {
    switch (ev.keyCode) {
      case 27:
      case 10000:
        if (this._NavigateHome) {
          this._NavigateHome();
        }
        break;
      default:
        break;
    }

    return true;
  }

  renderContent() {
    return (<div>
        <OffscreenVideo branchName="useTexture" changeMode={this.changeMode}/>
        <NormalVideo branchName="useSurface" changeMode={this.changeMode}/>
      </div>
    );
  }

  componentWillUnmount() {
    console.log("Video App componentWillUnmount in");
  }

  componentDidMount() {
    this.changeFocus("useTexture");
    console.log("Video App componentDidMount in");
  }
}
const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
