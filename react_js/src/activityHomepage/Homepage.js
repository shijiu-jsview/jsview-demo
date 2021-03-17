/*
 * @Author: ChenChanghua
 * @Date: 2020-04-13 17:00:41
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2021-03-10 15:16:45
 * @Description: file content
 */
import React from 'react';
import { FdivWrapper, SimpleWidget, HORIZONTAL, VERTICAL } from "../jsview-utils/jsview-react/index_widget";
import "./homepage.css";
import shadow_big_img from "./images/shadow_big.png";
import shadow_small_img from "./images/shadow_small.png";
import { getGlobalHistory } from '../demoCommon/RouterHistoryProxy';
import { jJsvRuntimeBridge } from "../demoCommon/JsvRuntimeBridge";
import { FocusBlock } from "../demoCommon/BlockDefine";

const globalHistory = getGlobalHistory();

const PingPongBg = ({ animation, background, preBackground, animationEnd }) => {
    if (preBackground) {
        return (<div>
            <div style={{ width: 1280, height: 480, backgroundImage: `url(${preBackground})` }} />
            <div style={{ width: 1280, height: 480, backgroundImage: `url(${background})`, animation }} onAnimationEnd={animationEnd} />
        </div>);
    }
    return (<div>
        <div style={{ width: 1280, height: 480, backgroundImage: `url(${background})`, animation }} onAnimationEnd={animationEnd} />
    </div>);
};


let quitData = [
    {
        w: 100,
        h: 50,
        content: "确定"
    },
    {
        w: 100,
        h: 50,
        content: "取消"
    }
]
class QuitWindow extends FocusBlock {
    constructor(props) {
        super(props);
        this.measures = this.measures.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderFocus = this.renderFocus.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    measures(item) {
        return SimpleWidget.getMeasureObj(item.w + 50, item.h, true, false);
    }

    renderItem(item) {
        return (
            <div style={{ width: item.w, height: item.h, fontSize: "40px", color: "#FFFFFF" }}>
                {item.content}
            </div>
        )
    }

    renderFocus(item) {
        return (
            <div style={{ width: item.w, height: item.h, fontSize: "40px", color: "#0000FF" }}>
                {item.content}
            </div>
        )
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            this.props.callback(false);
        }
        return true;
    }

    onClick(item) {
        if (item.content == "确定") {
            this.props.callback(true);
        } else {
            this.props.callback(false);
        }
    }

    onFocus() {
        this.changeFocus(this.props.branchName + "/quit")
    }

    renderContent() {
        return (
            <React.Fragment>
                <div style={{ left: 0, top: 0, width: 350, height: 200, backgroundColor: "rgba(0,0,0,0.7)" }}></div>
                <div style={{ top: 20, width: 350, height: 50, fontSize: "40px", color: "#FFFFFF", textAlign: "center" }}>
                    是否退出
                </div>
                <div style={{ left: 50, top: 120 }}>
                    <SimpleWidget
                        width={300}
                        height={50}
                        direction={VERTICAL}
                        data={quitData}
                        onClick={this.onClick}
                        renderItem={this.renderItem}
                        renderFocus={this.renderFocus}
                        measures={this.measures}
                        branchName={`${this.props.branchName}/quit`}
                    />
                </div>
            </React.Fragment >

        )
    }
}

class Home extends FdivWrapper {
    constructor(prop) {
        super(prop);
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._RenderBlur = this._RenderBlur.bind(this);
        this._onWidgetMount = this._onWidgetMount.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onItemFocus = this._onItemFocus.bind(this);
        this._onItemBlur = this._onItemBlur.bind(this);
        this._quitWindowCallback = this._quitWindowCallback.bind(this);
        this._BgInAnimationEnd = this._BgInAnimationEnd.bind(this);
        this.ItemWidth = parseInt(1280 / this.props.data.length, 10);
        this.ItemHeight = 240;
        this.state = {
            preBackground: null,
            background: null,
            bgAnimation: null,
            scaleAnim: null,
            blurScaleAnim: null,
            pingPongToken: 0,
            quitWindow: false,
        };
    }

    _BgInAnimationEnd() {
        // nothing to do
    }

    _onItemBlur(item) {
        this._preBackground = item.background;
    }

    _onItemFocus(item) {
        console.log("_onItemFocus item:", item);
        let pingpong_token = this.state.pingPongToken;
        const animation = `bgInOpacity${pingpong_token} 0.5s`;
        const scale_animation = "itemScale 0.2s";
        const blur_scale_animation = "itemBlurScale 0.2s";
        if (++pingpong_token > 1) {
            pingpong_token = 0;
        }

        this.setState({
            background: item.background,
            bgAnimation: animation,
            scaleAnim: scale_animation,
            blurScaleAnim: blur_scale_animation,
            pingPongToken: pingpong_token
        });
    }

    _onClick(item) {
        console.log(globalHistory);
        globalHistory.push(item.path);
        this.changeFocus(item.path, true); // 若子节点已经focus，则不改变focus状态
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(this.ItemWidth, this.ItemHeight, true, false);
    }

    _RenderFocus(item) {
        return (
            <div>
                <div style={{ left: (this.ItemWidth - 248) / 2, top: 27, width: 248, height: 150, animation: this.state.scaleAnim }}>
                    <div style={{ left: (248 - 317) / 2, top: 0, width: 317, height: 219, backgroundImage: `url(${shadow_big_img})` }} />
                    <div style={{ left: 0, top: 4, width: 248, height: 150, borderRadius: 4, backgroundImage: `url(${item.icon})` }} />
                </div>
                <div style={{
                    left: (this.ItemWidth - 248) / 2,
                    top: 185,
                    width: 248,
                    height: 34,
                    lineHeight: 34,
                    fontSize: 24,
                    verticalAlign: "middle",
                    textAlign: "center",
                    color: "#ffffff"
                }}>{item.name}</div>
            </div>
        );
    }

    _RenderItem(item) {
        return (
            <div >
                <div style={{
                    left: (this.ItemWidth - 208) / 2,
                    top: (this.ItemHeight - 130) / 2,
                    width: 208,
                    height: 130,
                    backgroundImage: `url(${shadow_small_img})`
                }} />
                <div style={{
                    left: (this.ItemWidth - 202) / 2,
                    top: (this.ItemHeight - 120) / 2,
                    width: 202,
                    height: 120,
                    borderRadius: 4,
                    backgroundImage: `url(${item.icon})`
                }} />
            </div>
        );
    }

    _RenderBlur(item) {
        return (
            <div>
                <div style={{
                    left: (this.ItemWidth - 202) / 2,
                    top: (this.ItemHeight - 120) / 2,
                    width: 202,
                    height: 120,
                    animation: this.state.blurScaleAnim
                }}>
                    <div style={{
                        left: (202 - 208) / 2,
                        top: (120 - 130) / 2,
                        width: 208,
                        height: 130,
                        backgroundImage: `url(${shadow_small_img})`
                    }} />
                    <div style={{
                        left: 0,
                        top: 0,
                        width: 202,
                        height: 120,
                        borderRadius: 4,
                        backgroundImage: `url(${item.icon})`
                    }} />
                </div>
            </div>
        );
    }

    _onWidgetMount() {
        //
    }

    // 直接集成自FdivWrapper的场合，使用renderContent而不是render进行布局
    renderContent() {
        return (
            <div style={{ left: 0, top: 0 }}>
                <PingPongBg preBackground={this._preBackground} background={this.state.background}
                    animation={this.state.bgAnimation} animationEnd={this._BgInAnimationEnd} />
                <div style={{ top: 480, left: 0, width: 1280, height: this.ItemHeight, backgroundColor: "#D2DCE0" }}>
                    <SimpleWidget
                        width={1280}
                        height={this.ItemHeight}
                        direction={HORIZONTAL}
                        data={this.props.data}
                        onItemFocus={this._onItemFocus}
                        onItemBlur={this._onItemBlur}
                        renderItem={this._RenderItem}
                        renderFocus={this._RenderFocus}
                        renderBlur={this._RenderBlur}
                        onClick={this._onClick}
                        measures={this._Measures}
                        padding={{ top: 0, left: 0 }}
                        branchName={"home_page"}
                        onWidgetMount={this._onWidgetMount}
                    />
                </div>
                {
                    this.state.quitWindow ?
                        <div style={{ left: 465, top: 300 }}>
                            <QuitWindow branchName={"quitWindow"} callback={this._quitWindowCallback} />
                        </div> : null
                }
            </div>
        );
    }

    _quitWindowCallback(if_quit) {
        if (if_quit) {
            jJsvRuntimeBridge.closePage();
        }
        this.setState({
            quitWindow: false
        });
        this.changeFocus("home_page");
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            // jJsvRuntimeBridge.closePage();
            if (!this.state.quitWindow) {
                this.setState({
                    quitWindow: true
                });
                this.changeFocus("quitWindow");
            }
            return true;
        }
        return false;
    }

    onKeyUp(ev) {
        return true;
    }

    onDispatchKeyDown(ev) {
        return false;
    }

    onDispatchKeyUp(ev) {
        return false;
    }

    onFocus() {
        this.changeFocus("home_page");
    }

    onBlur() {
        this._preBackground = null;
    }
}

export default Home;
