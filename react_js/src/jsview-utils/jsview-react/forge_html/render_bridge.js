import Forge from "../ForgeDefine";

class RenderBridge {
  constructor() {
    this._ScreenInfo = {
      width: 160,
      height: 90,
      x: 2 / 160,
      y: 2 / 90,
      perspective: 2 / 160,
      scaleRatio: 1.0 /* display scale ratio */,
      designedWidth: 1280 /* designed map width */
    };

    this._FrameLoopFunc = null;
    this._CallbacksPerFrame = new Set();

    this._WillSwapCallbacks = new Map();
    this._DoWillSwapCallback = this._OnWillSwap.bind(this); // 提前声明WillSwapCallback函数对象，提高调用速度
  }

  BeginHtmlFrameLoop() {
    if (this._FrameLoopFunc !== null) {
      // Already started
      return;
    }

    if (window.requestAnimationFrame) {
      this._FrameLoopFunc = this._OnAnimation.bind(this);
      window.requestAnimationFrame(this._FrameLoopFunc);
    }
  }

  _OnAnimation() {
    let keep_loop = false;

    // 碰撞检测
    if (Forge.sElementImpactSensorManager.HasTrace()) {
      Forge.sElementImpactSensorManager.TestCollision();

      // Check if need continue frame loop
      if (Forge.sElementImpactSensorManager.HasTrace()) {
        keep_loop = true;
      }
    }

    // 进度Repeat检测
    if (this._CallbacksPerFrame.size > 0) {
      for (const callback of this._CallbacksPerFrame) {
        callback();
      }
      // 再次检测，因为可能在callback中触发了队列个数变化
      if (this._CallbacksPerFrame.size > 0) {
        keep_loop = true;
      }
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
    if (Number.isNaN(display_scale_ratio)) {
      display_scale_ratio = 1.0;
    }
    if (Number.isNaN(designed_map_width)) {
      designed_map_width = 1280;
    }
    const buffer_width = designed_map_width * display_scale_ratio;
    const buffer_height = buffer_width / 16 * 9;
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
      Promise.resolve().then(this._DoRequestSwap.bind(this));
    }
  }

  SetGlobalConfig(json) {}

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
      this._DoRequestSwap(false);
    }
  }

  _OnWillSwap(callback) {
    callback();
  }

  RegisterPerFrameCallback(callback) {
    this._CallbacksPerFrame.add(callback);
  }

  UnregisterPerFrameCallback(callback) {
    this._CallbacksPerFrame.delete(callback);
  }
}
Forge.RenderBridge = RenderBridge;
Forge.sRenderBridge = new Forge.RenderBridge();
