import React from 'react';
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import { JsvActorMoveControl, JsvActorMove } from "../../utils/JsViewReactWidget/JsvActorMove";
import CssStyles from "./Styles";

class AccDemo extends FocusBlock {
  constructor(props) {
    super(props);
    this._ThrowControl = new JsvActorMoveControl(); // 抛物运动体控制器
    this._MoveControl = new JsvActorMoveControl(); // 平移运动体控制器
    this._LeftOrRight = 1; // -1:下, 1:上
    this.state = {
      direction: this._LeftOrRight,
      visible: false
    };
    this._ToggleDirection = 1;
  }

  onFocus() {
    this.setState({ visible: true });
  }

  onBlur() {
    this.setState({ visible: false });
  }

  onKeyDown(ev) {
    if (ev.keyCode === 13) {
      // 开始进行动画
      this._LeftOrRight = -this._LeftOrRight;
      this.setState({
        direction: this._LeftOrRight
      });

      // 向上向下加速度
      this._ThrowControl.throwAlongY(0, 750 * this._ToggleDirection, {
        type: "catch",
        position: 200 * this._ToggleDirection,
        direction: this._ToggleDirection
      }, (x, y) => {
        console.log(`Throw end with x=${x} y=${y}`);
      });

      this._ToggleDirection *= -1;

      return true;
    }
    return false;
  }

  renderContent() {
    if (!this.state.visible) {
      return null;
    }
    const direction = this.state.direction > 0 ? "上" : "下";
    return (
            <div>
        <div key="sample1" className={CssStyles.DetailFontStyle.getName()}
           style={{ top: 150, left: 425, width: 430, height: 40 }}>{`向${direction}加速`}</div>
        <div key="DirectText" className={CssStyles.FontStyle.getName()}
           style={{ top: 250, left: 425, width: 430, height: 40 }}>
          {`当前方向:${direction}`}
        </div>
        <div style={{ top: 390, left: 625 }}>
          <JsvActorMove key="move1" control={this._MoveControl}>
            <JsvActorMove key="throw1" control={this._ThrowControl}>
              <div style={{ backgroundColor: "#FF0000", width: 30, height: 30 }}></div>
            </JsvActorMove>
          </JsvActorMove>
              </div>
            </div>
    );
  }

  componentDidMount() {

  }
}

export default AccDemo;
