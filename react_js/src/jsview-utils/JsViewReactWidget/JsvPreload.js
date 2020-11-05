import React from 'react';
import { Forge, ForgeExtension } from "../jsview-react/index_widget.js"

const CONST_FORMAT_TOKEN = "_JsvP_";

let buildPreloadInfo = (url,
                        width = 0,   // 指定加载时的宽度(0为不指定)，与div标签中的 jsv_img_scaledown_tex 属性一起使用
                        height = 0,  // 指定加载时的高度(0为不指定)，与div标签中的 jsv_img_scaledown_tex 属性一起使用
                        color_type = Forge.ColorSpace.RGBA_8888, // 指定加载色空间，与div标签中的 jsv_img_color_space 一起使用
                        net_setting = null // 预留，未使用，图片的网络加载header设置
) => {
    return {
        "url": url,
        "width": width,
        "height": height,
        "colorType": color_type,
        "netSetting": net_setting,
        "magicToken": CONST_FORMAT_TOKEN,  // 用于格式校验
    }
}

let buildDownloadInfo = (url,
                         net_setting = null // 预留，未使用，图片的网络加载header设置
) => {
    return {
        "url": url,
        "netSetting": net_setting,
        "magicToken": CONST_FORMAT_TOKEN, // 用于格式校验
    }
}

class JsvPreload extends React.Component {
    constructor(props) {
        super(props);
        this._PreloadViewList = [];
        this._DownloadViewList = [];

        this._PreloadStateList = [];
        this._DownloadStateList = [];
    }

    _releaseForgeView() {
        if (window.JsView) {
            if (this._PreloadViewList.length > 0) {
                for (let i of this._PreloadViewList) {
                    ForgeExtension.RootActivity.ViewStore.remove(i);
                }
                this._PreloadViewList = [];
            }

            if (this._DownloadViewList.length > 0) {
                for (let i of this._DownloadViewList) {
                    ForgeExtension.RootActivity.ViewStore.remove(i);
                }
                this._DownloadViewList = [];
            }
        } else {
            this._PreloadViewList = [];
            this._DownloadViewList = [];

            this._PreloadStateList = [];
            this._DownloadStateList = [];
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.preloadList.length === this.props.preloadList.length && nextProps.downloadList.length === this.props.downloadList.length) {
            let same = true;
            for (let i = 0; i < nextProps.preloadList.length; i++) {
                if (nextProps.preloadList[i].url != this.props.preloadList[i].url) {
                    same = false;
                    break;
                }
            }
            for (let i = 0; i < nextProps.downloadList.length; i++) {
                if (nextProps.downloadList[i].url != this.props.downloadList[i].url) {
                    same = false;
                    break;
                }
            }
            return !same
        } else {
            return true;
        }
    }

    _checkPreload() {
        for (let state of this._PreloadStateList) {
            if (!state) return;
        }
        if (this.props.onPreloadDone) {
            this.props.onPreloadDone();
        }
    }

    _getPreloadViewIdList() {
        if (!this.props.preloadList) { return }
        this._PreloadStateList = new Array(this.props.preloadList.length).fill(false);
        this._PreloadViewList = this.props.preloadList.map((item, index) => {
            if (item.magicToken !== CONST_FORMAT_TOKEN) {
                console.error("Error:format mismatch, data should comes from function buildPreloadInfo()");
            }
            let base_url = item.url;
            let image_url = base_url;
            if (base_url && base_url.indexOf("http") < 0) { // 包含http和https两种请求
                if (window.JsView.React.UrlRef) {
                    image_url = new window.JsView.React.UrlRef(base_url).href;
                }
            }
            let target_size = null;
            if (item.width !== 0 && item.height !== 0) {
                target_size = {width:item.width, height:item.height};
            }
            let texture = ForgeExtension.TextureManager.GetImage2(image_url, false, target_size, item.colorType);
            texture.RegisterLoadImageCallback(null, () => {
                // console.log("preload succeed " + image_url);
                this._PreloadStateList[index] = true;
                this._checkPreload()
            })
            let texture_setting = new Forge.ExternalTextureSetting(texture);
            let preload_view = new Forge.PreloadView(texture_setting);
            return ForgeExtension.RootActivity.ViewStore.add(
                new Forge.ViewInfo(preload_view, { x: 0, y: 0, width: 0, height: 0 })
            );
        });
    }

    _checkDownload() {
        for (let state of this._DownloadStateList) {
            if (!state) return;
        }
        if (this.props.onDownloadDone) {
            this.props.onDownloadDone();
        }
    }

    _getDownloadViewIdList() {
        if (!this.props.downloadList) { return }
        this._DownloadStateList = new Array(this.props.downloadList.length).fill(false);
        this._DownloadViewList = this.props.downloadList.map((item, index) => {
            if (item.magicToken !== CONST_FORMAT_TOKEN) {
                console.error("Error:format mismatch, data should comes from function buildDownloadInfo()");
            }
            let base_url = item.url;
            let image_url = base_url;
            if (base_url && base_url.indexOf("http") < 0) { // 包含http和https两种请求
                if (window.JsView.React.UrlRef) {
                    image_url = new window.JsView.React.UrlRef(base_url).href;
                }
            }
            let texture = ForgeExtension.TextureManager.GetDownloadTexture(image_url);
            texture.RegisterLoadImageCallback(null, () => {
                this._DownloadStateList[index] = true;
                this._checkDownload();
            })
            let texture_setting = new Forge.ExternalTextureSetting(texture);
            let preload_view = new Forge.PreloadView(texture_setting);
            return ForgeExtension.RootActivity.ViewStore.add(
                new Forge.ViewInfo(preload_view, { x: 0, y: 0, width: 0, height: 0 })
            );
        });
    }

    _htmlPreload() {
        this._PreloadStateList = new Array(this.props.preloadList.length).fill(false);
        this._PreloadViewList = this.props.preloadList.map((item, index) => {
            let image = new Image();
            image.onload = () => {
                this._PreloadStateList[index] = true;
                console.log("preload succeed " + item.url);
                this._checkPreload();
            }
            image.src = item.url;
            return image;
        });

        this._DownloadStateList = new Array(this.props.downloadList.length).fill(false);
        this._DownloadViewList = this.props.downloadList.map((item, index) => {
            let image = new Image();
            image.onload = () => {
                this._DownloadStateList[index] = true;
                console.log("pre download succeed " + item.url);
                this._checkDownload();
            }
            image.src = item.url;
            return image;
        });
    }

    render() {
        if (window.JsView) {
            this._releaseForgeView();
            this._getPreloadViewIdList();
            this._getDownloadViewIdList();

            return (
                <React.Fragment>
                    {
                        this._PreloadViewList.map(id => {
                            return <div key={id} id={id} jsv_innerview={id} />
                        })
                    }
                    {
                        this._DownloadViewList.map(id => {
                            return <div key={id} id={id} jsv_innerview={id} />
                        })
                    }
                </React.Fragment>
            )
        } else {
            this._htmlPreload();
            return null;
        }
    }

    componentWillUnmount() {
        this._releaseForgeView();
    }
}

let emptyFunc = () => { };
JsvPreload.defaultProps = {
    preloadList: [],
    downloadList: [],
    onPreloadDone: emptyFunc,
    onDownloadDone: emptyFunc
}

export {
    buildPreloadInfo,
    buildDownloadInfo,
    JsvPreload
}