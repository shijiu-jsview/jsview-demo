import React from 'react';
import {Forge, ForgeExtension} from "../jsview-react/index_widget.js"

// JsvSpriteTranslate comes from JsView React Project

/**
 * Component: JsvSpriteTranslate
 * @param {TranslateControl} Sprite动作控制器 必需
 */

class JsvTranslateControl {
	constructor() {
		this._CurrentX = 0;
		this._CurrentY = 0;
		this._TargetX = 0;
		this._TargetY = 0;
		this._Speed = 0; // pixel per second
		this._StateIndex = 0; // 0: idle, 1:running
		this._StateLocked = false;
		this._StartSwitcher = false;
		this._Callbacks = [];

		this._SpriteView = null;
	}

	targetX(new_x) {
		// Take effect in next Start
		this._TargetX = new_x;
		return this;
	}

	targetY(new_y) {
		// Take effect in next Start
		this._TargetY = new_y;
		return this;
	}

	target(new_x, new_y) {
		// Take effect in next Start
		this._TargetX = new_x;
		this._TargetY = new_y;
		return this;
	}

	speed(pixel_per_second) {
		// Take effect in next Start
		this._Speed = pixel_per_second;
		return this;
	}

	start() {
		this._StartSwitcher = true;
		this._StateMachineNext();
	}

	pause(paused_callback) {
		if (this._StateIndex == 0) {
			if (paused_callback) {
				paused_callback(this._CurrentX, this._CurrentY);
			}
		} else {
			if (paused_callback) {
				this._Callbacks.push(paused_callback);
			}
			this._StateMachineNext();
		}
	}

	_StateMachineNext() {
		if (this._StateLocked) {
			// 内部处理进行中，暂停状态切换
			return;
		}

		if (this._StateIndex == 0) {
			// Idle -> play, need switcher
			if (this._StartSwitcher) {
				this._StartSwitcher = false;
				if (this._StartAnimation()) {
					this._StateIndex = 1;
				}
			}
		} else if (this._StateIndex == 1) {
			// Play -> idle, no need switcher
			this._StopAnimation();
			this._StateIndex = 0;
		}
	}

	_StartAnimation() {
		let from_x = this._CurrentX;
		let to_x = this._TargetX;
		let from_y = this._CurrentY;
		let to_y = this._TargetY;

		let dx = to_x - from_x;
		let dy = to_y - from_y;
		let time = Math.floor(Math.sqrt(dx * dx + dy * dy) * 1000 / this._Speed);
		if (time == 0) {
			console.log("Discard starting request for no distance");
			return false; // failed to start
		}

		let that = this;
		let listener = (new Forge.AnimationListener())
			.OnFinalProgress((progress)=>{
				that._OnPaused(
					Math.floor(dx * progress + from_x),
					Math.floor(dy * progress + from_y));
			});

		let anim = new Forge.TranslateAnimation(from_x, to_x, from_y, to_y, time, null);
		anim.AddAnimationListener(listener);
		anim.Enable(Forge.AnimationEnable.AckFinalProgress | Forge.AnimationEnable.KeepTransform);

		this._SpriteView.StartAnimation(anim);

		return true; // success
	}

	_StopAnimation() {
		this._SpriteView.StopAnimation();
		this._StateIndex = 0;
	}

	_OnPaused(current_x, current_y) {
		this._CurrentX = current_x;
		this._CurrentY = current_y;

		this._StateLocked = true;

		// 换出callbacks，回调时可能加入新的callbacks
		let callbacks = this._Callbacks;
		this._Callbacks = [];

		// 回调所有callback
		let size = callbacks.length;
		for (let i = 0; i < size; i++) {
			callbacks[i](this._CurrentX, this._CurrentY);
		}

		this._StateLocked = false;
		this._StateMachineNext(); // Trigger next start
	}

	_SetView(jsv_view) {
		this._SpriteView = jsv_view;
	}
}

class HtmlTranslateControl {
	constructor() {
	}

	targetX(new_x) {
		// Take effect in next Start

		return this;
	}

	targetY(new_y) {
		// Take effect in next Start

		return this;
	}

	target(new_x, new_y) {
		// Take effect in next Start

		return this;
	}

	speed(pixel_per_millisecond) {
		// Take effect in next Start

	}

	start() {
	}

	Pause(paused_callback) {

	}

	_SetView(jsv_view) {

	}
}

var TranslateControl = window.JsView ? JsvTranslateControl : HtmlTranslateControl;

class JsvSpriteTranslate extends React.Component{
	/**
	 * @description: 属性说明
	 * @param {TranslateControl} Sprite动作控制器 必需
	 */
	constructor(props) {
		super(props);

		this._LinkedControl = props.control;

		// Props for JsView
		this._JsvViewStoreId = -1;

		// 校验合法性
		if (!this._LinkedControl || !(this._LinkedControl instanceof TranslateControl)) {
			console.error("Error: Need set Control!");
		}
	}

	render() {
		if (window.JsView) {
			return this._RenderInJsView();
		} else {
			// TODO: 要补充html运行状态
			return (<div></div>);
		}
	}

	componentWillUnmount() {
		// 清理ViewStore对LayoutView的引用
		if (this._JsvViewStoreId != -1) {
			ForgeExtension.RootActivity.ViewStore.remove(this._JsvViewStoreId);
			this._JsvViewStoreId = -1;
		}
	}

	_RenderInJsView() {
		// 创建LayoutView，并通过jsv_innerview做成ProxyView(接管所有子View)
		if (this._JsvViewStoreId == -1) {
			this._JsvViewStoreId = this._BuildLayoutView();
		}

		let {control, ...other_prop} = this.props;
		return(
			<div {...other_prop} jsv_innerview={this._JsvViewStoreId}></div>
		);
	}

	_BuildLayoutView() {
		// 创建一个宽高都为0的定位View作为动画被控对象
		let sprite_view = new Forge.LayoutView(
			new Forge.TextureSetting(ForgeExtension.TextureManager.GetColorTexture("rgba(125, 125, 255, 1.0)"))
		);
		let view_info = new Forge.ViewInfo(sprite_view, new Forge.LayoutParams({x:0,y:0, width:400, height:300}));
		let viewstore_id  = ForgeExtension.RootActivity.ViewStore.add(view_info);

		this._LinkedControl._SetView(sprite_view);

		return viewstore_id;
	}
}

export {
	JsvSpriteTranslate,
	TranslateControl
};