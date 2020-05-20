import React from 'react';
import {Forge, ForgeExtension} from "../jsview-react/index_widget.js"
import { JsvSpriteBase, SpriteControlBase } from "./JsvSpriteBase"
import LongTextScroll from '../../longText/LongTextScroll.js';
import './JsvSpriteTranslate.css'
// JsvSpriteTranslate comes from JsView React Project

/**
 * Component: JsvSpriteTranslate
 * @param {TranslateControl} Sprite动作控制器 必需
 */

class JsvTranslateControl extends SpriteControlBase {
	constructor() {
		super(2); // targetX, targetY, accelerate, init velocity
		this._Mode = 0; // 0: 匀速控制模式, 1: 加减速控制模式
		this._Speed = 0; // pixel per second
		this._VerlocityAcc = new Array(2).fill(0); // 加速度值
		this._VerlocityInit = new Array(2).fill(0); // 初始速度
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
				console.error("Unsupported input=" + mode);
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

	enableRepeatFrom(start_x, start_y) {
		if (this._Mode != 0) {
			console.error("Error: mode error");
			return;
		}

		this.setRepeat(true);
		this._RepeatStart[0] = start_x;
		this._RepeatStart[1] = start_y;
		return this;
	}

	speed(pixel_per_second) {
		if (this._Mode != 0) {
			console.error("Error: mode error");
			return;
		}

		// Take effect in next Start
		this._Speed = pixel_per_second;
		return this;
	}

	// Start后，从当前位置到目标位置后动画结束
	accelerate(acc_x, acc_y, target_x, target_y) {
		if (this._Mode != 1) {
			console.error("Error: mode error");
			return;
		}

		this._Target[0] = target_x;
		this._Target[1] = target_y;
		this._VerlocityAcc[0] = acc_x;
		this._VerlocityAcc[1] = acc_y;
		this._VerlocityInit[0] = 0;
		this._VerlocityInit[1] = 0;
		return this;
	}

	// Start后，当减速到0时结束动画
	decelerate(acc_x, acc_y, init_v_x, init_v_y) {
		if (this._Mode != 1) {
			console.error("Error: mode error");
			return;
		}

		this._VerlocityAcc[0] = acc_x;
		this._VerlocityAcc[1] = acc_y;
		this._VerlocityInit[0] = init_v_x;
		this._VerlocityInit[1] = init_v_y;
		return this;
	}

	// Override
	_WrapBuildAnimation(repeat_start_array, current_array, tos_array, act_jump) {
		if (act_jump) {
			return this._UniformMove(null, current_array, tos_array, act_jump);
		} else {
			if (this._Mode == 0) {
				return this._UniformMove(repeat_start_array, current_array, tos_array, false);
			} else if (this._Mode == 1) {
				return this._AccelerMove(current_array, tos_array);
			}
		}
	}

	_UniformMove(repeat_start_array, current_array, tos_array, act_jump) {
		let from_x = 0;
		let from_y = 0;
		let start_pos = 0.0;
		let animate_time = 1;

		let current_x = current_array[0];
		let current_y = current_array[1];
		let to_x = tos_array[0];
		let to_y = tos_array[1];

		if (repeat_start_array != null) {
			from_x = repeat_start_array[0];
			from_y = repeat_start_array[1];
			let distance = this._Distance(current_x, current_y, to_x, to_y);
			let distance_total = this._Distance(from_x, from_y, to_x, to_y);
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

		if (!act_jump && animate_time == 0) {
			console.log("Discard starting request for no distance");
			return null; // failed to start
		}

		let anim = new Forge.TranslateAnimation(from_x, to_x, from_y, to_y, animate_time, null);
		if (start_pos != 0) {
			if (start_pos < 0) {
				console.warn("Warning: start position out of repeating range");
			} else {
				anim.SetStartPos(start_pos);
			}
		}

		return anim;
	}

	_AccelerMove(current_array, tos_array) {
		let current_x = current_array[0];
		let current_y = current_array[1];
		let int_v_x = this._VerlocityInit[0];
		let int_v_y = this._VerlocityInit[1];
		let acc_x = this._VerlocityAcc[0];
		let acc_y = this._VerlocityAcc[1];
		let target_x, target_y, time;
		let is_acc_up = true;

		if (acc_x == 0 && acc_y == 0) {
			console.error("Error: no found acceleration");
			return;
		}

		let d_acc = Math.sqrt(acc_x * acc_x + acc_y * acc_y);

		if (int_v_x == 0 && int_v_x == 0) {
			// 加速度运动，终点为target x，y
			target_x = tos_array[0];
			target_y = tos_array[1];
			// d = 0.5 * acc * time^2 ==> time = sqrt(d * 2 / acc)
			time = Math.floor(Math.sqrt(this._Distance(current_x, current_y, target_x, target_y) * 2 / d_acc) * 1000);
			is_acc_up = true;
		} else {
			// 减速运动
			let d_velocity = Math.sqrt(int_v_x * int_v_x + int_v_y * int_v_y);
			time = Math.floor(d_velocity * 1000 / d_acc);
			target_x = current_x + Math.floor(0.0000005 * acc_x * time * time);
			target_y = current_y + Math.floor(0.0000005 * acc_y * time * time);
			is_acc_up = false;
		}

		if (time == 0) {
			// no move
			console.log("no moved");
			return;
		}

		// console.log("_AccelerMove "
		// 	+ " current_x=" + current_x
		// 	+ " target_x=" + target_x
		// 	+ " current_y=" + current_y
		// 	+ " target_y=" + target_y
		// 	+ " time=" + time
		// );

		// Update target memo
		this._Target[0] = target_x;
		this._Target[1] = target_y;

		return new Forge.TranslateAnimation(current_x, target_x, current_y, target_y, time,
			(is_acc_up ? Forge.Easing.Circular.In : Forge.Easing.Circular.Out));
	}

	_Distance(from_x, from_y, to_x, to_y) {
		let dx = to_x - from_x;
		let dy = to_y - from_y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	// Override
	_WrapCallback(currents, callback) {
		if (callback) {
			callback(currents[0], currents[1]);
		}
	}
}

let is_char = char_code => (65 <= char_code && char_code <= 90) || (97 <= char_code && char_code <= 122);
let is_num = char_code => 48 <= char_code && char_code <= 57;

let parseTransform = (transform) => {
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

let HtmlTranslateControlToken = 0;
class HtmlTranslateControl extends SpriteControlBase {
	constructor() {
        super(2);
        this._Token = HtmlTranslateControlToken++;
        this._KeyframeBaseName = "jsvSpriteTranslate" + this._Token;
        this._Speed = 0;
        this._SubCount = 0;
	}

	targetX(new_x) {
		this._Target[0] = new_x;
		return this;
	}

	targetY(new_y) {
		this._Target[1] = new_y;
		return this;
	}

	target(new_x, new_y) {
		this._Target[0] = new_x;
		this._Target[1] = new_y;
		return this;
	}

	speed(pixel_per_second) {
		this._Speed = pixel_per_second;
		return this;
    }

    _GetTransform(valie_list) {
        return "matrix(1, 0, 0, 1, " + valie_list[0] +", " + valie_list[1] +")"
    }
    
    _GetCurrentValue() {
        let style = getComputedStyle(this._SpriteDiv);
        let transform = style.transform
        let trans_value = parseTransform(transform);
        let cur_value = [this._Current[0], this._Current[1]];
        if (trans_value != null) {
            switch(trans_value.name) {
                case "translate3d":
                    cur_value[0] = trans_value.params[0];
                    cur_value[1] = trans_value.params[1];
                    break;
                case "matrix":
                    cur_value[0] = trans_value.params[4];
                    cur_value[1] = trans_value.params[5];
                    break;
                case "matrix3d":
                    cur_value[0] = trans_value.params[12];
                    cur_value[1] = trans_value.params[13];
                    break;
                default:
                    console.error("HtmlTranslateControl get other animation " + transform)
                    break;
            }
        }
        return cur_value;
    }

    _WrapBuildAnimation(from, to) {
        let anim_name = this._KeyframeBaseName+ "_" + this._SubCount;
        this._SubCount = this._SubCount === 0 ? 1 : 0;

        let anim_str =  "@keyframes " + anim_name + "{from{transform:translate3d(" + from[0] + "px, " + from[1] + "px, 0);}to{transform:translate3d(" + to[0] + "px, " + to[1] + "px, 0);}}";
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; ++i) {
            let item = ss[i];
            if (item.cssRules && item.cssRules[0].name === "sprite_translate_tag") {
                for (let j = item.cssRules.length - 1; j >= 1; j--) {
                    if (item.cssRules[j].name && item.cssRules[j].name.indexOf(this._KeyframeBaseName) >= 0) {
                        item.deleteRule(j);
                    }
                }
                item.insertRule(anim_str, item.cssRules.length);
                break;
            }
        }

        let from_x = from[0];
		let to_x = to[0];
		let from_y = from[1];
		let to_y = to[1];

		let dx = to_x - from_x;
		let dy = to_y - from_y;
		let time = Math.sqrt(dx * dx + dy * dy) / this._Speed;
        return anim_name + " " + time + "s linear"
    }

    _WrapCallback(currents, callback) {
        if (callback) {
            callback(currents[0], currents[1]);
        }
	}
}

var TranslateControl = window.JsView ? JsvTranslateControl : HtmlTranslateControl;

export {
	JsvSpriteBase as JsvSpriteTranslate,
	TranslateControl
};