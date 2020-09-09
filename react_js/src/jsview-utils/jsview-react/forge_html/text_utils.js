import Forge from "../ForgeDefine"
class TextUtils {
	StringWithFont(_str,_size,_font,_alignment,_vertical_align, _text_color, _italic,
												  _bold, _shadow, _stroke_width, _vertical_area_align)
	{
		if(!_size) _size = TextUtils._sDefaultFontSize;
		if(!_font) _font = TextUtils._sDefaultFont;

		var italic = "";
		if(_italic === true) {
			italic = "italic";
		}
		var bold = "";
		if(_bold === true) {
			bold = "bold";
		}
		if(!_alignment)_alignment="left";
		if(!_vertical_align) _vertical_align = "middle";
		if(!_text_color) _text_color = TextUtils._sDefaultFontColor;
        if(!_shadow) _shadow = null;
        if(!_vertical_area_align) _vertical_area_align = "top";
		//LogM("_str=" + _str + " _size=" + _size + " _font=" + _font + " text_color=" + _text_color);
        if(!_stroke_width) _stroke_width = -1;
		return {
			str:""+_str, // export member
			font:_font, // export member
			size:_size, // export member
			italic:italic,
			bold:bold,
			stroke_width:_stroke_width,
			alignment:_alignment,
			vertical_align:_vertical_align,
			textColour:_text_color,
			backgroundColour:TextUtils._sDefaultBackgroundColor,
			enableBlend:true,
            shadow:_shadow,
            vertical_area_align: _vertical_area_align,
        };
	}

	TextAttr(_text_overflow, _word_wrap)
	{
		if(!_text_overflow) _text_overflow="none";
		if(!_word_wrap) _word_wrap="none";

		return {"text_overflow":_text_overflow,"word_wrap":_word_wrap};
	}

	GetTextWidth(t_StringWithFont) {
		if (typeof window.PlatformUtils !== "undefined") {
			return window.PlatformUtils.GetTextWidth(t_StringWithFont);
		} else {
			return t_StringWithFont.str.length * t_StringWithFont.size + 1; // TODO: 矫正成和平台相关的同步函数
		}
	};

	GetTextRect(str, max_rect, font_params, text_attr, line_height) {
		if (typeof window.PlatformUtils !== "undefined") {
			return window.PlatformUtils.GetTextRect(str, max_rect, font_params, text_attr, line_height);
		} else {
			return {"width":max_rect["width"], "height":max_rect["height"]};
		}
	};

	GetTextInfo(str, max_rect, font_params, text_attr, line_height) {
		if (typeof window.PlatformUtils !== "undefined") {
			return window.PlatformUtils.GetTextInfo(str, max_rect, font_params, text_attr, line_height);
		} else {
			return {"start":0, "end":str.length, "width":max_rect.width,"height":max_rect.height};
		}
	};

	GetCursorOffset(str, max_rect, font_params, text_attr, line_height, pos_x, pos_y) {
		if (typeof window.PlatformUtils !== "undefined") {
			return window.PlatformUtils.GetCursorOffset(str, max_rect, font_params, text_attr, line_height, pos_x, pos_y);
		} else {
			return 0;
		}
	};

	GetCursorPosition(str, max_rect, font_params, text_attr, line_height, cursor_offset) {
		if (typeof window.PlatformUtils !== "undefined") {
			return window.PlatformUtils.GetCursorPosition(str, max_rect, font_params, text_attr, line_height, cursor_offset);
		} else {
			return {x:0, y:0};
		}
	};
}
// static const
TextUtils._sDefaultFont="黑体";
TextUtils._sDefaultFontSize=30;
TextUtils._sDefaultFontColor="#FFFFFF";
TextUtils._sDefaultBackgroundColor="rgba(0, 0, 0, 0)";
Forge.TextUtils = TextUtils;
Forge.sTextUtils = new Forge.TextUtils();

