import React from "react";
import createStandaloneApp from "../jsview-utils/JsViewReactTools/StandaloneApp";
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";

class MainScene extends FocusBlock {
  onKeyDown(ev) {
    // 按键处理函数，ev.keyCode的内容可以和 DefaultKeyCodeMap(在jsview-utils/JsViewReactTools) 的内容相对照
    console.log(`keydown ev=${ev.keyCode}`);
    return false;
  }

  // renderContent函数是FocusBlock子类的描画函数，作用同 React.Component的render函数
  // 返回主渲染内容
  renderContent() {
    return (
      <div
        style={{
          left: 0,
          top: 110,
          width: 200,
          height: 30,
          color: "#00AA00",
          fontSize: "20px",
        }}
      >
        这是空项目(在此加入项目的主界面)
      </div>
    );
  }
}

// 创建APP，带有视图焦点控制，启动后，焦点交由本界面
const App = createStandaloneApp(MainScene);

export { App };
