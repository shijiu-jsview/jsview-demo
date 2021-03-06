import React from 'react';
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import BasicLayer from './BasicLayer';
import MessageLayer from './MessageLayer';
import InputLayer from './InputLayer';
import GiftLayer from './GiftLayer';

class LiveRoom extends FocusBlock {
  constructor(props) {
    super(props);
    this._autoPlay = false;
    this.video = null; // the html5 video
    this.state = {
      play_state: this._autoPlay ? "pause" : "play",
    };
  }

  componentWillUnmount() {
    console.log("Video App componentWillUnmount in");
  }

  componentDidMount() {
    console.log("Video App componentDidMount in");
  }

    _RefVideo = (ele) => {
      console.log("video:", ele);
      this.video = ele;
    }

    onKeyDown(ev) {
      if (ev.keyCode === 10000 || ev.keyCode === 27) {
        if (this._NavigateHome) {
          this._NavigateHome();
        }
        return true;
      }
      return false;
    }

    renderContent () {
      const _style = {
        top: 0,
        left: 0,
        width: 1280,
        height: 720,
        objectFit: "fill",
      };
      return (
            <React.Fragment>
                <video
                    style={_style}
                    // src="http://oss.image.51vtv.cn/homepage/20190726/4cc4e6a8fd7d9d9c707ed4c4da27ca9d.mp4"
                    src="http://qcast-image.oss-cn-qingdao.aliyuncs.com/homepage/20190726/4cc4e6a8fd7d9d9c707ed4c4da27ca9d.mp4"
                    ref={this._RefVideo}
                    autoPlay={true}
                    muted={true}
                    loop={true}
                />
                {/* <div style={{..._style, backgroundColor:"rgba(255,100,100,1)"}}> */}
                    <BasicLayer branchName="/liveRoom/basicLayer" />
                    <MessageLayer branchName="/liveRoom/MessageLayer" />
                    <InputLayer branchName="/liveRoom/InputLayer" />
                    <GiftLayer branchName="/liveRoom/GiftLayer" />
                {/* </div> */}

            </React.Fragment>
      );
    }
}

const App = createStandaloneApp(LiveRoom);

export {
  App, // ????????????????????????
  LiveRoom as SubApp, // ??????????????????????????????
};
