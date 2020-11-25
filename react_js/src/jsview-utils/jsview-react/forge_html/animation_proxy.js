import Forge from "../ForgeDefine";
import { AnimationProgress, AnimationGroupProgress } from "./animation_progress";
import { convertTimingFunc, animationToStyle, getStaticFrameControl } from "./animation_keyframe";

let sKeyFrameTokenGenerator = 0;

Forge.AnimationDelegate = class extends Forge.AnimationBase {
  constructor(type_name, duration, easing) {
    super();

    let easing_packed = null;
    if (easing) {
      easing_packed = easing.Package();
    }

    this.typeName = type_name;
    this.duration = duration;
    this.easing = easing_packed;
    this.repeatTimes = 1;
    this.delayedTime = 0;
    this.enableFlags = -1;// default invalid
    this.enableStartPos = 0;

    this._Progress = null;
  }

  EnableDelay(delay) {
    this.delayedTime = delay;
    return this; // 支持链式操作
  }

  SetStartPos(start_pos/* 取值0 - 1 */) {
    this.enableStartPos = start_pos;
  }

  EnableInfinite() {
    this.repeatTimes = -1; // -1 相当于无限
    return this; // 支持链式操作
  }

  SetRepeat(times) {
    this.repeatTimes = times;
    return this; // 支持链式操作
  }

  Enable(enable) {
    this._EnableFlagsInner(enable);
    return this; // 支持链式操作
  }

  // Override
  OnNewListener(listener) {
    let new_flags = 0;
    if (listener.OnAnimFinal) {
      new_flags |= Forge.AnimationEnable.AckFinalProgress;
    }

    if (listener.OnAnimRepeat) {
      new_flags |= Forge.AnimationEnable.AckRepeat;
    }

    if (new_flags !== 0) {
      this._EnableFlagsInner(new_flags);
    }
  }

  _EnableFlagsInner(new_flags) {
    if (this.enableFlags !== -1) {
      this.enableFlags |= new_flags;
    } else {
      // 首次设置
      this.enableFlags = new_flags;
    }
  }

  _GetCSSKeyframesRule(name) {
    let key_frames_rule = null;
    // 获取所有的style
    const ss = document.styleSheets;
    for (let i = 0; i < ss.length; ++i) {
      if (ss[i] && ss[i].cssRules) {
        for (const obj in ss[i].cssRules) {
          if (ss[i].cssRules[obj].name === name) {
            key_frames_rule = ss[i].cssRules[obj];
            break;
          }
        }
        if (key_frames_rule) {
          break;
        }
      }
    }
    return key_frames_rule;
  }

  CheckCssAnimationFormat(anim_name) {
    const key_frames_rule = this._GetCSSKeyframesRule(anim_name);
    if (key_frames_rule && key_frames_rule.cssRules) {
      for (const obj in key_frames_rule.cssRules) {
        if (!key_frames_rule.cssRules[obj] || !key_frames_rule.cssRules[obj].style) {
          continue;
        }
        if (!key_frames_rule.cssRules[obj].style.opacity
                    && !key_frames_rule.cssRules[obj].style.transform) {
          console.error(`@keyframe ${anim_name}, transform parse error! cssText:${key_frames_rule.cssText}`);
          continue;
        }

        const transform = key_frames_rule.cssRules[obj].style.transform;
        if (!transform) {
          continue;
        }

        if (transform.indexOf('rotate(') !== -1) {
          console.error(`@keyframe ${anim_name}, only support rotate3d, current transform:${transform}`);
        } else if (transform.indexOf('translate(') !== -1) {
          console.error(`@keyframe ${anim_name}, only support translate3d, current transform:${transform}`);
        } else if (transform.indexOf('scale(') !== -1) {
          console.error(`@keyframe ${anim_name}, only support scale3d, current transform:${transform}`);
        }
      }
    }
  }
};

Forge.KeyFrameAnimation = class extends Forge.AnimationDelegate {
  constructor(type, duration, easing) {
    super(type, duration, easing);
    this._KeyFrameNameToRecycle = null;

    this._TestRepeat = this._TestRepeat.bind(this);
    this._LatestProgressValue = 0;

    const that = this;
    this._OnEndEvent = (event) => {
      event.stopPropagation();
      that._PerformAnimationEnd(true);
    };

    this._CurrentEndEventFunc = null;
  }

  Start(layout_view) {
    super.Start(layout_view);
    // Keyframe动画启动时，清理transform，以保证动画行为正确
    layout_view.ResetCssTransform(null, null);
    if (layout_view.Element) {
      layout_view.Element.style.pointerEvents = "auto";
    }
    if (this.enableStartPos > 0) {
      // 有启动进度偏移(例如以30%进度的位置开始启动)
      this._EnableStarterAnimation();
    } else {
      this._EnableCssAnimation(this._BuildKeyFrame(), this._OnEndEvent, 0);
    }
  }

  Cancel() {
    super.Cancel();
    this._PerformAnimationEnd(false);
  }

  _EnableStarterAnimation() {
    let end_func = this._OnEndEvent;
    if (this.repeatTimes !== 1) {
      // 有动画Repeat处理
      const that = this;
      end_func = (event) => {
        event.stopPropagation();
        if (that._Progress !== null) {
          that._Progress.Stop();
        }
        // 启动重复动画前清理延迟时间和repeat次数-1
        that.delayedTime = 0;
        if (that.repeatTimes > 0) {
          that.repeatTimes -= 1;
        }
        this.OnRepeatEvent();
        that._EnableCssAnimation(that._BuildKeyFrame(), that._OnEndEvent, 0);
      };
    }

    // 首次动画，repeat临时调成1次，在此动画结束后，再开始循环
    const saved_repeat_time = this.repeatTimes;
    const saved_duration = this.duration;
    this.repeatTimes = 1;
    this.duration *= (1 - this.enableStartPos);

    this._EnableCssAnimation(this._BuildStarterKeyFrame(), end_func, this.enableStartPos);

    // 恢复存储值
    this.repeatTimes = saved_repeat_time;
    this.duration = saved_duration;
  }

  _EnableCssAnimation(animation, on_end_func, start_position) {
    if (animation === null) return;
    if (animation.keyFrameString !== null) {
      getStaticFrameControl().insertRule(animation.keyFrameString);
      this._KeyFrameNameToRecycle = animation.name;
    }

    const anim_name = animation.name;
    // 检查css animation transform格式
    this.CheckCssAnimationFormat(anim_name);

    const html_element = this._LayoutViewRef.Element;

    // 创建Progress跟踪器
    if ((this.enableFlags & Forge.AnimationEnable.AckFinalProgress) !== 0
            || (this.enableFlags & Forge.AnimationEnable.KeepTransform) !== 0
            || (this.enableFlags & Forge.AnimationEnable.AckRepeat) !== 0) {
      this._Progress = new AnimationProgress(this._LayoutViewRef);
      this._Progress.Start(this, start_position, (progress) => {
        this.OnAnimAdvance(progress);
      });
      if ((this.enableFlags & Forge.AnimationEnable.AckRepeat) !== 0) {
        this._LatestProgressValue = 0;
        Forge.sRenderBridge.RegisterPerFrameCallback(this._TestRepeat);
      }
    }

    const style_animation = animationToStyle(this, anim_name);

    // name duration timing-function delay iteration-count direction;
    if (!window.jsvInAndroidWebView) {
      html_element.style.animation = style_animation;
      html_element.addEventListener("animationend", on_end_func);
    } else {
      html_element.style.webkitAnimation = style_animation;
      html_element.addEventListener("webkitAnimationEnd", on_end_func);
    }
    this._CurrentEndEventFunc = on_end_func;
  }

  _PerformAnimationEnd(on_end) {
    // 清理OnEndListener监听，否则会重复收到
    if (this._CurrentEndEventFunc !== null) {
      const element = this._LayoutViewRef.Element;
      const animate_end_callback = this._CurrentEndEventFunc;
      // 异步进行removeEventListener处理，以解决event.stopPropagation不生效的问题
      setTimeout(() => {
        if (!window.jsvInAndroidWebView) {
          element.removeEventListener("animationend", animate_end_callback);
        } else {
          element.removeEventListener("webkitAnimationEnd", animate_end_callback);
        }
      }, 0);
      this._CurrentEndEventFunc = null;
    }

    if (this._Progress === null) {
      // 无进度跟进需求，直接结束
      if (on_end) {
        this.OnEnd();
      }
      return;
    }

    if ((this.enableFlags & Forge.AnimationEnable.AckRepeat) !== 0) {
      Forge.sRenderBridge.UnregisterPerFrameCallback(this._TestRepeat);
    }

    let progress = this._Progress.Stop();
    if (on_end) {
      // 修正可能产生的进度为0.999的异常数值
      progress = 1;
    }

    // 根据进度状态，保持动画最后状态
    if ((this.enableFlags & Forge.AnimationEnable.KeepTransform) !== 0) {
      const frozen_transform = this._GetFrozenTransform(progress);
      this._LayoutViewRef.ResetCssTransform(
        frozen_transform.transform,
        frozen_transform.transformOrigin);
    }

    // 注意: OnEnd处理放在transform制作之后
    if (on_end) {
      this.OnEnd();
    }

    // 进度信息要异步回调，模拟JsView native的场景
    if ((this.enableFlags & Forge.AnimationEnable.AckFinalProgress) !== 0) {
      window.setTimeout((() => {
        this.OnFinalProgress(progress);
      }), 0);
    }

    // 回收KeyFrame
    if (this._KeyFrameNameToRecycle !== null) {
      getStaticFrameControl().removeRule(this._KeyFrameNameToRecycle);
      this._KeyFrameNameToRecycle = null;
    }
  }

  _TestRepeat() {
    const progress_value = this._Progress.GetProgress();
    if (this._LatestProgressValue > progress_value) {
      this.OnRepeatEvent();
    }

    this._LatestProgressValue = progress_value;
  }

  // 由子类集成，创建动画对应的keyframe
  _BuildStarterKeyFrame() {
    // Should override
    // 返回 {name:KeyFrame名称, keyFrameString:null 或者 keyFrame内容(不为null时，动画结束时会被自动从cssRules中清理)};
    console.warn("Warning:Should override and return keyframe name");
  }


  // 由子类集成，创建动画对应的keyframe
  _BuildKeyFrame() {
    // Should override
    // 返回 {name:KeyFrame名称, keyFrameString:null 或者 keyFrame内容(不为null时，动画结束时会被自动从cssRules中清理)};
    console.warn("Warning:Should override and return keyframe name");
  }

  // 由子类集成，根据进度信息完成Keep Transform操作
  _GetFrozenTransform(progress) {
    // should override
    console.warn("Warning:Should override and keep view transform by ResetCssTransform()");
  }
};

Forge.TranslateAnimation = class extends Forge.KeyFrameAnimation {
  constructor(start_x, end_x, start_y, end_y, duration, easing) {
    super("TL", duration, easing);

    this.startX = start_x;
    this.startY = start_y;
    this.endX = end_x;
    this.endY = end_y;
  }

  // Override
  _BuildStarterKeyFrame() {
    if (this.enableStartPos > 0) {
      const start_x = (this.endX - this.startX) * this.enableStartPos + this.startX;
      const start_y = (this.endY - this.startY) * this.enableStartPos + this.startY;
      const keyframe_name = `_ForgeAnim_TL_${sKeyFrameTokenGenerator++}`;
      const keyframe_string = `@keyframes ${keyframe_name} {`
                + `0%{transform:translate3d(${start_x}px,${start_y}px,0);}`
                + `100%{transform:translate3d(${this.endX}px,${this.endY}px,0);}}`;
      return { name: keyframe_name, keyFrameString: keyframe_string };
    }
    console.error("Error: no enabled starter position");
  }

  // Override
  _BuildKeyFrame() {
    const keyframe_name = `_ForgeAnim_TL_${sKeyFrameTokenGenerator++}`;
    const keyframe_string = `@keyframes ${keyframe_name} {`
            + `0%{transform:translate3d(${this.startX}px,${this.startY}px,0);}`
            + `100%{transform:translate3d(${this.endX}px,${this.endY}px,0);}}`;
    return { name: keyframe_name, keyFrameString: keyframe_string };
  }

  // Override
  _GetFrozenTransform(progress) {
    const x = Math.floor((this.endX - this.startX) * progress + this.startX);
    const y = Math.floor((this.endY - this.startY) * progress + this.startY);
    const transform = `translate3d(${x}px,${y}px,0)`;
    return { transform, transformOrigin: null };
  }
};

Forge.FuncAnimation = class extends Forge.AnimationDelegate {
  constructor(formula_string, duration, easing) {
    super("FC2", duration, easing);
    this.formula = formula_string;
    console.warn("NO implemented");
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

    this.startAngle = start_angle;
    this.offsetAngle = offset_angle;
    this.anchorVec3 = anchor;
    this.axisVec3 = axis;
    console.warn("NO implemented");
  }
};

Forge.BasicScaleAnimation = class extends Forge.AnimationDelegate {
  constructor(from_width, from_height, target_width, target_height,
    anchor_x_percent, anchor_y_percent,
    duration, easing,
    base_width, base_height) {
    super("SC" /* [Sc]ale */, duration, easing);
    console.warn("NO implemented");
  }
};

Forge.ScaleAnimation = class extends Forge.BasicScaleAnimation {
  constructor(start_scale, end_scale, anchor_x_percent, anchor_y_percent, duration, easing) {
    const size = 200;
    const from_width = start_scale * size;
    const from_height = start_scale * size;
    const target_width = end_scale * size;
    const target_height = end_scale * size;

    super(
      from_width, from_height,
      target_width, target_height,
      anchor_x_percent, anchor_y_percent,
      duration, easing,
      200, 200
    );
  }
};

Forge.OpacityAnimation = class extends Forge.AnimationDelegate {
  constructor(start_opacity, end_opacity, duration, easing) {
    super("OP" /* [Op]acity */, duration, easing);
    console.warn("NO implemented");
  }
};

Forge.CssKeyframeAnimation = class extends Forge.KeyFrameAnimation {
  constructor(keyframes_string, duration, easing, width, height) {
    super("CK" /* [C]cs [K]eyframe */, duration, easing);
    this._keyFramesSet = keyframes_string;
  }

  // Override
  _BuildKeyFrame() {
    // Keyframe配置，支持设置给LayoutView.Element(div)即可
    const keyframes = this._keyFramesSet;
    if (keyframes.indexOf("@keyframes") < 0 && keyframes.indexOf("@-webkit-keyframes") < 0) {
      console.warn("Warning:keyframes array empty");
      return null;
    }
    const keyframes_list = keyframes.split(" ");
    let anim_name = keyframes_list[1];
    if (anim_name.indexOf("{") >= 0) {
      anim_name = anim_name.substr(0, anim_name.indexOf("{"));
    }

    return { name: anim_name, keyFrameString: null };
  }
};

Forge.CssTransitionAnimation = class extends Forge.AnimationDelegate {
  constructor(transition_array) {
    super("CT" /* [C]cs [K]eyframe */, null, null);
    this._transArray = transition_array;
  }

  Start(layout_view) {
    super.Start(layout_view);

    const that = this;
    const transitions = this._transArray;
    const transition_map = {};

    if (transitions.length === 0) {
      console.warn("Warning:transition empty");
      return;
    }

    let transition_str = "";
    for (let i = 0; i < transitions.length; i++) {
      let timing_function = "linear";
      const transition = transitions[i];
      if (transition.tf) {
        timing_function = convertTimingFunc(transition.tf);
      }

      transition_str = `${transition.name} ${transition.dur / 1000}s ${
        timing_function} ${
        transition.dly / 1000}s`;
      transition_map[transition.name] = transition_str;
    }

    layout_view.ApplyStyleTransition(transition_map);

    if (transition_str) {
      // 注意：仅最后一个Transition动画的AnimationEnd时间被监听
      layout_view.Element.addEventListener("transitionend", (event) => {
        event.stopPropagation();
        that.OnEnd(true);
      });
      layout_view.Element.addEventListener("webkitTransitionEnd", (event) => {
        event.stopPropagation();
        that.OnEnd(true);
      });
    }
  }
};

Forge.KeyFrameGroupAnimation = class extends Forge.AnimationDelegate {
  constructor(type) {
    super(type, 0, null);

    this._KeyFrameArray = null;
    this._LatestProgressValue = 0;
    this._CurrentEndEventFunc = null;
    this._Progress = null;
    this._AnimRunList = null;
    this._AnimationRunIndex = 0;

    const that = this;
    this._OnEndEvent = (event) => {
      event.stopPropagation();
      if (this._TestFinalKeyFrame(event)) {
        that._PerformAnimationEnd(true);
      } else {
        // 切换到下一个animation
        this._AnimationRunIndex++;
        this._LayoutViewRef.Element.style.animation = this._AnimRunList[this._AnimationRunIndex];
        this._Progress.TriggerNextStep(this._AnimationRunIndex);

        that._OnSubKeyFrameDone(event);
      }
    };
  }

  Start(layout_view) {
    super.Start(layout_view);
    // Keyframe动画启动时，清理transform，以保证动画行为正确
    layout_view.ResetCssTransform(null, null);
    if (layout_view.Element) {
      layout_view.Element.style.pointerEvents = "auto";
    }

    this._EnableCssAnimation(this._BuildKeyFrameGroup(), this._OnEndEvent);
  }

  Cancel() {
    super.Cancel();
    this._PerformAnimationEnd(false);
  }

  _EnableCssAnimation(animation_array, on_end_func) {
    if (animation_array === null) return;

    this._KeyFrameArray = new Array(animation_array.length);
    const frame_control = getStaticFrameControl();
    for (let i = 0; i < animation_array.length; i++) {
      const animation = animation_array[i];
      // 检查css animation transform格式
      this.CheckCssAnimationFormat(animation.name);

      this._KeyFrameArray[i] = {
        name: animation.name,
        easing: animation.ease.Package(),
        duration: animation.duration,
        needRecycle: false
      };

      // KeyFrame在此创建，也被此类回收
      if (animation.keyFrameString !== null) {
        frame_control.insertRule(animation.keyFrameString);
        this._KeyFrameArray.needRecycle = true;
      }
    }

    const html_element = this._LayoutViewRef.Element;

    // 创建Progress跟踪器
    if ((this.enableFlags & Forge.AnimationEnable.AckFinalProgress) !== 0
            || (this.enableFlags & Forge.AnimationEnable.KeepTransform) !== 0) {
      this._Progress = new AnimationGroupProgress(this._LayoutViewRef, this._KeyFrameArray.length);
      this._Progress.Start(this._KeyFrameArray);
    }

    this._AnimRunList = this._ConvertToAnimationStyle(this._KeyFrameArray);
    this._AnimationRunIndex = 0;

    // name duration timing-function delay iteration-count direction;
    if (!window.jsvInAndroidWebView) {
      html_element.style.animation = this._AnimRunList[0];
      html_element.addEventListener("animationend", on_end_func);
    } else {
      html_element.style.webkitAnimation = this._AnimRunList[0];
      html_element.addEventListener("webkitAnimationEnd", on_end_func);
    }
    this._CurrentEndEventFunc = on_end_func;
  }

  _PerformAnimationEnd(on_end) {
    // 清理OnEndListener监听，否则会重复收到
    if (this._CurrentEndEventFunc !== null) {
      const element = this._LayoutViewRef.Element;
      const animate_end_callback = this._CurrentEndEventFunc;
      // 异步进行removeEventListener处理，以解决event.stopPropagation不生效的问题
      setTimeout(() => {
        if (!window.jsvInAndroidWebView) {
          element.removeEventListener("animationend", animate_end_callback);
        } else {
          element.removeEventListener("webkitAnimationEnd", animate_end_callback);
        }
      }, 0);
      this._CurrentEndEventFunc = null;
    }

    if (this._Progress === null) {
      // 无进度跟进需求，直接结束
      if (on_end) {
        this.OnEnd();
      }
      return;
    }

    let progress = this._Progress.Stop();
    if (on_end) {
      // 修正可能产生的进度为0.999的异常数值
      progress = 1;
    }

    // 根据进度状态，保持动画最后状态
    if ((this.enableFlags & Forge.AnimationEnable.KeepTransform) !== 0) {
      const frozen_transform = this._GetFrozenTransform(progress);
      this._LayoutViewRef.ResetCssTransform(
        frozen_transform.transform,
        frozen_transform.transformOrigin);
    }

    // 注意: OnEnd处理放在transform制作之后
    if (on_end) {
      this.OnEnd();
    }

    // 进度信息要异步回调，模拟JsView native的场景
    if ((this.enableFlags & Forge.AnimationEnable.AckFinalProgress) !== 0) {
      window.setTimeout((() => {
        this.OnFinalProgress(progress);
      }), 0);
    }

    // 回收KeyFrame
    const frame_control = getStaticFrameControl();
    for (const key_frame of this._KeyFrameArray) {
      if (key_frame.needRecycle) {
        frame_control.removeRule(key_frame.name);
      }
    }
    this._KeyFrameArray = null;
  }

  _ConvertToAnimationStyle(steps_settings) {
    const style_animation_list = [];
    for (let i = 0; i < steps_settings.length; i++) {
      let timing_func = "linear";
      const settings = steps_settings[i];
      if (settings.easing) {
        timing_func = convertTimingFunc(settings.easing);
      }

      // const delay_start = (i !== 0 ? steps_settings[i - 1].duration : 0);

      style_animation_list.push(`${settings.name} ${settings.duration / 1000}s ${timing_func}`);
    }

    return style_animation_list;
  }

  // 由子类复写，创建动画对应的keyframe
  _BuildKeyFrameGroup() {
    // Should override
    // 返回 数组，每个元素内容为:
    // {
    //      name:KeyFrame名称,
    //      keyFrameString:null 或者 keyFrame内容(不为null时，动画结束时会被自动从cssRules中清理)
    //      ease:xxx,  当前步骤的easing
    //      duration:xxx, 当前步骤的duration
    // };
    console.warn("Warning:Should override and return keyframe name");
  }

  // 由子类复写，根据进度信息完成Keep Transform操作
  _GetFrozenTransform(progress) {
    // should override
    console.warn("Warning:Should override and keep view transform by ResetCssTransform()");
  }

  // 由子类复写，进行检测这个animation end event是否是最后一个KeyFrame发起的
  _TestFinalKeyFrame(event) {
    // should override
    console.warn("Warning:Should override");
  }

  // 由子类复写，进行检测这个animation end event是否是最后一个KeyFrame发起的
  _OnSubKeyFrameDone(event) {
    // should override
    console.warn("Warning:Should override");
  }
};

Forge.TranslateFrameAnimation = class extends Forge.TranslateAnimation {
  constructor(start_pos, target_pos, speed, affect_x, origin_x, origin_y) {
    // 在浏览器场合，使用匀速的Translate动画模拟TranslateFrame动画
    let start_x = origin_x;
    let start_y = origin_y;
    let end_x = origin_x;
    let end_y = origin_y;

    if (affect_x) {
      start_x = start_pos;
      end_x = target_pos;
    } else {
      start_y = start_pos;
      end_y = target_pos;
    }

    const duration = Math.abs(Math.floor((target_pos - start_pos) / speed * 1000));

    super(start_x, end_x, start_y, end_y, duration, null);
  }
};

Forge.ThrowAnimation = class extends Forge.KeyFrameGroupAnimation {
  constructor(from_x, from_y, x_or_y, init_v, acc, to, has_pole, pole_position) {
    super("Thr"); // "Thr"ow

    this._FromX = from_x;
    this._FromY = from_y;
    this._XorY = x_or_y;
    this._InitV = init_v;
    this._Acc = acc;
    this._To = to;
    this._HasPole = has_pole;
    this._PoleCallback = null;
    this._PolePosition = pole_position;
    this._IsPositiveMove = (this._InitV > 0 || (this._InitV === 0 && this._Acc > 0)); // 是否朝正方向运动
  }

  SetPoleCallback(callback) {
    this._PoleCallback = callback;
  }

  _MakeTranslateString(keyframe_name, from, to) {
    return `@keyframes ${keyframe_name} {`
            + `0%{transform:translate3d(${from.x.value}px,${from.y.value}px,0);}`
            + `100%{transform:translate3d(${to.x.value}px,${to.y.value}px,0);}}`;
  }

  _BuildKeyFrameGroup() {
    const name_token = `${sKeyFrameTokenGenerator++}`;

    // {
    //      name:KeyFrame名称,
    //      keyFrameString:null 或者 keyFrame内容(不为null时，动画结束时会被自动从cssRules中清理)
    //      ease:xxx,  当前步骤的easing
    //      duration:xxx, 当前步骤的duration
    // };
    const keyframe_array = [];

    const start_vec2 = { x: { value: this._FromX }, y: { value: this._FromY } };
    const end_vec2 = { x: { value: this._FromX }, y: { value: this._FromY } };

    const start_ref = (this._XorY === 0 ? start_vec2.x : start_vec2.y);
    const end_ref = (this._XorY === 0 ? end_vec2.x : end_vec2.y);
    if (this._HasPole) {
      // 有拐点时

      // 运动处理，先从起始位置，到拐点
      let keyframe_name = `_ForgeAnim_Thr_Forw_${name_token}`;
      end_ref.value = this._PolePosition;
      let keyframe_string = this._MakeTranslateString(keyframe_name, start_vec2, end_vec2);
      keyframe_array.push({
        name: keyframe_name,
        keyFrameString: keyframe_string,
        ease: Forge.Easing.Circular.Out, // 减速运动
        duration: Math.floor(-(this._InitV / this._Acc) * 1000) // 单位毫秒
      });


      // 运动处理，再从拐点到最终点
      keyframe_name = `_ForgeAnim_Thr_Backw_${name_token}`;
      start_ref.value = this._PolePosition;
      end_ref.value = this._To;
      keyframe_string = this._MakeTranslateString(keyframe_name, start_vec2, end_vec2);
      keyframe_array.push({
        name: keyframe_name,
        keyFrameString: keyframe_string,
        ease: Forge.Easing.Circular.In, // 加速运动
        duration: Math.floor(
          Math.sqrt(2 * (this._To - this._PolePosition) / this._Acc) * 1000), // 单位毫秒
      });
    } else {
      // 无拐点时
      const keyframe_name = `_ForgeAnim_Thr_Forw_${name_token}`;
      end_ref.value = this._To;
      const keyframe_string = this._MakeTranslateString(keyframe_name, start_vec2, end_vec2);

      // 转换坐标系，使运动始终向正方向以简化计算处理
      const init_v = (this._IsPositiveMove ? this._InitV : -this._InitV);
      const acc = (this._IsPositiveMove ? this._Acc : -this._Acc);
      const distance = (this._IsPositiveMove ? (end_ref.value - start_ref.value) : (start_ref.value - end_ref.value));

      keyframe_array.push({
        name: keyframe_name,
        keyFrameString: keyframe_string,
        ease: (acc > 0 ? Forge.Easing.Circular.In : Forge.Easing.Circular.Out), // 根据加速度方向决定是加速运动还是减速运动
        duration: Math.floor((Math.sqrt(init_v * init_v + 2 * acc * distance) - init_v) / acc * 1000)
      });
    }

    return keyframe_array;
  }

  // 由子类集成，根据进度信息完成Keep Transform操作
  _GetFrozenTransform(progress) {
    const position = { x: { value: this._FromX }, y: { value: this._FromY } };
    let from = (this._XorY === 0 ? position.x.value : position.y.value);
    const result_position_ref = (this._XorY === 0 ? position.x : position.y);
    let result_pos_value = 0;

    // 转换坐标系，使运动始终向正方向以简化计算处理
    from = (this._IsPositiveMove ? from : -from);
    const to = (this._IsPositiveMove ? this._To : -this._To);
    const pole_position = (this._IsPositiveMove ? this._PolePosition : -this._PolePosition);

    if (this._HasPole) {
      const moved = (pole_position * 2 - from - to) * progress;
      if (moved > (pole_position - from)) {
        // 运动了超过了拐点的距离
        result_pos_value = pole_position - (moved - (pole_position - from));
      } else {
        // 未到达拐点
        result_pos_value = from + moved;
      }
    } else {
      result_pos_value = from + (to - from) * progress;
    }

    // 恢复坐标系
    result_position_ref.value = Math.floor(this._IsPositiveMove ? result_pos_value : -result_pos_value);

    const transform = `translate3d(${position.x.value}px,${position.y.value}px,0)`;
    return { transform, transformOrigin: null };
  }

  // 由子类集成，进行检测这个animation end event是否是最后一个KeyFrame发起的
  _TestFinalKeyFrame(event) {
    if (this._HasPole) {
      return (event.animationName.indexOf("_ForgeAnim_Thr_Backw_") >= 0);
    }
    return (event.animationName.indexOf("_ForgeAnim_Thr_Forw_") >= 0);
  }

  _OnSubKeyFrameDone(event) {
    if (this._HasPole && this._PoleCallback) {
      // 第一个动画结束，到达拐点，回报拐点事件
      this._PoleCallback();
    }
  }
};

// enum
Forge.AnimationEnable = {
  ReleaseAfterEndCallback: 1, // 0000 0000 0001
  KeepTransform: 2, // 0000 0000 0010
  AckFinalProgress: 4, // 0000 0000 0000 0100
  AckRepeat: 8, // 0000 0000 0000 1000
};
