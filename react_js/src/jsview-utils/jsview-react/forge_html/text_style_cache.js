/**
 * Created by ludl on 12/10/20.
 */

import Forge from "../ForgeDefine";

{
  let sTextStyleIdGen = 0;

  class TextStyleObjectBase {
    constructor(type, fix_named_id) {
      this._ID = fix_named_id ? fix_named_id : type + sTextStyleIdGen++;
      this.Describe = {};
      this._RefCount = 0;
      this._Recycled = false; // 预留属性, 未来由于ref == 0，而从列表中移除后，设置标识位
    }

    ManualSetId(fix_named_id) {
      this._ID = fix_named_id;
    }

    GetId() {
      return this._ID;
    }

    // StylePack的Ref管理，通过TextStyleTexture的自动释放触发
    // 理论上从屏幕拿掉后的TextStyleTexture都会自动释放，在UnloadTex中触发UnRef
    DoRef() {
      this._RefCount++;
    }

    UnRef() {
      if (this._RefCount > 0) {
        this._RefCount--;
      } else {
        console.warn("Already 0...");
      }
    }
  }

  class FixNameStyle extends TextStyleObjectBase {
    constructor(fix_named_id) {
      super(null, fix_named_id);
    }
  }

  // 代表不激活的style，例如ShadowStyle场景
  const sDisableStyle = new FixNameStyle("DISABLE");

  const sDefaultDisplayStyle = {
    alignment: "left",
    vertical_align: "top",
    vertical_area_align: "top",
    text_overflow: "clip",
    word_wrap: "normal",
  };
  // 注意:NamesList的顺序需要和constructor的参数顺序相同
  const sDisplayStyleNames = [
    "alignment",
    "vertical_align",
    "vertical_area_align",
    "text_overflow",
    "word_wrap",
  ];
  class DisplayStyle extends TextStyleObjectBase {
    constructor(
      alignment,
      vertical_align,
      vertical_area_align,
      text_overflow,
      word_wrap
    ) {
      super("DS", null);

      // 具体化Describe信息
      this.Describe["alignment"] = alignment;
      this.Describe["vertical_align"] = vertical_align;
      this.Describe["vertical_area_align"] = vertical_area_align;
      this.Describe["text_overflow"] = text_overflow;
      this.Describe["word_wrap"] = word_wrap;
    }

    GetSyncData() {
      return {
        T: 0, // type
        ID: this._ID,
        A: this.Describe["alignment"],
        VA: this.Describe["vertical_align"],
        VAA: this.Describe["vertical_area_align"],
        TO: this.Describe["text_overflow"],
        WW: this.Describe["word_wrap"],
      };
    }
  }

  const sDefaultFontStyle = {
    font: "黑体",
    italic: false,
    bold: false,
  };
  // 注意:NamesList的顺序需要和constructor的参数顺序相同
  const sFontStyleNames = ["font", "italic", "bold"];
  class FontStyle extends TextStyleObjectBase {
    constructor(font, italic, bold) {
      super("FS", null);

      // 具体化Describe信息
      this.Describe["font"] = font;
      this.Describe["italic"] = italic;
      this.Describe["bold"] = bold;
    }

    GetSyncData() {
      return {
        T: 1, // type
        ID: this._ID,
        F: this.Describe["font"],
        I: this.Describe["italic"],
        B: this.Describe["bold"],
      };
    }
  }

  const sDefaultColorStyle = {
    text_color: "#000000", // 默认黑字
    bg_color: "#00FFFFFF", // 默认白色透明背景
  };
  // 注意:NamesList的顺序需要和constructor的参数顺序相同
  const sColorStyleNames = ["text_color", "bg_color"];
  class ColorStyle extends TextStyleObjectBase {
    constructor(text_color, bg_color) {
      super("CS", null);

      this.Describe["text_color"] = text_color;
      this.Describe["bg_color"] = bg_color;
    }

    GetSyncData() {
      return {
        T: 2, // type
        ID: this._ID,
        TC: this.Describe["text_color"],
        BC: this.Describe["bg_color"],
      };
    }
  }

  const sDefaultShadowStyle = {
    shadow_offset_x: 0,
    shadow_offset_y: 0,
    shadow_blur: 1,
    shadow_color: "rgba(0,0,0,1)",
  };
  // 注意:NamesList的顺序需要和constructor的参数顺序相同
  const sShadowStyleNames = [
    "shadow_offset_x",
    "shadow_offset_y",
    "shadow_blur",
    "shadow_color",
  ];
  class ShadowStyle extends TextStyleObjectBase {
    constructor(shadow_offset_x, shadow_offset_y, shadow_blur, shadow_color) {
      super("SS", null);

      this.Describe["shadow_offset_x"] = shadow_offset_x;
      this.Describe["shadow_offset_y"] = shadow_offset_y;
      this.Describe["shadow_blur"] = shadow_blur;
      this.Describe["shadow_color"] = shadow_color;
    }

    GetSyncData() {
      return {
        T: 3, // type
        ID: this._ID,
        OX: this.Describe["shadow_offset_x"],
        OY: this.Describe["shadow_offset_y"],
        B: this.Describe["shadow_blur"],
        C: this.Describe["shadow_color"],
      };
    }
  }

  class TextStylePack {
    constructor(style_define) {
      this.DS = Forge.sTextStyleCache.GetDisplayStyle(style_define);
      this.FS = Forge.sTextStyleCache.GetFontStyle(style_define);
      this.CS = Forge.sTextStyleCache.GetColorStyle(style_define);
      this.SS = Forge.sTextStyleCache.GetShadowStyle(style_define);
      this._IdsCache = null;
    }

    DoRef() {
      this.DS.DoRef();
      this.FS.DoRef();
      this.CS.DoRef();
      this.SS.DoRef();
    }

    UnRef() {
      this.DS.UnRef();
      this.FS.UnRef();
      this.CS.UnRef();
      this.SS.UnRef();
    }

    GetIdsPack() {
      if (!this._IdsCache) {
        this._IdsCache = {
          DS: this.DS.GetId(),
          FS: this.FS.GetId(),
          CS: this.CS.GetId(),
          SS: this.SS.GetId(),
        };
      }

      return this._IdsCache;
    }
  }

  class TextStyleCache {
    constructor() {
      // Map, 分为Map(key为属性连接), Ids(key为TextStyleObjectBase的ID)，编译快速检索
      this._DisplayStyleMap = new Map();
      this._DisplayStyleIds = new Map();
      this._FontStyleMap = new Map();
      this._FontStyleIds = new Map();
      this._ColorStyleMap = new Map();
      this._ColorStyleIds = new Map();
      this._ShadowStyleMap = new Map();
      this._ShadowStyleIds = new Map();

      // 供native同步时的新 TextStyleObjectBase 队列
      this._NewStyleList = [];
    }

    StyleToPack(style_define_origin) {
      // 创建TextStylePack

      // 成员变量属性名称转换和对应
      let style_define = {
        alignment:
          typeof style_define_origin["hAlign"] != "undefined"
            ? style_define_origin["hAlign"]
            : sDefaultDisplayStyle.alignment,
        vertical_align:
          typeof style_define_origin["vAlign"] != "undefined"
            ? style_define_origin["vAlign"]
            : sDefaultDisplayStyle.vertical_align,
        vertical_area_align:
          typeof style_define_origin["vAreaAlign"] != "undefined"
            ? style_define_origin["vAreaAlign"]
            : sDefaultDisplayStyle.vertical_area_align,
        text_overflow:
          typeof style_define_origin["textOverflow"] != "undefined"
            ? style_define_origin["textOverflow"]
            : sDefaultDisplayStyle.text_overflow,
        word_wrap:
          typeof style_define_origin["wordWrap"] != "undefined"
            ? style_define_origin["wordWrap"]
            : sDefaultDisplayStyle.word_wrap,
        font:
          typeof style_define_origin["font"] != "undefined"
            ? style_define_origin["font"]
            : sDefaultFontStyle.font,
        italic:
          typeof style_define_origin["italic"] != "undefined"
            ? style_define_origin["italic"]
            : sDefaultFontStyle.italic,
        bold:
          typeof style_define_origin["bold"] != "undefined"
            ? style_define_origin["bold"]
            : sDefaultFontStyle.bold,
        text_color:
          typeof style_define_origin["textColor"] != "undefined"
            ? style_define_origin["textColor"]
            : sDefaultColorStyle.text_color,
        bg_color:
          typeof style_define_origin["backgroundColor"] != "undefined"
            ? style_define_origin["backgroundColor"]
            : sDefaultColorStyle.bg_color,
        shadow_enable: false,
        shadow_offset_x: 0,
        shadow_offset_y: 0,
        shadow_blur: 1,
        shadow_color: null,
      };

      // Shadow处理
      if (typeof style_define_origin.shadow !== "undefined") {
        const shadow_set = style_define_origin.shadow;
        style_define.shadow_enable = true;
        style_define.shadow_offset_x = shadow_set.shadowOffsetX;
        style_define.shadow_offset_y = shadow_set.shadowOffsetY;
        style_define.shadow_blur = shadow_set.shadowBlur;
        style_define.shadow_color = shadow_set.shadowColor;
      }

      return new TextStylePack(style_define);
    }

    GetDisplayStyle(style_define) {
      return this._GetStyle(
        style_define,
        sDisplayStyleNames,
        DisplayStyle,
        this._DisplayStyleMap,
        this._DisplayStyleIds
      );
    }

    GetFontStyle(style_define) {
      return this._GetStyle(
        style_define,
        sFontStyleNames,
        FontStyle,
        this._FontStyleMap,
        this._FontStyleIds
      );
    }

    GetColorStyle(style_define) {
      return this._GetStyle(
        style_define,
        sColorStyleNames,
        ColorStyle,
        this._ColorStyleMap,
        this._ColorStyleIds
      );
    }

    GetShadowStyle(style_define) {
      if (!style_define.shadow_enable) {
        return sDisableStyle;
      }

      return this._GetStyle(
        style_define,
        sShadowStyleNames,
        sDefaultShadowStyle,
        ShadowStyle,
        this._ShadowStyleMap,
        this._ShadowStyleIds
      );
    }

    // interface for forge_html
    GetDsFromId(id) {
      return this._DisplayStyleIds.get(id);
    }

    GetFsFromId(id) {
      return this._FontStyleIds.get(id);
    }

    GetCsFromId(id) {
      return this._ColorStyleIds.get(id);
    }

    GetSsFromId(id) {
      return this._ShadowStyleIds.get(id);
    }

    _GetStyle(style_define, prop_name_list, class_define, map_ref, ids_ref) {
      const props_values = [];
      for (const name of prop_name_list) {
        props_values.push(style_define[name]);
      }

      // 制作style key
      const map_key = props_values.join(":");

      // 查找Map，获取或新建
      let style_object = null;
      if (!map_ref.has(map_key)) {
        style_object = new class_define(...props_values);

        // 填充Map, 两个维度的Map，以提高检索速度
        map_ref.set(map_key, style_object);
        ids_ref.set(style_object.GetId(), style_object);

        // 加入预备同步native的队列中
        // this._NewStyleList.push(style_object); // forge html中不需要进行同步
      } else {
        style_object = map_ref.get(map_key);
      }

      return style_object;
    }
  }

  // export
  Forge.TextStyleObjectBase = TextStyleObjectBase;
  Forge.TextStylePack = TextStylePack;
  Forge.sTextStyleCache = new TextStyleCache(); // 一个NativeForge内部只有一个共享的map，所以此处也为单例
}
