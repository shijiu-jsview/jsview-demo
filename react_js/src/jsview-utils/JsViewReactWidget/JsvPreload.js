import React from 'react';
import {Forge, ForgeExtension} from "../jsview-react/index_widget.js"

let buildPreloadInfo = (url, width, height, color_type) => {
    return {
        "url": url,
        "width": width,
        "height": height,
        "colorType": color_type ? color_type : null,
    }
}

class JsvPreload extends React.Component {
    constructor(props) {
        super(props);
        this._ForgeViewIdList = [];
    }

    _releaseForgeView() {
        if (this._ForgeViewIdList.length > 0) {
            for (let i of this._ForgeViewIdList) {
                ForgeExtension.RootActivity.ViewStore.remove(i);
            }
            this._ForgeViewIdList = [];
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.urls.length === this.props.urls.length) {
            for (let i = 0; i < nextProps.urls.length; i++) {
                if (nextProps.urls[i].url != this.props.urls[i].url) {
                    return true;
                }
            }
        }
        return false;
    }

    render() {
        if (window.JsView) {
            this._releaseForgeView();
            this._ForgeViewIdList = this.props.urls.map(item => {
                let base_url = item.url;
                let image_url = base_url;
                if (base_url && base_url.indexOf("http") < 0) {
                    if (window.JsView.React.UrlRef) {
                        image_url = new window.JsView.React.UrlRef(base_url).href;
                    }
                }
                let texture_setting = new Forge.ExternalTextureSetting(ForgeExtension.TextureManager.GetImage(image_url));
                let preload_view = new Forge.PreloadView(texture_setting);
                return ForgeExtension.RootActivity.ViewStore.add(
                    new Forge.ViewInfo(preload_view, {x:0, y:0, width: 0, height: 0})
                );
            })
            return(
                <React.Fragment>
                    {
                        this._ForgeViewIdList.map(id => {
                            return <div key={id} id={id} jsv_innerview={id}/>
                        })
                    }
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    {
                        this.props.urls.map((item, index) => {
                            return <div key={index} style={{ width: item.width, height: item.height, backgroundImage: `url(${item.url})`, visibility: "hidden" }} />
                        })
                    }
                </React.Fragment>
            )
        }
    }

    componentWillUnmount() {
        this._releaseForgeView();
    }
}

export{
    buildPreloadInfo,
    JsvPreload
}