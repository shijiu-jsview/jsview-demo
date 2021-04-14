/**
 * Created by ludl on 6/11/20.
 */
import Forge from "../ForgeDefine";
import { animationToStyle, getStaticFrameControl } from "./animation_keyframe";

let sKeyFrameTokenGenerator = 0;

class StepsAnimation extends Forge.AnimationDelegate {
  constructor(type_name, duration) {
    super(type_name, duration, null); // Easing 只支持linear形式
    this._StepsCount = 1;
    this._Running = false; // 记录动画是否被Cancel
    this._NextStepIndex = 0; // 记录动画运行的进度

    const that = this;
    this._OnStepEnd = () => {
      that._NextStep();
    };
  }

  SetStepsCount(steps_count) {
    this._StepsCount = steps_count;
    this._SplitSteps();
  }

  Start(layout_view) {
    super.Start(layout_view);

    // 激活步骤进度监听处理
    if (!window.jsvInAndroidWebView) {
      this._LayoutViewRef.Element.addEventListener("animationend", this._OnStepEnd);
    } else {
      this._LayoutViewRef.Element.addEventListener("webkitAnimationEnd", this._OnStepEnd);
    }

    // 开始动画
    this._Running = true;
    this._NextStep();
  }

  Cancel() {
    // 仅调整状态，在当前步骤的动画完成后，会进入停止处理
    this._Running = false;
  }

  _NextStep() {
    // 回收KeyFrame
    if (this._KeyFrameName !== null) {
      getStaticFrameControl().removeRule(this._KeyFrameName);
      this._KeyFrameName = null;
    }

    // 校验动画是否停止
    const on_end = (this._NextStepIndex === this._StepsCount);
    if (!this._Running || on_end) {
      // 动画结束
      this._PerformAnimationEnd(on_end);
      return;
    }

    // 描画下一步动画
    const animation = this._CreateOneStepKeyFrame(this._NextStepIndex);
    this._KeyFrameName = animation.name;
    getStaticFrameControl().insertRule(animation.keyFrameString);

    const style_animation = animationToStyle({
      repeatTimes: this.repeatTimes,
      easing: this.easing,
      delayedTime: 0,
      duration: this.duration / this._StepsCount
    }, this._KeyFrameName);
    const html_element = this._LayoutViewRef.Element;

    if (!window.jsvInAndroidWebView) {
      html_element.style.animation = style_animation;
    } else {
      html_element.style.webkitAnimation = style_animation;
    }

    this._NextStepIndex++;
  }

  _PerformAnimationEnd(on_end) {
    // 清理OnEndListener监听，否则会重复收到
    if (!window.jsvInAndroidWebView) {
      this._LayoutViewRef.Element.removeEventListener("animationend", this._OnStepEnd);
    } else {
      this._LayoutViewRef.Element.removeEventListener("webkitAnimationEnd", this._OnStepEnd);
    }

    const progress = this._NextStepIndex / this._StepsCount;

    if ((this.enableFlags & Forge.AnimationEnable.KeepTransform) !== 0) {
      const frozen_transform = this._GetFrozenTransform(this._NextStepIndex - 1);
      this._LayoutViewRef.ResetCssTransform(
        frozen_transform.transform,
        frozen_transform.transformOrigin);
    }

    // 注意: OnEnd处理放在transform制作之后
    if (on_end) {
      this.OnEnd();
    }

    // 进度信息要异步回调，模拟JsView native的场景
    window.setTimeout((() => {
      this.OnFinalProgress(progress);
    }), 0);
  }

  _GetFrozenTransform(current_index) {
    // should override
    console.warn("Warning:Should override and keep view transform by ResetCssTransform()");
  }

  _SplitSteps() {
    // should override
    console.warn("Warning: should be override by child class");
  }

  _CreateOneStepKeyFrame(next_step_index) {
    // should override
    console.warn("Warning: should be override by child class");
  }
}

Forge.TranslateStepAnimation = class extends StepsAnimation {
  constructor(start_x, end_x, start_y, end_y, duration) {
    super("TL-S", duration);

    this.startX = start_x;
    this.startY = start_y;
    this.endX = end_x;
    this.endY = end_y;
    this._StepsArray = null;
  }

  // Override
  _SplitSteps() {
    const steps_count = this._StepsCount;
    const x_step_distance = (this.endX - this.startX) / steps_count;
    const y_step_distance = (this.endY - this.startY) / steps_count;
    this._StepsArray = new Array(steps_count);
    let x = this.startX;
    let y = this.startY;
    for (let i = 0; i < steps_count - 1; i++) {
      x += x_step_distance;
      y += y_step_distance;
      this._StepsArray[i] = {
        targetX: Math.floor(x),
        targetY: Math.floor(y),
      };
    }
    // 最后一项
    this._StepsArray[steps_count - 1] = {
      targetX: this.endX,
      targetY: this.endY,
    };
  }

  // Override
  _CreateOneStepKeyFrame(next_step_index) {
    // 计算动画起始位置
    let start_x = 0;
    let start_y = 0;
    if (next_step_index === 0) {
      start_x = this.startX;
      start_y = this.startY;
    } else {
      start_x = this._StepsArray[next_step_index - 1].targetX;
      start_y = this._StepsArray[next_step_index - 1].targetY;
    }

    // 计算动画结束位置
    const end_x = this._StepsArray[next_step_index].targetX;
    const end_y = this._StepsArray[next_step_index].targetY;

    const keyframe_name = `_ForgeStepAnim_TL_${sKeyFrameTokenGenerator++}`;
    const keyframe_string = `@keyframes ${keyframe_name} {
      0%{transform:translate3d(${start_x}px,${start_y}px,0);}
      100%{transform:translate3d(${end_x}px,${end_y}px,0);}}`;
    return { name: keyframe_name, keyFrameString: keyframe_string };
  }

  // Override
  _GetFrozenTransform(current_index) {
    const transform = `translate3d(${this._StepsArray[current_index].targetX}px,${this._StepsArray[current_index].targetY}px,0)`;
    return { transform, transformOrigin: null };
  }
};
