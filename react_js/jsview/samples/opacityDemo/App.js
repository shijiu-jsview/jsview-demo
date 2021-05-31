import React from "react";
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import { JsvStyleClass } from "../../utils/JsViewReactTools/JsvStyleClass";
import "./AnimComposite.css"

const blockStyle = {
  top: 150,
  left: 100,
  width: 150,
  height: 150,
};

const sPicTitleTextClass = new JsvStyleClass({
  fontSize: 25,
  height: 68,
  lineHeight: 34,
  color: "#000000",
  textAlign: "center",
});

class MainScene extends FocusBlock {
  onKeyDown(ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      if (this._NavigateHome) {
        this._NavigateHome();
      }
    }

    // 按键处理函数，ev.keyCode的内容可以和 DefaultKeyCodeMap(在jsview-utils/JsViewReactTools) 的内容相对照
    console.log(`keydown ev=${ev.keyCode}`);
    return true;
  }

  // renderContent函数是FocusBlock子类的描画函数，作用同 React.Component的render函数
  // 返回主渲染内容
  renderContent() {
    let item_url = "http://oss.image.51vtv.cn/homepage/20210209/27bda620942566673ab449a3ef765321.png";

    return (
      <div style={{ width: 1920, height:1080, backgroundColor:"#334C4C" }}>
        <div style={{
          textAlign: "center",
          fontSize: "30px",
          lineHeight: "50px",
          color: "#ffffff",
          left: 100,
          top: 20,
          width: (1280 - 200),
          height: 50,
          backgroundColor: "rgba(27,38,151,0.8)"
        }}>{`透明动画效果展示样例`}</div>
        <div style={{ ...blockStyle,
          backgroundColor:"#0000FF",
          animation: 'opacityDemo_CompositeNoOpacity 3s infinite' }}>
        </div>
        <img style={{ ...blockStyle, objectFit:"contain", animation: 'opacityDemo_CompositeOpacity 3s infinite' }}
             src={`url(${item_url})`} >
        </img>
        <div
          className={sPicTitleTextClass.getName()}
          style={{ top: 320, left: 50, width: 250 }}
        >{`多动画组合\n图片ObjectFit`}</div>
      </div>
    );
  }
}

// 创建APP，带有视图焦点控制，启动后，焦点交由本界面
const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
