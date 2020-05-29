import Forge from "../ForgeDefine"

class RenderBridge {
	constructor() {
		this._ScreenInfo = {
			width: 160, height: 90,
			x: 2 / 160, y: 2 / 90,
			perspective: 2 / 160,
			scaleRatio: 1.0 /* display scale ratio */,
			designedWidth: 1280 /* designed map width */
        };

        this._FrameLoopFunc = null;

		this._WillSwapCallbacks = new Map();
		this._DoWillSwapCallback = this._OnWillSwap.bind(this); // 提前声明WillSwapCallback函数对象，提高调用速度
    }

    BeginHtmlFrameLoop() {
    	if (this._FrameLoopFunc != null) {
    		// Already started
    		return;
	    }

	    if (window.requestAnimationFrame) {
		    this._FrameLoopFunc = this._OnAnimation.bind(this);
		    window.requestAnimationFrame(this._FrameLoopFunc);
	    }
    }

    _OnAnimation() {
        Forge.sImpactSensorManager.TestCollision();

	    // Check if need continue frame loop
	    let keep_loop = false;
	    if (Forge.sImpactSensorManager.HasTrace()) {
		    keep_loop = true;
	    }

	    if (keep_loop) {
		    window.requestAnimationFrame(this._FrameLoopFunc);
	    } else {
		    this._FrameLoopFunc = null;
	    }
    }
    
	GetScreenInfo() {
		return this._ScreenInfo;
	}

	InitScreenBuffer(display_scale_ratio, designed_map_width) {
		if (isNaN(display_scale_ratio)) {
			display_scale_ratio = 1.0;
		}
		if (isNaN(designed_map_width)) {
			designed_map_width = 1280;
		}
		var buffer_width = designed_map_width * display_scale_ratio;
		var buffer_height = buffer_width / 16 * 9;
		this._ScreenInfo.width = Math.floor(buffer_width);
		this._ScreenInfo.height = Math.floor(buffer_height);
		this._ScreenInfo.x = 2.0 / this._ScreenInfo.width;
		this._ScreenInfo.y = 2.0 / this._ScreenInfo.height;
		this._ScreenInfo.perspective = this._ScreenInfo.x;
		this._ScreenInfo.scaleRatio = display_scale_ratio;
		this._ScreenInfo.designedWidth = designed_map_width;
	}

	RequestSwap() {
        if (!this._OnRequesting) {
            this._OnRequesting = true;
            this._SwapTimer = Forge.PersistTimer.setTimeout(this._DoRequestSwap.bind(this), 0);
        }
	}

	AddWillSwapListener(alias, callback) {
		this._WillSwapCallbacks.set(alias, callback);
	}

	_DoRequestSwap() {
		if (this._WillSwapCallbacks.size > 0) {
			this._WillSwapCallbacks.forEach(this._DoWillSwapCallback);
		}
        this._OnRequesting = false;
	}

	InstantPerformSwap() {
        if (this._OnRequesting) {
            this._OnRequesting = false;
            if (this._SwapTimer > 0) {
                Forge.PersistTimer.clearTimeout(this._SwapTimer);
                this._SwapTimer = -1;
            }
            this._DoRequestSwap(false);
        }
	}

	_OnWillSwap(callback) {
		callback();
	}
}
Forge.RenderBridge = RenderBridge;
Forge.sRenderBridge = new Forge.RenderBridge();
Forge.sAnimationManager = new Forge.AnimationManager();