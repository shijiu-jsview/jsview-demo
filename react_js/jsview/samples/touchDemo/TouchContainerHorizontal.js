import React from 'react';
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";
import JsvTouchContainer from "../jsview-utils/JsViewReactWidget/JsvTouchContainer";

class TouchContainerHorizontal extends FocusBlock {
  constructor(props) {
    super(props);
    this._DataList = null;
  }

  _getDataList() {
    if (this._DataList === null) {
      this._DataList = [];
      for (let i = 0; i < 20; i++) {
        this._DataList.push(
                    <JsvTouchContainer key={`item_${i}`} style={{
                      left: 122 / 2 * i,
                      top: 50,
                      width: 122 / 2 - 10,
                      height: 300,
                      fontSize: 18,
                      backgroundColor: `rgba(${parseInt(Math.random() * 255, 10)},${parseInt(Math.random() * 255, 10)},${parseInt(Math.random() * 255, 10)},1.0)`
                    }}
                    onClick={this._onClick}
                    direction={JsvTouchContainer.DIRECTION_DISABLE}>{i}</JsvTouchContainer>);
      }
    }
    return this._DataList;
  }

  onKeyDown(ev) {
    return true;
  }

  onFocus() {
    console.log("touch Demo onfocus");
  }

  onBlur() {
    console.log("touch Demo onblur");
  }

    _onClick=(msg) => {
      console.log(`_onClick:${JSON.stringify(msg)}`);
      return true;
    }

    renderContent() {
      return (
            <div style={{ width: 1280, height: 720, overflow: "hidden" }}>
                <JsvTouchContainer style={{ width: 1280, height: 720 * 2, backgroundColor: "#7b7a1c" }}
                                   direction={JsvTouchContainer.DIRECTION_VERTICAL}
                                   dragLimitArea={{ x: 0, y: 0, width: 1280, height: 720 }}>
                    <div style={{ left: 30, top: 0, width: 400, height: 40, fontSize: 25, lineHeight: "40px", color: "#f0ef29" }}>整屏幕滑动</div>
                    <JsvTouchContainer
                        style={{ left: 0, top: 50, width: (1280 - 60) * 5, height: 400, backgroundColor: "rgba(255,0,0,0.5)" }}
                        direction={JsvTouchContainer.DIRECTION_HORIZONTAL}
                        flingPageWidth={1280 - 60}
                        dragLimitArea={{ x: 0, y: 0, width: 1280 - 60, height: 400 }}>
                        <div style={{ left: 0, top: 0, width: 1280 - 60, height: 400, backgroundColor: "#b9b7b9" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: 1280 - 60, top: 0, width: 1280 - 60, height: 400, backgroundColor: "#978924" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: (1280 - 60) * 2, top: 0, width: 1280 - 60, height: 400, backgroundColor: "#33334f" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: (1280 - 60) * 3, top: 0, width: 1280 - 60, height: 400, backgroundColor: "#f7f7eb" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: (1280 - 60) * 4, top: 0, width: 1280 - 60, height: 400, backgroundColor: "#41b983" }}>
                            {this._getDataList()}
                        </div>
                    </JsvTouchContainer>
                    <div style={{ left: 30, top: 480, width: 400, height: 40, fontSize: 18, lineHeight: "40px", color: "#f0ef29" }}>左右滑动</div>
                    <JsvTouchContainer
                        style={{ left: 0, top: 550, width: (1280 - 60) * 5, height: 400, backgroundColor: "#1d9797" }}
                        direction={JsvTouchContainer.DIRECTION_HORIZONTAL}
                        dragLimitArea={{ x: 0, y: 0, width: (1280 - 60), height: 400 }}>
                        <div style={{ left: 0, top: 0, width: 1280 - 60, height: 400, backgroundColor: "#b9b7b9" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: 1280 - 60, top: 0, width: 1280 - 60, height: 400, backgroundColor: "#978924" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: (1280 - 60) * 2, top: 0, width: 1280 - 60, height: 400, backgroundColor: "#33334f" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: (1280 - 60) * 3, top: 0, width: 1280 - 60, height: 400, backgroundColor: "#f7f7eb" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: (1280 - 60) * 4, top: 0, width: 1280 - 60, height: 400, backgroundColor: "#41b983" }}>
                            {this._getDataList()}
                        </div>
                    </JsvTouchContainer>
                </JsvTouchContainer>
            </div>
      );
    }
}

export default TouchContainerHorizontal;
