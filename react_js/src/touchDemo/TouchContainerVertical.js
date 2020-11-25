import React from 'react';
import { FocusBlock } from "../demoCommon/BlockDefine";
import JsvTouchContainer from "../jsview-utils/JsViewReactWidget/JsvTouchContainer";

class TouchContainerVertical extends FocusBlock {
  constructor(props) {
    super(props);
    this._DataList = null;
  }

  _getDataList() {
    if (this._DataList === null) {
      this._DataList = [];
      for (let i = 0; i < 10; i++) {
        this._DataList.push(
                    <JsvTouchContainer key={`vertical_item_${i}`} style={{
                      left: 10,
                      top: 50 * i,
                      width: 380,
                      height: 40,
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
                <JsvTouchContainer style={{ width: 1280, height: 720, backgroundColor: "#810000" }}
                                   direction={JsvTouchContainer.DIRECTION_HORIZONTAL}
                                   dragLimitArea={{ x: 0, y: 0, width: 1280, height: 720 }}>
                    <div style={{ left: 30, top: 0, width: 400, height: 40, fontSize: 25, lineHeight: "40px", color: "#f0ef29" }}>整屏幕滑动</div>

                    <JsvTouchContainer
                        style={{ left: 30, top: 50, width: 400, height: 500 * 5, backgroundColor: "#810000" }}
                        direction={JsvTouchContainer.DIRECTION_VERTICAL}
                        flingPageWidth={500}
                        dragLimitArea={{ x: 0, y: 0, width: 400, height: 500 }}>
                        <div style={{ left: 0, top: 0, width: 400, height: 500, backgroundColor: "#b9b7b9" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: 0, top: 500, width: 400, height: 500, backgroundColor: "#978924" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: 0 * 2, top: 500 * 2, width: 400, height: 500, backgroundColor: "#33334f" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: 0 * 3, top: 500 * 3, width: 400, height: 500, backgroundColor: "#f7f7eb" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: 0 * 4, top: 500 * 4, width: 400, height: 500, backgroundColor: "#41b983" }}>
                            {this._getDataList()}
                        </div>
                    </JsvTouchContainer>
                    <div style={{ left: 580, top: 0, width: 400, height: 40, fontSize: 18, lineHeight: "40px", color: "#f0ef29" }}>上下滑动</div>
                    <JsvTouchContainer
                        style={{ left: 650, top: 50, width: 400, height: 500 * 3, backgroundColor: "#1d9797" }}
                        direction={JsvTouchContainer.DIRECTION_VERTICAL}
                        dragLimitArea={{ x: 0, y: 0, width: 400, height: 500 }}>

                        <div style={{ left: 0, top: 0, width: 400, height: 500, backgroundColor: "#b9b7b9" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: 0, top: 500, width: 400, height: 500, backgroundColor: "#978924" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: 0 * 2, top: 500 * 2, width: 400, height: 500, backgroundColor: "#33334f" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: 0 * 3, top: 500 * 3, width: 400, height: 500, backgroundColor: "#f7f7eb" }}>
                            {this._getDataList()}
                        </div>
                        <div style={{ left: 0 * 4, top: 500 * 4, width: 400, height: 500, backgroundColor: "#41b983" }}>
                            {this._getDataList()}
                        </div>
                    </JsvTouchContainer>
                </JsvTouchContainer>
            </div>
      );
    }
}

export default TouchContainerVertical;
