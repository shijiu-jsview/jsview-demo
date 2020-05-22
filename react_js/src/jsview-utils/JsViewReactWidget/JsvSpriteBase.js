import React from 'react';
import {Forge, ForgeExtension} from "../jsview-react/index_widget.js"

// JsvSpriteBase comes from JsView React Project

class JsvControl {
	constructor(params_count) {
		this._Current = new Array(params_count).fill(0);
		this._Target = new Array(params_count).fill(0);
		this._RepeatStart = new Array(params_count).fill(0);
		this._JumpTarget = null;
		this._Jumping = false;
		this._ParameterCount = params_count;
		this._StateIndex = 0; // 0: idle, 1:running
		this._StateLocked = false;
		this._StartSwitcher = false;
		this._PausedCallback = null;
		this._EndCallback = null;
		this._Token = 0;
		this._Repeat = false;
		this._SpriteView = null;
	}

	setRepeat(enable) {
        this._Repeat = enable;
        return this;
	}

	start(end_callback) {
		this._EndCallback = end_callback;
		this._StartSwitcher = true;
		this._Jumping = false;
		this._StateMachineNext();
	}

	pause(paused_callback) {
		// 执行pause动作时，相当于取消start()动作，所以EndCallback同时也应该被取消
		if (this._EndCallback != null) {
			this._EndCallback = null;
		}

		// 根据当前状态，已经处于Pause则直接回调，否则发送pause指令
		if (this._StateIndex == 0) {
			if (paused_callback) {
				this._CallbackWithCatch(this._Current, paused_callback);
			}
		} else {
			if (paused_callback) {
				this._PausedCallback = paused_callback;
			}
			this._StateMachineNext();
		}
	}

	jump() {
		this._JumpTarget = [...this._Target];
		this._Jumping = true;
		this._StartSwitcher = true;
		this._StateMachineNext();
	}

	_WrapBuildAnimation(repeat_start_array, current_array, tos_array, act_jump) {
		console.warn("Should Override");
	}

	_WrapCallback(currents, callback) {
		console.warn("Should Override");
	}

	_CallbackWithCatch(currents, callback) {
		try {
			this._WrapCallback(currents, callback);
		} catch(e) {
			console.error("Error:in callback");
			console.error(e);
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
		}
	}

	_StartAnimation() {
		let froms = (this._JumpTarget ? [...this._JumpTarget] : [...this._Current]);
		let tos = this._Target;
		let repeat_starts = (this._Repeat ? [...this._RepeatStart] : null);

		let token = this._Token++;

		let anim = this._WrapBuildAnimation(repeat_starts, froms, tos, this._Jumping);

		// clear jump status
		this._JumpTarget = null;
		this._Jumping = false;

		if (anim == null) {
			return;
		}

		// 生成OnFinalProgress处理监听，memo在 _WrapBuildAnimation()处理后生成，因为build处理中可能改变tos
		let memo_tos = [...tos];
		let that = this;
		let listener = (new Forge.AnimationListener())
			.OnFinalProgress((progress)=>{
				that._OnPaused((repeat_starts != null ? repeat_starts : froms), memo_tos, progress);
			});

		anim.AddAnimationListener(listener);
		anim.Enable(Forge.AnimationEnable.AckFinalProgress | Forge.AnimationEnable.KeepTransform);
		if(this._Repeat) {
            anim.EnableInfinite();
		}
		this._SpriteView.StartAnimation(anim);

		return true; // success
	}

	_StopAnimation() {
		this._SpriteView.StopAnimation();
	}

	_OnPaused(froms, tos, progress) {
		for (let i = 0; i < this._ParameterCount; i++) {
			this._Current[i] = Math.floor((tos[i] - froms[i]) * progress + froms[i]);
		}

		this._StateLocked = true;
		// 换出callbacks，回调时可能加入新的callbacks
		let paused_callback = this._PausedCallback;
		let ended_callback = this._EndCallback;
		this._PausedCallback = null;

		// 回调所有callback
		if (paused_callback) {
			// Paused callback
			this._CallbackWithCatch(this._Current, paused_callback);
		}
		if (ended_callback && progress == 1) {
			// Ended callback
			this._EndCallback = null;
			this._CallbackWithCatch(this._Current, ended_callback);
		}

		this._StateLocked = false;

		this._StateIndex = 0; // mark idle
		let that = this;
		that._StateMachineNext(); // Trigger next start
	}

	_SetView(jsv_view) {
		this._SpriteView = jsv_view;
	}
}

class HtmlControl {
	constructor(params_count) {
        this._Current = new Array(params_count).fill(0);
        this._Target = new Array(params_count).fill(0);
		this._RepeatStart = new Array(params_count).fill(0);
        this._ParameterCount = params_count;
        this._SpriteDiv = null;
        this._PausedCallback = null;
		this._EndCallback = null;
        this._Repeat = false;
	}

	setRepeat(enable) {
        this._Repeat = enable;
        return this;
    }

	start(end_callback) {
        this._EndCallback = end_callback;
		this._SpriteDiv.style.animation = null;
		this._SpriteDiv.style.transform = null;
		this._SpriteDiv.onanimationend = null;

		let animation;
		let built_obj = this._WrapBuildAnimation(null, this._Current, this._Target, false);
		if (built_obj == null) {
			// Discarded animation
			animation = null;
		} else {
			animation = built_obj.getDescribe();
		}
        console.log("start animation:" + animation);

		if (this._Repeat) {
			let start_repeat = () => {
				// Start repeat animation
				let animation_repeat =
					((this._WrapBuildAnimation(null, this._RepeatStart, this._Target, false))
						.getDescribe()) + " infinite";
				console.log("start animation(repeat):" + animation_repeat);
				this._SpriteDiv.style.animation = animation_repeat;
			};
			if (animation != null) {
				// 完成前序动画后，到达repeat基点后，再开始repeat动画
				this._SpriteDiv.onanimationend = start_repeat;
			} else {
				// 无前序，可以直接进行repeat动画
				start_repeat();
			}
		} else {
			this._SpriteDiv.onanimationend = () => {
				for (let idx = 0; idx < this._ParameterCount; idx++ ) {
					this._Current[idx] = this._Target[idx];
				}
				this._SpriteDiv.style.animation = null;
				this._SpriteDiv.style.transform = this._GetTransform(this._Current);
				this._SpriteDiv.onanimationend = null;
				let callback = this._EndCallback;
				this._EndCallback = null;
				this._WrapCallback(this._Current, callback);
			};
		}

		this._SpriteDiv.style.animation = animation;

		return this;
	}

	pause(paused_callback) {
        this._Current = this._GetCurrentValue();
        this._SpriteDiv.style.animation = null;
        this._SpriteDiv.style.transform = this._GetTransform(this._Current);
        this._SpriteDiv.onanimationend = null;
        this._WrapCallback(this._Current, paused_callback);
		return this;
    }

    jump() {
        this._Current = [...this._Target];
        this._SpriteDiv.style.animation = null;
        this._SpriteDiv.style.transform = this._GetTransform(this._Target);
        this._SpriteDiv.onanimationend = null;
		return this;
	}

    _GetTransform(value_list) {
        console.warn("Should Override");
    }

    _GetCurrentValue() {
        console.warn("Should Override");
    }

    _WrapBuildAnimation(repeat_start_array, current_array, tos_array, act_jump) {
        console.warn("Should Override");
    }

    _WrapCallback(currents, callback) {
		console.warn("Should Override");
    }
    
    _SetView(sprite_div) {
        this._SpriteDiv = sprite_div;
    }
}

var SpriteControlBase = window.JsView ? JsvControl : HtmlControl;

class JsvSpriteBase extends React.Component{
	/**
	 * @description: 属性说明
	 * @param {SpriteControlBase} Sprite动作控制器 必需
	 */
	constructor(props) {
		super(props);
		this._LinkedControl = props.control;

		// Props for JsView
		this._JsvViewStoreId = -1;

		// 校验合法性
		if (!this._LinkedControl || !(this._LinkedControl instanceof SpriteControlBase)) {
			console.error("Error: Need set Control!");
		}
	}

	render() {
		if (window.JsView) {
			return this._RenderInJsView();
		} else {
			// TODO: 要补充html运行状态
			return this._RenderInHtmlView();
		}
	}

	componentWillUnmount() {
		// 清理ViewStore对LayoutView的引用
		if (this._JsvViewStoreId != -1) {
			ForgeExtension.RootActivity.ViewStore.remove(this._JsvViewStoreId);
			this._JsvViewStoreId = -1;
		}
    }
    
    _RenderInHtmlView() {
        let {control, ...other_prop} = this.props;
        return (
            <div ref={(ele) => {if (ele) this._LinkedControl._SetView(ele.jsvMainView.Element)}} {...other_prop} />
        )
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
		let sprite_view = new Forge.LayoutView();
		let view_info = new Forge.ViewInfo(sprite_view);
		let viewstore_id  = ForgeExtension.RootActivity.ViewStore.add(view_info);

		this._LinkedControl._SetView(sprite_view);

		return viewstore_id;
	}
}

export {
	JsvSpriteBase,
	SpriteControlBase
};
