import Forge from "../ForgeDefine"
import AnimationProgress from "./animation_progress"
import {getKeyFramesGroup} from "./dynamic_key_frames"

function _ConvertTimingFunc(easing_info) {
	let timing_function = "linear";
	if (easing_info && typeof easing_info.T != "undefined") {
		switch (easing_info.T) {
			case Forge.EasingTypeIn:
				timing_function = "ease-in";
				break;
			case Forge.EasingTypeOut:
				timing_function = "ease-out";
				break;
			case Forge.EasingTypeInOut:
				timing_function = "ease-in-out";
				break;
			case Forge.EasingTypeBezier:
				timing_function = "cubic-bezier(" + easing_info.St.X1 + "," + easing_info.St.Y1 + "," + easing_info.St.X2 + "," + easing_info.St.Y2 + ")";
				break;
			case Forge.EasingTypeSteps:
				timing_function = "steps(" + easing_info.St.S + "," + (easing_info.St.T == 0 ? "start" : "end") + ")";
				break;
			case Forge.EasingTypeBlink:
			case Forge.EasingTypeDeceleration:
			default:
				break;
		}
	}
	return timing_function;
}

let sKeyFrameTokenGenerator = 0;

let sKeyFrameControl = null;
function _GetKeyFrameControl() {
	if (sKeyFrameControl == null) {
		sKeyFrameControl = getKeyFramesGroup();
	}
	return sKeyFrameControl;
}

Forge.AnimationDelegate = class extends Forge.AnimationBase {
	constructor(type_name, duration, easing) {
		super();

		let easing_packed = null;
		if (easing) {
			easing_packed = easing.Pacakge();
		}

		this.typeName = type_name;
		this.duration = duration;
		this.easing = easing_packed;
		this.repeatTimes = 1;
		this.delayedTime = 0;
		this.enableFlags = -1;//default invalid

		this._Progress = null;
	}

	EnableDelay(delay) {
		this.delayedTime = delay;
		return this; // 支持链式操作
	};

	EnableInfinite() {
		this.repeatTimes = -1; // -1 相当于无限
		return this; // 支持链式操作
	}

	SetRepeat(times) {
		this.repeatTimes = times;
		return this; // 支持链式操作
	}

	Enable(enable) {
		this.enableFlags = enable;
		return this; // 支持链式操作
	};
}

Forge.KeyFrameAnimation = class extends Forge.AnimationDelegate {
	constructor(type, duration, easing) {
		super(type, duration, easing);
		this._KeyFrameName = null;

		let that = this;
		this._OnEndEvent = (event) => {
			event.stopPropagation();
			that._PerformAnimationEnd(true);
		}
	}

	Start(layout_view) {
		super.Start(layout_view);
		// Keyframe动画启动时，清理transform，以保证动画行为正确
		layout_view.ResetCssTransform(null, null);
		this._EnableCssAnimation();
	}

	Cancel() {
		super.Cancel();
		this._PerformAnimationEnd(false);
	}

	_EnableCssAnimation() {
		this._KeyFrameName = this._BuildKeyFrame();
		let anim_name = this._KeyFrameName;
		let that = this;
		let repeat = (this.repeatTimes === -1 ? "infinite" : this.repeatTimes);
		let html_element = this._LayoutViewRef.Element;

		let timing_func = "linear";
		if (this.easing) {
			timing_func = _ConvertTimingFunc(this.easing);
		}

		// 创建Progress跟踪器
		if ((this.enableFlags & Forge.AnimationEnable.AckFinalProgress) != 0) {
			this._Progress = new AnimationProgress(this._LayoutViewRef);
			this._Progress.Start(this.duration, timing_func, this.delayedTime, repeat);
		}

		//name duration timing-function delay iteration-count direction;
		let style_anim = anim_name + " " + this.duration / 1000 + "s "
			+ timing_func + " " + this.delayedTime / 1000 + "s "
			+ repeat;
		console.log("StartAnimation style_anim:", style_anim);

		html_element.style.animation = style_anim;
		html_element.addEventListener("animationend", this._OnEndEvent);

		html_element.style.webkitAnimation = style_anim;
		html_element.addEventListener("webkitAnimationEnd", this._OnEndEvent);
	}

	_PerformAnimationEnd(on_end) {
		// 清理OnEndListener监听，否则会重复收到
		this._LayoutViewRef.Element.removeEventListener("animationend", this._OnEndEvent);
		this._LayoutViewRef.Element.removeEventListener("webkitAnimationEnd", this._OnEndEvent);

		if (this._Progress == null) {
			// 无进度跟进需求，直接结束
			if (on_end) {
				this.OnEnd();
			}
			return;
		}

		let progress = this._Progress.Stop();
		if (on_end) {
			// 修正可能产生的进度为0.999的异常数值
			progress = 1;
		}

		if ((this.enableFlags & Forge.AnimationEnable.KeepTransform) != 0) {
			this._DoKeepTransform(progress);
		}

		// 注意: OnEnd处理放在transform制作之后
		if (on_end) {
			this.OnEnd();
		}

		// 进度信息要异步回调，模拟JsView native的场景
		window.setTimeout((()=>{
			this.OnFinalProgress(progress);
		}).bind(this), 0);

		// 回收KeyFrame
		if (this._KeyFrameNeedRecycle()) {
			_GetKeyFrameControl().removeRule(this._KeyFrameName);
		}
		this._KeyFrameName = null;
	}

	// 由子类集成，创建动画对应的keyframe
	_BuildKeyFrame() {
		// Should override
		console.warn("Warning:Should override and return keyframe name");
	}

	// 由子类集成，根据进度信息完成Keep Transform操作
	_DoKeepTransform(progress) {
		// should override
		console.warn("Warning:Should override and keep view transform by ResetCssTransform()")
	}

	// 如果需要释放KeyFrame，重写此方法
	_KeyFrameNeedRecycle() {
		return false;
	}
}

Forge.TranslateAnimation = class extends Forge.KeyFrameAnimation {
	constructor(start_x, end_x, start_y, end_y, duration, easing) {
		super("TL", duration, easing);

		this.startX = start_x;
		this.startY= start_y;
		this.endX = end_x;
		this.endY = end_y;
	}

	// Override
	_BuildKeyFrame() {
		let keyframe_name = "_ForgeAnim_TL_" + (sKeyFrameTokenGenerator++);
		let keyframe_string = "@keyframes " + keyframe_name + " {"
				+ "0%{transform:translate3d(" + this.startX + "px," + this.startY + "px,0);}"
				+ "100%{transform:translate3d(" + this.endX + "px," + this.endY + "px,0);}}";
		_GetKeyFrameControl().insertRule(keyframe_string);
		return keyframe_name;
	}

	// Override
	_DoKeepTransform(progress) {
		let x = Math.floor((this.endX - this.startX) * progress + this.startX);
		let y = Math.floor((this.endY - this.startY) * progress + this.startY);
		let transform = "translate3d(" + x + "px," + y + "px,0)";
		this._LayoutViewRef.ResetCssTransform(transform, null);
	}

	// Override
	_KeyFrameNeedRecycle() {
		return true; // 需要KeyFrame自动释放
	}
}

Forge.FuncAnimation = class extends Forge.AnimationDelegate {

	constructor(formula_string, duration, easing) {
		super("FC2", duration, easing);
		this.formula = formula_string;
		console.warn("NO implemented");
	}
};

Forge.RotateAnimation = class extends Forge.AnimationDelegate {

	constructor(start_angle, offset_angle, anchor, axis, duration, easing) {
		super("RO" /* [Ro]tate */, duration, easing);

		if (!(anchor instanceof Forge.Vec3)) {
			anchor = new Forge.Vec3(anchor);
		}

		if (!(axis instanceof Forge.Vec3)) {
			axis = new Forge.Vec3(axis);
		}

		this.startAngle = start_angle;
		this.offsetAngle = offset_angle;
		this.anchorVec3 = anchor;
		this.axisVec3 = axis;
		console.warn("NO implemented");
	}
}

Forge.BasicScaleAnimation = class extends Forge.AnimationDelegate {

	constructor(from_width, from_height, target_width, target_height,
	            anchor_x_percent, anchor_y_percent,
	            duration, easing,
	            base_width, base_height) {
		super("SC" /* [Sc]ale */, duration, easing);
		console.warn("NO implemented");
	}

}

Forge.ScaleAnimation = class extends Forge.BasicScaleAnimation {
	constructor(start_scale, end_scale, anchor_x_percent, anchor_y_percent, duration, easing) {
		var size = 200;
		var from_width = start_scale * size;
		var from_height = start_scale * size;
		var target_width = end_scale * size;
		var target_height = end_scale * size;

		super(
			from_width, from_height,
			target_width, target_height,
			anchor_x_percent, anchor_y_percent,
			duration, easing,
			200, 200
		);
	}
}

Forge.OpacityAnimation = class extends Forge.AnimationDelegate {

	constructor(start_opacity, end_opacity, duration, easing) {
		super("OP" /* [Op]acity */, duration, easing);
		console.warn("NO implemented");
	}
}

Forge.CssKeyframeAnimation = class extends Forge.KeyFrameAnimation {
	constructor(keyframes_string, duration, easing,
				width, height) {
		super("CK" /* [C]cs [K]eyframe */, duration, easing);
		this._keyFramesSet = keyframes_string;
	}

	// Override
	_BuildKeyFrame() {
		// Keyframe配置，支持设置给LayoutView.Element(div)即可
		let keyframes = this._keyFramesSet;
		if (keyframes.indexOf("@keyframes") < 0 && keyframes.indexOf("@-webkit-keyframes") < 0) {
			console.warn("Warning:keyframes array empty");
			return;
		}
		let keyframes_list = keyframes.split(" ");
		let anim_name = keyframes_list[1];
		if (anim_name.indexOf("{") >= 0) {
			anim_name = anim_name.substr(0, anim_name.indexOf("{"));
		}

		return anim_name;
	}
};

Forge.CssTransitionAnimation = class extends Forge.AnimationDelegate {
	constructor(transition_array) {
		super("CT" /* [C]cs [K]eyframe */, null, null);
		this._transArray = transition_array;
	}

	Start(layout_view) {
		super.Start(layout_view);

		let that = this;
		let transitions = this._transArray;
		let transition_map = {};

		if (transitions.length == 0) {
			console.warn("Warning:transition empty");
			return;
		}

		let transition_str = "";
		for(let i =0; i<transitions.length; i++) {
			let timing_function = "linear";
			let transition = transitions[i];
			if (transition["tf"]) {
				timing_function = _ConvertTimingFunc(transition["tf"]);
			}

			transition_str = transition["name"] + " " + transition["dur"] / 1000 + "s "
				+ timing_function + " "
				+ transition["dly"] / 1000 + "s";
			transition_map[transition["name"]] = transition_str;
		}

		layout_view.ApplyStyleTransition(transition_map);

		if (transition_str) {
			// 注意：仅最后一个Transition动画的AnimationEnd时间被监听
			layout_view.Element.addEventListener("transitionend", (event) => {
				event.stopPropagation();
				that.OnEnd(true);
			});
			layout_view.Element.style.webkitTransition = transitions;
			layout_view.Element.addEventListener("webkitTransitionEnd", (event) => {
				event.stopPropagation();
				that.OnEnd(true);
			});
		}
	}
};

//enum
Forge.AnimationEnable = {
	ReleaseAfterEndCallback: 1, // 0000 0000 0001
	KeepTransform: 2, // 0000 0000 0010
	AckFinalProgress: 4, // 0000 0000 0000 0100
};
