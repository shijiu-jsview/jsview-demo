import React from "react";
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import NativeSharedDiv from "../../utils/JsViewReactWidget/JsvNativeSharedDiv";

class MainScene extends FocusBlock {
  constructor(props) {
    super(props);

    this.state = {
      outX: 20,
      outY: 30,
      inX: 13,
      inY: 15,
    };

    this._TestData = [
      [20, 30, 13, 15],
      [30, 40, 13, 15],
      [40, 50, 3, 5], // 绝对位置不动，不触发信息更新
    ];

    this._Index = 0;

    // 每2秒进行位置变化以测试位置信息更新
    setInterval(() => {
      this._Index = (this._Index + 1) % 3;
      this.setState({
        outX: this._TestData[this._Index][0],
        outY: this._TestData[this._Index][1],
        inX: this._TestData[this._Index][2],
        inY: this._TestData[this._Index][3],
      });
    }, 2000);

    // 使用两个View来测试Id跟踪的正确性
    this._ReisterId = null;
    this._ReisterId2 = null;
  }

  getId = (id) => {
    if (this._ReisterId !== id) {
      window.jDemoInterface.listenerToSharedView(id);
      this._ReisterId = id;
    }
  };

  getId2 = (id) => {
    if (this._ReisterId2 !== id) {
      this._ReisterId2 = id;

      // 延迟注册，以测试listener注册前发送event的场景
      // 提前发出的event在listener注册时，可以收到最后状态信息
      setTimeout(() => {
        window.jDemoInterface.listenerToSharedView(id);
        setTimeout(() => {
          window.jDemoInterface.removeListenerToSharedView(this._ReisterId2);
        }, 10000);
      }, 1000);
    }
  };

  render() {
    return (
      <>
        <div
          style={{
            left: this.state.outX,
            top: this.state.outY,
            backgroundColor: "#00FF00",
            width: 600,
            height: 600,
          }}
        >
          <NativeSharedDiv
            getId={this.getId}
            style={{
              left: this.state.inX,
              top: this.state.inY,
              width: 500,
              height: 500,
            }}
          >
            <div
              style={{
                backgroundColor: "#00FF00",
                left: 50,
                top: 40,
                width: 30,
                height: 30,
              }}
            />
          </NativeSharedDiv>
        </div>
        <div
          style={{
            left: this.state.outX + 200,
            top: this.state.outY,
            backgroundColor: "#00FF00",
            width: 600,
            height: 600,
          }}
        >
          <NativeSharedDiv
            getId={this.getId2}
            style={{
              left: this.state.inX,
              top: this.state.inY,
              width: 500,
              height: 500,
            }}
          >
            <div
              style={{
                backgroundColor: "#00FF00",
                left: 50,
                top: 40,
                width: 30,
                height: 30,
              }}
            />
          </NativeSharedDiv>
        </div>
      </>
    );
  }
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
