import React from 'react';
import {Forge, ForgeExtension} from "../jsview-react/index_widget.js"
import { JsvSpriteBase, SpriteControlBase } from "./JsvSpriteBase"

// JsvSpriteTranslate comes from JsView React Project

/**
 * Component: JsvSpriteTranslate
 * @param {TranslateControl} Sprite动作控制器 必需
 */

class JsvTranslateControl extends SpriteControlBase {
	constructor() {
		super(2);
		this._Speed = 0; // pixel per second
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

	speed(pixel_per_second) {
		// Take effect in next Start
		this._Speed = pixel_per_second;
		return this;
	}

	// Override
	_WrapBuildAnimation(froms_array, tos_array) {
		let from_x = froms_array[0];
		let to_x = tos_array[0];
		let from_y = froms_array[1];
		let to_y = tos_array[1];

		let dx = to_x - from_x;
		let dy = to_y - from_y;
		let time = Math.floor(Math.sqrt(dx * dx + dy * dy) * 1000 / this._Speed);
		if (time == 0) {
			console.log("Discard starting request for no distance");
			return null; // failed to start
		}

		let anim = new Forge.TranslateAnimation(from_x, to_x, from_y, to_y, time, null);
		return anim;
	}

	// Override
	_WrapCallback(currents, callback) {
		if (callback) {
			callback(currents[0], currents, callback[1]);
		}
	}
}

class HtmlTranslateControl extends SpriteControlBase {
	constructor() {
		super();
	}

	targetX(new_x) {
		// TODO: 要补充
		return this;
	}

	targetY(new_y) {
		// TODO: 要补充
		return this;
	}

	target(new_x, new_y) {
		// TODO: 要补充
		return this;
	}

	speed(pixel_per_second) {
		// TODO: 要补充
		return this;
	}
}

var TranslateControl = window.JsView ? JsvTranslateControl : HtmlTranslateControl;

export {
	JsvSpriteBase as JsvSpriteTranslate,
	TranslateControl
};