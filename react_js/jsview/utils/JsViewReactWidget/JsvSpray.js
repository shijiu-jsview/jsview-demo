/**
 * Created by changhua.chen@qcast.cn on 11/13/2020.
 */

/*
 * 【模块 export 内容】
 * JsvSpray：React高阶组件，粒子效果控件
 *      prop说明:
 *          pointRes {string} (必需)粒子图案 可选值: 绝对路径url|url(相对路径url)|#FFFFFF|rbga(255,0,0,1.0)
 *          sprayStyle {object}  (必需)粒子效果配置
 *
 * prop中的sprayStyle说明:
 *      type {int} (必需)喷射类型 0: 一次喷射 1: 持续喷射
 *      particleNum {int} (必需)粒子个数
 *      deltaAngle {int} (必需)粒子喷射角度范围。如设30则粒子喷射范围为div上边法向正负30度
 *      deltaWidth {int} (必需)粒子喷射位置宽度范围
 *      deltaHeight {int} (必需)粒子喷射位置高度范围
 *      pointSizeMin {int} (必需)粒子尺寸下限(像素)
 *      pointSizeMax {int} (必需)粒子尺寸上限(像素)
 *      speedMin {float} (必需)粒子速度下限
 *      speedMax {float} (必需)粒子速度上限
 *      lifeMin {int} (必需)粒子生命周期下限(ms)
 *      lifeMax {int} (必需)粒子生命周期上限(ms)
 *      accelerateX {float} (必需)水平方向加速度
 *      accelerateY {float} (必需)垂直方向加速度
 *      addNumSpeed {float} 持续喷射时，起始粒子添加速度(个/ms), 默认为0.001
 *      enableFade {boolean} 粒子淡出开关, 默认为false
 *      enableShrink {boolean} 粒子缩小开关, 默认为false
 */

import React from 'react';
import { Forge, ForgeExtension } from "../JsViewEngineWidget/index_widget";

class HtmlParticleProxyView extends React.Component {
  constructor(props) {
    super(props);
    this._Element = null;
    this._ParticleViewId = -1;
  }

  _initRef=(ref) => {
    this._Element = ref;
  }

  render() {
    const view_width = this.props.setting.deltaWidth === 0 ? 1 : 2 * this.props.setting.deltaWidth;
    const view_height = this.props.setting.deltaHeight === 0 ? 1 : 2 * this.props.setting.deltaHeight;
    return <div ref={this._initRef} style={{ width: view_width, height: view_height }}/>;
  }

  componentDidMount() {
    const view_width = this.props.setting.deltaWidth === 0 ? 1 : 2 * this.props.setting.deltaWidth;
    const view_height = this.props.setting.deltaHeight === 0 ? 1 : 2 * this.props.setting.deltaHeight;
    const view_size = {
      width: view_width,
      height: view_height
    };
    this._ParticleViewId = Forge.sParticleManager.addParticle(this.props.setting, this.props.pointImage, view_size, this._Element);
  }

  componentWillUnmount() {
    Forge.sParticleManager.recycleView(this._ParticleViewId);
  }
}

class JsvSpray extends React.Component {
  constructor(props) {
    super(props);
    this._buildForgeView = this._buildForgeView.bind(this);
    this._releaseViewId = this._releaseViewId.bind(this);
    this._SpraViewId = -1;
  }

  _buildForgeView() {
    if (!this.props.pointRes) { return -1; }
    const texture_manager = ForgeExtension.TextureManager;
    let texture_setting;
    if (this.props.pointRes.trim().startsWith("#") || this.props.pointRes.trim().startsWith("rgba")) {
      texture_setting = new Forge.TextureSetting(texture_manager.GetColorTexture(this.props.pointRes));
    } else {
      const base_url = this.props.pointRes;
      let image_url = base_url;
      if (base_url && base_url.indexOf("http") === 0) {
        image_url = base_url;
      } else if (window.JsView.React.UrlRef) {
        image_url = new window.JsView.React.UrlRef(this.props.pointRes).href;
      }
      texture_setting = new Forge.ExternalTextureSetting(texture_manager.GetImage2(image_url, false, null, "RGB_8888", null));
    }
    const spray_view = new Forge.SprayView(texture_setting);
    const add_num_per_frame = this.props.sprayStyle.addNumSpeed ? this.props.sprayStyle.addNumSpeed : 0.001;
    const accelerate_x = typeof this.props.sprayStyle.accelerateX !== 'undefined' ? this.props.sprayStyle.accelerateX : 0;
    const accelerate_y = typeof this.props.sprayStyle.accelerateY !== 'undefined' ? this.props.sprayStyle.accelerateY : -100;
    spray_view.SetSprayInfo(
      this.props.sprayStyle.type,
      this.props.sprayStyle.particleNum,
      add_num_per_frame,
      this.props.sprayStyle.deltaAngle / 180 * 3.1415,
      this.props.sprayStyle.deltaWidth, this.props.sprayStyle.deltaHeight,
      this.props.sprayStyle.pointSizeMin, this.props.sprayStyle.pointSizeMax,
      this.props.sprayStyle.speedMin, this.props.sprayStyle.speedMax,
      this.props.sprayStyle.lifeMin, this.props.sprayStyle.lifeMax,
      accelerate_x, accelerate_y,
      this.props.sprayStyle.enableFade, this.props.sprayStyle.enableShrink
    );
    const view_width = this.props.sprayStyle.deltaWidth === 0 ? 1 : 2 * this.props.sprayStyle.deltaWidth;
    const view_height = this.props.sprayStyle.deltaHeight === 0 ? 1 : 2 * this.props.sprayStyle.deltaHeight;
    return ForgeExtension.RootActivity.ViewStore.add(
      new Forge.ViewInfo(spray_view, { x: 0, y: 0, width: view_width, height: view_height })
    );
  }

  _releaseViewId() {
    if (this._SpraViewId >= 0) {
      ForgeExtension.RootActivity.ViewStore.remove(this._SpraViewId);
      this._SpraViewId = -1;
    }
  }

  shouldComponentUpdate(next_props, next_state) {
    const cur_spray_style = this.props.sprayStyle;
    const next_spray_style = next_props.sprayStyle;
    let spray_style_changed = false;
    for (const i of Object.keys(next_spray_style)) {
      if (cur_spray_style[i] !== next_spray_style[i]) {
        spray_style_changed = true;
        break;
      }
    }
    return this.props.pointImg !== next_props.pointImg || spray_style_changed;
  }

  render() {
    if (window.JsView) {
      this._releaseViewId();
      this._SpraViewId = this._buildForgeView();
      if (this._SpraViewId < 0) {
        return null;
      }
      return (
                    <div key={this._SpraViewId} jsv_innerview={this._SpraViewId}></div>
      );
    }
    return (
                <HtmlParticleProxyView pointImage={this.props.pointRes} setting={this.props.sprayStyle}/>
    );
  }

  componentWillUnmount() {
    this._releaseViewId();
  }
}
export default JsvSpray;
