import Forge from "../ForgeDefine";

Forge.ColorSpace = {
  RGBA_8888: "RGBA_8888",
  RGBA_4444: "RGBA_4444",
  RGBA_5551: "RGBA_5551",
  RGB_565: "RGB_565",

  // ETC1 format
  RGB_ETC1: "RGB_ETC1",
  RGBA_ETC1: "RGBA_ETC1",
};

Forge.QRCodeLevel = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2,
};
const CONST_CACHE_MAX_SIZE = 100;

class ImageTexture {
  /**
   * 用于LayoutView方格显示的Texture
   *
   * @public
   * @constructor Forge.ImageTexture
   * @param {Forge.TextureManager} texture_manager    Texture管理类
   * @param {Object} resource_info  RenderTexture的配置，创建自RenderTextureDelegateManager.CreateResourceInfo()
   * @param {String} status (文字Texture状态信息同步）
   * */
  constructor(texture_manager, resource_info, status) {
    this._Manager = texture_manager;
    if (status) {
      const status_texture = Forge.sRenderTextureDelegateManager.CreateTextureStatus();
      status_texture.SetResourceInfo(status);
    }
    this.RenderTexture = Forge.sRenderTextureDelegateManager.CreateTexture();
    this.RenderTexture.SetResourceInfo(resource_info);
    this._CallbackIdToken = 0;

    this._OnLoadCallback = [];

    // Trace memory
    if (Forge.ForgeDebug.EnableTextureTracer) {
      texture_manager._ImageTextureTracer.push(this);
      this._TracerDescript = "";
      // this._TracerStack = new Error().stack;
    }
  }

  // Texture loading status
  // before start to load: LoadTime = 0, Unloaded = false, InLoading = false
  // Be unloaded: LoadTime = 0, Unloaded = true, InLoading = false
  // In loading: LoadTime = 0, Unloaded = false, InLoading = true
  // Image loaded: LoadTime = Number, Unloaded = false, InLoading = false
  get Unloaded() {
    if (this.RenderTexture !== null) {
      return this.RenderTexture.Unloaded;
    }
    return true;
  }

  set Unloaded(val) {
    // Unloaded
  }

  get LoadTime() {
    if (this.RenderTexture !== null) {
      return this.RenderTexture.LoadTime;
    }
    return 0;
  }

  set LoadTime(val) {
    // load time
  }

  get Width() {
    if (this.RenderTexture !== null) {
      return this.RenderTexture.Width;
    }
    return 0;
  }

  set Width(val) {
    // width
  }

  get Height() {
    if (this.RenderTexture !== null) {
      return this.RenderTexture.Height;
    }
    return 0;
  }

  set Height(val) {
    // height
  }

  /**
   * 释放渲染端的Texture
   *
   * @public
   * @func UnloadTex
   * @memberof Forge.ImageTexture
   * @instance
   * */
  UnloadTex() {
    // Clear onload callbacks
    this._OnLoadCallback = [];
    if (this.RenderTexture !== null) {
      if (this._CallbackIdToken > 0) {
        this.RenderTexture.UnregisterOnloadCallback(this._CallbackIdToken);
        this._CallbackIdToken = 0;
      }
      this.RenderTexture.UndoRef();
      this.RenderTexture = null;
    }

    // Clear tracer descript
    this._TracerDescript = "";
  }

  /**
   * 注册加载完成后的回调（只被调用一次，或则当图片Unload时，所有回调会被清楚）<br>
   *     为了释放被回调函数引用的外部变量
   *
   * @public
   * @func RegisterLoadImageCallback
   * @memberof Forge.ImageTexture
   * @instance
   * @param {String} url                    预留，请设置为null
   * @param {Function} on_load_callback    回调函数
   * @param {Object} params                原封不动传递给回调函数的参数
   * */
  RegisterLoadImageCallback(url, on_load_callback, params) {
    if (this.IsLoaded() && on_load_callback !== null) {
      on_load_callback(params);
      return;
    }

    if (on_load_callback !== null) {
      this._OnLoadCallback.push({ callback: on_load_callback, params });
      if (this._CallbackIdToken === 0) {
        Forge.Assert(this.RenderTexture !== null);
        this._CallbackIdToken = this.RenderTexture.RegisterOnloadCallback(
          ImageTexture.prototype._InvokeOnLoadCallbacks.bind(this)
        );
      }
    }
  }

  _InvokeOnLoadCallbacks() {
    const callbacks = this._OnLoadCallback;
    this._OnLoadCallback = []; // Clear all callbacks before invoke
    for (let i = 0; i < callbacks.length; i++) {
      const callback_setting = callbacks[i];
      callback_setting.callback(callback_setting.params);
    }
    if (this.RenderTexture) {
      this.RenderTexture.UnregisterOnloadCallback(this._CallbackIdToken);
    }
  }

  /**
   * 判断图片是否加载进内存
   *
   * @public
   * @func IsLoaded
   * @memberof Forge.ImageTexture
   * @instance
   * @return {boolean} 图片是否加载进内存
   * */
  IsLoaded() {
    return this.LoadTime !== 0 && !this.Unloaded;
  }

  SetTextureTracerDescript(descript) {
    this._TracerDescript = descript;
  }

  ReallocRenderTexture() {
    // Should be override for some reload able texture
  }
}
Forge.ImageTexture = ImageTexture;

class UrlImageTexture extends Forge.ImageTexture {
  constructor(texture_manage, url, is_forever, size, color_space, net_setting) {
    const name = "IMG";
    const resource_info = Forge.sRenderTextureDelegateManager.CreateResourceInfo(
      texture_manage.GetId(),
      name
    );
    resource_info.Set = {
      URL: url,
      Siz: size,
      Clr: color_space || "",
      IsF: is_forever ? 1 : 0,
      NtS: net_setting,
      ILd: 0, // instant decode 0:false 1:true
    };
    super(texture_manage, resource_info);

    this.Name = name;
    // public
    this.Source = url;
    this.IsForever = is_forever ? 1 : 0;
    this.TargetSize = size;
    /* Forge.RectArea */
    this.ColorSpace = color_space || "";
    /* Forge.ColorSpace */
    this.NetSetting = net_setting || null;
    this._InstantLoad = 0; // 默认为0 //instant decode 0:false 1:true
    this._ImageElement = new Image();
    this._ImageElement.onload = function () {
      this._Loaded();
    }.bind(this);
    this._ImageElement.onerror = function () {
      this._Loaded();
    }.bind(this);

    this._ImageElement.src = url;
    this.RenderTexture.NeedCheckExpired = true;
  }

  _Loaded() {
    this.RenderTexture.Unloaded = false;
    this.RenderTexture.LoadTime = Date.now();
    this.RenderTexture.Width = this._ImageElement.width;
    this.RenderTexture.Height = this._ImageElement.height;
    this.RenderTexture.InvokeOnloadCallbacks();
  }

  /**
   * 是否开启当前帧Load图片
   *
   * @public
   * @func InstantLoad
   * @memberof Forge.UrlImageTexture
   * @instance
   * @param {bool} enable_flag 是否即时Load
   * */
  InstantLoad(enable_flag) {
    this._InstantLoad = enable_flag ? 1 : 0;
    if (this.RenderTexture) {
      const resource_info = this.RenderTexture.GetResourceInfo();
      if (resource_info !== null) {
        resource_info.Set.ILd = this._InstantLoad;
        this.RenderTexture.SetResourceInfo(resource_info);
      }
    }

    return this;
  }

  ReallocRenderTexture() {
    if (this.IsForever) {
      Forge.LogE("ReallocRenderTexture(): NOT need for forever texture");
      return;
    }

    // if (this.RenderTexture === null) {
    //  Forge.LogD("ReallocRenderTexture(): Render texture still alive");
    // }
    const url = this.Source;
    const target_size = this.TargetSize;
    /* Forge.RectArea */
    const color_space = this.ColorSpace;
    /* Forge.ColorSpace */

    const is_forever = this.IsForever;
    const resource_info = Forge.sRenderTextureDelegateManager.CreateResourceInfo(
      this._Manager.GetId(),
      this.Name
    );
    resource_info.Set = {
      URL: url,
      Siz: target_size,
      Clr: color_space,
      IsF: is_forever,
      ILd: this._InstantLoad, // instant decode 0:false 1:true
    };

    this.RenderTexture = Forge.sRenderTextureDelegateManager.CreateTexture();
    this.RenderTexture.SetResourceInfo(resource_info);
    this._Manager.CachedTextureManager.CacheTheTexture(this);
  }
}
Forge.UrlImageTexture = UrlImageTexture;

class TextStyleTexture extends Forge.ImageTexture {
  constructor(
    texture_manage,
    str,
    tsp,
    has_load_callback,
    rect_area,
    font_size,
    line_height,
    is_instant,
    latex_mode
  ) {
    const name = "TST";
    const resource_info = Forge.sRenderTextureDelegateManager.CreateResourceInfo(
      texture_manage.GetId(),
      name
    );

    resource_info["Set"] = {
      ST: str,
      IDS: tsp.GetIdsPack(),
      W: Math.floor(rect_area.width + 0.5),
      H: Math.floor(rect_area.height + 0.5),
      FS: font_size,
      LA: latex_mode,
      LH: Math.floor(line_height + 0.5),
      ILD: is_instant ? 1 : 0,
      TLC: has_load_callback ? 1 : 0,
    };

    super(texture_manage, resource_info);

    this.Name = name;
    this._TextStylePack = tsp;
    tsp.DoRef();
  }

  // Override
  UnloadTex() {
    this._TextStylePack.UnRef();
    super.UnloadTex();
  }
}
Forge.TextStyleTexture = TextStyleTexture;

class CachedTextureManager {
  constructor(texture_manager) {
    this._TextureManager = texture_manager;
    this._Renderer = texture_manager.GetRenderer();
    this._CachedTextureStack = [];
    this._LockedTextureStack = [];
    this._MemoryLimited = 10 * 1024 * 1024; // Limit to 10M
    this._VisibleMark = 1;
    // this._MemoryLimited = 2 * 1024 * 1024; // Limit to 1M for test
  }

  SetMemoryLimited(new_limit) {
    this._MemoryLimited = new_limit * 1024 * 1024;
  }

  _FindTexture(url, size, color_space) {
    const stack_length = this._CachedTextureStack.length;
    for (let i = stack_length - 1; i >= 0; i--) {
      const compare_texture = this._CachedTextureStack[i];
      if (
        compare_texture.Source === url &&
        (size === compare_texture.TargetSize ||
          (size !== null && size.Equals(compare_texture.TargetSize))) &&
        color_space === compare_texture.ColorSpace
      ) {
        if (compare_texture.RenderTexture === null) {
          continue;
        }
        return compare_texture;
      }
    }

    return null;
  }

  CacheTheTexture(texture_to_cache) {
    const stack_length = this._CachedTextureStack.length;
    for (let i = stack_length - 1; i >= 0; i--) {
      if (texture_to_cache === this._CachedTextureStack[i]) return;
    }
    this._CachedTextureStack.push(texture_to_cache);
  }

  _MarkVisibleViewTextures(check_view, new_mark) {
    if (check_view.TextureSetting && check_view.TextureSetting.Texture) {
      check_view.TextureSetting.Texture.VisibleMark = new_mark;
    }

    const child_view_length = check_view.ChildViews.length;
    for (let i = 0; i < child_view_length; i++) {
      const child_view = check_view.ChildViews[i];
      if (child_view && child_view.Visibility !== "VISIBLE") {
        continue;
      }
      this._MarkVisibleViewTextures(child_view, new_mark);
    }
  }

  ReduceInvisibleTexture(main_view) {
    this._MarkVisibleViewTextures(main_view, ++this._VisibleMark);
    for (let i = 0; i < this._CachedTextureStack.length; i++) {
      const texture = this._CachedTextureStack[i];
      if (texture.VisibleMark === this._VisibleMark) {
        continue;
      }
      texture.UnloadTex();
      // Remove from stack
      this._CachedTextureStack.splice(i, 1);
      i--; // reset looper
    }
  }

  GetCacheSize() {
    return this._CachedTextureStack.length;
  }
}
Forge.CachedTextureManager = CachedTextureManager;

const TEXT_FONT_STYLE_CACHE = new Map();
let TEXT_FONT_STYLE_TOKEN = 0;
const TEXT_DISPLAY_STYLE_CACHE = new Map();
let TEXT_DISPLAY_STYLE_TOKEN = 0;
class TextureManager {
  constructor() {
    this.CachedTextureManager = new Forge.CachedTextureManager(this);
    this._ForeverCachedTextureManager = new Forge.CachedTextureManager(this);

    this._AtlasDataInfo = {
      atlas_data: [],
      buffer_data_offset: 0,
      textures: [],
    };

    // Cached image stack cleaner
    this._ClearTimer = -1;

    this._ImageTextureTracer = [];

    // TextureManager Id
    this._Id = TextureManager.sTextureManagerToken++;

    this._CacheMaxSize = CONST_CACHE_MAX_SIZE;

    this.StartScavengerCachedTimer();
  }

  StartScavengerCachedTimer() {
    if (this._ClearTimer === -1) {
      this._ClearTimer = Forge.ForegroundTimer.setInterval(
        this.ScavengerCached.bind(this),
        30000
      );
    }
  }

  GetId() {
    return this._Id;
  }

  GetRenderer() {
    return Forge.sDeprecatedRenderer;
  }

  GetGifImage(url, is_forever, net_setting) {
    return this.GetImage(url, is_forever, net_setting);
  }

  GetImage(url, is_forever, net_setting) {
    // return this.GetImage2(url, is_forever, new Forge.RectArea(0, 0, 150, 150));
    if (!url) {
      Forge.LogI("GetImage, url is null!");
      return null;
    }
    const texture_new = this._GetImageInternal(
      url,
      null,
      Forge.ColorSpace.RGBA_8888,
      is_forever,
      false,
      net_setting
    );
    return texture_new;
  }

  GetImage2(url, is_forever, target_size, color_space, net_setting) {
    if (!url) {
      Forge.LogI("GetImage2, url is null!");
      return null;
    }
    const formated_target_size = Forge.sRectUitls.FormatRectArea(target_size);
    if (typeof color_space !== "string") {
      if (url.indexOf(".pkm") >= 0) {
        if (url.indexOf(".pkma") >= 0) {
          color_space = Forge.ColorSpace.RGBA_ETC1;
        } else {
          color_space = Forge.ColorSpace.RGB_ETC1;
        }
      } else {
        color_space = Forge.ColorSpace.RGB_565;
      }
    }
    const texture_new = this._GetImageInternal(
      url,
      formated_target_size,
      color_space,
      is_forever,
      false,
      net_setting
    );
    return texture_new;
  }

  _GetImageInternal(
    url,
    target_size,
    color_space,
    is_forever,
    is_gif,
    net_setting
  ) {
    // 先尝试从Cache中拿取ImageTexture
    if (!is_forever) {
      const texture = this.CachedTextureManager._FindTexture(
        url,
        target_size,
        color_space
      );
      if (texture) {
        return texture;
      }
    } else {
      const texture = this._ForeverCachedTextureManager._FindTexture(
        url,
        target_size,
        color_space
      );
      if (texture) {
        return texture;
      }
    }
    const texture_new = new Forge.UrlImageTexture(
      this,
      url,
      is_forever,
      target_size,
      color_space,
      net_setting
    );

    // 加入到Cache中
    if (!texture_new.IsForever) {
      this.CachedTextureManager.CacheTheTexture(texture_new);
    } else {
      this._ForeverCachedTextureManager.CacheTheTexture(texture_new);
    }

    return texture_new;
  }

  GetRoundCornerMask(rect_area, rad) {
    return this.GetCustomCornerMask(rect_area, rad, rad, rad, rad);
  }

  GetCustomCornerMask(
    rect_area,
    rad_left_top,
    rad_right_top,
    rad_left_bottom,
    rad_right_bottom
  ) {
    const formatted_rect_area = Forge.sRectUitls.FormatRectArea(rect_area);
    const max_rad = Math.max(
      rad_left_top,
      rad_right_top,
      rad_left_bottom,
      rad_right_bottom
    );
    if (
      max_rad > formatted_rect_area.width / 2 ||
      max_rad > formatted_rect_area.height / 2
    ) {
      Forge.LogE(
        `TextureManager.GetRoundCornerMask(): radius is too large, radius=${max_rad} w=${formatted_rect_area.width} h=${formatted_rect_area.height}`
      );
      return null;
    }
    const resource_info = Forge.sRenderTextureDelegateManager.CreateResourceInfo(
      this._Id,
      "CCM"
    );
    resource_info.Set = {
      W: formatted_rect_area.width,
      H: formatted_rect_area.height,
      LT: rad_left_top,
      RT: rad_right_top,
      LB: rad_left_bottom,
      RB: rad_right_bottom,
    };
    const image_texture = new Forge.ImageTexture(this, resource_info);

    if (Forge.ForgeDebug.EnableTextureTracer) {
      image_texture.SetTextureTracerDescript("CornerMask");
    }

    return image_texture;
  }

  GetOneCornerMask(rad) {
    const resource_info = Forge.sRenderTextureDelegateManager.CreateResourceInfo(
      this._Id,
      "OCM"
    );
    resource_info.Set = {
      Rad: rad,
    };
    const image_texture = new Forge.ImageTexture(this, resource_info);

    if (Forge.ForgeDebug.EnableTextureTracer) {
      image_texture.SetTextureTracerDescript("OneCornerMask");
    }

    return image_texture;
  }

  /**
   * 通过TextStylePack设定创建TextTexture
   *
   * @public
   * @func BuildTextView
   * @memberof Forge.TextureManager
   * @param {String} str                 文件内容
   * @param {Forge.TextStylePack} tsp    文字配置信息
   * @param {boolean} has_load_callback   是否有加载回调函数
   * @param {Object} rect_area         文字描画区域，有宽高即可{width:xxxx, height:xxxx}, 当height为0表示按照文字长度处理高
   * @param {int} font_size               字号
   * @param {int} line_height             文字行高
   * @param {int} is_instant 是否立即加载
   * @param {boolean} latex_mode 多格式混排模式
   * @return {Forge.TextStyleTexture} 文字Texture
   */
  GetTextTextureFromStylePack(
    str,
    tsp,
    has_load_callback,
    rect_area,
    font_size,
    line_height,
    is_instant,
    latex_mode
  ) {
    if (!str || str.length === 0) {
      return null;
    }

    return new Forge.TextStyleTexture(
      this,
      str,
      tsp,
      has_load_callback,
      rect_area,
      font_size,
      line_height,
      is_instant,
      latex_mode
    );
  }

  _getParamsId(string_with_font, attr, shader) {
    const font = string_with_font.font;
    const size = string_with_font.size;
    const italic = string_with_font.italic;
    const bold = string_with_font.bold;
    const alignment = string_with_font.alignment;
    const vertical_align = string_with_font.vertical_align;
    const vertical_area_align = string_with_font.vertical_area_align;
    const text_color = string_with_font.textColour;
    const bg_color = string_with_font.backgroundColour;
    // let enable_blend = string_with_font.enableBlend;
    const shadow = string_with_font.shadow;
    let stroke_width = "";
    if (string_with_font.stroke_width) {
      stroke_width = string_with_font.stroke_width;
    }
    const text_overflow = attr.text_overflow;
    const word_wrap = attr.word_wrap;

    const fs_key = [font, italic, bold, shadow, stroke_width].join(":");
    const ds_key = [
      size,
      alignment,
      vertical_align,
      vertical_area_align,
      text_overflow,
      word_wrap,
    ].join(":");
    let fs_id = "";
    let ds_id = "";
    if (!TEXT_FONT_STYLE_CACHE.has(fs_key)) {
      fs_id = `TS${TEXT_FONT_STYLE_TOKEN}`;
      TEXT_FONT_STYLE_CACHE.set(fs_key, fs_id);
      TEXT_FONT_STYLE_TOKEN++;
    } else {
      fs_id = TEXT_FONT_STYLE_CACHE.get(fs_key);
    }

    if (!TEXT_DISPLAY_STYLE_CACHE.has(ds_key)) {
      ds_id = `DS${TEXT_DISPLAY_STYLE_TOKEN}`;
      TEXT_DISPLAY_STYLE_CACHE.set(ds_key, ds_id);
      TEXT_DISPLAY_STYLE_TOKEN++;
    } else {
      ds_id = TEXT_DISPLAY_STYLE_CACHE.get(ds_key);
    }
    return [fs_id, ds_id, text_color, bg_color];
  }

  GetTextTextureByMultiRows(
    t_StringWithFont,
    t_TextAttr,
    t_RectArea,
    line_height,
    need_quick,
    shader,
    is_instant,
    latex_mode,
    duplicate_info_bag
  ) {
    const text = t_StringWithFont.str;
    if (text === null || text.length === 0) {
      return null;
    }

    // 清晰度调整
    const screen_info = Forge.sRenderBridge.GetScreenInfo();
    const display_scale_ratio = screen_info.scaleRatio;
    const rect_area = Object.assign(t_RectArea);

    rect_area.x *= display_scale_ratio;
    rect_area.y *= display_scale_ratio;
    rect_area.width *= display_scale_ratio;
    rect_area.height *= display_scale_ratio;
    const string_with_font = Object.assign(t_StringWithFont);
    string_with_font.size = Math.ceil(
      string_with_font.size * display_scale_ratio
    );
    line_height *= display_scale_ratio;

    // Create TextTexture Setting Info
    const texture_set = {
      ST: t_StringWithFont.str,
      AT: JSON.stringify({
        // 【重要】
        // 顺序不能调整，native按顺序而非key-value读取
        // 字段追加只能放在末尾
        TO: t_TextAttr.text_overflow,
        WW: t_TextAttr.word_wrap,
      }),
      RA: JSON.stringify({
        X: parseInt(rect_area.x + 0.5, 10),
        Y: parseInt(rect_area.y + 0.5, 10),
        W: parseInt(rect_area.width + 0.5, 10),
        H: parseInt(rect_area.height + 0.5, 10),
      }),
      LA: latex_mode,
      LH: parseInt(line_height + 0.5, 10),
      ILD: typeof is_instant !== "undefined" ? is_instant : 1,
    };

    // 若有shader，则传输
    if (shader) {
      texture_set.SH = JSON.stringify({
        T: shader.Type, // type
        P: shader.Params, // params
      });
    }
    if (
      typeof window.JsView !== "undefined" &&
      typeof window.JsView.ForgeNativeRevision !== "undefined" &&
      window.JsView.ForgeNativeRevision > 0
    ) {
      const ids = this._getParamsId(string_with_font, t_TextAttr, shader);
      texture_set.PI = {
        FS: ids[0],
        DS: ids[1],
        TC: ids[2],
        BC: ids[3],
      };
    }

    // 创建TextTexture
    const texture = this._BuildTextTextureAndSerialStatus(
      texture_set,
      string_with_font
    );

    // 填充Duplicate信息
    if (duplicate_info_bag !== null) {
      const dup_texture_set = Object.assign({}, texture_set);

      // 重置Style以外的配置
      dup_texture_set.ST = null;
      dup_texture_set.TLC = 0;

      // 进行记录
      duplicate_info_bag.Set = dup_texture_set;
      duplicate_info_bag.Swf = Object.assign({}, string_with_font);
    }

    let real_height = rect_area.height;
    if (typeof window.PlatformUtils !== "undefined" && need_quick === false) {
      const real_rect = window.PlatformUtils.GetTextRect(
        text,
        rect_area,
        string_with_font,
        t_TextAttr,
        line_height
      );
      real_height = real_rect.height;
    }

    real_height = Math.floor(real_height / display_scale_ratio + 0.5);

    if (Forge.ForgeDebug.EnableTextureTracer) {
      let descript = t_StringWithFont.str;
      if (descript.length > 8) {
        descript = `${t_StringWithFont.str.substr(0, 8)}...`;
      }
      texture.SetTextureTracerDescript(`[${descript}]`);
    }

    return {
      texture, // export member
      real_height, // export member
    };
  }

  /**
   * 快速重建属性相同的的TextTexture
   * hide public
   *
   * @protected
   * @func GetCopiedTextTexture
   * @memberof Forge.TextureManager
   * @instance
   * @param {String} text 描画的文字信息
   * @param {Object} duplicate_info_bag 含有{Set, Swf(StringWithFont设定)}
   * @param {bool} if_texture_onload_callback 是否texture加载回调
   * @return {Forge.TextTexture} 创建完成的文字Texture
   * */
  GetCopiedTextTexture(
    text,
    text_area,
    duplicate_info_bag,
    if_texture_onload_callback
  ) {
    // 取出TextureSetting和StringWithFont信息
    const texture_set = Object.assign({}, duplicate_info_bag.Set);
    texture_set.ST = text;
    texture_set.TLC =
      typeof if_texture_onload_callback !== "undefined" &&
      if_texture_onload_callback
        ? 1
        : 0;
    const string_with_font = duplicate_info_bag.Swf;

    // 重新配置Size
    const display_scale_ratio = Forge.sRenderBridge.GetScreenInfo().scaleRatio;
    texture_set.RA = JSON.stringify({
      X: parseInt(text_area.x * display_scale_ratio + 0.5, 10),
      Y: parseInt(text_area.y * display_scale_ratio + 0.5, 10),
      W: parseInt(text_area.width * display_scale_ratio + 0.5, 10),
      H: parseInt(text_area.height * display_scale_ratio + 0.5, 10),
    });

    // 创建TextTexture
    const texture = this._BuildTextTextureAndSerialStatus(
      texture_set,
      string_with_font
    );

    if (Forge.ForgeDebug.EnableTextureTracer && text) {
      let descript = text;
      if (descript.length > 8) {
        descript = `${text.substr(0, 8)}...`;
      }
      texture.SetTextureTracerDescript(`[${descript}]`);
    }

    return texture;
  }

  // 创建文字的Texture，文字信息传输时，共通的信息会通过串行化的同步发送的Status传递
  _BuildTextTextureAndSerialStatus(texture_set, string_with_font) {
    Forge.sRenderTextureDelegateManager.AppendFontStatusIfNeed(
      texture_set,
      string_with_font
    );
    let status = null;

    if (texture_set.FO) {
      // 状态变化后，串行化Status信息
      status = {
        STA: {
          Nam: "T",
          Sta: texture_set.FO,
        },
      };
    }
    const resource_info = Forge.sRenderTextureDelegateManager.CreateResourceInfo(
      this._Id,
      "T"
    );
    resource_info.Set = texture_set;

    return new Forge.ImageTexture(this, resource_info, status);
  }

  GetColorTexture(fill_style) {
    const resource_info = Forge.sRenderTextureDelegateManager.CreateResourceInfo(
      this._Id,
      "CT"
    );
    resource_info.Set = {
      Clr: fill_style,
    };
    const image_texture = new Forge.ImageTexture(this, resource_info);

    if (Forge.ForgeDebug.EnableTextureTracer) {
      image_texture.SetTextureTracerDescript(`Color[${fill_style}]`);
    }

    return image_texture;
  }

  ScavengerCached() {
    const cache_size = this.CachedTextureManager.GetCacheSize();
    if (cache_size >= this._CacheMaxSize) {
      this.CachedTextureManager.ReduceInvisibleTexture(Forge.sRootView);
    }
  }

  GetOffScreenMediaTexture(video_player_hdl) {
    if (
      typeof window.OffscreenVideoPlayer === "undefined" ||
      !(video_player_hdl instanceof window.OffscreenVideoPlayer)
    ) {
      // 未运行在JsView中
      return null;
    }

    if (!video_player_hdl.hasTerminator()) {
      const main_texture = this._BuildVideoTexture(video_player_hdl);

      // 当播放器释放时，清理Texture资源
      video_player_hdl.setResourceTerminator(() => {
        main_texture.UnloadTex();
      });
    }

    return this._BuildVideoTexture(video_player_hdl);
  }

  _BuildVideoTexture(video_player_hdl) {
    const resource_info = Forge.sRenderTextureDelegateManager.CreateResourceInfo(
      this._Id,
      "VPLY"
    );
    resource_info.Set = {
      Hdl: video_player_hdl.mediaHandler(),
    };

    const image_texture = new Forge.ImageTexture(this, resource_info);
    if (Forge.ForgeDebug.EnableTextureTracer) {
      image_texture.SetTextureTracerDescript(
        `Video[${video_player_hdl.mediaHandler()}]`
      );
    }

    return image_texture;
  }
}
TextureManager.sTextureManagerToken = 100;
Forge.TextureManager = TextureManager;
window.TextureManager = Forge.TextureManager; // export class
export { TextureManager };
