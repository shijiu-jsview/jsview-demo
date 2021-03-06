// JsvSpriteTranslate comes from JsView React Project
/**
 * Component: JsvSpriteTranslate
 * @param {TranslateControl} Sprite动作控制器 必需
 */

import { Forge } from "../../dom/jsv-forge-define";
import { JsvSpriteBase, SpriteControlBase } from "./JsvSpriteBase";

class __SharedControl extends SpriteControlBase {
  constructor() {
    super(2); // targetX, targetY, accelerate, init velocity
    this._Mode = 0; // 0: 匀速控制模式, 1: 加减速控制模式
    this._Speed = 0; // pixel per second
    this._VerlocityAcc = 0; // 加速度值
    this._VerlocityInit = 0; // 初始速度
    this._AccAlongX = true; // true 延X轴加速， false 延Y轴加速
    this._AnimationRef = null;
    this._AllowFrameStep = false; // 是否可以使用FrameStep模式,该模式下为了保证动画的平滑性，动画总运行时间会超过设定时间
  }

  allowFrameStepMode(allow) {
    this._AllowFrameStep = allow;
    return this;
  }

  selectMode(mode) {
    switch (mode) {
      case "UniformMotion":
        this._Mode = 0;
        break;
      case "AcceleratedMotion":
        this._Mode = 1;
        this.setRepeat(false); // 加速模式不支持repeat
        break;
      default:
        console.error(`Unsupported input=${mode}`);
    }

    return this;
  }

  targetX(new_x) {
    // Take effect in next Start
    this._Target[0] = new_x;
    return this;
  }

  targetY(new_y) {
    // Take effect in next Start
    this._Target[1] = new_y;
    return this;
  }

  target(new_x, new_y) {
    // Take effect in next Start
    this._Target[0] = new_x;
    this._Target[1] = new_y;
    return this;
  }

  // start_x, start_y，必须要在当前位置到target的范围之外，范围之内目前不支持
  enableRepeatFrom(start_x, start_y, repeat_callback) {
    if (!this._ComfirmMode(0)) return;

    this.setRepeat(true, repeat_callback);
    this._RepeatStart[0] = start_x;
    this._RepeatStart[1] = start_y;
    return this;
  }

  speed(pixel_per_second) {
    if (!this._ComfirmMode(0)) return;

    // Take effect in next Start
    this._Speed = pixel_per_second;
    return this;
  }

  // Start后，从当前位置到目标位置后动画结束
  accelerateX(acc_x, target_x) {
    if (!this._ComfirmMode(1)) return;

    this._Target[0] = target_x;
    this._VerlocityAcc = acc_x;
    this._VerlocityInit = 0;
    this._AccAlongX = true;
    return this;
  }

  accelerateY(acc_y, target_y) {
    if (!this._ComfirmMode(1)) return;

    this._Target[1] = target_y;
    this._VerlocityAcc = acc_y;
    this._VerlocityInit = 0;
    this._AccAlongX = false;
    return this;
  }

  decelerateX(acc_x, init_v_x) {
    if (!this._ComfirmMode(1)) return;

    this._VerlocityAcc = acc_x;
    this._VerlocityInit = init_v_x;
    this._AccAlongX = true;
    return this;
  }

  decelerateY(acc_y, init_v_y) {
    if (!this._ComfirmMode(1)) return;

    this._VerlocityAcc = acc_y;
    this._VerlocityInit = init_v_y;
    this._AccAlongX = false;
    return this;
  }

  // Start后，当减速到0时结束动画
  decelerate(acc_x, acc_y, init_v_x, init_v_y) {
    if (this._Mode !== 1) {
      console.error("Error: mode error");
      return;
    }

    this._VerlocityAcc[0] = acc_x;
    this._VerlocityAcc[1] = acc_y;
    this._VerlocityInit[0] = init_v_x;
    this._VerlocityInit[1] = init_v_y;
    return this;
  }

  _ComfirmMode(mode) {
    if (this._Mode !== mode) {
      console.error("Error: mode error");
      return false;
    }
    return true;
  }

  // Override
  _WrapBuildAnimation(repeat_start_array, current_array, tos_array, act_jump) {
    if (act_jump) {
      this._AnimationRef = this._UniformMove(null, current_array, tos_array, act_jump);
    } else {
      if (this._Mode === 0) {
        this._AnimationRef = this._UniformMove(repeat_start_array, current_array, tos_array, false);
      } else if (this._Mode === 1) {
        this._AnimationRef = this._AccelerMove(current_array, tos_array);
      }
    }
    return this._AnimationRef;
  }

  _UniformMove(repeat_start_array, current_array, tos_array, act_jump) {
    let from_x = 0;
    let from_y = 0;
    let start_pos = 0.0;
    let animate_time = 1;

    const current_x = current_array[0];
    const current_y = current_array[1];
    const to_x = tos_array[0];
    const to_y = tos_array[1];

    if (repeat_start_array !== null) {
      from_x = repeat_start_array[0];
      from_y = repeat_start_array[1];
      const distance = this._Distance(current_x, current_y, to_x, to_y);
      const distance_total = this._Distance(from_x, from_y, to_x, to_y);
      start_pos = (distance_total - distance) / distance_total;
      if (!act_jump) {
        animate_time = distance_total * 1000 / this._Speed;
      }
    } else {
      from_x = current_x;
      from_y = current_y;
      start_pos = 0.0;
      if (!act_jump) {
        animate_time = this._Distance(current_x, current_y, to_x, to_y) * 1000 / this._Speed;
      }
    }

    if (!act_jump && animate_time === 0) {
      console.warn("Discard starting request for no distance");
      // 但动画仍然会执行，为了能正常触发回调
    }

    let anim = null;
    if ((from_x === to_x || from_y === to_y) && !act_jump
                && this._AllowFrameStep && window.JsView) {
      // 单轴动画时，使用Frame animation来提升平滑性
      console.log("Using frame translate animation");
      let position_from = 0;
      let position_target = 0;
      let affect_x = true;
      if (from_x !== to_x) {
        // X轴方向上的移动
        position_from = from_x;
        position_target = to_x;
        affect_x = true;
      } else {
        // Y轴方向上的移动
        position_from = from_y;
        position_target = to_y;
        affect_x = false;
      }
      anim = new Forge.TranslateFrameAnimation(position_from, position_target, this._Speed, affect_x);
    } else {
      // 创建普通的平移动画
      anim = new Forge.TranslateAnimation(from_x, to_x, from_y, to_y, animate_time, null);
    }

    if (start_pos !== 0) {
      if (start_pos < 0) {
        console.warn("Warning: start position out of repeating range");
      } else {
        anim.SetStartPos(start_pos);
      }
    }
    return anim;
  }

  _AccelerMove(current_array, tos_array) {
    const current = (this._AccAlongX ? current_array[0] : current_array[1]);
    const init_v = this._VerlocityInit;
    const acc = this._VerlocityAcc;

    let target; let
      time;
    let is_acc_up = true;

    if (acc === 0) {
      console.error("Error: no found acceleration");
      return;
    }

    if (init_v === 0) {
      // 加速度运动，终点为target x，y
      target = (this._AccAlongX ? tos_array[0] : tos_array[1]);

      // d = 0.5 * acc * time^2 ==> time = sqrt(d * 2 / acc)
      time = Math.floor(Math.sqrt(Math.abs(target - current) * 2 / acc) * 1000);
      is_acc_up = true;
    } else {
      // 减速运动
      time = Math.floor(Math.abs(init_v) * 1000 / acc);
      target = current + Math.floor(0.0005 * init_v * time);
      is_acc_up = false;
    }

    if (time === 0) {
      // no move，但动画仍然会执行，为了能正常触发回调
      console.warn("no moved...");
    }

    // Update target memo
    let target_x; let
      target_y;
    if (this._AccAlongX) {
      target_x = target;
      this._Target[0] = target_x;
      target_y = this._Target[1];
    } else {
      target_x = this._Target[0];
      target_y = target;
      this._Target[1] = target_y;
    }

    // console.log("_AccelerMove "
    // + " current_x=" + current_array[0]
    // + " target_x=" + target_x
    // + " current_y=" + current_array[1]
    // + " target_y=" + target_y
    // + " time=" + time
    // );

    return new Forge.TranslateAnimation(current_array[0], target_x, current_array[1], target_y, time,
      (is_acc_up ? Forge.Easing.Circular.In : Forge.Easing.Circular.Out));
  }

  _Distance(from_x, from_y, to_x, to_y) {
    const dx = to_x - from_x;
    const dy = to_y - from_y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Override
  _WrapCallback(currents, callback) {
    this._AnimationRef = null; // un-reference
    if (callback) {
      callback(currents[0], currents[1]);
    }
  }
}

class JsvTranslateControl extends __SharedControl {
}

const TranslateControl = JsvTranslateControl;

export {
  JsvSpriteBase as JsvSpriteTranslate,
  TranslateControl
};
