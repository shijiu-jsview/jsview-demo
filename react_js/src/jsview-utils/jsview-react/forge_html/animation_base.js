import Forge from "../ForgeDefine"
Forge.AnimationEnable = {ReleaseAfterEndCallback:0};

class AnimationBase {
	constructor() {
		this.IdToken = 0;
		this._AttachedGroup = null;
		this.AnimationListenerObj = null;
		this._AnimationClose = false;
		this._LayoutViewRef = null;
		this._IsTextureAnim = false;
	}

	SetAnimationListener(listener) {
		this.AnimationListenerObj = listener;
	};

	AddAnimationListener(listener) {
		if (this.AnimationListenerObj) {
			listener.AddInherit(this.AnimationListenerObj);
		}
		this.SetAnimationListener(listener);
	};

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
				cancel_whole_group = (by_other_animation._AttachedGroup !== this._AttachedGroup);
			}

			if (cancel_whole_group) {
				this._AttachedGroup.CancelFromInternalAnimation(this);
				this._AttachedGroup = null;
			}
		}
	};

	RemoveFromGroup() {
		this._AttachedGroup = null;
	};

	// hide public
	AsTextureAnimation() {
		this._IsTextureAnim = true;
	}

	Start(layout_view) {
		this._LayoutViewRef = layout_view;
		if (layout_view && !this._IsTextureAnim) {
			// Reset tranform matrix of layout view
			layout_view.ClearAnimation();
		}

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
	OnEnd() {
		if (this._LayoutViewRef) {
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
	OnViewHide() {
		var listener = this.AnimationListenerObj;
		if (listener && listener.OnViewNoVisible) {
			listener.OnViewNoVisible();
		}
	};

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
		this._AttachedGroup = null;
		this._InheritListener = [];
	}

	OnStart(on_start) {
		this.OnAnimationStart = this._OnAnimationStart = on_start;
		return this;
	}

	OnEnd(on_end) {
		this.OnAnimationEnd = this._OnAnimationEnd = on_end;
		return this;
	}

	OnFinalProgress(on_final) {
		this.OnAnimFinal = this._OnAnimFinal = on_final;
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
				for (var i = 0; i < this._InheritListener.length; i++) {
					if (this._InheritListener[i].OnAnimationStart) {
						this._InheritListener[i].OnAnimationStart();
					}
				}
			};
			this.OnAnimationEnd = function(normal_end) {
				if (that._OnAnimationEnd) that._OnAnimationEnd(normal_end);
				for (var i = 0; i < this._InheritListener.length; i++) {
					if (this._InheritListener[i].OnAnimationEnd) {
						this._InheritListener[i].OnAnimationEnd(normal_end);
					}
				}
			};
			this.OnViewNoVisible = function() {
				if (that._OnViewNoVisible) that._OnViewNoVisible();
				for (var i = 0; i < this._InheritListener.length; i++) {
					if (this._InheritListener[i].OnViewNoVisible) {
						this._InheritListener[i].OnViewNoVisible();
					}
				}
			};
			this.OnAnimFinal = function() {
				if (that._OnAnimFinal) that._OnAnimFinal();
				for (var i = 0; i < this._InheritListener.length; i++) {
					if (this._InheritListener[i].OnAnimFinal) {
						this._InheritListener[i].OnAnimFinal();
					}
				}
			};
		}

		this._InheritListener.push(inherit_listener);
	};
}
Forge.AnimationListener = AnimationListener;
