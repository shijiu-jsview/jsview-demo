import Forge from "../ForgeDefine";
import { parseLatex, toHtml } from "./latex_parse";
import Velocity from "./velocity";
import "./impact_sensor_manager";

window.gRootView = null; // For record root view
Forge.sRootView = null;

/**
 * @file layout_view.js
 * @namespace Forge
 */
class TextureSetting {
  constructor(texture, mask, texture_before_image_load, has_alpha) {
    this.Texture = texture;
    this._IsTextureExternal = false;
    if (mask instanceof Forge.ImageTexture) {
      // 重新设置请求时间
      if (mask && mask.RenderTexture && mask.RenderTexture.NeedCheckExpired) {
        mask.RenderTexture.RequireTime = 0;
      }
      this.MaskSetting = new Forge.ViewTextureMask(mask);
    } else {
      this.MaskSetting = mask;
    }
    // 重新设置请求时间
    if (texture && texture.RenderTexture && texture.RenderTexture.NeedCheckExpired) {
      texture.RenderTexture.RequireTime = 0;
    }

    this._IsMaskTextureExternal = false;
    this.TextureBeforeImageLoad = texture_before_image_load;
    this._IsPreloadImageTextureExternal = false;
    if (typeof has_alpha === "undefined") has_alpha = true;
    this.HasAlpha = has_alpha;
  }

  /**
     * 标识这个Texture集合是否为外部Texture<br>
     *     默认为内部Texture，内部Texture将在所附着的LayoutView从RootView移除时被强制释放<br>
     *         文字的Texture应该用内部Texture，图形Texture一般用外部Texture
     *
     * @public
     * @func SetExternal
     * @memberof Forge.TextureSetting
     * @instance
     * @param {boolean} is_texture_external            主要Texture是否为外部Texture
     * @param {boolean} is_mask_external               遮罩Texture是否为外部Texture
     * @param {boolean} is_reload_image_external       次要Texture是否为外部Texture
     * */
  SetExternal(is_texture_external, is_mask_external, is_reload_image_external) {
    this._IsTextureExternal = is_texture_external;
    this._IsMaskTextureExternal = is_mask_external;
    this._IsPreloadImageTextureExternal = is_reload_image_external;
  }

  ReleaseInternalTexture(renderer, container_view) {
    if (!this._IsTextureExternal && this.Texture) {
      this.Texture.UnloadTex();
      this.Texture = null;
    }
    if (!this._IsMaskTextureExternal && this.MaskSetting /* && this.MaskSetting instanceof Forge.ImageTexture */) {
      this.MaskSetting.UnLoad();
      this.MaskSetting = null;
    }
    if (!this._IsPreloadImageTextureExternal && this.TextureBeforeImageLoad) {
      this.TextureBeforeImageLoad.UnloadTex();
      this.TextureBeforeImageLoad = null;
    }
  }

  DebugPrint() {
    return ` _IsTextureExternal=${this._IsTextureExternal}`;
  }
}
Forge.TextureSetting = TextureSetting;
window.TextureSetting = Forge.TextureSetting; // export class;

class ExternalTextureSetting extends Forge.TextureSetting {
  constructor(texture, mask_texture, texture_before_image_load, has_alpha) {
    super(texture, mask_texture, texture_before_image_load, has_alpha);
    this.SetExternal(true, true, true);
  }
}
Forge.ExternalTextureSetting = ExternalTextureSetting;
window.ExternalTextureSetting = Forge.ExternalTextureSetting; // export class;

class PackedLayout {
  constructor(layout_view_base) {
    const data_from = layout_view_base.RectInfo;
    this.RectInfo = {
      coordX: data_from.coordX,
      coordY: data_from.coordY,
      width: data_from.width,
      height: data_from.height
    };

    this.LayoutParams = JSON.parse(JSON.stringify(layout_view_base.LayoutParams));
  }

  ApplyToView(target_view) {
    const data_from = this.RectInfo;
    target_view.RectInfo = {
      coordX: data_from.coordX,
      coordY: data_from.coordY,
      width: data_from.width,
      height: data_from.height
    };

    target_view.LayoutParams = JSON.parse(JSON.stringify(this.LayoutParams));
  }
}
Forge.PackedLayout = PackedLayout;

class ViewMask {
  constructor() {
    this._MaskType = "COMMON";
  }

  Type() {
    return this._MaskType;
  }

  UnLoad() {
    // need to be overrided
  }
}
Forge.ViewMask = ViewMask;

class ViewTextureMask extends Forge.ViewMask {
  constructor(image_texture) {
    super();
    this._MaskType = "TEXTURE";
    this.ImageTexture = image_texture;
  }

  UnLoad() {
    this.ImageTexture.UnloadTex();
  }
}
Forge.ViewTextureMask = ViewTextureMask;
class ViewRoundCornerMask extends Forge.ViewMask {
  constructor(top_left, top_right, bottom_left, bottom_right) {
    super();

    this._MaskType = "CORNER";

    this._TopLeft = top_left;
    this._TopRight = (!Number.isNaN(top_right)) ? top_right : top_left;
    this._BottomLeft = (!Number.isNaN(bottom_left)) ? bottom_left : top_left;
    this._BottomRight = (!Number.isNaN(bottom_right)) ? bottom_right : top_left;

    this._CornersWidth = [0.0, 0.0, 0.0, 0.0];
    this._CornersDisable = [
      (this._TopLeft === 0 ? 1.0 : 0.0),
      (this._TopRight === 0 ? 1.0 : 0.0),
      (this._BottomLeft === 0 ? 1.0 : 0.0),
      (this._BottomRight === 0 ? 1.0 : 0.0)];
  }

  UnLoad() {
    // nothing to do
  }
}
Forge.ViewRoundCornerMask = ViewRoundCornerMask;

class DragSetting {
  /**
     * 拖拽参数设置
     * @param {int}drag_direction 拖拽方向: 横向、纵向、自由拖拽、Disable
     * @param {int}trigger_moved_distance onMoved事件触发的移动距离
     * @param {boolean}  enable_js_fling 是否由js进行fling操作，true：js进行fling，false：系统执行fling
     * @param {Forge.RectArea} slide_pile  滑桩   view 滑动时由滑桩控制其滑动区域
     * @param {int}fling_page_width 滑动页的宽度，即开启整平滑动模式
     * @param {int}fling_page_edge 触发整屏滑动页的边界，默认为1/4
     */
  constructor(drag_direction, trigger_moved_distance, enable_js_fling, slide_pile, fling_page_width, fling_page_edge) {
    this.DragDirection = drag_direction || 0;
    this.TriggerMovedDistance = trigger_moved_distance || 0;
    this._EnableJsFling = enable_js_fling ? 1 : 0;
    this.SlidePile = slide_pile || new Forge.RectArea(0, 0, 1280, 720);
    this.PageWidth = fling_page_width > 0 ? fling_page_width : 0xFFFF;
    this.EnableTabMode = fling_page_width > 0;
    this.PageEdge = fling_page_edge || 1 / 4;
  }
}

Forge.DragSetting = DragSetting;
Forge.DragSetting.DIRECTION_DISABLE = 0x00;// 只接收长按/quick tap事件
Forge.DragSetting.DIRECTION_VERTICAL = 0x01;
Forge.DragSetting.DIRECTION_HORIZONTAL = 0x02;
Forge.DragSetting.DIRECTION_AUTO = Forge.DragSetting.DIRECTION_VERTICAL | Forge.DragSetting.DIRECTION_HORIZONTAL;

Forge.DragInfo = class {
    static INFLEXION = 0.35;// Tension lines cross at (INFLEXION, 1)//拐点

    static DECELERATION_RATE = ((Math.log(0.78) / Math.log(0.9))) // 减速率

    static PHYSICAL_COEF = (51890.2)// 物理系数

    /**
     * final float ppi = context.getResources().getDisplayMetrics().density * 160.0f;
     PHYSICAL_COEF = SensorManager.GRAVITY_EARTH // g (m/s^2)
     * 39.37f // inch/meter
     * ppi
     * 0.84f; // look and feel tuning
     */
    static SCROLL_FRICTION = (0.015 * 4)// 摩擦系数

    static EVENT_TYPE = {
      OnDown: 0,
      OnTap: 1,
      OnLongPress: 2,
      OnDragStart: 3,
      OnMoved: 4,
      OnDragEnd: 5,
      OnRelease: 6,
      OnFling: 7,
    }

    constructor() {
      this.Settings = null;
      this.Listener = null;
      this.ListenerFlags = 0;
      this.OverListener = null;
      this.OverListenerFlags = 0;
      this.Formula = null;
      this.SyncString = null; // Deprecated;
    }

    SetListener(listener) {
      this.Listener = listener;
    }
};

let count = 0;
class LayoutViewBase {
  constructor(texture_setting, element_name) {
    this.TextureSetting = texture_setting;
    if (texture_setting) {
      console.error("LayoutViewBase constructor texture_setting not undefined!");
    }
    this.Visibility = "VISIBLE";
    this.LayoutParams = null; // TODO: 为了节省内存，将改成按需求生成
    this.ParentView = null;
    this.ChildViews = []; // TODO: 为了节省内存，将改成按需求生成
    // Z-index
    this.zIndex = 0;
    this._Perspective = 0;
    this._PerspectiveAnchor = [0.5, 0.5];
    this._BackfaceVisibility = 1;
    this._DebugCount = ++count;
    this.childZIndexCount = 0; // 计数器，统计子界面中有多少个设置了index的界面，用于优化AddView时的z-index调整处理
    this._IsChildOfRootView = false;
    this._DetachFromSystemCallback = null;
    this.Element = null;
    this.InnerChildElement = null; // 例如video element
    if (element_name === "root") {
      this.Element = window.originDocument.getElementById(element_name);
    } else if (element_name === "svg" || element_name === "path") {
      this.Element = document.createElementNS("http://www.w3.org/2000/svg", element_name);
    } else if (element_name) {
      this.Element = window.originDocument.createElement(element_name);
      this.Element.style.position = "absolute";
    }

    this.TransitionStore = {}; // div的所有transition信息，多个Transition动画会同时作用？

    this.TransformAnimationObj = null;
    this._TextureAnimationObj = null;

    // drag 2018/10/16(luocf), 2019/09/02(ludl)
    this._DragInfo = null;
    // drag 相关变量 2020/09/21
    this.DragControl = null;
    this._Velocity = { x: new Velocity(), y: new Velocity() };
    this._TouchSlopSquare = 8 * 8;
    this._InDragging = null;
    this._InLongPress = null;
    this._AlwaysInTapRegion = null;
    this._LastFocusX = null;
    this._LastFocusY = null;
    this._DownFocusX = null;
    this._DownFocusY = null;
    this._LastTimeStamp = null;
    this._ObjectFitTestCache = null;

    this._ProxyView = null;
  }

  Init(texture_setting) {
    this.ResetTexture(texture_setting);
  }

  SetElementProp(changed_props, owner_activity) {
    if (changed_props) {
      Object.keys(changed_props).forEach((name) => {
        switch (name) {
          case "jsv_enable_fade":
            // 无论配置什么内容，都将启动
            break;
          case "jsv_poster_on_top":
            // 无论配置什么内容，都将启动
            break;
          case "jsv_innerview": {
            const view_info = Forge.sViewStore.get(changed_props[name]);
            if (view_info) {
              const proxy_view = view_info.view;
              const proxy_view_lp = view_info.layout_params;
              if (proxy_view) {
                if (this._ProxyView === null) {
                  this._InsertProxyLayer(proxy_view, proxy_view_lp);
                } else {
                  if (proxy_view !== this._ProxyView) {
                    console.error("Error: Can not reset proxy view");
                  } else {
                    // Do nothing
                  }
                }
              }
            }
            break;
          }
          case "jsv_media_usetexture":
            // nothing todo
            break;
          default:
            Forge.LogE(`Error: View Unknown prop name=${name}`);
            break;
        }
      });
    }
  }

  AddView(child_view, layout_params, packed_layout) {
    if (layout_params !== null) {
      if (!(layout_params instanceof Forge.LayoutParamsBase)) { child_view.LayoutParams = new Forge.LayoutParams(layout_params); } else { child_view.LayoutParams = layout_params.Clone(); }
    } else {
      if (child_view.LayoutParams === null) {
        child_view.LayoutParams = new Forge.LayoutParams({ x: 0, y: 0 });
      }
    }

    if (child_view.LayoutParams !== null) {
      if (child_view.LayoutParams.MarginLeft) {
        child_view.Element.style.left = `${child_view.LayoutParams.MarginLeft}px`;
      }
      if (child_view.LayoutParams.MarginTop) {
        child_view.Element.style.top = `${child_view.LayoutParams.MarginTop}px`;
      }
      if (child_view.LayoutParams.Width) {
        child_view.Element.style.width = `${child_view.LayoutParams.Width}px`;
      }

      if (child_view.LayoutParams.Height) {
        child_view.Element.style.height = `${child_view.LayoutParams.Height}px`;
      } else {
        child_view.Element.style.height = "";
      }
    }

    child_view.ParentView = this;
    this.ChildViews.push(child_view);

    if (this._IsChildOfRootView) {
      child_view._OnAttachToSystem();
    }
  }

  SetZIndex(z_index) {
    this.Element.style.zIndex = z_index;
    this.zIndex = z_index;
  }

  /**
     * Perspective距离<br>
     *
     * hide public
     * @func SetPerspective
     * @memberof Forge.LayoutViewBase
     * @instance
     * @param {int} distance 观察点距离view的值, 最大为2^16 - 1
     * */
  SetPerspective(distance, origin) {
    this.Element.style.perspective = `${distance}px`;
    this.Element.style.webkitPerspective = `${distance}px`;
    this.Element.style.perspectiveOrigin = origin;
    this.Element.style.webkitPerspectiveOrigin = origin;
    this._Perspective = distance;
    this._PerspectiveOrigin = origin;
  }

  /**
     * 背面是否可见<br>
     *
     * hide public
     * @func SetBackfaceVisibility
     * @memberof Forge.LayoutViewBase
     * @instance
     * @param {boolean} visible 可见性
     * */
  SetBackfaceVisibility(visible) {
    console.log("set back face", visible);
    this.Element.style.backfaceVisibility = visible ? "visible" : "hidden";
    this.Element.style.webkitBackfaceVisibility = visible ? "visible" : "hidden";
    console.log(`back face style ${this.Element.style.backfaceVisibility}`);
    this._BackfaceVisibility = visible ? 1 : 0;
  }

  SetTransformStyle(transform_style) {
    this.Element.style.transformStyle = transform_style;
    this.Element.style.webkitTransformStyle = transform_style;
    this._TransformStyle = transform_style;
  }

  EnableDivTouch(ele, setting) {
    if (ele.reactEventHandlers && ele.reactEventHandlers.onClick) {
      this.Element.onclick = (ev) => {
        ele.reactEventHandlers.onClick();
        if (ev.preventDefault) {
          ev.preventDefault();
        }
      };
      this.Element.style.pointerEvents = "auto";
    }
  }

  _DoDragPause(event) {
    if (this._DragInfo.Settings.EnableTabMode) {
      return;
    }
    if (this.DragControl) {
      this.DragControl.pause((view_x, view_y) => {
        if (this.Element.style.transform !== null) {
          // 对view_x, view_y进行校对
          let lp = this.GetLayoutParams();
          lp = this._GetMovedLayoutParams(view_x - lp.MarginLeft, view_y - lp.MarginTop);
          this.ResetLayoutParams(lp);
          this._DragImactSensorRecycle();
          console.log(`_DoDragPause lp.MarginLeft:${lp.MarginLeft}, lp.MarginTop:${lp.MarginTop}`);
          this.DragControl = null;
          this.Element.style.transform = null;
          // 补充event
          event.viewX = view_x;
          event.viewY = view_y;

          this._DragInfo.Listener.OnFling(event);
        }
      });
    }
  }

  TouchEventProcess(event) {
    // 将event type转换为字符串
    let event_used = false;
    switch (event.type) {
      case Forge.DragInfo.EVENT_TYPE.OnDown: {
        console.log("TouchEventProcess OnDown in");
        this._DoDragPause(event);
        if (this._DragInfo.Listener && this._DragInfo.Listener.OnDown) {
          event_used = this._DragInfo.Listener.OnDown(event);
        }
        break;
      }
      case Forge.DragInfo.EVENT_TYPE.OnTap:
        if (this._DragInfo.Listener && this._DragInfo.Listener.OnTap) {
          event_used = this._DragInfo.Listener.OnTap(event);
        }
        break;
      case Forge.DragInfo.EVENT_TYPE.OnLongPress:
        if (this._DragInfo.Listener && this._DragInfo.Listener.OnLongPress) {
          event_used = this._DragInfo.Listener.OnLongPress(event);
        }
        break;
      case Forge.DragInfo.EVENT_TYPE.OnDragStart:
        this._DragMovedDistanceX = 0;
        this._DragMovedDistanceY = 0;
        if (this._DragInfo.Listener && this._DragInfo.Listener.OnDragStart) {
          event_used = this._DragInfo.Listener.OnDragStart(event);
        }
        break;
      case Forge.DragInfo.EVENT_TYPE.OnMoved:
        if (this._DragInfo.Listener && this._DragInfo.Listener.OnMoved) {
          event_used = this._DoDragMove(event, true);
        }
        break;
      case Forge.DragInfo.EVENT_TYPE.OnDragEnd:
        if (this._DragInfo.Listener && this._DragInfo.Listener.OnDragEnd) {
          // 对应吸附性,进行动画调整
          const enable_tab_mode = this._SlideIfEnableTabMod(event, -1);
          if (enable_tab_mode) {
            event_used = true;
          } else {
            event_used = this._DoDragEnd(event);
          }
        }
        break;
      case Forge.DragInfo.EVENT_TYPE.OnRelease:
        if (this._DragInfo.Listener && this._DragInfo.Listener.OnRelease) {
          event_used = this._DragInfo.Listener.OnRelease(event);
        }
        break;
      case Forge.DragInfo.EVENT_TYPE.OnFling:
        if (this._DragInfo.Listener && this._DragInfo.Listener.OnFling) {
          const enable_tab_mode = this._SlideIfEnableTabMod(event, -1);
          if (enable_tab_mode) {
            event_used = true;
          } else {
            event_used = this._DoFling(event);
          }
        }
        break;
      default:
        console.log(`TouchEventProcess:${event}`);
        break;
    }

    return event_used;
  }

  /**
     * 使Drag无效
     * @constructor
     */
  DisableDrag() {
    this._DragInfo = null;
  }

  /**
     * 使能拖拽
     * @param {Forge.DragSetting} setting 拖拽设置
     * @param {Object} listener 拖拽事件 listener Event事件：
     *                                                     OnDragEnd：{viewX:0,viewY:0},
     *                                                     OnMoved：{deltaX:0,deltaY:0},
     *                                                     Other:{x:0,y:0}//点击位置，相对于屏幕的绝对坐标
     * @param {String} movement_formula  移动公式
     * @constructor
     */
  EnableDrag(setting, listener, movement_formula) {
    if (!(setting instanceof Forge.DragSetting)) {
      Forge.ThrowError("EnableDrag The setting is not Forge.DragSetting");
    }
    if (listener === null) {
      Forge.ThrowError("EnableDrag The listener is null");
    }

    const drag_info = new Forge.DragInfo();
    drag_info.Settings = setting;
    drag_info.SetListener(listener);
    drag_info.Formula = movement_formula;
    this._DragInfo = drag_info;
    this.DragControl = null;

    // 追加事件监听
    this._AddEventListener();
    Forge.sRenderBridge.RequestSwap();
  }

  RemoveView(child_view_to_remove) {
    for (let i = 0; i < this.ChildViews.length; i++) {
      if (this.ChildViews[i] === child_view_to_remove) {
        if (child_view_to_remove.IsChildOfRootView()) {
          child_view_to_remove._OnDetachFromSystem();
        }
        this.ChildViews.splice(i, 1);
        child_view_to_remove.ParentView = null;
        break;
      }
    }
  }

  _OnDetachFromSystem() {
    this._IsChildOfRootView = false;
    if (this._DetachFromSystemCallback) {
      this._DetachFromSystemCallback();
    } else {
      this.OnDettachFromSystem();
    }
    for (let i = 0; i < this.ChildViews.length; i++) {
      const child_view = this.ChildViews[i];
      child_view._OnDetachFromSystem();
    }
    this.ParentView.Element.removeChild(this.Element);

    this._releaseViewResources();
  }

  RegisterDetachCallback(callback) {
    this._DetachFromSystemCallback = callback;
  }

  UnregisterDetachCallback() {
    this._DetachFromSystemCallback = null;
  }

  /**
     * 按需重载的回调函数
     *
     * @public
     * @func OnDettachFromSystem
     * @memberof Forge.LayoutViewBase
     * @instance
     * */
  OnDettachFromSystem() {
    // Override if needed
  }

  _releaseViewResources() {
    // Stop animation
    this.StopAnimation();
    this.StopTextureAnimation();
  }

  ClearViews() {
    const child_count = this.ChildViews.length;
    if (child_count === 0) { return; }
    for (let i = 0; i < child_count; i++) {
      const child_view = this.ChildViews[i];
      if (child_view && child_view.IsChildOfRootView()) { child_view._OnDetachFromSystem(); }
    }

    this.ChildViews = [];
  }

  _ResetTextStyle(resource_info) {
    this.Element.style.overflow = "hidden";
    if (resource_info.Set.AT) {
      const attr_json = JSON.parse(resource_info.Set.AT);
      this.Element.style.textOverflow = attr_json.TO;
      this.Element.style.wordBreak = "normal";
      if (attr_json.WW === "none") {
        this.Element.style.whiteSpace = "nowrap";
      } else if (attr_json.WW) {
        this.Element.style.wordWrap = attr_json.WW.replace("_", "-");
      }
    }
    if (resource_info.Set.RA) {
      const react_json = JSON.parse(resource_info.Set.RA);
      this.Element.style.width = `${react_json.W}px`;
      this.Element.style.height = `${react_json.H}px`;
    }
    if (resource_info.Set.LH) {
      this.Element.style.lineHeight = `${resource_info.Set.LH}px`;
    }

    if (resource_info.Set.FO) {
      const font_json = JSON.parse(resource_info.Set.FO);
      if (font_json.Tx) {
        this.Element.style.color = font_json.Tx;
      }
      if (font_json.Fo) {
        this.Element.style.fontFamily = font_json.Fo;
      }
      if (font_json.Si) {
        this.Element.style.fontSize = `${font_json.Si}px`;
      }
      if (font_json.Ba) {
        this.Element.style.backgroundColor = font_json.Ba;
      }
      if (font_json.It) {
        this.Element.style.fontStyle = "italic";
      }
      if (font_json.Bo) {
        this.Element.style.fontWeight = "bold";
      } else {
        this.Element.style.fontWeight = "normal";
      }
      if (font_json.Al) {
        this.Element.style.textAlign = font_json.Al;
      }
      if (font_json.Vaa) {
        this.Element.style.verticalAlign = font_json.Vaa;
      }
    }
    if (resource_info.Set.LA) {
      // latex文本
      const node_info = parseLatex(resource_info.Set.ST);
      const html_node = toHtml(node_info);
      this.Element.appendChild(html_node);
    } else {
      this.Element.textContent = resource_info.Set.ST;
    }
  }

  _SetBorderRadius(mask_setting) {
    const target_element = (this.InnerChildElement ? this.InnerChildElement : this.Element);
    target_element.style.borderRadius = `${mask_setting._TopLeft}px ${
      mask_setting._TopRight}px ${
      mask_setting._BottomRight}px ${
      mask_setting._BottomLeft}px`;
  }

  // 将本View的所有子节点都移动到Proxy层中
  _InsertProxyLayer(proxy_view, layout_params) {
    proxy_view.ParentView = this;
    proxy_view.ChildViews = proxy_view.ChildViews.concat(this.ChildViews);
    proxy_view._ChildrenListDirty = true;
    for (let i = 0; i < proxy_view.ChildViews; i++) {
      proxy_view.ChildViews[i].ParentView = proxy_view;
      proxy_view._RequestLayoutForAddingView(proxy_view.ChildViews[i]);
    }

    // 应用Layout params
    if (layout_params !== null) {
      if (!(layout_params instanceof Forge.LayoutParamsBase)) { proxy_view.LayoutParams = new Forge.LayoutParams(layout_params); } else { proxy_view.LayoutParams = layout_params.Clone(); }
    } else {
      if (proxy_view.LayoutParams === null) {
        proxy_view.LayoutParams = new Forge.LayoutParams({ x: 0, y: 0 });
      }
    }
    // 设置element 属性
    proxy_view.ResetLayoutParams(proxy_view.LayoutParams);

    // 重置原节点的ChildViews
    this.ChildViews = [proxy_view];
    this._ChildrenListDirty = true;
    this._RequestLayoutForAddingView(proxy_view);

    // 关联ProxyView
    this._ProxyView = proxy_view;
    // Poster on top关系不需要重建

    // 将子view追加到父view上
    if (this._IsChildOfRootView) {
      proxy_view._OnAttachToSystem();
    }
  }

  _RequestLayoutForAddingView(child_view) {
    this._RequestLayout();
  }

  /**
     * 设置新的Texture集合
     *
     * @public
     * @func ResetTexture
     * @memberof Forge.LayoutViewBase
     * @instance
     * @param {Forge.TextureSetting} texture_setting    新的Texture集合
     * */
  ResetTexture(texture_setting) {
    this.TextureSetting = texture_setting;
    if (texture_setting) {
      if (texture_setting.Texture.Source) {
        if (this.Element.tagName === "IMG") {
          // 图片元素，设置url到src中
          this.Element.src = texture_setting.Texture.Source;
        } else {
          this.Element.style.backgroundImage = `url(${texture_setting.Texture.Source})`;
          this.Element.style.backgroundSize = "100% 100%";
        }
      } else if (texture_setting.Texture.RenderTexture && texture_setting.Texture.RenderTexture._SyncingResourceInfo) {
        const render_texture = texture_setting.Texture.RenderTexture;
        const resource_info = render_texture._SyncingResourceInfo;
        if (resource_info.Nam === "T") {
          this._ResetTextStyle(resource_info);
        } else if (resource_info.Nam === "CT") {
          this.Element.style.backgroundColor = resource_info.Set.Clr;
        } else if (resource_info.Nam === "VPLY") {
          const video_el = resource_info.Set.Hdl;

          // 在Forge html状态，video的显示尺寸由父元素决定
          video_el.style.width = "100%";
          video_el.style.height = "100%";
          video_el.style.objectFit = "fill";

          this.Element.appendChild(video_el);
          this.InnerChildElement = video_el;
        }
      }

      if (texture_setting.MaskSetting) {
        if (texture_setting.MaskSetting._MaskType === "CORNER") {
          this._SetBorderRadius(texture_setting.MaskSetting);
        }
      }
    }
  }

  SetVisibility(new_visibility) {
    if (typeof new_visibility === "string") {
      this.Element.style.visibility = new_visibility.toLocaleLowerCase();
    } else {
      this.Element.style.visibility = "inherit";
    }
  }

  _OnAttachToSystem() {
    if (this.Element.id === "svg" || this.Element.id === "path") {
      console.log("_OnAttachToSystem appendChild");
    }
    this.ParentView.Element.appendChild(this.Element);
    this._IsChildOfRootView = true;
    const child_view_list = this.ChildViews;
    let child_view;
    for (let i = 0; i < child_view_list.length; i++) {
      child_view = child_view_list[i];
      child_view._OnAttachToSystem();
    }
  }

  IsChildOfRootView() {
    return this._IsChildOfRootView;
  }

  StartAnimation(anim, anim_for_self, delay) {
    if (typeof this.TransformAnimationObj !== "undefined" && this.TransformAnimationObj) {
      this.TransformAnimationObj.Cancel(anim);
      this.TransformAnimationObj = null;

      if (!window.jsvInAndroidWebView) {
        this.Element.style.animation = null;
      } else {
        this.Element.style.webkitAnimation = null;
      }
    }
    this.TransformAnimationObj = anim;
    if (!isNaN(delay) && delay > 0) {
      anim.EnableDelay(delay);
    }
    anim.Start(this);
  }

  ApplyStyleTransition(new_map) {
    this.TransitionStore = { ...this.TransitionStore, ...new_map };
    let transitions = "";
    Object.values(this.TransitionStore).forEach((value) => {
      if (transitions) {
        transitions += ",";
      }
      transitions += value;
    });
    if (!window.jsvInAndroidWebView) {
      this.Element.style.transition = transitions;
    } else {
      this.Element.style.webkitTransition = transitions;
    }
  }

  /**
     * 停止这个LayoutView的动画变换，并重置曾经进行动画变换的矩阵
     *
     * @public
     * @func StopAnimation
     * @memberof Forge.LayoutViewBase
     * @instance
     * */
  StopAnimation() {
    if (typeof this.TransformAnimationObj !== "undefined" && this.TransformAnimationObj) {
      this.TransformAnimationObj.Cancel();
      this.TransformAnimationObj = null;
      // 状态将在Animation触发的DetachAnimation中恢复，不需要在此手动恢复
    }
  }

  /**
     * 对这个LayoutView开始进行Texture动画变换(相对于view自身)
     *
     * @public
     * @func StartTextureAnimation
     * @memberof Forge.LayoutViewBase
     * @instance
     * @param {Forge.AnimationBase} anim   动画设置，例如通过new Forge.TranslateAnimation()创建
     * */
  StartTextureAnimation(anim) {
    if (typeof this._TextureAnimationObj !== "undefined" && this._TextureAnimationObj) {
      this._TextureAnimationObj.Cancel(anim);
      this._TextureAnimationObj = null;
    }
    this._TextureAnimationObj = anim;
    anim.AsTextureAnimation();
    anim.Start(this);
    this._RequestLayout();
  }

  _RequestLayout() {

  }

  /**
     * 停止这个LayoutView中的Texture的动画变换，并重置曾经进行动画变换的矩阵
     *
     * @public
     * @func StopAnimation
     * @memberof Forge.LayoutViewBase
     * @instance
     * */
  StopTextureAnimation() {
    if (typeof this._TextureAnimationObj !== "undefined" && this._TextureAnimationObj) {
      this._TextureAnimationObj.Cancel();
      this._TextureAnimationObj = null;
    }
  }


  /**
     * 停止该LayoutView和其所有子LayoutView的动画，并重置曾经进行动画变换的矩阵
     *
     * @public
     * @func StopAllAnimations
     * @memberof Forge.LayoutViewBase
     * @instance
     * */
  StopAllAnimations() {
    this.StopAnimation();
    this.StopTextureAnimation();
    for (let i = 0; i < this.ChildViews.length; i++) {
      this.ChildViews[i].StopAllAnimations();
    }
  }

  /**
     * 获得正在进行动的动画的句柄
     *
     * @public
     * @func GetAnimation
     * @memberof Forge.LayoutViewBase
     * @instance
     * @return {Forge.AnimationBase}
     * */
  GetAnimation() {
    return this.TransformAnimationObj;
  }

  /**
     * 移除动画设置。<br>
     *     架构内部函数，应只能被Forge.AnimationBase调用
     *
     * @func DetachAnimation
     * @memberof Forge.LayoutViewBase
     * @instance
     * @param {Forge.AnimationBase} anim 要移除的动画
     * */
  DetachAnimation(anim) {
    if (this.TransformAnimationObj === anim) {
      this.TransformAnimationObj = null;

      if (!window.jsvInAndroidWebView) {
        this.Element.style.animation = null;
        this.Element.style.transition = null;
      } else {
        this.Element.style.webkitAnimation = null;
        this.Element.style.webkitTransition = null;
      }
    }
  }

  ResetCssTransform(transform_string, transform_origin_string) {
    if (transform_string !== this._CssTransform || transform_origin_string !== this._CssTransformOrigin) {
      // console.log("ResetCssTransform transform_string:", transform_string);
      if (!window.jsvInAndroidWebView) {
        this.Element.style.transform = transform_string;
        this.Element.style.transformOrigin = transform_origin_string;
      } else {
        this.Element.style.webkitTransform = transform_string;
        this.Element.style.webkitTransformOrigin = transform_origin_string;
      }

      this._CssTransform = transform_string;
      this._CssTransformOrigin = transform_origin_string;
    }
  }

  ResetTextureCssTransform(transform_string, transform_origin_string) {
    this.ResetCssTransform(transform_string, transform_origin_string);
  }

  /** **************************************
     * View getter
     */
  SetId(id) {
    this.Id = id;
  }

  ResetLayoutParams(new_params) {
    if (new_params !== null) {
      if (!(new_params instanceof Forge.LayoutParamsBase)) { this.LayoutParams = new Forge.LayoutParams(new_params); } else { this.LayoutParams = new_params.Clone(); }
      this.Element.style.left = `${this.LayoutParams.MarginLeft}px`;
      this.Element.style.top = `${this.LayoutParams.MarginTop}px`;
      if (this.LayoutParams.Width) {
        this.Element.style.width = `${this.LayoutParams.Width}px`;
      }
      if (this.LayoutParams.Height) {
        this.Element.style.height = `${this.LayoutParams.Height}px`;
      }
    } else {
      Forge.ThrowError("ResetLayoutParams(): new params is null");
    }
  }

  /**
     * 获得关联的Forge.Renderer
     *
     * hide public
     * @func GetRenderer
     * @memberof Forge.LayoutViewBase
     * @instance
     * @return {Forge.Renderer}
     * */
  GetRenderer() {
    return Forge.LayoutViewBase.sRenderer;
  }

  /**
     * 获得当前布局配置的拷贝
     *
     * @public
     * @func GetLayoutParams
     * @memberof Forge.LayoutViewBase
     * @instance
     * @return {Forge.LayoutParams}
     * */
  GetLayoutParams() {
    if (!this.LayoutParams) { return new Forge.LayoutParams(); }
    return this.LayoutParams.Clone();
  }

  /**
     * 启用自适应高度
     *
     * @public
     * @func EnableAutoHeight
     * @memberof Forge.LayoutViewBase
     * @instance
     * */
  EnableAutoHeight() {
    this._AutoHeight = true;
  }

  // 功能: 标识本LayoutView要根据自身Texture加载完成后，根据Texture的尺寸重新Resize
  // 当enable后，无论尺寸设成多少，同步给Native的界面尺寸都会固定为(1,1)，
  // 以保证View会被渲染，从而防止Texture由于不在界面上不会加载的处理生效，同时小尺寸不会被注意
  WaitTextureToResize(enable) {
    // js模式下为控制显示和隐藏
    this.Element.style.visibility = (enable ? "hidden" : "visible");
  }

  // 根据object fit，调整texture在view中的显示位置
  // 当view的宽/高，单项为0时，可以进行内容的自适应扩展
  ApplyObjectFit(frame_width, frame_height, texture_width, texture_height, object_fit, object_fit_define) {
    if (this._ObjectFitTestCache === null) {
      // 创建检测结果的缓存，用于加快检测速度
      this._ObjectFitTestCache = {
        frameWidth: NaN,
        frameHeight: NaN,
        textureWidth: NaN,
        textureHeight: NaN,
        objectFit: null,
        clipLayout: null
      };
    }

    const test_cache = this._ObjectFitTestCache;

    if (test_cache.frameWidth === frame_width
            && test_cache.objectFit === object_fit
            && test_cache.frameHeight === frame_height
            && test_cache.textureWidth === texture_width
            && test_cache.textureHeight === texture_height) {
      return test_cache.clipLayout;
    }

    const clip_layout = { x: 0, y: 0, width: frame_width, height: frame_height, overflow: false };

    // Flush cache, 放在判断处理调整viewSize之前进行cache
    test_cache.frameWidth = frame_width;
    test_cache.frameHeight = frame_height;
    test_cache.textureWidth = texture_width;
    test_cache.textureHeight = texture_height;
    test_cache.objectFit = object_fit;
    test_cache.clipLayout = clip_layout;

    let expect_size = { width: 0, height: 0 };

    let frame_ratio = frame_width / frame_height;
    const texture_ratio = texture_width / texture_height;

    if (!texture_ratio) {
      console.error("Error:Texture size is 0!");
      return clip_layout;
    }

    if (frame_width === 0 || frame_height === 0) {
      if (frame_width === 0 && frame_height === 0) {
        // frame没有size的场合
        return clip_layout;
      }

      // 调整frame width 和 frame height，并计算新的frame ratio
      if (frame_width === 0) {
        frame_width = frame_height * texture_ratio;
      } else {
        // frame height === 0
        frame_height = frame_width / texture_ratio;
      }
      frame_ratio = frame_width / frame_height;
    }

    let object_fit_str = "";

    switch (object_fit) {
      case object_fit_define.FILL:
        expect_size.width = frame_width;
        expect_size.height = frame_height;
        object_fit_str = "fill";
        break;
      case object_fit_define.NONE:
        expect_size.width = texture_width;
        expect_size.height = texture_height;
        object_fit_str = "none";
        break;
      case object_fit_define.COVER:
        expect_size = this._StretchSize(frame_width, frame_height, texture_ratio, texture_ratio < frame_ratio);
        object_fit_str = "cover";
        break;
      case object_fit_define.SCALEDOWN: {
        // 使用contain和none之间尺寸小的一个。
        let refer_width = (texture_ratio > frame_ratio); // use object-fit.contain
        if (frame_width > texture_width
                    && frame_height > texture_height) { // use object-fit.none
          refer_width = (texture_ratio < frame_ratio); // use object-fit.contain
        }
        expect_size = this._StretchSize(frame_width, frame_height, texture_ratio, refer_width);
        object_fit_str = "scaledown";
        break;
      }
      case object_fit_define.CONTAIN:
        expect_size = this._StretchSize(frame_width, frame_height, texture_ratio, texture_ratio > frame_ratio);
        // console.warn("Element.JsvFitViewLayout() expect_size=" + JSON.stringify(expect_size));
        object_fit_str = "contain";
        break;
      default:
        throw new Error("Unexpected object-fit.");
    }

    // format expect size
    expect_size.width = Math.floor(expect_size.width);
    expect_size.height = Math.floor(expect_size.height);

    // 计算可视区域
    clip_layout.width = Math.min(expect_size.width, frame_width);
    clip_layout.height = Math.min(expect_size.height, frame_height);
    clip_layout.x = Math.floor((frame_width - clip_layout.width) / 2);
    clip_layout.y = Math.floor((frame_height - clip_layout.height) / 2);
    clip_layout.overflow = (expect_size.width > frame_width || expect_size > frame_height);

    // element设置object fit
    const target_ele = (this.InnerChildElement ? this.InnerChildElement : this.Element);
    target_ele.style.width = `${frame_width}px`;
    target_ele.style.height = `${frame_height}px`;
    target_ele.style.objectFit = object_fit_str;

    return clip_layout;
  }

  _StretchSize(origin_width, origin_height, ratio, refer_width) {
    const stretchSize = { width: 0, height: 0 };

    if (refer_width) {
      stretchSize.width = origin_width;
      stretchSize.height = origin_width / ratio;
    } else {
      stretchSize.height = origin_height;
      stretchSize.width = origin_height * ratio;
    }

    return stretchSize;
  }

  /**
     * 注意：改坐标计算过程中，只通过LayoutParams进行计算，不计算变形矩阵
     *
     * @func GetPositionOffset
     * @memberof Forge.LayoutViewBase
     * @instance
     * @param {Forge.LayoutViewBase} target_parent Offset测试目标父节点的LayoutView
     * @return {Forge.Coordinate} 坐标值
     * */
  GetPositionOffset(target_parent) {
    let test_view = this;
    let x_offset = 0;
    let y_offset = 0;
    while (target_parent !== test_view) {
      x_offset += (test_view.LayoutParams) ? test_view.LayoutParams.MarginLeft : 0;
      y_offset += (test_view.LayoutParams) ? test_view.LayoutParams.MarginTop : 0;
      test_view = test_view.ParentView;
      if (!test_view) Forge.ThrowError("ERROR: Target parent layoutview is not found in LayoutView tree");
    }
    return new Forge.Coordinate(x_offset, y_offset);
  }

    _dispatchLongPress = () => {
      this._LongPressDelayRequestTaskId = null;
      this._InLongPress = true;
      const target_event = {
        type: Forge.DragInfo.EVENT_TYPE.OnLongPress,
        x: this._CurrentDownEvent.designX,
        y: this._CurrentDownEvent.designY,
      };
      this.TouchEventProcess(target_event);
    }

    _onMouseDown(designX, designY, timeStamp) {
      // reset velocity
      this._Velocity.x.reset();
      this._Velocity.y.reset();
      this._Velocity.x.updatePosition(designX);
      this._Velocity.y.updatePosition(designY);
      this._LastFocusX = designX;
      this._DownFocusX = this._LastFocusX;
      this._LastFocusY = designY;
      this._DownFocusY = this._LastFocusY;
      this._CurrentDownEvent = { designX, designY, timeStamp };
      this._AlwaysInTapRegion = true;
      this._InLongPress = false;
      if (this._LongPressDelayRequestTaskId !== null) {
        clearTimeout(this._LongPressDelayRequestTaskId);
      }
      this._LongPressDelayRequestTaskId = setTimeout(this._dispatchLongPress, 600);
      const target_event = {
        type: Forge.DragInfo.EVENT_TYPE.OnDown,
        x: designX,
        y: designY,
        deltaX: 0,
        deltaY: 0
      };
      return target_event;
    }

    _onMouseMove(designX, designY, timeStamp) {
      if (!this._CurrentDownEvent) {
        return null;
      }
      this._Velocity.x.updatePosition(designX);
      this._Velocity.y.updatePosition(designY);
      const deltaX = parseInt(designX - this._LastFocusX, 10);
      const deltaY = parseInt(designY - this._LastFocusY, 10);
      const distanceX = parseInt(designX - this._DownFocusX, 10);
      const distanceY = parseInt(designY - this._DownFocusY, 10);
      let target_event = null;
      if (this._AlwaysInTapRegion) {
        const distance = (distanceX * distanceX) + (distanceY * distanceY);
        const slopSquare = this._TouchSlopSquare;
        if (distance > slopSquare) {
          target_event = {
            type: Forge.DragInfo.EVENT_TYPE.OnDragStart,
            x: designX,
            y: designY,
          };
          this._LastFocusX = designX;
          this._LastFocusY = designY;
          this._LastTimeStamp = timeStamp;
          this._AlwaysInTapRegion = false;// 状态从Tap恢复到DragStart
          this._InLongPress = false;// 状态从LongPress恢复到DragStart
          this._InDragging = true;// 进入DragMove状态
          if (this._LongPressDelayRequestTaskId !== null) {
            clearTimeout(this._LongPressDelayRequestTaskId);
            this._LongPressDelayRequestTaskId = null;
          }
        }
      } else if (this._InDragging && ((Math.abs(deltaX) >= 1) || (Math.abs(deltaY) >= 1))) {
        target_event = {
          type: Forge.DragInfo.EVENT_TYPE.OnMoved,
          x: designX,
          y: designY,
          deltaX: distanceX, // 匹配jsview touch 返回值
          deltaY: distanceY,
          _deltaX: deltaX, // 内部使用
          _deltaY: deltaY,

          timeStamp: parseInt((this._LastTimeStamp - timeStamp) / 1000, 10)
        };
        this._LastFocusX = designX;
        this._LastFocusY = designY;
        this._LastTimeStamp = timeStamp;
      }
      return target_event;
    }

    _onMouseUp(designX, designY, timeStamp) {
      let target_event = null;
      console.log("_onMouseUp, ", this._CurrentDownEvent);
      if (this._CurrentDownEvent) {
        const designMap = window.Forge.DesignMap();
        const screenBufferWidth = Math.floor(designMap.displayScale * designMap.width);
        const screenBufferRatio = window.innerWidth / screenBufferWidth;
        const designVelocityX = this._Velocity.x.getVelocity() / screenBufferRatio;
        const designVelocityY = this._Velocity.y.getVelocity() / screenBufferRatio;
        let distance_x = designX - this._CurrentDownEvent.designX;
        let distance_y = designY - this._CurrentDownEvent.designY;
        const deltaX = designX - this._LastFocusX;
        const deltaY = designY - this._LastFocusY;
        if (this._InLongPress) {
          // 长按状态下不处理任何事件
        } else if (this._AlwaysInTapRegion) {
          target_event = {
            type: Forge.DragInfo.EVENT_TYPE.OnTap,
            x: designX,
            y: designY,
            velocityX: 0,
            velocityY: 0,
            deltaX: distance_x,
            deltaY: distance_y,
            _deltaX: deltaX,
            _deltaY: deltaY,
          };
        } else {
          // A fling must travel the minimum tap distance
          // 一个fling最小的速度，单位：px/s  70
          if ((Math.abs(designVelocityY) > 70)
                    || (Math.abs(designVelocityX) > 70)) {
            distance_x = this._GetSplineFlingDistance(designVelocityX);
            distance_y = this._GetSplineFlingDistance(designVelocityY);
            target_event = {
              type: Forge.DragInfo.EVENT_TYPE.OnFling,
              x: designX,
              y: designY,
              velocityX: designVelocityX,
              velocityY: designVelocityY,
              deltaX: designVelocityX < 0 ? -distance_x : distance_x,
              deltaY: designVelocityY < 0 ? -distance_y : distance_y,
              _deltaX: deltaX,
              _deltaY: deltaY,
            };
          } else {
            target_event = {
              type: Forge.DragInfo.EVENT_TYPE.OnDragEnd,
              x: designX,
              y: designY,
              deltaX: distance_x,
              deltaY: distance_y,
              _deltaX: deltaX,
              _deltaY: deltaY,
            };
          }
          this.TouchEventProcess(target_event);
          // Release
          target_event = {
            type: Forge.DragInfo.EVENT_TYPE.OnRelease,
            x: designX,
            y: designY,
            deltaX: distance_x,
            deltaY: distance_y,
            _deltaX: deltaX,
            _deltaY: deltaY,
          };
          this._CurrentDownEvent = null;
        }
      }
      return target_event;
    }

    _onTouchEvent(event) {
      const designMap = window.Forge.DesignMap();
      const screenBufferWidth = Math.floor(designMap.displayScale * designMap.width);
      const screenBufferRatio = window.innerWidth / screenBufferWidth;
      const designX = event.clientX / screenBufferRatio;
      const designY = event.clientY / screenBufferRatio;

      // 转换event
      let target_event = null;
      switch (event.type) {
        case "touchstart":
        case "mousedown": {
          target_event = this._onMouseDown(designX, designY, event.timeStamp);
          break;
        }
        case "touchmove":
        case "mousemove": {
          target_event = this._onMouseMove(designX, designY, event.timeStamp);
          break;
        }
        case "touchend":
        case "touchcancel":
        case "mouseup": {
          target_event = this._onMouseUp(designX, designY, event.timeStamp);
          break;
        }
        default:
          break;
      }

      if (target_event) {
        return this.TouchEventProcess(target_event);
      }
      return false;
    }

    _AddEventListener() {
      this.Element.style.pointerEvents = "auto";
      this._ValidTouch = false;
      const isTouch = 'ontouchstart' in window;
      console.log(`isTouch:${isTouch}`);
      if (isTouch) {
        this.Element.addEventListener("touchstart", (event) => {
          console.log("touchstart", event);
          this._ValidTouch = true;
          if (event.touches && event.touches.length > 0) {
            console.log(`touchstart event.touches[0].clientX:${event.touches[0].clientX}, event.touches[0].clientY:${event.touches[0].clientY}`);
            const event_used = this._onTouchEvent({ type: event.type, clientX: event.touches[0].clientX, clientY: event.touches[0].clientY, timeStamp: event.timeStamp });
            if (event_used) {
              event.stopPropagation();
            }
          }
        }, true);
        this.Element.addEventListener("touchmove", (event) => {
          if (this._ValidTouch) {
            console.log("touchmove", event);
            if (event.touches && event.touches.length > 0) {
              console.log(`touchmove event.touches[0].clientX:${event.touches[0].clientX}, event.touches[0].clientY:${event.touches[0].clientY}`);
              const event_used = this._onTouchEvent({ type: event.type, clientX: event.touches[0].clientX, clientY: event.touches[0].clientY, timeStamp: event.timeStamp });
              if (event_used) {
                event.stopPropagation();
              }
            }
          }
        }, true);
        this.Element.addEventListener("touchend", (event) => {
          console.log(`touchend event.touches.length:${event.touches.length}, event.clientX:${event.clientX}, event.pageX:${event.pageX}`);
          this._ValidTouch = false;
          if (event.changedTouches && event.changedTouches.length > 0) {
            console.log(`touchend event.changedTouches[0].clientX:${event.changedTouches[0].clientX}, event.changedTouches[0].pageX:${event.changedTouches[0].pageX}`);
            const event_used = this._onTouchEvent({ type: event.type, clientX: event.changedTouches[0].clientX, clientY: event.changedTouches[0].clientY, timeStamp: event.timeStamp });
            if (event_used) {
              event.stopPropagation();
            }
          }
        }, true);
        this.Element.addEventListener("touchcancel", (event) => {
          this._ValidTouch = false;
          console.log("touchcancel", event);
          if (event.changedTouches && event.changedTouches.length > 0) {
            console.log(`touchcancel event.clientX:${event.clientX}, event.clientY:${event.clientY}`);
            const event_used = this._onTouchEvent({ type: event.type, clientX: event.touches[0].clientX, clientY: event.touches[0].clientY, timeStamp: event.timeStamp });
            if (event_used) {
              event.stopPropagation();
            }
          }
        }, true);
      } else {
        this.Element.addEventListener("mousedown", (event) => {
          console.log("mousedown", event);
          this._ValidTouch = true;
          const event_used = this._onTouchEvent(event);
          if (event_used) {
            event.stopPropagation();
          }
        }, true);

        this.Element.addEventListener("mousemove", (event) => {
          if (this._ValidTouch) {
            const event_used = this._onTouchEvent(event);
            if (event_used) {
              event.stopPropagation();
            }
          }
        }, true);

        this.Element.addEventListener("mouseup", (event) => {
          console.log("mouseup", event);
          this._ValidTouch = false;
          const event_used = this._onTouchEvent(event);
          if (event_used) {
            event.stopPropagation();
          }
        }, true);
      }
    }

    /*
     _GetSplineFlingDuration(velocity) {
     let l = this._GetSplineDeceleration(velocity);
     let decelMinusOne = Forge.DragInfo.DECELERATION_RATE - 1.0;
     return parseInt(1000.0 * Math.exp(l / decelMinusOne));
     }
     */
    // 减速带
    _GetSplineDeceleration(velocity) {
      return Math.log(Forge.DragInfo.INFLEXION * Math.abs(velocity) / (Forge.DragInfo.SCROLL_FRICTION * Forge.DragInfo.PHYSICAL_COEF));
    }

    _GetSplineFlingDistance(velocity) {
      const l = this._GetSplineDeceleration(velocity);
      const decelMinusOne = Forge.DragInfo.DECELERATION_RATE - 1.0;
      return Forge.DragInfo.SCROLL_FRICTION * Forge.DragInfo.PHYSICAL_COEF * Math.exp(Forge.DragInfo.DECELERATION_RATE / decelMinusOne * l);
    }

    _DoDragMove(event, need_anim) {
      let deltaX = event._deltaX;
      let deltaY = event._deltaY;
      this._DragMovedDistanceX += deltaX;
      this._DragMovedDistanceY += deltaY;
      if (!need_anim) { // onFling时，dragmove不更新view坐标，故用deltaX，不使用内部的_deltaX。
        deltaX = event.deltaX;
        deltaY = event.deltaY;
      }

      const duration = event.timeStamp / 1000;
      let transition = `left ${duration}s, top ${duration}s`;
      if (this._DragInfo.Settings.DragDirection === Forge.DragSetting.DIRECTION_VERTICAL) {
        deltaX = 0;
        transition = `top ${duration}s`;
      } else if (this._DragInfo.Settings.DragDirection === Forge.DragSetting.DIRECTION_HORIZONTAL) {
        deltaY = 0;
        transition = `left ${duration}s`;
      } else if (this._DragInfo.Settings.DragDirection === Forge.DragSetting.DIRECTION_DISABLE) {
        deltaX = 0;
        deltaY = 0;
      }
      let lp = this.GetLayoutParams();
      // const viewX = lp.MarginLeft;
      // const viewY = lp.MarginTop;
      // 检测边界
      lp = this._GetMovedLayoutParams(deltaX, deltaY);
      if (need_anim) {
        this.Element.style.transition = transition;
        this.ResetLayoutParams(lp);
      }
      if (Math.abs(this._DragMovedDistanceX) >= this._DragInfo.Settings.TriggerMovedDistance
            || Math.abs(this._DragMovedDistanceY) >= this._DragInfo.Settings.TriggerMovedDistance) {
        if (this._DragInfo.Listener && this._DragInfo.Listener.OnMoved) {
          // 补充event
          event.viewX = lp.MarginLeft;
          event.viewY = lp.MarginTop;
          return this._DragInfo.Listener.OnMoved(event);
        }
      }
      return false;
    }

    _GetMovedLayoutParams(deltaX, deltaY) {
      const lp = this.GetLayoutParams();
      let x = lp.MarginLeft + deltaX;
      let y = lp.MarginTop + deltaY;

      if (x > this._DragInfo.Settings.SlidePile.x) {
        x = this._DragInfo.Settings.SlidePile.x;
      } else if (x + lp.Width < this._DragInfo.Settings.SlidePile.x + this._DragInfo.Settings.SlidePile.width) {
        x = (this._DragInfo.Settings.SlidePile.x + this._DragInfo.Settings.SlidePile.width) - lp.Width;
      }
      if (y > this._DragInfo.Settings.SlidePile.y) {
        y = this._DragInfo.Settings.SlidePile.y;
      } else if (y + lp.Height < this._DragInfo.Settings.SlidePile.y + this._DragInfo.Settings.SlidePile.height) {
        y = (this._DragInfo.Settings.SlidePile.y + this._DragInfo.Settings.SlidePile.height) - lp.Height;
      }
      lp.SetPosition(x, y);

      return lp;
    }

    _SlideIfEnableTabMod(event, direction) {
      if (!this._DragInfo.Settings.EnableTabMode) {
        return false;
      }
      const deltaX = event._deltaX;
      const deltaY = event._deltaY;
      let distance_x = event.deltaX;
      let distance_y = event.deltaY;
      let page_edge = this._DragInfo.Settings.PageWidth * this._DragInfo.Settings.PageEdge;
      const lp = this.GetLayoutParams();
      const viewX = lp.MarginLeft + deltaX;
      const viewY = lp.MarginTop + deltaY;
      if (event.type === Forge.DragInfo.EVENT_TYPE.OnFling) {
        page_edge = 0;// fling时，不进行edge判断
      }

      // 计算
      switch (this._DragInfo.Settings.DragDirection) {
        case Forge.DragSetting.DIRECTION_VERTICAL: { // 当拖拽的距离大于等于limitrange时，进行同向动画，否则动画相反
          distance_x = 0;
          // 重置duration 与 距离
          if (distance_y >= 0) {
            const left_width = this._DragInfo.Settings.PageWidth - Math.abs(viewY) % this._DragInfo.Settings.PageWidth;
            if (left_width >= page_edge) {
              distance_y = (this._DragInfo.Settings.PageWidth - left_width);
            } else {
              distance_y = -left_width;
            }
          } else {
            const left_width = Math.abs(viewY) % this._DragInfo.Settings.PageWidth;
            if (left_width >= page_edge) {
              distance_y = -(this._DragInfo.Settings.PageWidth - left_width);
            } else {
              distance_y = left_width;
            }
          }
          break;
        }
        case Forge.DragSetting.DIRECTION_HORIZONTAL: {
          distance_y = 0;
          if (distance_x >= 0) {
            const left_width = this._DragInfo.Settings.PageWidth - Math.abs(viewX) % this._DragInfo.Settings.PageWidth;
            if (left_width >= page_edge) {
              distance_x = (this._DragInfo.Settings.PageWidth - left_width);
            } else {
              distance_x = -left_width;
            }
            console.log(`right, left_width:${left_width}, distance_x:${distance_x}`);
          } else {
            const left_width = Math.abs(viewX) % this._DragInfo.Settings.PageWidth;
            if (left_width >= page_edge) {
              distance_x = -(this._DragInfo.Settings.PageWidth - left_width);
            } else {
              distance_x = left_width;
            }
            console.log(`left, left_width:${left_width}, distance_x:${distance_x}`);
          }
          break;
        }
        case Forge.DragSetting.DIRECTION_AUTO: {
          console.log("slideIfEnableTabMode DragDirection error DRAG_DIRECTION_AUTO");
          break;
        }
        default:
          break;
      }

      if (distance_x === 0 && distance_y === 0) {
        console.log("slideIfEnableTabMode distance_x === 0 && distance_y === 0");
        return false;
      }
      const speed = Math.sqrt(distance_x * distance_x + distance_y * distance_y) / 0.3;// 与jsview 效果匹配，300ms完成动画
      event.deltaX = distance_x;
      event.deltaY = distance_y;
      this._DonFlingAnim(event, speed);
      return true;
    }

    _DoDragEnd(event) {
      let deltaX = event._deltaX;
      let deltaY = event._deltaY;
      if (this._DragInfo.Settings.DragDirection === Forge.DragSetting.DIRECTION_VERTICAL) {
        deltaX = 0;
      } else if (this._DragInfo.Settings.DragDirection === Forge.DragSetting.DIRECTION_HORIZONTAL) {
        deltaY = 0;
      } else if (this._DragInfo.Settings.DragDirection === Forge.DragSetting.DIRECTION_DISABLE) {
        deltaX = 0;
        deltaY = 0;
      }

      console.log("_DoDragEnd event:", event, this.Element.style);
      let lp = this.GetLayoutParams();
      // 检测边界
      lp = this._GetMovedLayoutParams(deltaX, deltaY);
      this.ResetLayoutParams(lp);

      // 补充event
      event.viewX = lp.MarginLeft;
      event.viewY = lp.MarginTop;

      return this._DragInfo.Listener.OnDragEnd(event);
    }

    _DragImactSensorRecycle() {
      console.log("_DragImactSensorRecycle this._DragImactSensor:", this._DragImactSensor);
      if (this._DragImactSensor) {
        this._DragImactSensor.Recycle();
      }
    }

    _DonFlingAnim(event, speed) {
      const distance_x = event.deltaX;
      const distance_y = event.deltaY;
      const lp = this.GetLayoutParams();
      const view_origin_x = lp.MarginLeft;
      const view_origin_y = lp.MarginTop;
      const target_x = lp.MarginLeft + distance_x;
      const target_y = lp.MarginTop + distance_y;
      const adjust_lp = this._GetMovedLayoutParams(distance_x, distance_y);
      if (adjust_lp.MarginLeft === lp.MarginLeft && adjust_lp.MarginTop === lp.MarginTop) {
        console.log("_DonFlingAnim adjust_lp.MarginLeft === lp.MarginLeft && adjust_lp.MarginTop === lp.MarginTop");
        return;
      }

      this.DragControl = new Forge.DragTranslateControl();
      this.DragControl._SetView(this);
      this.DragControl.speed(speed);
      console.log(`OnFling speed:${speed}`);
      const setting = this._DragInfo.Settings;
      this._DragImactSensorRecycle();

      this.Element.style.transform = null;
      this.DragControl.target(lp.MarginLeft, lp.MarginTop).jumpSilent();
      // TODO 需确认，恢复view的坐标，进行动画,否则碰撞检测时，会使用坐标并将其于transform translate合计，导致碰撞错误
      lp.SetPosition(0, 0);
      this.ResetLayoutParams(lp);
      let timeStamp = 0;

      this.DragControl.target(target_x, target_y).start((view_x, view_y) => {
        this.DragControl = null;
        lp.SetPosition(view_x, view_y);
        this.ResetLayoutParams(lp);
        this.Element.style.transform = null;
        this._DragImactSensorRecycle();

        // 补充event
        event.viewX = view_x;
        event.viewY = view_y;
        this._DragInfo.Listener.OnFling(event);
        console.log(`_DonFlingAnim  end view_x:${view_x}, view_y:${view_y}, distance_x:${distance_x}, distance_y:${distance_y}`);
      }, (progress) => {
        const deltaX = distance_x * progress;
        const deltaY = distance_y * progress;
        console.log(`_DonFlingAnim progress:${progress}, deltaX:${deltaX}, deltaY:${deltaY}`);
        if (Math.abs(deltaX) > this._DragInfo.Settings.TriggerMovedDistance
                || Math.abs(deltaY) > this._DragInfo.Settings.TriggerMovedDistance) {
          const target_event = {
            deltaX: view_origin_x + deltaX,
            deltaY: view_origin_y + deltaY,
            _deltaX: deltaX,
            _deltaY: deltaY,
            timeStamp: parseInt((Date.now() - timeStamp) / 1000, 10)
          };
          this._DoDragMove(target_event, false);
          timeStamp = Date.now();
        }
      });
      const parent_view_position = this.GetPositionOffset(this.ParentView);
      // 设置碰撞sensor
      this._DragImactSensor = Forge.sElementImpactSensorManager.AddImpactSensor(new Forge.DragImpactSensor(
        [{ x: setting.SlidePile.x + parent_view_position.x, y: setting.SlidePile.y + parent_view_position.y },
          { x: setting.SlidePile.x + parent_view_position.x + setting.SlidePile.width, y: setting.SlidePile.y + parent_view_position.y },
          { x: setting.SlidePile.x + parent_view_position.x, y: setting.SlidePile.y + parent_view_position.y + setting.SlidePile.height },
          {
            x: setting.SlidePile.x + parent_view_position.x + setting.SlidePile.width,
            y: setting.SlidePile.y + parent_view_position.y + setting.SlidePile.height
          }],
        this.Element,
        new Forge.sImpactSensorManager.Callback((element_position) => {
          this._DoDragPause(event);
          this._DragImactSensorRecycle();
        }, null)
      ));
    }

    _DoFling(event) {
      let distance_x = event.deltaX;
      let distance_y = event.deltaY;
      let need_fling = true;
      let speed = 0;
      switch (this._DragInfo.Settings.DragDirection) {
        case Forge.DragSetting.DIRECTION_VERTICAL:
          distance_x = 0;
          if (distance_y === 0) {
            need_fling = false;
          }
          speed = Math.abs(event.velocityY);
          break;
        case Forge.DragSetting.DIRECTION_HORIZONTAL:
          distance_y = 0;
          if (distance_x === 0) {
            need_fling = false;
          }
          speed = Math.abs(event.velocityX);
          break;
        case Forge.DragSetting.DIRECTION_DISABLE:
          need_fling = false;
          break;
        default:
          speed = Math.sqrt(event.velocityX ** 2, event.velocityY ** 2);
          break;
      }

      if (need_fling) {
        event.deltaX = distance_x;
        event.deltaY = distance_y;
        this._DonFlingAnim(event, speed);
      }
      return true;
    }
}
LayoutViewBase.DivId = 0;
// Static variable
Forge.LayoutViewBase = LayoutViewBase;

class LayoutView extends Forge.LayoutViewBase {
  /**
     * 渲染树的每个节点。<br>
     *     创建例子：<br>
     *         1. 通过Forge.TextureManager创建Texture<br>
     *         2. 将Texture装入Forge.TextureSetting集合, var ts = new Forge.TextureSetting(...);<br>
     *         3. var v = new Forge.LayoutView(ts)<br>
     *         4. 将view加入渲染树 parent_view.AddView(v, {x:0, y:0, width:100, height:100})<br>
     *            width和height决定Texture的描画尺寸（拉伸）<br>
     *
     * @public
     * @constructor Forge.LayoutView
     * @extends Forge.LayoutViewBase
     * @param {Forge.TextureSetting} texture_setting            用于描画的Texture合集
     * */
  constructor(texture_setting, element_name) {
    if (texture_setting && !(texture_setting instanceof Forge.TextureSetting)) { Forge.ThrowError("ERROR:LayoutView need TextureSetting as parameter"); }
    element_name = element_name || "div";
    super(texture_setting, element_name);
  }
}

Forge.LayoutView = LayoutView;
window.LayoutView = Forge.LayoutView; // export class
class RootView extends Forge.LayoutView {
  /**
     * 根节点LayoutView
     *
     * @protected
     * @constructor Forge.RootView
     * @extends Forge.LayoutView
     * */
  constructor() {
    super(undefined, "root");
    this._ViewType = 1;
    this._IsChildOfRootView = true;
    window.gRootView = this;
    Forge.sRootView = this;
  }

  /**
     * 初始化RootView的尺寸（一般根据window.innerHeight和window.innerWidth)
     *
     * @public
     * @func Init
     * @memberof Forge.RootView
     * @instance
     * @param {Forge.Renderer} renderer
     * @param {int} left
     * @param {int} top
     * @param {int} width
     * @param {int} height
     * */
  Init(renderer, left, top, width, height) {
    // Init static private value
    this.InitLayoutViewStaticValues(renderer);

    this.ResetLayoutParams({ x: 0, y: 0, width: 1280, height: 720 }); // TODO: 需要和ActivityManager设置进行对接
  }

  /**
     * 初始化LayoutViewBase中的静态变量
     *
     * @protected
     * @func InitLayoutViewStaticValues
     * @memberof Forge.LayoutViewBase
     * @instance
     * @param {Forge.Renderer} renderer
     * */
  InitLayoutViewStaticValues(renderer) {
    Forge.LayoutViewBase.sRenderer = renderer; // Set shared renderer of all LayoutView
    Forge.LayoutViewBase.sInternalTextureManager = renderer.GetSharedTextureManager();
    Forge.LayoutViewBase.sIdentityMat4 = new Forge.Mat4();
    Forge.LayoutViewBase.sNullDirectParentMat4 = new Forge.Mat4();
    Forge.LayoutViewBase.sBakeFlipYMat4 = (new Forge.Mat4()).rotatex(180);
  }
}
Forge.RootView = RootView;
window.RootView = Forge.RootView; // export class
class CClipRectInfo {
  constructor(x, y, w, h, enable) {
    this.coordX = x;
    this.coordY = y;
    this.width = w;
    this.height = h;
    this.useScissors = enable;
    this.maskStencil = null;
  }

  updateInfo(x, y, w, h, enable) {
    this.coordX = x;
    this.coordY = y;
    this.width = w;
    this.height = h;
    this.useScissors = enable;
  }

  setMaskStencil(local_file_uri) {
    this.maskStencil = local_file_uri;
  }
}

class ClipView extends Forge.LayoutView {
  /**
     * 带裁剪功能的LayoutView
     *
     * @public
     * @constructor Forge.ClipView
     * @extends Forge.LayoutView
     * @param {Forge.TextureSetting} texture_setting 背景Texture集合
     * */
  constructor(texture_setting) {
    super(texture_setting, "div");
    this._ClipRectInfo = null;
    this.Id = "ClipView";
    this.TextureSetting = null;
  }

  /**
     * 重载LayoutView.SetId，为所设置的Id添加后缀_ClipView
     *
     * @public
     * @func SetId
     * @memberof Forge.ClipView
     * @instance
     * @param {string} id 原始id
     * */
  SetId(id) {
    this.Id = `${id}_ClipView`;
  }

  /**
     * 设置裁剪区域大小
     *
     * @public
     * @func SetClipRect
     * @memberof Forge.ClipView
     * @instance
     * @param {int} x           相对于自己的坐标
     * @param {int} y           相对于自己的坐标
     * @param {int} width       相对于自己的坐标
     * @param {int} height      相对于自己的坐标
     * @param {boolean} use_scissors    是否进行裁剪
     * */
  SetClipRect(x, y, width, height, use_scissors) {
    // use_scissors = false; // Enabled only when debug
    if (this._ClipRectInfo === null) {
      this._ClipRectInfo = new CClipRectInfo(x, y, width, height, use_scissors);
    } else {
      this._ClipRectInfo.updateInfo(x, y, width, height, use_scissors);
    }
    const clip_left = x;
    const clip_top = y;
    const clip_right = this.LayoutParams.Width - clip_left - width;
    const clip_bottom = this.LayoutParams.Height - clip_top - height;
    if (use_scissors) {
      this.Element.style.overflow = "hidden";
      this.Element.style.clipPath = `inset(${clip_top}px ${clip_right}px ${clip_bottom}px ${clip_left}px)`;
    } else {
      this.Element.style.overflow = "visible";
      this.Element.style.clipPath = "unset";
    }
  }
}
Forge.ClipView = ClipView;
window.ClipView = Forge.ClipView; // export class

class NinePatchView extends Forge.LayoutView {
  /**
     * 按照NinePatch方式进行渲染的专用LayoutView
     *
     * @public
     * @constructor Forge.NinePatchView
     * @extends Forge.LayoutView
     * @param {Forge.TextureSetting} texture_setting 背景Texture集合
     * */
  constructor(texture_setting) {
    super(texture_setting, "div");
    this._HorizontalRepeats = [0, 0, 0, 0];
    this._VerticalRepeats = [0, 0, 0, 0];
    this._HorizontalPadding = [0, 0];
    this._VerticalPadding = [0, 0];
  }

  /**
     * 设置新的Texture集合
     *
     * @public
     * @func ResetTexture
     * @memberof Forge.LayoutViewBase
     * @instance
     * @param {Forge.TextureSetting} texture_setting    新的Texture集合
     * */
  ResetTexture(texture_setting) {
    this.TextureSetting = texture_setting;

    if (texture_setting) {
      if (texture_setting.MaskSetting) {
        if (texture_setting.MaskSetting._MaskType === "CORNER") {
          this._SetBorderRadius(texture_setting.MaskSetting);
        }
      }
      if (texture_setting.Texture.Source) {
        const texture_width = texture_setting.Texture.RenderTexture.Width;
        const texture_height = texture_setting.Texture.RenderTexture.Height;
        const slice_left = this._HorizontalRepeats[0];
        const slice_right = texture_width - this._HorizontalRepeats[1] - slice_left;
        const slice_top = this._VerticalRepeats[0];
        const slice_bottom = texture_height - this._VerticalRepeats[1] - slice_top;

        // top right bottom left
        const slice_str = `${slice_top} ${slice_right} ${slice_bottom} ${slice_left}`;
        this.Element.style.borderImage = `url(${texture_setting.Texture.Source}) ${slice_str} fill`;// 图片边框向内偏移。
        const outset_left = this._HorizontalPadding[0];
        const outset_right = texture_width - this._HorizontalPadding[1] - outset_left;
        const outset_top = this._VerticalPadding[0];
        const outset_bottom = texture_height - this._VerticalPadding[1] - outset_top;

        this.Element.style.borderImageWidth = `${slice_top}px ${slice_right}px ${slice_bottom}px ${slice_left}px`;// 图片边框的宽度。
        this.Element.style.borderImageOutset = `${outset_top}px ${outset_right}px ${outset_bottom}px ${outset_left}px`;// 边框图像区域超出边框的量。
      }
    }
  }

  /**
     * 设置横向延展区域和纵向延展的区域。（即NinePatch规则中的上边线和左边线）
     *
     * @public
     * @func SetRepeat
     * @memberof Forge.NinePatchView
     * @instance
     * @param {Array} horizontal_repeat  横向延展区域设置数组（目前延展区域个数最大支持2个）<br>
     *                                  数组元素内容，包含start和end该点：{start:xxx, width:xxx}
     * @param {Array} vertical_repeat  纵向延展区域设置数组（目前延展区域个数最大支持2个）<br>
     *                                  数组元素内容，包含start和end该点：{start:xxx, width:xxx}
     * */
  SetRepeat(horizontal_repeat, vertical_repeat) {
    Forge.Assert(horizontal_repeat.length <= 2);
    Forge.Assert(vertical_repeat.length <= 2);

    for (let i = 0; i < 2; i++) {
      if (i < horizontal_repeat.length) {
        this._HorizontalRepeats[i * 2] = horizontal_repeat[i].start;
        this._HorizontalRepeats[i * 2 + 1] = horizontal_repeat[i].width;
      } else {
        this._HorizontalRepeats[i * 2] = 0;
        this._HorizontalRepeats[i * 2 + 1] = 0;
      }

      if (i < vertical_repeat.length) {
        this._VerticalRepeats[i * 2] = vertical_repeat[i].start;
        this._VerticalRepeats[i * 2 + 1] = vertical_repeat[i].width;
      } else {
        this._VerticalRepeats[i * 2] = 0;
        this._VerticalRepeats[i * 2 + 1] = 0;
      }
    }
    return this; // 为了支持连续设定的用法
  }

  /**
     * 设置横向填充区尺寸以及纵向填充区尺寸。（即NinePatch规则中的下边线和右边线）
     *
     * @public
     * @func SetPadding
     * @memberof Forge.NinePatchView
     * @instance
     * @param {Object} horizontal_padding  内容覆盖区域（横向），格式：{start:xxx, width:xxx}
     * @param {Object} vertical_padding  内容覆盖区域（纵向向），格式：{start:xxx, width:xxx}
     * */
  SetPadding(horizontal_padding, vertical_padding) {
    Forge.Assert(horizontal_padding !== null);
    Forge.Assert(vertical_padding !== null);
    this._VerticalPadding[0] = vertical_padding.start;
    this._VerticalPadding[1] = vertical_padding.width;
    this._HorizontalPadding[0] = horizontal_padding.start;
    this._HorizontalPadding[1] = horizontal_padding.width;
    return this; // 为了支持连续设定的用法
  }
}

Forge.NinePatchView = NinePatchView;


class JsvElementView extends Forge.LayoutView {
  /**
     * 根节点LayoutView
     *
     * @protected
     * @constructor Forge.RootView
     * @extends Forge.LayoutView
     * */
  constructor(name) {
    const origin_name = name.substr(3);
    super(undefined, origin_name);
  }

  setAttribute(name, value) {
    this.Element.setAttribute(name, value);
  }

  removeAttribute(name) {
    this.Element.removeAttribute(name);
  }

  getAttribute(name) {
    return this.Element.getAttribute(name);
  }

  hasAttribute(name) {
    return this.Element.hasAttribute(name);
  }

  get textContent() {
    return this.Element.textContent;
  }

  set textContent(text) {
    this.Element.textContent = text;
  }
}
Forge.JsvElementView = JsvElementView;

class VideoView extends Forge.LayoutView {
  constructor(video_player_hdl, texture_setting) {
    super(texture_setting);
    this._ViewType = 8;
    this.Element = video_player_hdl.Ele;
    this.Id = "VideoView";
  }

  /**
     * 重载LayoutView.SetId，为所设置的Id添加后缀_VideoView
     *
     * @public
     * @func SetId
     * @memberof Forge.VideoView
     * @instance
     * @param {string} id 原始id
     * */
  SetId(id) {
    this.Id = `${id}_VideoView`;
  }

  ResetLayoutParams(new_params) {
    if (new_params !== null) {
      if (!(new_params instanceof Forge.LayoutParamsBase)) { this.LayoutParams = new Forge.LayoutParams(new_params); } else { this.LayoutParams = new_params.Clone(); }
      this.Element.style.left = `${this.LayoutParams.MarginLeft}px`;
      this.Element.style.top = `${this.LayoutParams.MarginTop}px`;
      if (this.LayoutParams.Width) {
        this.Element.style.width = `${this.LayoutParams.Width}px`;
      }
      if (this.LayoutParams.Height) {
        this.Element.style.height = `${this.LayoutParams.Height}px`;
      }
    } else {
      Forge.ThrowError("ResetLayoutParams(): new params is null");
    }
  }

  _OnDetachFromSystem() {
    super._OnDetachFromSystem();
    if (this._VideoPlayerHdl) {
      this._VideoPlayerHdl.unload();
      this._VideoPlayerHdl = null;
    }
  }
}
Forge.VideoView = VideoView;

class EditControlView extends Forge.LayoutView {
  /**
     * 带输入框功能的LayoutView
     *
     * @constructor Forge.EditControlView
     * @extends Forge.LayoutView
     * @param {Forge.TextureSetting} texture_setting 背景Texture集合
     * */
  constructor() {
    super(null, "input");
    this._ViewType = 5;
    this._InputType = Forge.TextInputType.TEXT;
    this.Id = "EditControlView";
  }

  _OnAttachToSystem() {
    super._OnAttachToSystem();
    // 该input只作为文字录入的辅助作用，故移除屏幕外,
    // 具体描画为高阶控件操控
    this.Element.style.left = "-1920px";
    this.Element.style.top = "-1080px";
    this.Element.style.width = "1px";
    this.Element.style.height = "1px";
    /* //TODO for Test
        this.Element.style.left="300px";
        this.Element.style.top="100px";
        this.Element.style.width="100px";
        this.Element.style.height="50px"; */

    // pointerEvents设置，input才能获得焦点
    this.Element.style.pointerEvents = "auto";
    this.Element.addEventListener('keydown', (event) => { // add listener keydown for textarea
      event = event || window.event;
      let cur_offset = this.Element.selectionStart;
      console.log(`keydown cur_offset:${cur_offset}`);
      if (event.keyCode === 37) {
        --cur_offset;
        if (cur_offset < 0) {
          cur_offset = 0;
        }
        if (cur_offset !== this.Element.selectionStart) {
          this.OnTextChanged(this.Element.value, cur_offset, true);
          if (event.stopPropagation) {
            event.stopPropagation();
          }
        } else {
          this.Element.blur();
        }
      } else if (event.keyCode === 39) {
        ++cur_offset;
        if (cur_offset > this.Element.value.length) {
          cur_offset = this.Element.value.length;
        }
        if (cur_offset !== this.Element.selectionStart) {
          this.OnTextChanged(this.Element.value, cur_offset, true);
          if (event.stopPropagation) {
            event.stopPropagation();
          }
        } else {
          this.Element.blur();
        }
      } else if (event.keyCode === 38 || event.keyCode === 40) {
        this.Element.blur();
      }
    });

    // input onfocus焦点获得
    this.Element.onfocus = (event) => {
      console.log("onfocus in");
      this.OnStatusChanged(1);
    };
    // input onfocus焦点丢失
    this.Element.onblur = (event) => {
      console.log("onblur in");
      this.OnStatusChanged(0);
    };
    const ifDigital = char => '0'.charCodeAt() <= char.charCodeAt() && char.charCodeAt() <= '9'.charCodeAt();

    // input 文字变化时
    this.Element.oninput = (event) => {
      console.log("oninput:", event);
      if (event.target.value.length > 0 && event.target.selectionStart > 0) {
        const start = event.target.selectionStart - 1;
        const end = event.target.selectionStart;
        const add_text = event.target.value.slice(start, end);
        if (!ifDigital(add_text) && this._InputType === Forge.TextInputType.NUMBER) {
          event.target.value = event.target.value.substr(0, start) + event.target.value.substr(end);
          event.target.selectionStart = start;
        }
      }

      const text = event.target.value;
      const select_start = event.target.selectionStart;
      this.OnTextChanged(decodeURIComponent(text), select_start);
    };
  }

  /**
     * 重载LayoutView.SetId，为所设置的Id添加后缀_EditControlView
     *
     * @public
     * @func SetId
     * @memberof Forge.EditControlView
     * @instance
     * @param {string} id 原始id
     * */
  SetId(id) {
    this.Id = `${id}_EditControlView`;
  }

  /**
     * 显示输入法
     *
     * @public
     * @func showIme
     * @memberof Forge.EditControlView
     * @instance
     * @param {Forge.TextInputType} input_type
     * @param {string} text    显示字符串
     * @param {int} cursor_pos  光标所在位置
     * @param {int} selectionEnd  字符串选择stop位置，默认为文字的末尾
     * */
  showIme(input_type, text, cursor_pos) {
    if (!this.Element) {
      console.log("showIme but ele is null!");
      return;
    }
    if (input_type === Forge.TextInputType.NONE) {
      console.log("showIme input_type error");
      return;
    }
    if (typeof cursor_pos === "undefined" || cursor_pos === null) {
      cursor_pos = text.length > 0 ? text.length : 0;
    }
    if (cursor_pos < 0) {
      cursor_pos = 0;
    } else if (cursor_pos > text.length) {
      cursor_pos = text.length > 0 ? text.length : 0;
    }
    this._InputType = input_type;
    /* switch (input_type) {
            case Forge.TextInputType.PASSWORD:
                this.Element.type = "password";
                break;
            case Forge.TextInputType.NUMBER:
                this.Element.type = "number";
                break;
            case Forge.TextInputType.TEXT:
            default:
                this.Element.type = "text";
                break;
        } */
    // 浏览器端不对type做限制，（因为number/password类型时selectionStart为null）
    this.Element.type = "text";
    this.Element.value = text;
    this.Element.focus();
    this.Element.selectionStart = cursor_pos;
    this.Element.selectionEnd = cursor_pos;
  }

  /**
     * 隐藏输入法
     *
     * @public
     * @func hideIme
     * @memberof Forge.EditControlView
     * @instance
     * */
  hideIme() {
    if (!this.Element) {
      console.log("hideIme, but ele is null!");
      return;
    }
    this.Element.blur();
  }

  /**
     * 更新光标位置
     *
     * @public
     * @func updateCursorOffset
     * @memberof Forge.EditControlView
     *
     * @instance
     * @param {String} text  显示字符串
     * @param {int} cursor_pos  光标所在位置
     * */
  updateCursorOffset(text, cursor_offset) {
    if (!this.Element) {
      console.log("updateCursorOffset, but ele is null!");
      return;
    }
    this.Element.selectionStart = cursor_offset;
    this.Element.selectionEnd = cursor_offset;
    this.Element.value = text;
  }

  /**
     * 文字变更
     * @param value
     * @param {int} cursor_pos  光标所在位置
     * @param {bool} moved  光标移动
     * @constructor
     */
  OnTextChanged(value, cursor_pos, moved) {
    // Override
    console.log(`OnTextChanged value:${value}`);
  }

  /**
     * 状态变更
     * @param status    输入法状态 1:'show'/0:'hide'
     * @constructor
     */
  OnStatusChanged(status) {
    // Override
  }

  /**
     * action 事件通知
     * @param action
     * @constructor
     */
  OnEditAction(action) {
    // Override
  }
}

Forge.TextInputType = {
  NONE: 0,
  TEXT: 1,
  PASSWORD: 2,
  TEXT_AREA: 3,
  CONTENT_EDITABLE: 4,
  SEARCH: 5,
  URL: 6,
  EMAIL: 7,
  TELEPHONE: 8,
  NUMBER: 9
};
Forge.EditControlView = EditControlView;
class JsvControl {
  constructor(params_count) {
    this._Current = new Array(params_count).fill(0);
    this._Target = new Array(params_count).fill(0);
    this._RepeatStart = new Array(params_count).fill(0);
    this._JumpTarget = null;
    this._Jumping = false;
    this._ParameterCount = params_count;
    this._StateIndex = 0; // 0: idle, 1:running
    this._StateLocked = false;
    this._StartSwitcher = false;
    this._PausedCallback = null;
    this._EndCallback = null;
    this._NextEndCallback = null;
    this._Token = 0;
    this._Repeat = false;
    this._OnRepeatCallback = null;
    this._SpriteView = null;
    this._AdvanceCallback = null;
  }

  setRepeat(enable, repeat_callback) {
    this._Repeat = enable;
    if (enable) {
      this._OnRepeatCallback = repeat_callback;
    } else {
      this._OnRepeatCallback = null;
    }
    return this;
  }

  start(end_callback, advance_callback) {
    // 取消旧的Callback
    this._NextEndCallback = end_callback;
    this._EndCallback = null;
    this._AdvanceCallback = advance_callback;
    this._StartSwitcher = true;
    this._Jumping = false;
    this._StateMachineNext();
  }

  pause(paused_callback) {
    this._AdvanceCallback = null;

    // 执行pause动作时，相当于取消start()动作，所以EndCallback同时也应该被取消
    if (this._EndCallback !== null || this._NextEndCallback !== null) {
      this._EndCallback = null;
      this._NextEndCallback = null;
    }

    // 根据当前状态，已经处于Pause则直接回调，否则发送pause指令
    if (this._StateIndex === 0) {
      if (paused_callback) {
        this._CallbackWithCatch(this._Current, paused_callback);
      }
    } else {
      if (paused_callback) {
        this._PausedCallback = paused_callback;
      }
      this._StateMachineNext();
    }
  }

  jump() {
    this._JumpTarget = [...this._Target];
    this._Jumping = true;
    this._StartSwitcher = true;
    this._StateMachineNext();
  }

  jumpSilent() {
    this._JumpTarget = [...this._Target];
  }

  startFpsTesting() {
    Forge.sRenderBridge.SetStepFpsSwitch(true);
  }

  stopFpsTesting() {
    Forge.sRenderBridge.SetStepFpsSwitch(false);
  }

  _WrapBuildAnimation(repeat_start_array, current_array, tos_array, act_jump) {
    console.warn("Should Override");
  }

  _WrapCallback(currents, callback) {
    console.warn("Should Override");
  }

  _CallbackWithCatch(currents, callback) {
    try {
      this._WrapCallback(currents, callback);
    } catch (e) {
      console.error("Error:in callback");
      console.error(e);
    }
  }

  _StateMachineNext() {
    if (this._StateLocked) {
      // 内部处理进行中，暂停状态切换
      return;
    }

    if (this._StateIndex === 0) {
      // Idle -> play, need switcher
      if (this._StartSwitcher) {
        this._StartSwitcher = false;
        if (this._StartAnimation()) {
          this._StateIndex = 1;
        }
      }
    } else if (this._StateIndex === 1) {
      // Play -> idle, no need switcher
      this._StopAnimation();
    }
  }

  _StartAnimation() {
    // 当动画开始后才进行回调设置，防止Pause过程中直接调用了新设置进的回调
    this._EndCallback = this._NextEndCallback;
    this._NextEndCallback = null;

    const froms = (this._JumpTarget ? [...this._JumpTarget] : [...this._Current]);
    const tos = this._Target;
    const repeat_starts = (this._Repeat ? [...this._RepeatStart] : null);

    // const token = this._Token++;

    const anim = this._WrapBuildAnimation(repeat_starts, froms, tos, this._Jumping);

    // clear jump status
    this._JumpTarget = null;
    this._Jumping = false;

    if (anim === null) {
      return;
    }

    // 生成OnFinalProgress处理监听，memo在 _WrapBuildAnimation()处理后生成，因为build处理中可能改变tos
    const memo_tos = [...tos];
    const that = this;
    const listener = (new Forge.AnimationListener())
      .OnFinalProgress((progress) => {
        that._OnPaused((repeat_starts !== null ? repeat_starts : froms), memo_tos, progress);
      })
      .OnAdvance((progress) => {
        if (this._AdvanceCallback) {
          this._AdvanceCallback(progress);
        }
      });

    if (this._OnRepeatCallback) {
      listener.OnRepeat((times) => {
        if (that._OnRepeatCallback) {
          that._OnRepeatCallback(times);
        }
      });
    }

    anim.AddAnimationListener(listener);
    anim.Enable(Forge.AnimationEnable.KeepTransform);
    if (this._Repeat) {
      anim.EnableInfinite();
    }
    this._SpriteView.StartAnimation(anim);

    return true; // success
  }

  _StopAnimation() {
    this._SpriteView.StopAnimation();
  }

  _OnPaused(froms, tos, progress) {
    for (let i = 0; i < this._ParameterCount; i++) {
      this._Current[i] = Math.floor((tos[i] - froms[i]) * progress + froms[i]);
    }

    this._StateLocked = true;
    // 换出callbacks，回调时可能加入新的callbacks
    const paused_callback = this._PausedCallback;
    const ended_callback = this._EndCallback;
    this._PausedCallback = null;

    // 回调所有callback
    if (paused_callback) {
      // Paused callback
      this._CallbackWithCatch(this._Current, paused_callback);
    }
    if (ended_callback && progress === 1) {
      // Ended callback
      this._EndCallback = null;
      this._CallbackWithCatch(this._Current, ended_callback);
    }

    this._StateLocked = false;

    this._StateIndex = 0; // mark idle
    const that = this;
    that._StateMachineNext(); // Trigger next start
  }

  _SetView(jsv_view) {
    this._SpriteView = jsv_view;
  }
}
class DragTranslateControl extends JsvControl {
  constructor() {
    super(2); // targetX, targetY, accelerate, init velocity
    this._Mode = 0; // 0: 匀速控制模式, 1: 加减速控制模式
    this._Speed = 0; // pixel per second
    this._VerlocityAcc = 0; // 加速度值
    this._VerlocityInit = 0; // 初始速度
    this._AccAlongX = true; // true 延X轴加速， false 延Y轴加速
    this._AnimationRef = null;
    this._AllowFrameStep = false; // 是否可以使用FrameStep模式,该模式下为了保证动画的平滑性，动画总运行时间会超过设定时间
  }

  allowFrameStepMode(allow) {
    this._AllowFrameStep = allow;
    return this;
  }

  selectMode(mode) {
    switch (mode) {
      case "UniformMotion":
        this._Mode = 0;
        break;
      case "AcceleratedMotion":
        this._Mode = 1;
        this.setRepeat(false); // 加速模式不支持repeat
        break;
      default:
        console.error(`Unsupported input=${mode}`);
    }

    return this;
  }

  targetX(new_x) {
    // Take effect in next Start
    this._Target[0] = new_x;
    return this;
  }

  targetY(new_y) {
    // Take effect in next Start
    this._Target[1] = new_y;
    return this;
  }

  target(new_x, new_y) {
    // Take effect in next Start
    this._Target[0] = new_x;
    this._Target[1] = new_y;
    return this;
  }

  // start_x, start_y，必须要在当前位置到target的范围之外，范围之内目前不支持
  enableRepeatFrom(start_x, start_y, repeat_callback) {
    if (!this._ComfirmMode(0)) return;

    this.setRepeat(true, repeat_callback);
    this._RepeatStart[0] = start_x;
    this._RepeatStart[1] = start_y;
    return this;
  }

  speed(pixel_per_second) {
    console.log(`speed, pixel_per_second:${pixel_per_second}`);
    if (!this._ComfirmMode(0)) return;

    // Take effect in next Start
    this._Speed = pixel_per_second;
    return this;
  }

  // Start后，从当前位置到目标位置后动画结束
  accelerateX(acc_x, target_x) {
    if (!this._ComfirmMode(1)) return;

    this._Target[0] = target_x;
    this._VerlocityAcc = acc_x;
    this._VerlocityInit = 0;
    this._AccAlongX = true;
    return this;
  }

  accelerateY(acc_y, target_y) {
    if (!this._ComfirmMode(1)) return;

    this._Target[1] = target_y;
    this._VerlocityAcc = acc_y;
    this._VerlocityInit = 0;
    this._AccAlongX = false;
    return this;
  }

  decelerateX(acc_x, init_v_x) {
    if (!this._ComfirmMode(1)) return;

    this._VerlocityAcc = acc_x;
    this._VerlocityInit = init_v_x;
    this._AccAlongX = true;
    return this;
  }

  decelerateY(acc_y, init_v_y) {
    if (!this._ComfirmMode(1)) return;

    this._VerlocityAcc = acc_y;
    this._VerlocityInit = init_v_y;
    this._AccAlongX = false;
    return this;
  }

  // Start后，当减速到0时结束动画
  decelerate(acc_x, acc_y, init_v_x, init_v_y) {
    if (this._Mode !== 1) {
      console.error("Error: mode error");
      return;
    }

    this._VerlocityAcc[0] = acc_x;
    this._VerlocityAcc[1] = acc_y;
    this._VerlocityInit[0] = init_v_x;
    this._VerlocityInit[1] = init_v_y;
    return this;
  }

  _ComfirmMode(mode) {
    if (this._Mode !== mode) {
      console.error("Error: mode error");
      return false;
    }
    return true;
  }

  // Override
  _WrapBuildAnimation(repeat_start_array, current_array, tos_array, act_jump) {
    if (act_jump) {
      this._AnimationRef = this._UniformMove(null, current_array, tos_array, act_jump);
    } else {
      if (this._Mode === 0) {
        this._AnimationRef = this._UniformMove(repeat_start_array, current_array, tos_array, false);
      } else if (this._Mode === 1) {
        this._AnimationRef = this._AccelerMove(current_array, tos_array);
      }
    }
    return this._AnimationRef;
  }

  _UniformMove(repeat_start_array, current_array, tos_array, act_jump) {
    let from_x = 0;
    let from_y = 0;
    let start_pos = 0.0;
    let animate_time = 1;

    const current_x = current_array[0];
    const current_y = current_array[1];
    const to_x = tos_array[0];
    const to_y = tos_array[1];

    if (repeat_start_array !== null) {
      from_x = repeat_start_array[0];
      from_y = repeat_start_array[1];
      const distance = this._Distance(current_x, current_y, to_x, to_y);
      const distance_total = this._Distance(from_x, from_y, to_x, to_y);
      start_pos = (distance_total - distance) / distance_total;
      if (!act_jump) {
        animate_time = distance_total * 1000 / this._Speed;
      }
    } else {
      from_x = current_x;
      from_y = current_y;
      start_pos = 0.0;
      if (!act_jump) {
        animate_time = this._Distance(current_x, current_y, to_x, to_y) * 1000 / this._Speed;
      }
    }

    if (!act_jump && animate_time === 0) {
      console.warn("Discard starting request for no distance");
      // 但动画仍然会执行，为了能正常触发回调
    }

    let anim = null;
    if ((from_x === to_x || from_y === to_y) && !act_jump
            && this._AllowFrameStep && window.JsView) {
      // 单轴动画时，使用Frame animation来提升平滑性
      console.log("Using frame translate animation");
      let position_from = 0;
      let position_target = 0;
      let affect_x = true;
      if (from_x !== to_x) {
        // X轴方向上的移动
        position_from = from_x;
        position_target = to_x;
        affect_x = true;
      } else {
        // Y轴方向上的移动
        position_from = from_y;
        position_target = to_y;
        affect_x = false;
      }
      anim = new Forge.TranslateFrameAnimation(position_from, position_target, this._Speed, affect_x);
    } else {
      // 创建普通的平移动画
      anim = new Forge.TranslateAnimation(from_x, to_x, from_y, to_y, animate_time, null);
    }

    if (start_pos !== 0) {
      if (start_pos < 0) {
        console.warn("Warning: start position out of repeating range");
      } else {
        anim.SetStartPos(start_pos);
      }
    }
    return anim;
  }

  _AccelerMove(current_array, tos_array) {
    const current = (this._AccAlongX ? current_array[0] : current_array[1]);
    const init_v = this._VerlocityInit;
    const acc = this._VerlocityAcc;

    let target; let
      time;
    let is_acc_up = true;

    if (acc === 0) {
      console.error("Error: no found acceleration");
      return;
    }

    if (init_v === 0) {
      // 加速度运动，终点为target x，y
      target = (this._AccAlongX ? tos_array[0] : tos_array[1]);

      // d = 0.5 * acc * time^2 ==> time = sqrt(d * 2 / acc)
      time = Math.floor(Math.sqrt(Math.abs(target - current) * 2 / acc) * 1000);
      is_acc_up = true;
    } else {
      // 减速运动
      time = Math.floor(Math.abs(init_v) * 1000 / acc);
      target = current + Math.floor(0.0005 * init_v * time);
      is_acc_up = false;
    }

    if (time === 0) {
      // no move，但动画仍然会执行，为了能正常触发回调
      console.warn("no moved...");
    }

    // Update target memo
    let target_x; let
      target_y;
    if (this._AccAlongX) {
      target_x = target;
      this._Target[0] = target_x;
      target_y = this._Target[1];
    } else {
      target_x = this._Target[0];
      target_y = target;
      this._Target[1] = target_y;
    }

    return new Forge.TranslateAnimation(current_array[0], target_x, current_array[1], target_y, time,
      (is_acc_up ? Forge.Easing.Circular.In : Forge.Easing.Circular.Out));
  }

  _Distance(from_x, from_y, to_x, to_y) {
    const dx = to_x - from_x;
    const dy = to_y - from_y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Override
  _WrapCallback(currents, callback) {
    this._AnimationRef = null; // un-reference
    if (callback) {
      callback(currents[0], currents[1]);
    }
  }
}

Forge.DragTranslateControl = DragTranslateControl;
