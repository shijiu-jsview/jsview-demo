import React from 'react';
import createStandaloneApp from "../demoCommon/StandaloneApp";
import { FocusBlock } from "../demoCommon/BlockDefine";
import { JsvActorMoveControl } from "../jsview-utils/JsViewReactWidget/JsvActorMove";
import CssStyles from "./Styles";
import TargetDemo from "./TargetDemo";
import LRParabolicDemo from "./LRParabolicDemo";
import UDParabolicDemo from "./UDParabolicDemo";
import AccDemo from "./AccDemo";

class MainScene extends FocusBlock {
  constructor(props) {
    super(props);
    this._ThrowControl = new JsvActorMoveControl(); // 抛物运动体控制器
    this._MoveControl = new JsvActorMoveControl(); // 平移运动体控制器
    this._ThrowControl1 = new JsvActorMoveControl(); // 抛物运动体控制器
    this._MoveControl1 = new JsvActorMoveControl(); // 平移运动体控制器
    this._ThrowControl3 = new JsvActorMoveControl(); // 抛物运动体控制器
    this._MoveControl3 = new JsvActorMoveControl(); // 平移运动体控制器
    this._ThrowControl4 = new JsvActorMoveControl(); // 抛物运动体控制器
    this._MoveControl4 = new JsvActorMoveControl(); // 平移运动体控制器
    this._LeftOrRight = 1; // -1:left, 1:right
    this.state = {
      direction: this._LeftOrRight,
      demoIndex: 1,
    };
    this._ToggleDirection = 1;
  }

  onKeyDown(ev) {
    switch (ev.keyCode) {
      case 10000:
      case 27:
        if (this._NavigateHome) {
          this._NavigateHome();
        }
        break;
      case 37:// left
      {
        let index = this.state.demoIndex;
        if (--index < 0) {
          index = 3;
        }
        this.setState({ demoIndex: index });
        this.changeFocus(`/demo${index}`);
        break;
      }
      case 39:// right
      {
        let index = this.state.demoIndex;
        if (++index > 3) {
          index = 0;
        }
        this.setState({ demoIndex: index });
        this.changeFocus(`/demo${index}`);
        break;
      }
      default:
        break;
    }

    return true;
  }

  onFocus() {
    this.changeFocus("/demo1");
  }

  renderContent() {
    return (
      <>
                <div key="bg" style={{ width: 1280, height: 720, backgroundColor: "#000000" }}/>
                <React.Fragment>
                    <div key="leftWall" style={{ top: 0, left: 425, width: 5, height: 620, backgroundColor: "#F0F000" }}/>
                    <div key="rightWall" style={{ top: 0, left: 850, width: 5, height: 620, backgroundColor: "#F0F000" }}/>
                    <div key="bottomWall" style={{ top: 620, left: 425, width: 430, height: 5, backgroundColor: "#F0F000" }}/>
                    <div key="GuidText1" className={CssStyles.FontStyle.getName()}
                         style={{ top: 625, left: (1280 - 430) / 2, width: 430, height: 40 }}>
                        {`按OK键进行跳跃和转向`}
                    </div>
                    <div key="GuidText2" className={CssStyles.FontStyle.getName()}
                         style={{ top: 625 + 40, left: (1280 - 430) / 2, width: 430, height: 40 }}>
                        {`左右键切换不同模式的Demo`}
                    </div>
                </React.Fragment>
                <TargetDemo branchName="/demo0"/>
                <LRParabolicDemo branchName="/demo1"/>
                <UDParabolicDemo branchName="/demo2"/>
                <AccDemo branchName="/demo3"/>
      </>
    );
  }

  componentDidMount() {

  }
}
const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
