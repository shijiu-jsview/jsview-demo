/**
 * Created by changhua.chen@qcast.cn on 11/13/2020.
 */

/*
 * 【模块 export 内容】
 * JsvPreload：React高阶组件，图片预加载的控件
 *      preloadList: 预加载的信息列表，通过buildPreloadInfo构建
 *      downloadList: 预下载的信息列表，通过buildDownloadInfo构建
 *      onPreloading: 预加载中回调，返回预加载进度
 *      onPreloadDone: 预加载完成回调
 *      onDownloadDone: 预下载完成回调
 *      sprayStyle {object}  (必需)粒子效果配置
 *
 * 注意事项:
 *      指定加载时的尺寸(0为不指定)，与img标签中的 jsv_img_scaledown_tex 属性一起使用
 *      指定加载色空间，与div标签中的 jsv_img_color_space 一起使用。
 *      因为，同样url情况下，jsv_img_scaledown_tex 和 jsv_img_color_space 启用后，不同的尺寸不同颜色空间
 *      对应着各自不同的图片内存缓存
 *
 * buildPreloadInfo: 函数，创建预加载信息项，用于制作JsvPreload的preloadList属性列表信息
 *
 * buildDownloadInfo: 函数，创建预下载信息项，用于制作JsvPreload的downloadList属性列表信息
 */

import React from "react";
import { Forge, ForgeExtension } from "../../dom/jsv-forge-define";

const CONST_FORMAT_TOKEN = "_JsvP_";

/*
 * buildPreloadInfo: 创建预加载信息项
 * 参数说明:
 *      url     {String}        图片下载地址
 *      width   {int}           指定加载时的宽度(0为不指定)，不为0时，与img标签中的 jsv_img_scaledown_tex 属性一起使用
 *      height  {int}           指定加载时的宽度(0为不指定)，不为0时，与img标签中的 jsv_img_scaledown_tex 属性一起使用
 *      color_type {String}     指定加载色空间，与div标签中的 jsv_img_color_space 一起使用，支持 RGBA_8888 和 RGB_565
 *      net_setting {Object}    预留，未使用，图片的网络加载header设置
 */
const buildPreloadInfo = (
  url,
  width = 0,
  height = 0,
  color_type = "RGBA_8888",
  net_setting = null
) => {
  return {
    url,
    width,
    height,
    colorType: color_type,
    netSetting: net_setting,
    magicToken: CONST_FORMAT_TOKEN, // 用于格式校验
  };
};

/*
 * buildPreloadInfo: 创建预下载信息项，仅下载，不加载进内存
 * 参数说明:
 *      url     {String}        图片下载地址
 *      net_setting {Object}    预留，未使用，图片的网络加载header设置
 */
const buildDownloadInfo = (url, net_setting = null) => {
  return {
    url,
    netSetting: net_setting,
    magicToken: CONST_FORMAT_TOKEN, // 用于格式校验
  };
};

class _JsvPreload extends React.Component {
  constructor(props) {
    super(props);
    this._PreloadViewList = [];
    this._DownloadViewList = [];

    this._PreloadStateList = [];
    this._DownloadStateList = [];

    this._PreloadResultMap = {};
  }

  _releaseForgeView() {
    if (window.JsView) {
      if (this._PreloadViewList.length > 0) {
        for (const view_info of this._PreloadViewList) {
          if (view_info) { // 当预加载url为null时view_info为null
            const id = view_info.viewId;
            // UnMarkImportant & UnregisterLoadImageCallback(这两个API同版本加入)
            if (
              view_info.textureRef &&
              view_info.textureRef.DisableBackgroundLoad
            ) {
              view_info.textureRef.DisableBackgroundLoad(this);
              view_info.textureRef.UnregisterLoadImageCallback(
                view_info.callToken
              );
            }
            ForgeExtension.RootActivity.ViewStore.remove(id);
          }
        }
        this._PreloadViewList = [];
      }

      if (this._DownloadViewList.length > 0) {
        for (const view_info of this._DownloadViewList) {
          if (view_info) { // 当预加载url为null时view_info为null
            const id = view_info.viewId;
            // UnMarkImportant & UnregisterLoadImageCallback(这两个API同版本加入)
            if (
              view_info.textureRef &&
              view_info.textureRef.DisableBackgroundLoad
            ) {
              view_info.textureRef.DisableBackgroundLoad(this);
              view_info.textureRef.UnregisterLoadImageCallback(
                view_info.callToken
              );
            }
            ForgeExtension.RootActivity.ViewStore.remove(id);
          }
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
    if (
      nextProps.preloadList.length === this.props.preloadList.length &&
      nextProps.downloadList.length === this.props.downloadList.length
    ) {
      let same = true;
      for (let i = 0; i < nextProps.preloadList.length; i++) {
        if (nextProps.preloadList[i].url !== this.props.preloadList[i].url) {
          same = false;
          break;
        }
      }
      for (let i = 0; i < nextProps.downloadList.length; i++) {
        if (nextProps.downloadList[i].url !== this.props.downloadList[i].url) {
          same = false;
          break;
        }
      }
      return !same;
    }
    return true;
  }

  _checkPreload() {
    let loadedNum = 0;
    this._PreloadStateList.forEach((state) => {
      loadedNum = state ? ++loadedNum : loadedNum;
    });
    if (this.props.onPreloading) {
      this.props.onPreloading(loadedNum / this._PreloadStateList.length);
    }
    if (
      this.props.onPreloadDone &&
      loadedNum === this._PreloadStateList.length
    ) {
      this.props.onPreloadDone(this._PreloadResultMap);
    }
  }

  _getPreloadViewIdList() {
    if (!this.props.preloadList) {
      return;
    }
    this._PreloadStateList = new Array(this.props.preloadList.length).fill(
      false
    );
    this._PreloadViewList = this.props.preloadList.map((item, index) => {
      if (item.magicToken !== CONST_FORMAT_TOKEN) {
        console.error(
          "Error:format mismatch, data should comes from function buildPreloadInfo()"
        );
      }
      const base_url = item.url;
      let image_url = base_url;
      if (base_url && base_url.indexOf("http") < 0) {
        // 包含http和https两种请求
        if (window.JsView.React.UrlRef) {
          image_url = new window.JsView.React.UrlRef(base_url).href;
        }
      }
      let target_size = null;
      if (item.width !== 0 && item.height !== 0) {
        target_size = { width: item.width, height: item.height };
      }
      let texture = null;
	    if (image_url &&
		    (image_url.toLowerCase().indexOf(".webp") >= 0 ||
        image_url.toLowerCase().indexOf(".gif") >= 0)
      ) {
        texture = ForgeExtension.TextureManager.GetGifImage(image_url, false);
      } else {
        texture = ForgeExtension.TextureManager.GetImage2(
          image_url,
          false,
          target_size,
          item.colorType
        );
      }
      if (!texture) {
        console.error("Error: Preload view build texture failed for " + image_url);
        this._PreloadStateList[index] = true; // 无法创建texture的图片先认为加载完成
        return;
      }
      const callback_token = texture.RegisterLoadImageCallback(
        null,
        (params) => {
          console.log(`preload succeed ${image_url}`, params);
          this._PreloadStateList[index] = true;
          this._PreloadResultMap[item.url] = {
            width: params.width,
            height: params.height,
          };
          console.log(`preload succeed ${item.url}, params:${params}`);
          this._checkPreload();
        }
      );
      if (texture.EnableBackgroundLoad) {
        texture.EnableBackgroundLoad(this);
      }
      const texture_setting = new Forge.ExternalTextureSetting(texture);
      const preload_view = new Forge.PreloadView(texture_setting);
      return {
        viewId: ForgeExtension.RootActivity.ViewStore.add(
          new Forge.ViewInfo(preload_view, { x: 0, y: 0, width: 0, height: 0 })
        ),
        textureRef: texture,
        callToken: callback_token,
      };
    });
  }

  _checkDownload() {
    for (const state of this._DownloadStateList) {
      if (!state) return;
    }
    if (this.props.onDownloadDone) {
      this.props.onDownloadDone();
    }
  }

  _getDownloadViewIdList() {
    if (!this.props.downloadList) {
      return;
    }
    this._DownloadStateList = new Array(this.props.downloadList.length).fill(
      false
    );
    this._DownloadViewList = this.props.downloadList.map((item, index) => {
      if (item.magicToken !== CONST_FORMAT_TOKEN) {
        console.error(
          "Error:format mismatch, data should comes from function buildDownloadInfo()"
        );
      }
      const base_url = item.url;
      let image_url = base_url;
      if (base_url && base_url.indexOf("http") < 0) {
        // 包含http和https两种请求
        if (window.JsView.React.UrlRef) {
          image_url = new window.JsView.React.UrlRef(base_url).href;
        }
      }
      const texture = ForgeExtension.TextureManager.GetDownloadTexture(
        image_url
      );
      if (!texture) {
        console.error("Error: Down view build texture failed for " + image_url);
        // 无法创建texture的图片先认为加载完成
        this._DownloadStateList[index] = true;
        return;
      }
      const callback_token = texture.RegisterLoadImageCallback(null, () => {
        this._DownloadStateList[index] = true;
        this._checkDownload();
      });
      if (texture.EnableBackgroundLoad) {
        texture.EnableBackgroundLoad(this);
      }
      const texture_setting = new Forge.TextureSetting(texture); // Download类型的释放跟随view一同释放
      const preload_view = new Forge.PreloadView(texture_setting);

      return {
        viewId: ForgeExtension.RootActivity.ViewStore.add(
          new Forge.ViewInfo(preload_view, { x: 0, y: 0, width: 0, height: 0 })
        ),
        textureRef: texture,
        callToken: callback_token,
      };
    });
  }

  render() {
    this._releaseForgeView();
    this._getPreloadViewIdList();
    this._getDownloadViewIdList();

    return (
      <React.Fragment>
        {this._PreloadViewList.map((obj) => {
          if (!obj) {
            // 图片未加载
            return null;
          }
          const id = obj.viewId;
          return <div key={id} id={id} jsv_innerview={id} />;
        })}
        {this._DownloadViewList.map((obj) => {
          if (!obj) {
            // 图片未加载
            return null;
          }
          const id = obj.viewId;
          return <div key={id} id={id} jsv_innerview={id} />;
        })}
      </React.Fragment>
    );
  }

  componentWillUnmount() {
    this._releaseForgeView();
  }
}

const emptyFunc = () => {};
_JsvPreload.defaultProps = {
  preloadList: [],
  downloadList: [],
  onPreloadDone: emptyFunc,
  onDownloadDone: emptyFunc,
};

let JsvPreload = _JsvPreload;
if (!window.JsView) {
  JsvPreload = JsvWidgetWrapperGroup.getPreload(_JsvPreload);
}

export { buildPreloadInfo, buildDownloadInfo, JsvPreload };
