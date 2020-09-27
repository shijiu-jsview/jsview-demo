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
		"backfaceVisibility": ["backface-visibility"],
		"clipPath": ["clip-path"],
		"fontFamily": ["font-family"],
		"fontSize": ["font-size"],
		"fontStyle": ["font-style"],
		"lineHeight": ["line-height"],
		"objectFit": ["object-fit"],
		"perspectiveOrigin": ["perspective-origin"],
		"textAlign": ["text-align"],
		"textOverflow": ["text-overflow"],
		"transform": ["transform", "-webkit-transform"],
		"transformOrigin": ["transform-origin", "-webkit-transform-origin"],
		"transformStyle": ["transform-style"],
		"transition": ["transition", "-webkit-transition"],
		"whiteSpace": ["white-space"],
		"zIndex": ["z-index"],
	};

	sUnitSuffixMap = {
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

class JsvStyleClass {
	constructor(styles_define) {
		this._Name = null;
		this._Styles = null;
		this._StyleGroup = null;

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

		this._Name = "JsvStyle_" + (sIdGenerator++);
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
		}
	}

	// 约定接口，引擎中获取本对象的style设置
	getStyles() {
		return this._Styles;
	}
}

class JsvFontStyleClass extends JsvStyleClass {
	// TODO: 完成与Forge fsId对接
}

class JsvFontDisplayStyleClass extends JsvStyleClass {
	// TODO: 完成与Forge dsId对接
}

export {
	JsvStyleClass,
	JsvFontStyleClass,
	JsvFontDisplayStyleClass,
}

