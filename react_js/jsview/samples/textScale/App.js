import React from "react";
import {
  SimpleWidget,
  VERTICAL,
} from "../../utils/JsViewEngineWidget/index_widget";
import { Commodity, Controller } from "./Commodity";
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";

class MainScene extends FocusBlock {
  constructor(props) {
    super(props);

    this._data = [];
    for (let i = 0; i < 3; i++) {
      this._data.push({
        name: i,
        controller: new Controller(),
      });
    }
    window.data = this._data;
  }

  _Measures = (item) => {
    return SimpleWidget.getMeasureObj(340, 526, true, false);
  };

  _OnItemFocus = (item) => {
    item.controller.focus();
  };

  _OnItemBlur = (item) => {
    item.controller.blur();
  };

  _RenderItem = (item) => {
    return (
      <Commodity
        controller={item.controller}
        scale={1.0}
        isFocus={false}
        name={item.name}
      />
    );
  };

  onKeyDown(ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      if (this._NavigateHome) {
        this._NavigateHome();
      }
    }
    return true;
  }

  onFocus() {
    this.changeFocus(`${this.props.branchName}/widget1`);
  }

  renderContent() {
    return (
      <div style={{ width: 1920, height: 1080, backgroundColor: "#00000F" }}>
        <div
          style={{
            textAlign: "center",
            fontSize: "30px",
            lineHeight: "50px",
            color: "#ffffff",
            left: 100,
            top: 20,
            width: 1280 - 200,
            height: 50,
            backgroundColor: "rgba(27,38,151,0.8)",
          }}
        >{`JsView环境下，放大后文字仍保持清晰显示`}</div>
        <div style={{ top: 100, left: 80 }}>
          <SimpleWidget
            width={1840}
            height={1000}
            padding={{ left: 100, top: 100, right: 20, bottom: 20 }}
            direction={VERTICAL}
            data={this._data}
            renderItem={this._RenderItem}
            measures={this._Measures}
            branchName={`${this.props.branchName}/widget1`}
            onItemFocus={this._OnItemFocus}
            onItemBlur={this._OnItemBlur}
          />
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
