import {getCssStyleGroup} from "./JsvDynamicCssStyle"
import {Forge} from "../jsview-react/index_widget.js"

let sIdGenerator = 100;

// 转换CSS名称的对应表
let sCssNamesMap = null;
let sUnitSuffixMap = null

function _EnsureCssNamesMap() {
	// Css 名称 style -> css的对应表，
	// 对应表为array，若array中有多个值，则生成多个内容，例如--webkit-animation/animation
	// 不在表中的style不进行名字转换
	sCssNamesMap = {
		"animation": ["animation", "-webkit-animation"],
		"backgroundImage": ["background-image"],
		"borderRadius": ["border-radius"],
		"borderImage": ["border-image"],
		"borderImageOutset": ["border-image-outset"],
		"borderImageWidth": ["border-image-width"],
		"backgroundColor": ["background-color"],
		"backfaceVisibility": ["backface-visibility", "-webkit-backface-visibility"],
		"clipPath": ["clip-path"],
		"fontFamily": ["font-family"],
		"fontSize": ["font-size"],
		"fontStyle": ["font-style"],
		"lineHeight": ["line-height"],
		"objectFit": ["object-fit"],
		"perspective": ["perspective", "-webkit-perspective"],
		"perspectiveOrigin": ["perspective-origin", "-webkit-perspective-origin"],
		"textAlign": ["text-align"],
		"textOverflow": ["text-overflow"],
		"transform": ["transform", "-webkit-transform"],
		"transformOrigin": ["transform-origin", "-webkit-transform-origin"],
		"transformStyle": ["transform-style", "-webkit-transform-style"],
		"transition": ["transition", "-webkit-transition"],
		"whiteSpace": ["white-space"],
		"zIndex": ["z-index"],
	};

	sUnitSuffixMap = {
		"fontSize": "px",
		"left": "px",
		"top": "px",
		"width": "px",
		"height": "px",
	}
}

function _ConvertStyles(styles_define) {
	_EnsureCssNamesMap();

	let styles_result = "{";

	for (let prop in styles_define) {
		let value = styles_define[prop];

		// 追加计数单位
		if (sUnitSuffixMap.hasOwnProperty(prop)) {
			if (typeof value === "number") {
				value = "" + value + sUnitSuffixMap[prop];
			}
		}

		if (sCssNamesMap.hasOwnProperty(prop)) {
			let alias_array = sCssNamesMap[prop];
			// 找到别名，若为多别名，则每个别名都设置
			for (let alias of alias_array) {
				styles_result += (alias + ":" + value + ";");
			}
		} else {
			// 名字不变
			styles_result += (prop + ":" + value + ";");
		}
	}

	styles_result += "}";

	return styles_result;
}

let CONST_TYPE_BASE = null;
let CONST_TYPE_TEXT = "text";

class JsvStyleClass {
	constructor(styles_define) {
		this._Name = null;
		this._Styles = null;
		this._StyleGroup = null;
		this._JsvInnerAttach = null;

		if (styles_define) {
			this._UpdateInner(styles_define);
		} else {
			// 先创建，后设置值的场景
		}
	}

	reset(styles_define) {
		// 创建新的Css Style，替代原缓存，并生成新的name
		this._UpdateInner(styles_define);
	}

	_UpdateInner(styles_define) {
		this._RecycleInner();

		this._Name = "JsvStyle_" + (sIdGenerator++); // 重新命名以触发react的className属性变化
		this._Styles = styles_define;

		if (window.JsvDisableReactWrapper) {
			// 纯WebView场景: 动态生成css
			let css_define = _ConvertStyles(styles_define);
			if (!this._StyleGroup) {
				this._StyleGroup = getCssStyleGroup();
			}
			this._StyleGroup.insertRule("." + this._Name + css_define);
		} else {
			// JsView场合(PC/android)，向引擎注册class
			Forge.ReactUtils.StyleClassMap[this._Name] = this;
		}
	}

	getName() {
		return this._Name;
	}

	// 释放CSS定义，以节省内存
	recycle() {
		this._RecycleInner();
	}

	_RecycleInner() {
		if (this._Name) {
			if (window.JsvDisableReactWrapper) {
				// 纯WebView场景
				this._StyleGroup.removeRule("." + this._Name);
			} else {
				// JsView场合(PC/android)
				delete Forge.ReactUtils.StyleClassMap[this._Name];
			}
			this._Name = null;
			this._Styles = null;
			this._JsvInnerAttach = null;
		}
	}

	// 约定接口，引擎中获取本对象的类型
	classType() {
		return CONST_TYPE_BASE;
	}

	// 约定接口，引擎中获取本对象的style设置
	getStyles() {
		return this._Styles;
	}


	// 约定接口，
	// 用于存储配置转化出来的缓存信息和标识位
	getAttach() {
		return this._JsvInnerAttach;
	}

	// 约定接口，
	// 用于读取缓存信息和标识位
	updateAttach(new_attach) {
		this._JsvInnerAttach = new_attach;
	}
}

class JsvTextStyleClass extends JsvStyleClass {
	constructor(styles_define) {
		super(styles_define);

		this._JsvTextAttributes = {}; // 例如 jsv_text_vertical_align 属性
	}

	// 注意:此接口仅提供给JsViewReactWidget中的hoc调用，
	// 非hoc由于调用时机控制不正确，可能产生设置无效的问题
	appendJsvAttributes(name, value) {
		if (!name.startsWith("jsv_text_")) {
			// Error: should start with 'jsv_text_'
			return false;
		}

		if (this._JsvTextAttributes.hasOwnProperty(name) && this._JsvTextAttributes[name] !== value) {
			// Error: should set once
			return false ;
		}

		this._JsvTextAttributes[name] = value;
		return true;
	}

	getTextJsvAttributes() {
		return this._JsvTextAttributes;
	}

	// 与jsviewreact.min.js对接的内部接口
	// 加速功能失效，失效的原因由style name给出
	// 导致加速失效的属性为下列列表中的属性在class的style定义之外被设置成其他值:
	// ***** Style中 ******
	// "textOverflow",
	// "wordWrap",
	// "textShadow",
	// "fontSize",
	// "lineHeight",
	// "color",
	// "fontFamily",
	// "fontStyle",
	// "fontWeight",
	// "textAlign",
	// ***** Attribute中 ******
	// "jsv_text_vertical_align"
	fallbackMode(style_name) {
		console.warn("WARN: JsvTextStyleClass[" + this.getName() + "] enter fallback mode due to [" + style_name + "]");
	}

	// Override
	classType() {
		return CONST_TYPE_TEXT;
	}
}

function combinedStyles(style_array, extract_all) {
	let class_process_done = false;
	let name_list = [];
	let normal_style = {};
	for (let item of style_array) {
		if (item instanceof JsvStyleClass) {
			if (extract_all) {
				// 属性全拆解
				normal_style = Object.assign(normal_style, item.getStyles());
			} else {
				name_list.push(item.getName());
			}
			if (class_process_done) {
				console.warn("WARNING:found class define after normal style set");
			}
		} else {
			class_process_done = true;
			normal_style = Object.assign(normal_style, item);
		}
	}

	return {
		combinedClass: name_list.join(" "),
		combinedStyle: normal_style
	};
}

export {
	JsvStyleClass,
	JsvTextStyleClass,
	combinedStyles
}

