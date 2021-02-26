import React from 'react';
import { MetroPage, VERTICAL } from "../jsview-utils/jsview-react/index_widget";
import Commodity from "./Commodity";
import { FocusBlock } from "../demoCommon/BlockDefine";
import createStandaloneApp from "../demoCommon/StandaloneApp";
import "./App.css"

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);

        this._data = [];

        // 添加300个模拟数据
        for (let i = 0; i < 183; i++) {
            this._data.push({
                name: `商品：骆驼奶粉蛋白质粉，限时抢购，立刻发货，序号:${i}`,
                prize: `${Math.floor(Math.random() * 200) + 200}`, /* 测试数据要保证比最高优惠券(300左右)要高 */
                savePrize: `${i}`,
                soldTotal: `${Math.floor(Math.random() * 50000)}`,
                pictUrl: "http://img.alicdn.com/bao/uploaded/i3/2207313464483/O1CN01Ab4vWz1izGAyRL1Yf_!!0-item_pic.jpg",
            });
        }
    }

    _Measures = (item) => {
        return MetroPage.getMeasureObj(227, 351, true, false);
    };

    _OnItemFocus = (data_item) => {
        if (data_item._Commodity) {
            data_item._Commodity.becomeFocus();
        }
    };

    _OnItemBlur = (data_item) => {
        if (data_item._Commodity) {
            data_item._Commodity.becomeBlur();
        }
    };

    _RenderItem = (data_item, onedge, query) => {
        return (
            <Commodity scale={1.0} isFocus={false} index={query.id} data={data_item} ref={(ref) => { data_item._Commodity = ref; }} />
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
        console.log("On App focused");
        this.changeFocus(`${this.props.branchName}/widget1`);
    }

    _onFocusPosChange = () => {

    }

    _renderLoadView = () => {
        return (
            <div style={{ width: 1253, height: 50, backgroundColor: "rgba(255,0,0,0.5)", textAlign: 'center', fontSize: "40px" }}>
                <div style={{ width: 1253, height: 50, textAlign: 'center', fontSize: "40px" }}>
                    加载中
                </div>
                <div style={{top: 10, left: 500, width: 30, height: 30, backgroundColor: "#FFFFFF", animation: "myRotate 1s infinite"}}/>
            </div>
        )
    }

    renderContent() {
        return (
            <div style={{ width: 1920, height: 1080, backgroundColor: "#00000F" }}>
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
                }}>{`使用ClassName写法可提升渲染性能`}</div>
                <div style={{ top: 100, left: 70 }}>
                    <MetroPage
                        width={1253}
                        height={600}
                        padding={{ left: 26, top: 36, right: 26, bottom: 36 }}
                        direction={VERTICAL}
                        data={this._data}
                        renderItem={this._RenderItem}
                        measures={this._Measures}
                        branchName={`${this.props.branchName}/widget1`}
                        onItemFocus={this._OnItemFocus}
                        onItemBlur={this._OnItemBlur}

                        onFocusPosChange={this._onFocusPosChange}
                        renderLoadView={this._renderLoadView}
                        loadViewSize={{ width: 500, height: 50 }}
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
