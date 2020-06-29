import {animationToStyle, getStaticFrameControl} from "./animation_keyframe"

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

function _BuildTracer(layout_view) {
	let children = layout_view.Element.children;
	let found_tracer = null;
	// 寻找进度跟踪器，以免重复创建，浪费资源
	for (let i = 0; i < children.length; i++) {
		if (children[i].id === "_AnimateProgressTracer") {
			found_tracer = children[i];
			break;
		}
	}

	if (found_tracer == null) {
		// 若在此节点下没有进度跟踪器，则创建一个
		found_tracer = window.originDocument.createElement("div");
		found_tracer.id = "_AnimateProgressTracer";
		layout_view.Element.appendChild(found_tracer);
	}

	return found_tracer;
}

let sIdToken = 0;

class AnimationProgress {
	constructor(layout_view) {
		this._TracerDiv = _BuildTracer(layout_view);
		this._IdToken = (sIdToken++);
		this._KeyFrameName = null;

		if (!this._TracerDiv.hasOwnProperty("_ForgeProgressToken")) {
			this._TracerDiv._ForgeProgressToken = 0;
		}

		// 阻止事件上发到父节点
		this._OnEndListener = ((event) => {
			event.stopPropagation();
		});
	}

	Start(host_animation, starter_progress) {
		// 保证可用的Animation动画
		if (this._KeyFrameName) {
			console.error("Error: Asset!! should Stop before start");
		}
		this._TracerDiv._ForgeProgressToken = (this._TracerDiv._ForgeProgressToken + 1) % 2
		this._KeyFrameName = this._BuildTraceKeyFrame(
				starter_progress,
				this._IdToken,
				this._TracerDiv._ForgeProgressToken);
		this._TracerDiv.style.animation = animationToStyle(host_animation, this._KeyFrameName);

		// TODO: 要支持Android WebView? WebkitAnimationEnd...
		this._TracerDiv.addEventListener("animationend", this._OnEndListener);
	}

	// 停止进度跟进，并返回进度值
	Stop() {
		let progress = this.GetProgress();
		this._TracerDiv.style.animation = null;

		// TODO: 要支持Android WebView? WebkitAnimationEnd...
		this._TracerDiv.removeEventListener("animationend", this._OnEndListener);

		if (this._KeyFrameName) {
			this._RemoveTraceKeyFrame(this._KeyFrameName);
			this._KeyFrameName = null;
		}

		return progress;
	}

	GetProgress() {
		let s = window.getComputedStyle(this._TracerDiv);
		if (s.transform != "none") {
			let trans_values = __parseTransform(s.transform);
			if (trans_values != null) {
				return (trans_values.params[4] / 100); // type is matrix...
			} else {
				console.error("Error:internal error");
				return 0;
			}
		} else {
			// none的场合代表动画结束了
			return 1;
		}
	}

	_BuildTraceKeyFrame(starter_progress/* 0~1 */, token, dynamic_count) {
		let keyframe_name = "_AnimateProgress_" + token + "_" + dynamic_count;
		let keyframe_control = getStaticFrameControl();
		let animate_progress = "@keyframes " + keyframe_name
			+ "{0%{transform:translate3d(" + Math.floor(starter_progress * 100) + ",0,0)}"
			+ "100%{transform:translate3d(100px,0,0)}}";
		keyframe_control.insertRule(animate_progress);
		return keyframe_name;
	}

	_RemoveTraceKeyFrame(name) {
		let keyframe_control = getStaticFrameControl();
		keyframe_control.removeRule(name);
	}
}

export default AnimationProgress;
