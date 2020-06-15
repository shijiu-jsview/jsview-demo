/**
 * Created by ludl on 6/11/20.
 */
// 工具类，用于将Animation配置转换成KeyFrame
import Forge from "../ForgeDefine"
import {getKeyFramesGroup} from "./dynamic_key_frames"

let sKeyFrameControl = null;
function getStaticFrameControl() {
	if (sKeyFrameControl == null) {
		sKeyFrameControl = getKeyFramesGroup();
	}
	return sKeyFrameControl;
}

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

// 将Forge.AnimationDelegate信息转化成style.animation的填写内容
function animationToStyle(animation_ref, keyframe_name) {
	let repeat = (animation_ref.repeatTimes === -1 ? "infinite" : animation_ref.repeatTimes);
	let timing_func = "linear";
	if (animation_ref.easing) {
		timing_func = _ConvertTimingFunc(animation_ref.easing);
	}

	let style_animation = keyframe_name + " " + animation_ref.duration / 1000 + "s "
		+ timing_func + " " + animation_ref.delayedTime / 1000 + "s "
		+ repeat;
	console.log("animationToStyle style_anim:", style_animation);

	return style_animation;
}

export {
	getStaticFrameControl,
	animationToStyle,
	_ConvertTimingFunc as convertTimingFunc,
}