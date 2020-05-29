import Forge from "../ForgeDefine"
Forge.AnimationManager = class {
	constructor() {
		this._EndAckAnimationList = [];
		this._StartingAnimationList = [];
		this._CancelingAnimationIdList = [];
		this._SyncInfo = {"EndAck": null, "Start": null, "Cancel": null};
		this._ActiveAnimationList = {};
		this._IdTokenGenerator = 1;
	}

	GenerateIdToken() {
		return this._IdTokenGenerator++;
	}

	CreateBaseSetting(id_token, type_name, duration, easing) {
		var easing_package_data = null;
		if (easing) {
			easing_package_data = easing.Pacakge();
		}

		return {
			"ID": id_token,
			"Nam": type_name, // [Nam]e
			"V_C": 0, // has On[V]iewHide [c]allback
			"Dur": Math.floor(duration), // [Dur]ation
			"E": easing_package_data, // [E]asing
			"En": -1,// [En]able
			"Set": null, // [Set]ting
			"Dly": 0 // [D]e[l]a[y]
		};
	};

	UpdateIdToken(setting_ref, new_id_token) {
		setting_ref["ID"] = new_id_token;
	};

	ScheduleSyncEndAckAnimation(animation_delegate) {
		this._EndAckAnimationList.push(animation_delegate.IdToken);
		Forge.sRenderBridge.RequestSwap();
	};

	ScheduleSyncStartingAnimation(animation_delegate) {
		this._StartingAnimationList.push(animation_delegate);
		Forge.sRenderBridge.RequestSwap();
	};

	ScheduleSyncCancelAnimation(animation_delegate) {
		if (this._ActiveAnimationList["" + animation_delegate.IdToken]) {
			this._CancelingAnimationIdList.push(animation_delegate.IdToken);
			delete this._ActiveAnimationList["" + animation_delegate.IdToken];
			Forge.sRenderBridge.RequestSwap();
		} else {
			for (var i = this._StartingAnimationList.length - 1; i >= 0; i--) {
				if (this._StartingAnimationList[i].IdToken === animation_delegate.IdToken) {
					this._StartingAnimationList.splice(i, 1);
				}
			}
		}
	};
	ProcessViewHideEvents(animate_id_array) {
		var len = animate_id_array.length;
		for (var i = 0; i < len; i++) {
			var animation = this._ActiveAnimationList["" + animate_id_array[i]];
			if (animation) {
				animation.OnViewHide();
			}
		}
	};

	ProcessEndEvents(animate_id_array) {
		var len = animate_id_array.length;
		for (var i = 0; i < len; i++) {
			var animation = this._ActiveAnimationList["" + animate_id_array[i]];
			if (animation) {
				animation.OnEnd();
				delete this._ActiveAnimationList["" + animate_id_array[i]];
			}
		}
	}
}
Forge.sAnimationManager = null;

Forge.AnimationDelegate = class extends Forge.AnimationBase {
	constructor(type_name, duration, easing) {
		super();

		this.IdToken = Forge.sAnimationManager.GenerateIdToken();
		this._SettingInfo = Forge.sAnimationManager.CreateBaseSetting(this.IdToken, type_name, duration, easing);
		this._Enable = -1;//default invalid
		this._AnimationUsed = false; // 标识Animation是否已经被Start过，用于重复使用Animation时的清理标识
	}

	// OVERRIDE
	SetAnimationListener(listener) {
		super.SetAnimationListener(listener);
		if (this.AnimationListenerObj && this.AnimationListenerObj.OnViewNoVisible) {
			this._SettingInfo["V_C"] = 1;
		} else {
			this._SettingInfo["V_C"] = 0;
		}
	};

	EnableDelay(delay) {
		this._SettingInfo["Dly"] = delay;
		return this; // 支持链式操作
	};

	EnableInfinite() {
		this._SettingInfo["Rpt"] = -1; // [R]e[p]ea[t], -1 相当于 无限
		return this; // 支持链式操作
	}

	SetRepeat(times) {
		this._SettingInfo["Rpt"] = times; // [R]e[p]ea[t], -1 相当于 无限
		return this; // 支持链式操作
	}

	SetForceSmooth(to_enable, min_fps_rate) {
		if (isNaN(min_fps_rate)) {
			min_fps_rate = 50;
		}

		if (min_fps_rate < 10 || min_fps_rate > 60) {
			Forge.LogE("Fps rate should be 10 ~ 60");
		}

		if (to_enable) {
			this._SettingInfo["Mfr"] = min_fps_rate;
		} else {
			delete this._SettingInfo["Mfr"];
		}
	};

	// OVERRIDE
	Start(layout_view) {
		if (this._AnimationUsed) {
			Forge.sAnimationManager.ScheduleSyncCancelAnimation(this); // 取消上一个动作，防止一个Animation同时工作于两个View中
			this.IdToken = Forge.sAnimationManager.GenerateIdToken(); // 重新申请ID，以免Render端管理错乱
			Forge.sAnimationManager.UpdateIdToken(this._SettingInfo, this.IdToken);
		}

		Forge.sAnimationManager.ScheduleSyncStartingAnimation(this);
		super.Start(layout_view);

		this._AnimationUsed = true;
	};

	// OVERRIDE
	Cancel(by_other_animation) {
		Forge.sAnimationManager.ScheduleSyncCancelAnimation(this);
		super.Cancel(by_other_animation);
	};

	// OVERRIDE
	OnEnd() {
		if (this._Enable === Forge.AnimationEnable.ReleaseAfterEndCallback) {
			Forge.sAnimationManager.ScheduleSyncEndAckAnimation(this);
		}
		super.OnEnd();
	};

	// hide public
	GetSetting() {
		return this._SettingInfo;
	};

	Clone() {
		var setting_info_clone = JSON.parse(JSON.stringify());
		var new_animation = new Forge.AnimationDelegate("CLONE", 0, null);
		setting_info_clone["ID"] = new_animation._SettingInfo["ID"];
		setting_info_clone["V_C"] = 0;
		new_animation._SettingInfo = setting_info_clone;

		return new_animation;
	};

	Enable(enable) {
		this._SettingInfo["En"] = enable;
		this._Enable = enable;
	};

}

Forge.TranslateAnimation = class extends Forge.AnimationDelegate {
	constructor(start_x, end_x, start_y, end_y, duration, easing) {
		super("TL", duration, easing);

		var settings = {
			"X0": start_x,
			"X1": end_x,
			"Y0": start_y,
			"Y1": end_y,
		};
		this._SettingInfo["Set"] = settings;
	}
}

Forge.FuncAnimation = class extends Forge.AnimationDelegate {

	constructor(formula_string, duration, easing) {
		if (typeof window.JsView !== "undefined" && window.JsView.ForgeNativeRevision >= 67) {
			super("FC2" /* [F]un[c]tion [2] */, duration, easing);
			var settings = {
				"F": formula_string, // [F]unction string
			};
			this._SettingInfo["Set"] = settings;
		} else {
			super("FC", duration, easing);
			this._SettingInfo["Set"] = {
				"X": "0",
				"Y": "0",
				"Z": "0",
			};
		}
	}
};

Forge.MultiFactorAnimation = class extends Forge.AnimationDelegate {
	constructor(purpose, formula_string_array, duration, easing) {
		super("MF" /* [M]ulti [F]actor */ , duration, easing);
		var settings = {
			"FSA": formula_string_array, // [F]ormula [S]tring [A]rray
			"PP": purpose, // [P]ur[p]ose
		};
		this._SettingInfo["Set"] = settings;
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

		var anchor_list = anchor.data;
		var axis_list = axis.data;
		var settings = {
			"SA": start_angle, // [S]tart [a]ngle
			"OA": offset_angle, // [O]ffest [a]ngle
			"AN": anchor_list, // [An]chor list
			"AX": axis_list,    // [Ax]is list
		};
		this._SettingInfo["Set"] = settings;
	}
}

Forge.BasicScaleAnimation = class extends Forge.AnimationDelegate {

	constructor(from_width, from_height, target_width, target_height,
	            anchor_x_percent, anchor_y_percent,
	            duration, easing,
	            base_width, base_height) {
		super("SC" /* [Sc]ale */, duration, easing);
		from_width = Math.round(from_width);
		from_height = Math.round(from_height);
		target_width = Math.round(target_width);
		target_height = Math.round(target_height);
		base_width = base_width ? Math.round(base_width) : target_width;
		base_height = base_height ? Math.round(base_height) : target_height;
		var settings = {
			"SW": from_width, // [S]tart scale [w]idth
			"SH": from_height, // [S]tart scale [h]eight
			"EW": target_width, // [E]nd scale [w]idth
			"EH": target_height, // [E]nd scale [h]eight
			"AX": anchor_x_percent, // [A]nchor [x] percent
			"AY": anchor_y_percent, // [A]nchor [y] percent
			"BW": base_width, // [B]ase [w]idth
			"BH": base_height, // [B]ase [h]eight
		};

		this._SettingInfo["Set"] = settings;
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
		this._StartOpacity = start_opacity;
		this._EndOpacity = end_opacity;
		this._OffsetOpacity = (end_opacity - start_opacity);
		var settings = {
			"SO": start_opacity, // [S]tart [o]pacity
			"EO": end_opacity, // [E]nd [o]pacity
		};
		this._SettingInfo["Set"] = settings;
	}
}

Forge.CssKeyframeAnimation = class extends Forge.AnimationDelegate {
	constructor(keyframes_string, duration, easing,
				width, height) {
		super("CK" /* [C]cs [K]eyframe */, duration, easing);
		this._SettingInfo["Set"] = {
			"Kf": keyframes_string, // [K]ey[f]rames
			"VL": {  // [V]ariable [L]ist
				vw: (!!width ? width : 0), // [V]iew [W]idth
				vh: (!!height ? height : 0), // [V]iew [H]eight
			},
		};
	}
};

Forge.CssTransitionAnimation = class extends Forge.AnimationDelegate {
	constructor(transition) {
		super("CT" /* [C]cs [K]eyframe */, null, null);
		this._SettingInfo["Set"] = {
			"Ts": transition, // [T]ran[s]ition
		};
	}
};

//enum
Forge.AnimationEnable = {
	ReleaseAfterEndCallback: 0
};

// 为了适配老版本APP代码
window["TranslateAnimation"] = Forge.TranslateAnimation;
