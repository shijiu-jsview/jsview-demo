import './JsvAnimationDelgate.css'
import {Forge} from "../jsview-react/index_widget.js"

class AnimDelegateBase {
	constructor(name) {
		this._KFName = name;
		this._Valid = false;
	}

	enableKeyFrame(anim_str) {
		anim_str = "@keyframes " + this._KFName + anim_str;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; ++i) {
			let item = ss[i];
			if (item.cssRules && item.cssRules[0].name === "sprite_animation_tag") {
				item.insertRule(anim_str, item.cssRules.length);
				break;
			}
		}
		this._Valid = true;
	}

	cancel() {
		recycle();
	}

	recycle() {
		if (!this._Valid) {
			// already recycled
			return;
		}

		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; ++i) {
			let item = ss[i];
			if (item.cssRules && item.cssRules[0].name === "sprite_animation_tag") {
				for (let j = item.cssRules.length - 1; j >= 1; j--) {
					if (item.cssRules[j].name && item.cssRules[j].name == this._KFName) {
						item.deleteRule(j);
						break;
					}
				}
				break;
			}
		}
		this._Valid = false;
	}

	getDescribe() {
		console.warn("Should override");
	}
}

/*
 * TranslateAnimation
 */
let sAnimationCount = 0;
class TranslateAnimation extends AnimDelegateBase {
	constructor(start_x, end_x, start_y, end_y, duration, easing) {
		super("JsvKFAnimation_" + (sAnimationCount++));

		this.enableKeyFrame("{from{transform:translate3d("
			+ start_x + "px, " + start_y + "px, 0);}to{transform:translate3d("
			+ end_x + "px, " + end_y + "px, 0);}}")

		// 转义easing
		if (easing == Forge.Easing.Circular.In) {
			easing = "ease-in";
		} else if (easing == Forge.Easing.Circular.Out) {
			easing = "ease-out";
		} else {
			easing = "linear";
		}

		this._Describe = this._KFName + " " + (duration / 1000) + "s " + easing;
	}

	// Override
	getDescribe() {
		return this._Describe;
	}
}

/*
 * TranslateStyle
 */
let is_char = char_code => (65 <= char_code && char_code <= 90) || (97 <= char_code && char_code <= 122);
let is_num = char_code => 48 <= char_code && char_code <= 57;
let __parseTransform = (transform) => {
	if (!transform) { return null; }
	let func_name = "";
	let param = "";
	let param_list = [];
	let mode = 0; // 0 parse name; 1 parse params;
	for (let i = 0; i < transform.length; i++) {
		let char_code = transform.charCodeAt(i);
		if (mode == 0) {
			if (is_char(char_code) || is_num(char_code)) {
				func_name += transform[i]
			}
		} else {
			if (is_num(char_code) || char_code == 46 || char_code == 45 || char_code == 101) { //科学计数
				param += transform[i];
			}
		}

		if (char_code == 40) { // (
			mode = 1;
			param = "";
			param_list = [];
		} else if (char_code == 41) { // )
			param_list.push(parseFloat(param));
			return {
				"name": func_name,
				"params": param_list
			}
		} else if (char_code == 44) { // ,
			param_list.push(parseFloat(param));
			param = "";
		}
	}
	console.error("transform error", transform);
	return null;
}
let TranslateStyle = {
	// return {x, y}
	getCurrentValue: (div_element)=>{
		let style = window.getComputedStyle(div_element);
		let transform = style.transform;
		let trans_value = __parseTransform(transform);
		let x_value = 0;
		let y_value = 0;
		if (trans_value != null) {
			switch(trans_value.name) {
				case "translate3d":
					x_value = trans_value.params[0];
					y_value = trans_value.params[1];
					break;
				case "matrix":
					x_value = trans_value.params[4];
					y_value = trans_value.params[5];
					break;
				case "matrix3d":
					x_value = trans_value.params[12];
					y_value = trans_value.params[13];
					break;
				default:
					console.error("HtmlTranslateControl get other animation " + transform)
					break;
			}
		} else {
			console.error("Error:Parse computerStyle failed");
		}

		return {x:x_value, y:y_value};
	},

	buildTransform: (x, y)=>{
		return "matrix(1, 0, 0, 1, " + x +", " + y +")"
	},
};

export {
	TranslateAnimation,
	TranslateStyle
}