import Forge from "../ForgeDefine"

let sIdTokenGenerator = 0;

class AnimationBase {
	constructor() {
		this.IdToken = sIdTokenGenerator++;
		this._AttachedGroup = null;
		this.AnimationListenerObj = null;
		this._AnimationClose = false;
		this._LayoutViewRef = null;
		this._IsTextureAnim = false;
	}

	/**
	 * 设置动画起始/结束的监听回调
	 *
	 * @public
	 * @func SetAnimationListener
	 * @memberof Forge.AnimationBase
	 * @instance
	 * @param {Forge.AnimationListener} listener    动画起始/结束的监听回调
	 **/
	SetAnimationListener(listener) {
		this.AnimationListenerObj = listener;
		this.OnNewListener(listener);
	};

	/**
	 * 追加动画起始/结束的监听回调
	 *
	 * @public
	 * @func AddAnimationListener
	 * @memberof Forge.AnimationBase
	 * @instance
	 * @param {Forge.AnimationListener} listener    动画起始/结束的监听回调
	 **/
	AddAnimationListener(listener) {
		if (this.AnimationListenerObj) {
			listener.AddInherit(this.AnimationListenerObj);
		}

		this.AnimationListenerObj = listener;
		this.OnNewListener(listener);
	};

	OnNewListener(listener) {
		// Can override if needed
	}

	/**
	 * 获得当前动画的启动/结束监听接口
	 *
	 * @public
	 * @func GetAnimationListener
	 * @memberof Forge.AnimationBase
	 * @instance
	 * @return {Forge.AnimationListener} 动画起始/结束的监听回调
	 **/
	GetAnimationListener() {
		return this.AnimationListenerObj;
	};

	// public from customer
	Cancel(by_other_animation) {
		if (this._LayoutViewRef) {
			this._LayoutViewRef.DetachAnimation(this);
		}
		var listener = this.AnimationListenerObj;
		if (listener && listener.OnAnimationEnd && !this._AnimationClose) {
			this._AnimationClose  = true;
			listener.OnAnimationEnd(false);
		}

		if (this._AttachedGroup) {
			var cancel_whole_group = true;
			if (by_other_animation) {
				cancel_whole_group = (by_other_animation._AttachedGroup != this._AttachedGroup);
			}

			if (cancel_whole_group) {
				this._AttachedGroup.CancelFromInternalAnimation(this);
				this._AttachedGroup = null;
			}
		}
	};

	/**
	 * 将当前动画加入动画组
	 * hide public
	 *
	 * @func AttachToGroup
	 * @memberof Forge.AnimationBase
	 * @instance
	 * @param {Forge.AnimationGroup} group	要加入的动画组
	 **/
	AttachToGroup(group) {
		if (this._AttachedGroup != null) {
			Forge.ThrowError("ERROR: In TransformAnimation.AttachToGroup(), animation already attached to other group");
		}
		this._AttachedGroup = group;
	};

	/**
	 * 从动画组脱离
	 * hide public
	 *
	 * @func RemoveFromGroup
	 * @memberof Forge.AnimationBase
	 * @instance
	 **/
	RemoveFromGroup() {
		this._AttachedGroup = null;
	};

	// hide public
	AsTextureAnimation() {
		this._IsTextureAnim = true;
	}

	Start(layout_view) {
		this._LayoutViewRef = layout_view;
	};

	SetCannotDisable(can_disable) {

	};

	// hide public
	OnStart() {
		var listener = this.AnimationListenerObj;
		if (listener && listener.OnAnimationStart) {
			listener.OnAnimationStart();
		}
	};

	// hide public
	OnEnd(keep_animation) {
		if (this._LayoutViewRef && !keep_animation) {
			this._LayoutViewRef.DetachAnimation(this);
			this._LayoutViewRef = null;
		}

		var listener = this.AnimationListenerObj;
		if (listener && listener.OnAnimationEnd && !this._AnimationClose) {
			this._AnimationClose  = true;
			listener.OnAnimationEnd(true);
		}
	};

	// hide public
	OnRepeatEvent() {
		var listener = this.AnimationListenerObj;
		if (listener && listener.OnAnimRepeat) {
			listener.OnAnimRepeat();
		}
	}

	// hide public
	OnViewHide() {
		var listener = this.AnimationListenerObj;
		if (listener && listener.OnViewNoVisible) {
			listener.OnViewNoVisible();
		}
	};

	// hide public
	OnFinalProgress(progress) {
		var listener = this.AnimationListenerObj;
		if (listener && listener.OnAnimFinal) {
			listener.OnAnimFinal(progress);
		}
	};

	OnAnimAdvance(progress) {
		var listener = this.AnimationListenerObj;
		if (listener && listener.OnAnimAdvance) {
			listener.OnAnimAdvance(progress);
		}
	}
}
Forge.AnimationBase = AnimationBase;

class AnimationListener {
	/**
	 * 监听动画启动和结束时间的接口
	 *
	 * @public
	 * @constructor Forge.AnimationListener
	 * @author donglin donglin.lu@qcast.cn
	 * @param {function} on_start   监听动画启动事件（无参数）
	 * @param {function} on_end     监听动画结束事件（无参数）
	 * @param {function} on_view_hide    当更新过程中检测到动画对应的View已经不可见的回调<br>
	 *                                   需要和LayoutView.OnDrawResumed(callback)配合使用<br>
	 *     								 参数(LayoutView：对象View, TransformAnimation：监听的动画句柄)
	 **/
	constructor(on_start, on_end, on_view_hide) {
		this.OnAnimationStart = on_start;
		this._OnAnimationStart = on_start;
		this.OnAnimationEnd = on_end;
		this._OnAnimationEnd = on_end;
		this.OnViewNoVisible = on_view_hide;
		this._OnViewNoVisible = on_view_hide;
		this.OnAnimFinal = null;
		this._OnAnimFinal = null;
		this.OnAnimRepeat = null;
		this._OnAnimRepeat = null;
		this._AttachedGroup = null;
		this._InheritListener = [];
		this._OnAnimAdvance = null;
		this.OnAnimAdvance = null;
	}

	OnStart(on_start) {
		this.OnAnimationStart = this._OnAnimationStart = on_start;
		return this;
	}

	OnEnd(on_end) {
		this.OnAnimationEnd = this._OnAnimationEnd = on_end;
		return this;
	}

	OnAdvance(on_advance) {
		this.OnAnimAdvance = this._OnAnimAdvance = on_advance;
		return this;
	}

	OnFinalProgress(on_final) {
		this.OnAnimFinal = this._OnAnimFinal = on_final;
		return this;
	}

	OnRepeat(on_repeat) {
		this.OnAnimRepeat = this._OnAnimRepeat = on_repeat;
		return this;
	}

	/**
	 * 添加继承的监听者，当本监听接口被调用后，会继续调用继承者的监听接口
	 *
	 * @public
	 * @param {Forge.AnimationListener} inherit_listener   继承的监听者
	 **/
	AddInherit(inherit_listener) {
		if (!inherit_listener) {
			return;
		}

		if (this._InheritListener.length == 0) {
			// Init for first inherit
			var that = this;
			this.OnAnimationStart = function() {
				if (that._OnAnimationStart) that._OnAnimationStart();
				for (var i = 0; i < that._InheritListener.length; i++) {
					if (that._InheritListener[i].OnAnimationStart) {
						that._InheritListener[i].OnAnimationStart();
					}
				}
			};
			this.OnAnimationEnd = function(normal_end) {
				if (that._OnAnimationEnd) that._OnAnimationEnd(normal_end);
				for (var i = 0; i < that._InheritListener.length; i++) {
					if (that._InheritListener[i].OnAnimationEnd) {
						that._InheritListener[i].OnAnimationEnd(normal_end);
					}
				}
			};
			this.OnViewNoVisible = function() {
				if (that._OnViewNoVisible) that._OnViewNoVisible();
				for (var i = 0; i < that._InheritListener.length; i++) {
					if (that._InheritListener[i].OnViewNoVisible) {
						that._InheritListener[i].OnViewNoVisible();
					}
				}
			};
			this.OnAnimFinal = function(progress) {
				if (that._OnAnimFinal) that._OnAnimFinal(progress);
				for (var i = 0; i < that._InheritListener.length; i++) {
					if (that._InheritListener[i].OnAnimFinal) {
						that._InheritListener[i].OnAnimFinal(progress);
					}
				}
			};
			this.OnAnimRepeat = function() {
				if (that._OnAnimRepeat) that._OnAnimRepeat();
				for (var i = 0; i < that._InheritListener.length; i++) {
					if (that._InheritListener[i].OnAnimRepeat) {
						that._InheritListener[i].OnAnimRepeat();
					}
				}
			};

			this.OnAnimAdvance = function() {
				if (that._OnAnimAdvance) that._OnAnimAdvance();
				for (var i = 0; i < that._InheritListener.length; i++) {
					if (that._InheritListener[i].OnAnimAdvance) {
						that._InheritListener[i].OnAnimAdvance();
					}
				}
			};
		}

		this._InheritListener.push(inherit_listener);
	};
}
Forge.AnimationListener = AnimationListener;
