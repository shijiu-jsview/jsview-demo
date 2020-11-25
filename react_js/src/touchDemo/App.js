import React from 'react';
import { FocusBlock } from "../demoCommon/BlockDefine";
import createStandaloneApp from "../demoCommon/StandaloneApp";
import JsvTouchContainer from "../jsview-utils/JsViewReactWidget/JsvTouchContainer";
import TouchContainerVertical from "./TouchContainerVertical";
import TouchContainerHorizontal from "./TouchContainerHorizontal";
import SimpleWidgetHorizontal from "./SimpleWidgetHorizontal";
import SimpleWidgetVertical from "./SimpleWidgetVertical";

class MainScene extends FocusBlock {
  constructor(props) {
    super(props);
    this.state = {
      simpleVerticalVisible: false,
      simpleHorizontalVisible: true,
      touchContainerHorizontalVisible: false,
      touchContainerVerticalVisible: false,
      title: "SimpleWidget 横向"
    };
  }

  onKeyDown(ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      if (this._NavigateHome) {
        this._NavigateHome();
      }
    }
    return true;
  }

  onFocus() {
    console.log("touch Demo onfocus");
  }

  onBlur() {
    console.log("touch Demo onblur");
  }

    _onClick=(id) => {
      switch (id) {
        case 0:
          this.setState({
            title: "SimpleWidget 横向",
            simpleVerticalVisible: false,
            simpleHorizontalVisible: true,
            touchContainerHorizontalVisible: false,
            touchContainerVerticalVisible: false,
          });
          break;
        case 1:
          this.setState({
            title: "SimpleWidget 纵向",
            simpleVerticalVisible: true,
            simpleHorizontalVisible: false,
            touchContainerHorizontalVisible: false,
            touchContainerVerticalVisible: false,
          });
          break;
        case 2:
          this.setState({
            title: "TouchContainer 横向",
            simpleVerticalVisible: false,
            simpleHorizontalVisible: false,
            touchContainerHorizontalVisible: true,
            touchContainerVerticalVisible: false,
          });
          break;
        case 3:
          this.setState({
            title: "TouchContainer 纵向",
            simpleVerticalVisible: false,
            simpleHorizontalVisible: false,
            touchContainerHorizontalVisible: false,
            touchContainerVerticalVisible: true,
          });
          break;
        default:
          break;
      }
      return true;
    }

    renderContent() {
      return (
            <div>
            <div style={{
              width: 1280, height: 720 * 2, backgroundColor: "#1b2697" }}>
                <JsvTouchContainer style={{ left: 50, top: 10, width: 280, height: 80, backgroundColor: "#ff0000", fontSize: 18, lineHeight: "80px" }}
                                   onClick={() => { this._onClick(0); }}
                                   direction={JsvTouchContainer.DIRECTION_DISABLE}>SimpleWidget 横向</JsvTouchContainer>
                <JsvTouchContainer style={{ left: 350, top: 10, width: 280, height: 80, backgroundColor: "#ff0000", fontSize: 18, lineHeight: "80px" }}
                                   onClick={() => { this._onClick(1); }}
                                   direction={JsvTouchContainer.DIRECTION_DISABLE}>SimpleWidget 纵向</JsvTouchContainer>
                <JsvTouchContainer style={{ left: 650, top: 10, width: 280, height: 80, backgroundColor: "#ff0000", fontSize: 18, lineHeight: "80px" }}
                                   onClick={() => { this._onClick(2); }}
                                   direction={JsvTouchContainer.DIRECTION_DISABLE}>TouchContainer 横向</JsvTouchContainer>
                <JsvTouchContainer style={{ left: 950, top: 10, width: 280, height: 80, backgroundColor: "#ff0000", fontSize: 18, lineHeight: "80px" }}
                                   onClick={() => { this._onClick(3); }}
                                   direction={JsvTouchContainer.DIRECTION_DISABLE}>TouchContainer 纵向</JsvTouchContainer>
                <div style={{ left: 30, top: 100, width: 400, height: 80, fontSize: 30, lineHeight: "80px", color: "#f0ef29" }}>{this.state.title}</div>
                {
                    this.state.touchContainerHorizontalVisible ? <div style={{ left: 30, top: 180 }}>
                    <TouchContainerHorizontal />
                </div> : null
                }
                {
                    this.state.touchContainerVerticalVisible ? <div style={{ left: 30, top: 180 }}>
                        <TouchContainerVertical />
                    </div> : null
                }
                {
                    this.state.simpleHorizontalVisible ? <div style={{ left: 30, top: 180 }}>
                        <SimpleWidgetHorizontal />
                    </div> : null
                }
                {
                    this.state.simpleVerticalVisible ? <div style={{ left: 30, top: 180 }}>
                        <SimpleWidgetVertical />
                    </div> : null
                }
            </div>
        </div>
      );
    }
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
