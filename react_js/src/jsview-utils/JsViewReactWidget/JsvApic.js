/**
 * Created by changhua.chen@qcast.cn on 11/13/2020.
 */

/*
 * 【模块 export 内容】
 * JsvApic：React高阶组件，控制动图播放
 *      prop说明:
 *          src {string} 对应img标签的src
 *          style {object} 对应img标签的style
 *      方法说明
 *          stop: 停止播放
 *          play: 开始播放
 */

import React from 'react';
import { ForgeExtension } from "../jsview-react/index_widget";
window.testtest = ForgeExtension;
class JsvApic extends React.Component {
    constructor(props) {
        super(props);
        this._Element = null;
    }

    stop() {
        if (window.JsView) {
            if (this._Element) {
                let main_view = this._Element.jsvMainView;
                if (main_view && main_view.ChildViews.length > 0) {
                    let target_view = main_view.ChildViews[0];
                    if (target_view.TextureSetting && target_view.TextureSetting.Texture && target_view.TextureSetting.Texture.RenderTexture) {
                        ForgeExtension.TextureManager.DispatchCommand(target_view.TextureSetting.Texture.RenderTexture.IdToken, 1, "");
                    }
                }
            }
        }
    }

    play() {
        if (window.JsView) {
            if (this._Element) {
                let main_view = this._Element.jsvMainView;
                if (main_view && main_view.ChildViews.length > 0) {
                    let target_view = main_view.ChildViews[0];
                    if (target_view.TextureSetting && target_view.TextureSetting.Texture && target_view.TextureSetting.Texture.RenderTexture) {
                        ForgeExtension.TextureManager.DispatchCommand(target_view.TextureSetting.Texture.RenderTexture.IdToken, 0, "");
                    }
                }
            }
        }
    }

    render() {
        if (window.JsView) {
            return (
                <img ref={(ele) => { this._Element = ele; }} jsv_auto_play="false" src={this.props.src} style={this.props.style} />
            )
        } else {
            return (
                <img src={this.props.src} style={this.props.style} />
            )
        }
    }

    componentDidMount() {
        if (this.props.autoPlay) {
            this.play();
        }
    }

    componentWillUnmount() {
        this.stop()
    }
}

JsvApic.defaultProps = {
    autoPlay: true,
}

export {
    JsvApic
}