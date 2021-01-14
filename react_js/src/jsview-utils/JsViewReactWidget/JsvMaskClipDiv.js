/**
 * Created by ludl on 01/11/21.
 */

/*
 * JsvMaskClipDiv：React高阶组件，进行蒙版遮罩处理
 *      props说明:
 *          stylesList {array}    布局样式(必需)，数组中可包含样式对象或者JsvStyleClass，或者JsvTextStyleClass对象，
 *                                  样式对象内容为{left:0, top:0, width:xxx, height:xxx}，
 *                                  布局样式为数组中所有样式的合并。
 *          styleRevision {string}  类似于react html元素的key，当style变化时，由使用者改变此Token通知hoc进行style重新识别。
 *                                  Token不变的场景，props变化不会引起render，以提高渲染性能。
 *                                  若未设置，则默认对比stylesList的引用是否变化，每个新的{}视为改变
 *          maskSrc   {string/URL} 蒙版图片，可为URL字符串，或者通过import进来的图片引用
 *          viewSrc   {string/URL} 被遮罩的图片，可为URL字符串，或者通过import进来的图片引用
 *          maskTop   {double}     蒙版相对于被遮罩图片的左上角Y定位，单位为百分比(Y坐标 / 被遮罩图片的高)
 *          maskLeft  {double}     蒙版相对于被遮罩图片的左上角X定位，单位为百分比(X坐标 / 被遮罩图片的宽)
 *          maskWidth {double}     蒙版相对于被遮罩图片宽度的百分比(蒙版的宽度 / 被遮罩图片的宽)
 *          maskHeight{double}     蒙版相对于被遮罩图片高度的百分比(蒙版的高度 / 被遮罩图片的宽)
 */

import React from "react";
import PropTypes from "prop-types";
import { Forge, ForgeExtension } from "../jsview-react/index_widget";
import {
  combinedStyles,
  JsvStyleClass,
} from "../JsViewReactTools/JsvStyleClass";

class JsvMaskClipDiv extends React.Component {
  constructor(props) {
    super(props);
    this._JsvMainView = null;
    this._InnerViewId = -1;
    this._StyleDetail = null;
    this._Cache = {
      viewSrc: null,
      maskSrc: null,
      maskTop: 0,
      maskLeft: 0,
      maskWidth: 0,
      maskHeight: 0,
      styleList: null,
      styleRevision: null,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.maskTop !== nextProps.maskTop ||
      this.props.maskLeft !== nextProps.maskLeft ||
      this.props.maskWidth !== nextProps.maskWidth ||
      this.props.maskHeight !== nextProps.maskHeight ||
      this.props.viewSrc !== nextProps.viewSrc ||
      this.props.maskSrc !== nextProps.maskSrc
    ) {
      return true;
    }

    // 当styleRevision未设定时，以StyleList的Object引用是否变化为准
    if (!this.props.styleRevision || !nextProps.styleRevision) {
      return this.props.styleRevision !== nextProps.styleRevision;
    }

    return this.props.stylesList !== nextProps.stylesList;
  }

  drawClip=(canvas, clip_image, clip_ready, bg_image, bg_ready) => {
    const ctx = canvas.getContext("2d");
    if (!clip_ready || !bg_ready) {
      return;
    }
    const canvasW = this.props.maskWidth * bg_image.width;
    const canvasH = this.props.maskHeight * bg_image.height;
    canvas.width = canvasW;
    canvas.height = canvasH;
    ctx.drawImage(clip_image, 0, 0, canvasW, canvasH);
    ctx.globalCompositeOperation = "source-atop";
    ctx.drawImage(bg_image, -this.props.maskLeft * bg_image.width, -this.props.maskTop * bg_image.height, bg_image.width, bg_image.height);
    console.log(`w=${bg_image.width} h=${bg_image.height}`);
  }

  initRef=(ref) => {
    if (ref) {
      const canvas = window.originDocument.createElement("canvas");
      if (ref.jsvMainView) {
        ref.jsvMainView.Element.appendChild(canvas);
      } else if (ref.jsvMaskView) {
        ref.jsvMaskView.Element.appendChild(canvas);
      }

      const clip_image = new Image();
      const bg_image = new Image();
      clip_image.src = this.props.maskSrc;
      bg_image.src = this.props.viewSrc;
      let clip_ready = false;
      let bg_ready = false;

      clip_image.onload = () => {
        clip_ready = true;
        this.drawClip(canvas, clip_image, clip_ready, bg_image, bg_ready);
      };

      bg_image.onload = () => {
        bg_ready = true;
        this.drawClip(canvas, clip_image, clip_ready, bg_image, bg_ready);
      };
    }
  }

  renderHtmlView() {
    return <div
          ref={this.initRef}
          style={{
            top: this._StyleDetail.top,
            left: this._StyleDetail.left,
          }}
          ></div>;
  }

  render() {
    this._AnalyzeStyleList();

    if (window.JsView) {
      // JsView场合
      return this.renderJsView();
    }

    // TODO: 使用canvas(jsvcanvas)进行描画
    return this.renderHtmlView();
  }

  renderJsView() {
    if (this._JsvMainView === null) {
      // 初始化View
      this._JsvMainView = new Forge.LayoutView();
      this._InnerViewId = ForgeExtension.RootActivity.ViewStore.add(
        new Forge.ViewInfo(this._JsvMainView, null)
      );
    }

    if (
      this.props.viewSrc !== this._Cache.viewSrc ||
      this.props.maskSrc !== this._Cache.maskSrc
    ) {
      // 刷新显示图片内容
      ForgeExtension.SetMaskedBackgroundImage(
        this._JsvMainView,
        this.props.viewSrc,
        this.props.maskSrc
      );
      this._Cache.viewSrc = this.props.viewSrc;
      this._Cache.maskSrc = this.props.maskSrc;
    }

    // 更新描画区域宽高
    this._JsvMainView.ResetLayoutParams({
      width: this._StyleDetail.width,
      height: this._StyleDetail.height,
    });

    // 更新裁剪后的显示子区域
    if (
      this.props.maskTop !== this._Cache.maskTop ||
      this.props.maskLeft !== this._Cache.maskLeft ||
      this.props.maskWidth !== this._Cache.maskWidth ||
      this.props.maskHeight !== this._Cache.maskHeight
    ) {
      this.updateMainTexturePosition();
    }

    // 不使用width/height属性，因为已经给innerView设置完毕，其他style属性有需要再添加
    return (
      <div
        jsv_innerview={this._InnerViewId}
        style={{
          top: this._StyleDetail.top,
          left: this._StyleDetail.left,
        }}
      ></div>
    );
  }

  updateMainTexturePosition() {
    // Texture进行放大，让view的可视区域只能看到所设定的部分
    const scale_width = 1 / this.props.maskWidth;
    const scale_height = 1 / this.props.maskHeight;

    // texture移动参考的坐标系是(0,0) -> (1,-1)，注意取值范围和Y坐标flip，
    // 以及Texture是相对可视区域反向移动的
    const move_x = -this.props.maskLeft;
    const move_y = this.props.maskTop;

    // 注意translate需要px单位，虽然移动的数值单位不是px，但是由于transform只接受px，所以作为workaround加上px
    this._JsvMainView.ResetTextureCssTransform(
      `scale3d(${scale_width},${scale_height},1) ` +
        `translate3d(${move_x}px,${move_y}px,0)`,
      "left top"
    );

    this._Cache.maskTop = this.props.maskTop;
    this._Cache.maskLeft = this.props.maskLeft;
    this._Cache.maskWidth = this.props.maskWidth;
    this._Cache.maskHeight = this.props.maskHeight;
  }

  componentWillUnmount() {
    // 清理View管理缓存
    if (this._InnerViewId !== -1) {
      ForgeExtension.RootActivity.ViewStore.remove(this._InnerViewId);
      this._InnerViewId = -1;
      this._JsvMainView = null;
    }
  }

  _AnalyzeStyleList() {
    let should_update = false;
    if (!this.props.styleRevision) {
      // StyleRevision无效，则直接比较StyleList引用
      should_update = this.props.stylesList !== this._Cache.styleList;
      // 更新StyleList的Cache
      this._Cache.styleList = this.props.stylesList;
    } else {
      should_update = this.props.styleRevision !== this._Cache.styleRevision;
      // 更新styleRevision的Cache
      this._Cache.styleRevision = this.props.styleRevision;
    }

    if (!should_update) {
      return;
    }

    const style_set = combinedStyles(this.props.stylesList, true);
    this._StyleDetail = style_set.combinedStyle;
  }
}

const sDefaultLayoutStyle = new JsvStyleClass({
  left: 0,
  top: 0,
  width: 10,
  height: 10,
});

JsvMaskClipDiv.propTypes = {
  stylesList: PropTypes.array, // 布局样式列表(包含x,y,width,height)
  styleRevision: PropTypes.string, // 布局样式版本，用于判断stylesList是否更新
  maskSrc: PropTypes.string, // 蒙版URL或者import图片
  viewSrc: PropTypes.string, // 被遮罩URL或者import图片
  maskTop: PropTypes.number, // Y定位(百分比)
  maskLeft: PropTypes.number, // X定位(百分比)
  maskWidth: PropTypes.number, // 透露宽度(百分比)
  maskHeight: PropTypes.number, // 透露高度(百分比)
};

JsvMaskClipDiv.defaultProps = {
  stylesList: [sDefaultLayoutStyle],
  styleRevision: null,
  maskTop: 0,
  maskLeft: 0,
  maskWidth: 0,
  maskHeight: 0,
};

export default JsvMaskClipDiv;
