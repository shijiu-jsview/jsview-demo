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

	constructor(on_start, on_end, on_view_hide) {
		this.OnAnimationStart = on_start;
		this._OnAnimationStart = on_start;
		this.OnAnimationEnd = on_end;
		this._OnAnimationEnd = on_end;
		this.OnViewNoVisible = on_view_hide;
		this._OnViewNoVisible = on_view_hide;
		this._AttachedGroup = null;
		this._InheritListener = [];
	}

	AddInherit(inherit_listener) {
		if (!inherit_listener) {
			return;
		}

		if (this._InheritListener.length === 0) {
			// Init for first inherit
			var _this = this;
			this.OnAnimationStart = function() {
				if (_this._OnAnimationStart) _this._OnAnimationStart();
				for (var i = 0; i < this._InheritListener.length; i++) {
					if (this._InheritListener[i].OnAnimationStart) {
						this._InheritListener[i].OnAnimationStart();
					}
				}
			};
			this.OnAnimationEnd = function(normal_end) {
				if (_this._OnAnimationEnd) _this._OnAnimationEnd(normal_end);
				for (var i = 0; i < this._InheritListener.length; i++) {
					if (this._InheritListener[i].OnAnimationEnd) {
						this._InheritListener[i].OnAnimationEnd(normal_end);
					}
				}
			};
			this.OnViewNoVisible = function() {
				if (_this._OnViewNoVisible) _this._OnViewNoVisible();
				for (var i = 0; i < this._InheritListener.length; i++) {
					if (this._InheritListener[i].OnViewNoVisible) {
						this._InheritListener[i].OnViewNoVisible();
					}
				}
			};
		}

		this._InheritListener.push(inherit_listener);
	};

}
Forge.AnimationListener = AnimationListener;
