import React from 'react';
import { FocusBlock } from "../demoCommon/BlockDefine";
import createStandaloneApp from "../demoCommon/StandaloneApp";
import { SimpleWidget, HORIZONTAL } from "../jsview-utils/jsview-react/index_widget";

import jpgDemo from "./jpgDemo.jpg";
import jpegDemo from "./jpegDemo.jpeg";
import pngDemo from "./pngDemo.png";
import pngNoAlphaDemo from "./pngNoAlphaDemo.png";
import bmpDemo from "./bmpDemo.bmp";

const image_list = [`url(${jpgDemo})`, `url(${jpegDemo})`, `url(${pngDemo})`, `url(${pngNoAlphaDemo})`, `url(${bmpDemo})`];
const data = [];
for (let i = 0; i < 60; i++) {
    data.push({
        id: i,
        width: 300,
        height: 300,
        image: image_list[Math.floor(i / 12)]
    });
}

class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focus: false,
            anim: null,
        }
    }

    focus() {
        this.setState({
            focus: true,
        })
    }

    blur() {
        this.setState({
            focus: false,
        })
    }

    render() {
        let item = this.props.data;
        return (
            <div style={{ width: item.width - 10, height: item.height - 10, fontSize: "30px" }}>
                <img alt="" style={{ width: item.width - 10, height: item.height - 10, borderRadius: '15px 15px 15px 15px' }} jsv_img_color_space={"RGB_565"} src={item.image} />
                {item.id}
                {this.state.focus ? <div style={{ width: 20, height: 20, backgroundColor: "#FF0000" }} /> : null}
            </div>
        )
    }
}

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);

        this._measures = this._measures.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onItemFocus = this._onItemFocus.bind(this);
        this._onItemBlur = this._onItemBlur.bind(this);
        this._onClick = this._onClick.bind(this);

        this.state = {
            textureSize: "HTML上无缓存大小",
            position: 0,
        };

        if (window.JsView) {
            window.JsView.setGlobalConfig({
                texCache: 10 * 1024 * 1024,
                holderCache: 1000
            });
            this.state.textureSize = "10M";
        }
    }


    _measures(item) {
        return SimpleWidget.getMeasureObj(item.width, item.height, true, false);
    }

    _renderItem(item, on_edge, query, view_obj) {
        return (
            <Item ref={ele => view_obj.view = ele} data={item} />
        )
    }

    _onItemBlur(data, qurey, view_obj) {
        if (view_obj && view_obj.view) {
            view_obj.view.blur();
        }
    }

    _onItemFocus(item, pre_dege, query, view_obj) {
        if (view_obj && view_obj.view) {
            view_obj.view.focus();
        }
    }

    _onClick(item) {
        if (window.JsView) {
            if (this.state.textureSize === "10M") {
                window.JsView.setGlobalConfig({
                    texCache: 1024,
                    holderCache: 1000
                });
                this.setState({
                    textureSize: "1K"
                });
            } else {
                window.JsView.setGlobalConfig({
                    texCache: 10 * 1024 * 1024,
                    holderCache: 1000
                });
                this.setState({
                    textureSize: "10M"
                });
            }
        }
    }

    onKeyDown(ev) {
        switch (ev.keyCode) {
            case 10000:
            case 27:
                if (this._NavigateHome) {
                    if (window.JsView) {
                        window.JsView.setGlobalConfig({
                            texCache: -1,
                        });
                    }
                    this._NavigateHome();
                }
                break;
            default:
                break;
        }
        return true;
    }

    onFocus() {
        this.changeFocus(`${this.props.branchName}/widget1`);
    }

    renderContent() {
        return (
            <div style={{ width: 1920, height: 1080, backgroundColor: "#FFFFFF" }}>
                <div style={{ width: 1920, height: 100, fontSize: "50px", color: "#000000" }}>
                    {`按OK切换缓存大小, 现texture缓存大小为: ${this.state.textureSize}`}
                </div>
                <div style={{ top: 80, left: 50 }}>
                    <SimpleWidget
                        width={1700}
                        height={700}
                        padding={{ left: 20, top: 20, right: 20, bottom: 20 }}
                        direction={HORIZONTAL}
                        data={data}
                        onClick={this._onClick}
                        renderItem={this._renderItem}
                        onItemFocus={this._onItemFocus}
                        onItemBlur={this._onItemBlur}
                        measures={this._measures}
                        branchName={`${this.props.branchName}/widget1`}
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
