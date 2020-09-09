import Forge from "../ForgeDefine"
Forge.TextShaderType = {
    LinearGradient: 0,
    Image: 1,
};
class TextShader {
    constructor(type, params) {
        this.Type = type;
        this.Params = params;
    }

}
Forge.TextShader = TextShader;
class TextViewParams {
    constructor() {
        let layout_view = new Forge.LayoutView();
        let renderer = layout_view.GetRenderer();
		this._Renderer = renderer;
        this.StringWithFont = Forge.sTextUtils.StringWithFont("", 0, undefined, "center", "middle", undefined, false, false, undefined, undefined, "top");
        this.RectArea =  new Forge.RectArea(0, 0, 0, 0);//default w:0, h:0
        this.TextAttr = Forge.sTextUtils.TextAttr("ellipsis", "none");
        this.Marquee = null;//{repetition: "infinite", direction: "left", speed: "normal" };
        this.Shader = null;
	    this.IsInstantLoad = true;
        this.LineHeight = 0;
    }
	SetInstantLoad(is_instant_load) {
		this.IsInstantLoad = is_instant_load;
		return this;
	};
    SetStringWithFont(string_with_font) {
        this.StringWithFont = string_with_font;//renderer.StringWithFont
        return this;
    };
	SetFontStyle(_size_or_set,_font,_alignment,_vertical_align, _text_color, _italic, _bold, _shadow, _stroke_width, _vertical_area_align) {
	    if (typeof _size_or_set === "object") {
            this.StringWithFont = Forge.sTextUtils.StringWithFont(
                "",
                (typeof _size_or_set["size"] !== "undefined" ? _size_or_set["size"] : 10),
                (typeof _size_or_set["font"] !== "undefined" ? _size_or_set["font"] : "宋体"),
                (typeof _size_or_set["hAlign"] !== "undefined" ? _size_or_set["hAlign"] : "center"),
                (typeof _size_or_set["vAlign"] !== "undefined" ? _size_or_set["vAlign"] : "middle"),
                (typeof _size_or_set["textColor"] !== "undefined" ? _size_or_set["textColor"] : "#000000"),
                (typeof _size_or_set["italic"] !== "undefined" ? _size_or_set["italic"] : false),
                (typeof _size_or_set["bold"] !== "undefined" ? _size_or_set["bold"] : false),
                (typeof _size_or_set["shadow"] !== "undefined" ? _size_or_set["shadow"] : null),
                (typeof _size_or_set["strokeWidth"] != "undefined" ? _size_or_set["strokeWidth"] : null),
                (typeof _size_or_set["vAreaAlign"] != "undefined" ? _size_or_set["vAreaAlign"] : "top"),
            );
        } else {
            this.StringWithFont = Forge.sTextUtils.StringWithFont(
                "", _size_or_set, _font,_alignment,_vertical_align, _text_color, _italic, _bold, _shadow, _stroke_width, _vertical_area_align);
        }
        return this;
	};
    SetRectArea(rect_area) {
        if (rect_area instanceof Forge.RectArea) {
            this.RectArea = rect_area;
        } else {
            this.RectArea = new Forge.RectArea(rect_area.x, rect_area.y, rect_area.width, rect_area.height);
        }
        return this;
    };
    SetViewSize(rect_area) {
        if (!(rect_area instanceof Forge.RectArea)) {
            rect_area = new Forge.RectArea(rect_area.x, rect_area.y, rect_area.width, rect_area.height);
        }
		this.SetRectArea(rect_area);
		if (this.LineHeight === 0 && rect_area.height !== 0) {
			this.LineHeight = rect_area.height;
		}
		return this;
	};
    SetTextAttr(set) {
        let text_overflow;
        if (set.hasOwnProperty("textOverflow"))
            text_overflow = set["textOverflow"];
        else if (set.hasOwnProperty("text_overflow")) // 兼容老定义
            text_overflow = set["text_overflow"];
        else
            text_overflow = "clip";
        let word_wrap;
        if (set.hasOwnProperty("wordWrap"))
            word_wrap = set["wordWrap"];
        else if (set.hasOwnProperty("word_wrap")) // 兼容老定义
            word_wrap = set["word_wrap"];
        else
            word_wrap = "none";
        this.TextAttr  = {
            word_wrap:word_wrap,
            text_overflow:text_overflow
        };
        return this;
    };
    SetMarquee(marquee) {
        if (marquee) {
            this.Marquee = {repetition: "infinite", direction: "left", speed: "normal" };//set default
            if (marquee.repetition)
                this.Marquee.repetition = marquee.repetition;
            if (marquee.direction)
                this.Marquee.direction = marquee.direction;
            if (marquee.speed)
                this.Marquee.speed = marquee.speed;
        }
        return this;
    };
    SetShader(shader) {
        this.Shader = shader;
        return this;
    };
    SetLineHeight(line_height) {
        this.LineHeight = line_height;
        return this;
    };
    Clone() {
        let text_view_params = new TextViewParams(null);
        text_view_params.StringWithFont = this.StringWithFont;
        text_view_params.RectArea = this.RectArea;
        text_view_params.TextAttr = this.TextAttr;
        text_view_params.LineHeight = this.LineHeight;
        return text_view_params;
    };
}
Forge.TextViewParams = TextViewParams;
window["TextViewParams"] = Forge.TextViewParams;

class TextViewEx {
    constructor(texture_manager, text_view_params, text_string, quick, texture_onload_callbacks)
    {
        this._layoutView = null;
        this._textWidth = 0;
        this._textViewReahHeight = 0;
        this._marqueeRunning = true;
        this._marqueePause = false;
        this._marqueeCurrentNum = 2;
        this._textView = null;
        this._TextViewParams = text_view_params;
        this._NeedQuick = typeof quick === "undefined"? false : quick;//默认需要实际高度
        this._marquee = text_view_params.Marquee;
        this._rectArea = text_view_params.RectArea;
		this._DrawCount = 0;
		this._ShowInterval = 0;
        this._TextureManager = texture_manager;
        this._Shader = text_view_params.Shader;
	    this._IsInstantLoad = text_view_params.IsInstantLoad ? 1:0;
        this._AutoHeight = false;
        this._EnableTextureOnloadCallback = !!texture_onload_callbacks;
        let _this = this;
        let _renderer = null;
        let _blockWidth =  text_view_params.RectArea.width;
        let _blockHeight= text_view_params.RectArea.height;
        let _stringWithFont = null;
	    let _matrixClipLayoutview = null;

	    if (this._marquee !== null) {
	    	// 只有在Maquee情况下需要ClipView(PS: react模式下不需要文字自身的maquee)
		    _matrixClipLayoutview = new Forge.ClipView();
		    _matrixClipLayoutview.Init();
		    _matrixClipLayoutview.SetClipRect(
			    0,
			    0,
			    _blockWidth,
			    _blockHeight,
			    true);
		    _matrixClipLayoutview.SetId("matrixClipLayoutview");
		    _matrixClipLayoutview.OnDettachFromSystem = function (){
			    _this._marqueeRunning = false;
			    Forge.ClipView.prototype.OnDettachFromSystem.call(this); // Call to super class
		    }
	    } else {
		    _matrixClipLayoutview = new Forge.LayoutView();
            _matrixClipLayoutview.OnDettachFromSystem = function (){
                if (this._TextureOnloadCallbacksTimer) {
                    clearTimeout(this._TextureOnloadCallbacksTimer);
                    this._TextureOnloadCallbacksTimer = null;
                }
            }
	    }

        _renderer = _matrixClipLayoutview.GetRenderer();
		this._Renderer = _renderer;
        let text_str = text_string;
        if (!text_str) {
            text_str = text_view_params.StringWithFont.str;
        }
        //对字符串进行转义字符替换(Escape character);
        text_str = this._ConvertEscToString(text_str);
		let italic = false;
		if (text_view_params.StringWithFont.italic.length > 0) {
			italic = true;
		}
		let bold = false;
		if (text_view_params.StringWithFont.bold.length > 0) {
			bold = true;
		}
        _stringWithFont = Forge.sTextUtils.StringWithFont(
            text_str,
            text_view_params.StringWithFont.size,
            text_view_params.StringWithFont.font,
            text_view_params.StringWithFont.alignment,
            text_view_params.StringWithFont.vertical_align,
            text_view_params.StringWithFont.textColour,
			italic,
			bold,
            text_view_params.StringWithFont.shadow,
            text_view_params.StringWithFont.stroke_width,
            text_view_params.StringWithFont.vertical_area_align
        );

        //需要实际宽高时，或有跑马灯设置，才获取实际的宽度
        if (typeof text_view_params.Marquee !== "undefined"
            && text_view_params.Marquee !== null) {
           this._textWidth = Forge.sTextUtils.GetTextWidth(_stringWithFont);
        } else if(!this._NeedQuick) {
            this._textWidth = Forge.sTextUtils.GetTextWidth(_stringWithFont);
        } else {
            this._textWidth = text_view_params.RectArea.width - 2 * text_view_params.RectArea.x;
        }

        //add text view
        this.addTextView(_matrixClipLayoutview, _stringWithFont,
            text_view_params.TextAttr, text_view_params.RectArea,
            text_view_params.Marquee, text_view_params.LineHeight);
        if (this._TextureOnloadCallbacksTimer) {
            clearTimeout(this._TextureOnloadCallbacksTimer);
            this._TextureOnloadCallbacksTimer = null;
        }
        this._TextureOnloadCallbacksTimer = setTimeout(() => {
            if (texture_onload_callbacks) {
                texture_onload_callbacks({
                    width: this._textView.Element.clientWidth,
                    height: this._textView.Element.clientHeight
                })
            }
        }, 0)

        this._layoutView = _matrixClipLayoutview;

		this._TextTexture = null;

		this._MarqueeTimer = null;
    }
    _ConvertEscToString(src_string) {
        let dst_str = ""+src_string;//强转字符串型
        if (dst_str.indexOf("&quot;") !== -1) {
            dst_str = dst_str.replace(/&quot;/ig, "\"");
        }
        if (dst_str.indexOf("&amp;") !== -1) {
            dst_str = dst_str.replace(/&amp;/ig, "&");
        }
        if (dst_str.indexOf("&lt;") !== -1) {
            dst_str = dst_str.replace(/&lt;/ig, ">");
        }
        if (dst_str.indexOf("&gt;") !== -1) {
            dst_str = dst_str.replace(/&gt;/ig, "<");
        }
        if (dst_str.indexOf("&nbsp;") !== -1) {
            dst_str = dst_str.replace(/&nbsp;/ig, " ");
        }
        return dst_str;
    }

    EnableAutoHeight() {
        this._AutoHeight = true;
        this._textView.EnableAutoHeight();
    }

    addTextView(parent_view, t_StringWithFont, t_TextAttr, t_RectArea, t_Marquee, line_height) {
        let block_height = t_RectArea.height;
        let text_texture;
        let rect_area = Forge.Clone(t_RectArea);
		let text_view = null;
        if (t_StringWithFont.str.length !== 0) {
            text_texture =  this._TextureManager.GetTextTextureByMultiRows(t_StringWithFont, t_TextAttr, rect_area,
                line_height, this._NeedQuick, this._Shader, this._IsInstantLoad);

			// Set text texture
			this._TextTexture = text_texture.texture;

            //set real height
            this._textViewReahHeight = text_texture.real_height;
            text_view = new Forge.LayoutView();
            text_view.Init(new Forge.TextureSetting(text_texture.texture, null, null, true));
            text_view.SetId("Text-"+t_StringWithFont.str);

			if (t_StringWithFont.vertical_align == "middle" || t_StringWithFont.vertical_align == "bottom") {
				text_view.Element.style.display = "table-cell";
				text_view.Element.style.position = "static";
				parent_view.Element.style.display = "table";
				parent_view.Element.style.position = "static";
			}
            parent_view.AddView(text_view,
                new Forge.LayoutParams({
                    x:0, y:0,
                    width: rect_area.width, height:block_height}));
            this._textView = text_view;
        } else {
            this._textViewReahHeight = 0;
            Forge.LogI("t_StringWithFont.str.length is 0");
        }
    }
    GetLayoutView () {
        return this._layoutView;
    }
    GetTextWidth() {
    	if (this._textView) {
    		return this._textView.Element.clientWidth;
	    } else {
		    return Math.floor(this._textWidth + 0.5);
	    }
    }
    StartAnimation(animation) {
        if(animation && this._textView !== null) {
            this._textView.StartAnimation(animation);
        }
    }
}
Forge.TextViewEx = TextViewEx;
Forge.TextViewControl = TextViewEx;

Forge.Clone = function(obj) {
	let obj_json = JSON.stringify(obj);
	let obj_clone = JSON.parse(obj_json);
	return obj_clone;
};
window["Clone"] = Forge.Clone;
