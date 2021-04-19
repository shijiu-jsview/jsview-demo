import Forge from "../ForgeDefine";

// 当TextView需要父View时，搭建一个中转类，将针对TextView的设置转发到TextView中
class TextParentViewProxy extends Forge.LayoutView {
  constructor() {
    super();
    this._ChildTextView = null;
  }

  PutChildTextView(child_view) {
    this._ChildTextView = child_view; // 记录TextView
    this.AddView(child_view);
  }

  // 代理EnableAutoHeight
  EnableAutoHeight() {
    this._ChildTextView.EnableAutoHeight();
  }
}

class TextUtils {
  StringWithFont(
    _str,
    _size,
    _font,
    _alignment,
    _vertical_align,
    _text_color,
    _italic,
    _bold,
    _shadow,
    _stroke_width,
    _vertical_area_align
  ) {
    if (!_size) _size = TextUtils._sDefaultFontSize;
    if (!_font) _font = TextUtils._sDefaultFont;

    let italic = "";
    if (_italic === true) {
      italic = "italic";
    }
    let bold = "";
    if (_bold === true) {
      bold = "bold";
    }
    if (!_alignment) _alignment = "left";
    if (!_vertical_align) _vertical_align = "middle";
    if (!_text_color) _text_color = TextUtils._sDefaultFontColor;
    if (!_shadow) _shadow = null;
    if (!_vertical_area_align) _vertical_area_align = "top";
    // LogM("_str=" + _str + " _size=" + _size + " _font=" + _font + " text_color=" + _text_color);
    if (!_stroke_width) _stroke_width = -1;
    return {
      str: `${_str}`, // export member
      font: _font, // export member
      size: _size, // export member
      italic,
      bold,
      stroke_width: _stroke_width,
      alignment: _alignment,
      vertical_align: _vertical_align,
      textColour: _text_color,
      backgroundColour: TextUtils._sDefaultBackgroundColor,
      enableBlend: true,
      shadow: _shadow,
      vertical_area_align: _vertical_area_align,
    };
  }

  TextAttr(_text_overflow, _word_wrap) {
    if (!_text_overflow) _text_overflow = "none";
    if (!_word_wrap) _word_wrap = "none";

    return { text_overflow: _text_overflow, word_wrap: _word_wrap };
  }

  GetTextWidth(t_StringWithFont) {
    if (typeof window.PlatformUtils !== "undefined") {
      return window.PlatformUtils.GetTextWidth(t_StringWithFont);
    }
    return t_StringWithFont.str.length * t_StringWithFont.size + 1; // TODO: 矫正成和平台相关的同步函数
  }

  GetTextRect(str, max_rect, font_params, text_attr, line_height) {
    if (typeof window.PlatformUtils !== "undefined") {
      return window.PlatformUtils.GetTextRect(
        str,
        max_rect,
        font_params,
        text_attr,
        line_height
      );
    }
    return { width: max_rect.width, height: max_rect.height };
  }

  GetTextInfo(str, max_rect, font_params, text_attr, line_height) {
    if (typeof window.PlatformUtils !== "undefined") {
      return window.PlatformUtils.GetTextInfo(
        str,
        max_rect,
        font_params,
        text_attr,
        line_height
      );
    }
    return {
      start: 0,
      end: str.length,
      width: max_rect.width,
      height: max_rect.height,
    };
  }

  GetCursorOffset(
    str,
    max_rect,
    font_params,
    text_attr,
    line_height,
    pos_x,
    pos_y
  ) {
    if (typeof window.PlatformUtils !== "undefined") {
      return window.PlatformUtils.GetCursorOffset(
        str,
        max_rect,
        font_params,
        text_attr,
        line_height,
        pos_x,
        pos_y
      );
    }
    return 0;
  }

  GetCursorPosition(
    str,
    max_rect,
    font_params,
    text_attr,
    line_height,
    cursor_offset
  ) {
    if (typeof window.PlatformUtils !== "undefined") {
      return window.PlatformUtils.GetCursorPosition(
        str,
        max_rect,
        font_params,
        text_attr,
        line_height,
        cursor_offset
      );
    }
    return { x: 0, y: 0 };
  }

  /**
   * 通过TextStylePack设定创建TextView
   *
   * @public
   * @func BuildTextView
   * @memberof Forge.TextUtils
   * @param {Forge.TextureManager} manager  纹理管理器
   * @param {String} str                 文件内容
   * @param {Forge.TextStylePack} tsp    文字配置信息
   * @param {Function} load_callback     文字加载完成后的回调
   * @param {Object} area	                文字描画区域，有宽高即可{width:xxxx, height:xxxx}, 当height为0表示按照文字长度处理高
   * @param {int} font_size               字号
   * @param {int} line_height             文字行高
   * @param {boolean} is_instant 是否立即加载(0/1)
   * @param {boolean} latex_mode 多格式混排模式
   * @return {Forge.LayoutView} 文字View
   */
  BuildTextView(
    manager,
    str,
    tsp,
    load_callback,
    area,
    font_size,
    line_height,
    is_instant,
    latex_mode
  ) {
    // 规范化数值内容，以免崩溃
    area.width = isNaN(area.width) ? 0 : area.width;
    area.height = isNaN(area.height) ? 0 : area.height;
    font_size = isNaN(font_size) ? 10 /* 默认字号10 */ : font_size;
    line_height = isNaN(line_height) ? 0 : line_height;

    let text_view = new Forge.LayoutView();

    // 创建Texture
    const text_texture = manager.GetTextTextureFromStylePack(
      str,
      tsp,
      !!load_callback,
      area,
      font_size,
      line_height,
      is_instant,
      latex_mode
    );

    // Texture加载完成的回调处理
    if (load_callback) {
      // PC端特别处理，抓取TextView element的内容来完成回调
      setTimeout(()=>{
        load_callback({
          width: text_view.Element.clientWidth,
          height: text_view.Element.clientHeight
        });
      });
      // text_texture.RegisterLoadImageCallback(null, load_callback, null);
    }

    // 创建失败
    if (text_texture === null) {
      console.error("Error: Build text texture failed!");
      return null;
    }

    // 采用普通的TextureSetting，保证View在离开RootView后自动释放Texture
    text_view.ResetTexture(
      new Forge.TextureSetting(text_texture, null, null, true)
    );

    // 为了增加调试性，加入以内容为命名的ID
    if (str.length < 10) {
      text_view.SetId("Text-" + str);
    } else {
      // 文字太长时，使用长度来代表view id
      text_view.SetId("Text-Long-" + str.length);
    }

    // 配置宽高
    text_view.ResetLayoutParams({
      x: 0,
      y: 0,
      width: area.width,
      height: area.height,
    });

    // 处理区域对齐属性
    const ds_describe = tsp.DS.Describe;
    if (
      ds_describe.vertical_area_align === "middle" ||
      ds_describe.vertical_area_align === "bottom"
    ) {
      const parent_view = new TextParentViewProxy();
      parent_view.PutChildTextView(text_view);
      text_view.Element.style.display = "table-cell";
      text_view.Element.style.position = "static";
      parent_view.Element.style.display = "table";
      parent_view.Element.style.position = "static";

      // 输出textView进行替代
      text_view = parent_view;
    }

    return text_view;
  }
}

// static const
TextUtils._sDefaultFont = "黑体";
TextUtils._sDefaultFontSize = 30;
TextUtils._sDefaultFontColor = "#FFFFFF";
TextUtils._sDefaultBackgroundColor = "rgba(0, 0, 0, 0)";
Forge.TextUtils = TextUtils;
Forge.sTextUtils = new Forge.TextUtils();
