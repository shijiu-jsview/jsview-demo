import React from 'react';
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";
import { JsvActorMoveControl, JsvActorMove } from "../jsview-utils/JsViewReactWidget/JsvActorMove";
import CssStyles from "./Styles";

class UDParabolicDemo extends FocusBlock {
  constructor(props) {
    super(props);
    this._ThrowControl = new JsvActorMoveControl(); // 抛物运动体控制器
    this._MoveControl = new JsvActorMoveControl(); // 平移运动体控制器
    this._UpOrDown = 1; // -1:下, 1:上
    this.state = {
      direction: this._UpOrDown,
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
      this._UpOrDown = -this._UpOrDown;
      this.setState({
        direction: this._UpOrDown
      });
      // 向上向下抛物
      this._ThrowControl.throwAlongY(-400 * this._ToggleDirection, 550 * this._ToggleDirection, {
        type: "catch",
        position: 100 * this._ToggleDirection,
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
    const direction = this.state.direction < 0 ? "上" : "下";
    const detail = this.state.direction < 0 ? "向上抛物" : "向下掷物并弹起";
    return (
            <div>
                <div key="sample1" className={CssStyles.DetailFontStyle.getName()}
                     style={{ top: 150, left: 425, width: 430, height: 40 }}>{detail}</div>
                <div key="DirectText" className={CssStyles.FontStyle.getName()}
                     style={{ top: 250, left: 425, width: 430, height: 40 }}>
                    {`当前方向:${direction}`}
                </div>
                <div style={{ top: 450, left: 625 }}>
                    <JsvActorMove key="move2" control={this._MoveControl}>
                        <JsvActorMove key="throw2" control={this._ThrowControl}>
                            <div style={{ backgroundColor: "#ffb915", width: 30, height: 30 }}></div>
                        </JsvActorMove>
                    </JsvActorMove>
                </div>
            </div>
    );
  }

  componentDidMount() {

  }
}

export default UDParabolicDemo;
