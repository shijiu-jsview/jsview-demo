class PlatformUtils {
  static getTextPixelWith(text, fontStyle) {
    if (PlatformUtils.sCanvas === null) {
      PlatformUtils.sCanvas = window.originDocument.createElement("canvas"); // 创建 canvas 画布
    }

    const context = PlatformUtils.sCanvas.getContext("2d"); // 获取 canvas 绘图上下文环境
    context.font = fontStyle; // 设置字体样式，使用前设置好对应的 font 样式才能准确获取文字的像素长度
    const dimension = context.measureText(text); // 测量文字
    return Math.ceil(dimension.width);
  }

  static GetTextWidth(font_params) {
    let bold = "";
    if (font_params.bold) {
      bold = "bold";
    }
    let italic = "";
    if (font_params.italic) {
      italic = "italic";
    }
    return this.getTextPixelWith(font_params.str, `${bold} ${italic} ${font_params.size}px ${font_params.font}`);
  }

  static GetTextRect(str, max_rect, font_params, text_attr, line_height) {
    const rows = Math.ceil((font_params.size * str.length) / max_rect.width);
    let height = rows * line_height;
    if (height > max_rect.height) {
      height = max_rect.height;
    }
    const ret_json = {
      width: max_rect.width,
      height
    };
    return ret_json;
  }

  static GetCursorOffset(str, max_rect, font_params, text_attr, line_height, pos_x, pos_y) {
    // TODO 目前只考虑单行
    let bold = "";
    if (font_params.bold) {
      bold = "bold";
    }
    let italic = "";
    if (font_params.italic) {
      italic = "italic";
    }
    let cursor_offset = 0;
    if (font_params.alignment === "right") {
      const width = this.getTextPixelWith(str, `${bold} ${italic} ${font_params.size}px ${font_params.font}`);
      pos_x -= (max_rect.width - width);
      if (pos_x < 0) {
        pos_x = 0;
      }
    }

    let sub_width = 0;
    while (pos_x >= sub_width) {
      if (cursor_offset === str.length) {
        break;
      }
      sub_width = this.getTextPixelWith(str.substr(0, cursor_offset + 1), `${bold} ${italic} ${font_params.size}px ${font_params.font}`);
      if (pos_x >= sub_width) {
        cursor_offset++;
      }
    }

    return cursor_offset;
  }

  static GetCursorPosition(str, max_rect, font_params, text_attr, line_height, cursor_offset) {
    // TODO 目前只考虑单行
    let bold = "";
    if (font_params.bold) {
      bold = "bold";
    }
    let italic = "";
    if (font_params.italic) {
      italic = "italic";
    }

    let width = 0;
    let sub_str = str;
    if (cursor_offset < str.length) {
      sub_str = sub_str.substr(0, cursor_offset);
    }

    width = this.getTextPixelWith(sub_str, `${bold} ${italic} ${font_params.size}px ${font_params.font}`);
    if (font_params.alignment === "right") {
      // 总长度
      const total_width = this.getTextPixelWith(str, `${bold} ${italic} ${font_params.size}px ${font_params.font}`);
      width = max_rect.width - total_width + width;
    }

    return { x: width, y: 0 };
  }
}
PlatformUtils.sCanvas = null;
window.PlatformUtils = PlatformUtils;
