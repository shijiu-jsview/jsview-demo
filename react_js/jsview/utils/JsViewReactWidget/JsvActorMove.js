/**
 * Created by donglin.lu@qcast.cn on 10/12/20.
 */

/*
 * 【模块 export 内容】
 * JsvActorMove：React高阶组件，单轴(X 或 Y)运动控制控件，可控制完成单方向的匀速运动和变速运动（抛物运动），
 *               若想进行X和Y轴同时的运动，可以通过运动分解后的两个JsvActorMove进行组合来实现
 *      props说明:
 *          control {JsvActorMoveControl} JsvActorMove控制器实体，通过new JsvActorMoveControl()生成，说明见下文
 *
 * JsvActorMoveControl: 面向对象的类，JsvActorMove控制器
 *      功能函数：(参数说明见函数本体)
 *          moveToX(target_x, speed, end_callback)
 *              功能：延X轴进行匀速运动
 *          moveToY(target_y, speed, end_callback)
 *              功能：延Y轴进行匀速运动
 *          repeatMoveAlongX(target_x, speed, repeat_start, repeat_callback)
 *              功能：延X轴进行重复匀速运动
 *          repeatMoveAlongY(target_y, speed, repeat_start, repeat_callback)
 *              功能：延Y轴进行重复匀速运动
 *          throwAlongX(init_v, acc, end_condition, end_callback, pole_callback)
 *              功能：延X轴进行回旋运动
 *          throwAlongY(init_v, acc, end_condition, end_callback, pole_callback)
 *              功能：延Y轴进行回旋运动(例如Y轴抛物运动)
 *          jumpTo(new_x, new_y)
 *              功能：直接将JsvActorMove移动到目标位置，无中间运动动画
 *          pause(pause_callback)
 *              功能：暂停动画，并将JsvActorMove保持在暂停的位置上
 */

import { Forge } from "../../dom/jsv-forge-define";
import { JsvActorBase, ActorControlBase } from "./JsvActorBase";

const CONST_MOVE_TYPE_ACC = 1; // 抛物变速运动
const CONST_MOVE_TYPE_UNIFORM = 2; // 匀速运动
const CONST_MOVE_TYPE_JUMP = 3; // 无动画，直接调整坐标到目标位置

// 单向运动控制模块，单方向指的是只能进行一个方向的运动，要不是x，要不是y
class _ActorControl extends ActorControlBase {
  constructor() {
    // 0: X位置,
    // 1: Y位置，
    super(2);
  }

  /*
     * moveToX 参数说明:
     *      paused_callback (Function(x,y)) 运动暂停完成后的回调，回报当前JsvActorMove的相对x,y
     */
  pause(paused_callback) {
    super.pause(paused_callback);
  }

  /*
     * moveToX 参数说明:
     *      target_x     (int) 带符号整数，标识运动的目标位置，相对于JsvActorMove当前位置
     *      speed        (int) 带符号整数，符号表示方向，标识运动的运行速度，单位(pixel/s)
     *      end_callback (Function(x,y)) 运动到目标位置后的回调函数，回报当前JsvActorMove的相对x,y
     */
  moveToX(target_x, speed, end_callback) {
    this._UniformMove(0, target_x, NaN, speed, null, end_callback);
  }

  /*
     * moveToY 参数说明:
     *      target_y     (int) 带符号整数，标识运动的目标位置，相对于JsvActorMove当前位置
     *      speed        (int) 带符号整数，符号表示方向，标识运动的运行速度，单位(pixel/s)
     *      end_callback (Function(x,y)) 运动到目标位置后的回调函数，回报当前JsvActorMove的相对x,y
     */
  moveToY(target_y, speed, end_callback) {
    this._UniformMove(1, NaN, target_y, speed, null, end_callback);
  }

  /*
     * repeatMoveAlongX 参数说明：
     *      target_x     (int) 带符号整数，标识运动的目标位置，相对于JsvActorMove当前位置
     *      speed        (int) 带符号整数，符号表示方向，标识运动的运行速度，单位(pixel/s)
     *      repeat_start (int) 带符号整数，标识往复运动的起始点，使用时注意，JsvActorMove的当前位置必须在
     *                         repeat_start和target_x之间
     *      repeat_callback (Function(times)) 完整一个运动周期后的回调，返回当前运动的周期数times
     */
  repeatMoveAlongX(target_x, speed, repeat_start, repeat_callback) {
    this._UniformMove(0,
      target_x, NaN, speed,
      {
        start: repeat_start,
        repeatCallback: repeat_callback,
      },
      null);
  }

  /*
     * repeatMoveAlongY 参数说明：
     *      target_y     (int) 带符号整数，标识运动的目标位置，相对于JsvActorMove当前位置
     *      speed        (int) 带符号整数，符号表示方向，标识运动的运行速度，单位(pixel/s)
     *      repeat_start (int) 带符号整数，标识往复运动的起始点，使用时注意，JsvActorMove的当前位置必须在
     *                         repeat_start和target_y之间
     *      repeat_callback (Function(times)) 完整一个运动周期后的回调，返回当前运动的周期数times
     */
  repeatMoveAlongY(target_y, speed, repeat_start, repeat_callback) {
    this._UniformMove(1,
      NaN, target_y, speed,
      {
        start: repeat_start,
        repeatCallback: repeat_callback,
      },
      null);
  }

  _UniformMove(x_or_y, target_x, target_y, speed, repeat_set, end_callback) {
    const start_params = {
      type: CONST_MOVE_TYPE_UNIFORM,
      xOrY: x_or_y,
      speed,
      repeatSet: repeat_set,
    };
    this._Target[0] = target_x;
    this._Target[1] = target_y;
    super.start(start_params, end_callback);
  }

  /*
     * throwAlongX 参数说明：
     *      init_v      (int) 带符号整形，描素运动初速度，单位(pixel/s)
     *      acc         (int) 带符号整形，描素运动的加速度，单位(pixel/(s*s))
     *      end_condition (Object) 动画结束的条件设定
     *                          格式{type:"catch", position:xxx, offset:xxx, direction: 1 or -1}
     *                          例如:
     *                              1. X轴方向运动，在相对于起始点右方30px位置，接住向上运动的物体时，
     *                                  设置 direction = -1, offset = -30
     *                              2. X轴方向运动，在相对于起始点左方30px位置，接住运动到右边界后回旋向左的运动的物体时，
     *                                  设置 direction = 1, offset = 30
     *                                  position为相对于元素0点位置的绝对坐标，和offset的设定二选一
     *      end_callback (Function(x,y)) 运动到目标位置后的回调函数，回报当前JsvActorMove的相对x,y
     *      pole_callback (Function(void)) 动画运行到拐点时的回调
     */
  throwAlongX(init_v, acc, end_condition, end_callback, pole_callback) {
    this._Throw(0, init_v, acc, end_condition, end_callback, pole_callback);
  }

  /*
     * throwAlongY 参数说明：
     *      init_v      (int) 带符号整形，描素运动初速度，单位(pixel/s)
     *      acc         (int) 带符号整形，描素运动的加速度，单位(pixel/(s*s))
     *      end_condition (Object) 动画结束的条件设定
     *                          格式{type:"catch", position:xxx, offset:xxx, direction: 1 or -1}
     *                          例如:
     *                              1. Y轴方向运动，在相对于起始点上方30px位置，接住向上运动的物体时，
     *                                  设置 direction = -1, offset = -30
     *                              2. Y轴方向运动，在相对于起始点下方30px位置，接住运动到高点后跌落下来的运动的物体时，
     *                                  设置 direction = 1, offset = 30
     *                                  position为相对于元素0点位置的绝对坐标，和offset的设定二选一
     *      end_callback (Function(x,y)) 运动到目标位置后的回调函数，回报当前JsvActorMove的相对x,y
     *      pole_callback (Function(void)) 动画运行到拐点时的回调
     */
  throwAlongY(init_v, acc, end_condition, end_callback, pole_callback) {
    this._Throw(1, init_v, acc, end_condition, end_callback, pole_callback);
  }

  _Throw(x_or_y, init_v, acc, end_condition, end_callback, pole_callback) {
    // 需要先进行动画停止，以确定本次动画的起始点(this._Current)
    super.pause(() => {
      const start_params = this._CalculateTerminalStatus(x_or_y, init_v, acc, end_condition, pole_callback);
      if (start_params !== null) {
        super.start(start_params, end_callback);
      } else {
        // 无法确定终止点，动画无法启动
      }
    });
  }

  /*
     * jumpTo 参数说明:
     *      new_x     (int) 带符号整数，标识目标位置，数值相对于JsvActorMove在render中的起始位置
     *      new_y     (int) 带符号整数，标识目标位置，数值相对于JsvActorMove在render中的起始位置
     */
  jumpTo(new_x, new_y) {
    this._Target[0] = new_x;
    this._Target[1] = new_y;

    const start_params = {
      type: CONST_MOVE_TYPE_JUMP,
    };
    super.start(start_params, null);
  }

  _CalculateTerminalStatus(x_or_y, init_v, acc, end_condition, pole_callback) {
    const start_params = {
      type: CONST_MOVE_TYPE_ACC,
      xOrY: x_or_y,
      initV: init_v,
      acc,
      hasPole: false,
      polePosition: 0,
      poleCallback: pole_callback,
      isPositiveMove: (init_v > 0 || (init_v === 0 && acc > 0))
    };
    let start_pos = (x_or_y === 0 ? this._Current[0] : this._Current[1]);

    if (acc === 0) {
      console.error("Error: Acceleration is not inited!");
      return null;
    }

    let direction_revert = false;
    let catch_direction = end_condition.direction;
    let catch_pos = end_condition.hasOwnProperty("position") ?
      end_condition.position
      : (end_condition.offset + start_pos);
    let move_pole_pos = 0; // 减速运动的顶点位置
    let trace_include_pole = false; // 运动轨迹包含拐点

    // 为了方便设计计算思路，根据初速度进行坐标系归一化(同归为向正方向进行计算)
    if (init_v < 0 || (init_v === 0 && acc < 0)) {
      // 启动坐标系反转
      direction_revert = true;
      init_v = -init_v;
      acc = -acc;
      start_pos = -start_pos;
      catch_direction = -catch_direction;
      catch_pos = -catch_pos;
    }

    if (acc * init_v < 0) {
      // 初速度与加速度反向

      // 计算减速运动最终位移
      move_pole_pos = start_pos + init_v * init_v / 2 / (-acc);

      if (init_v * catch_direction < 0) {
        // 准备在返回轨道中进行捕获
        if (catch_pos > move_pole_pos) {
          console.error(`Error: can not catch, range(<${move_pole_pos}), but catch=${catch_pos}`);
          return null;
        }
        trace_include_pole = true;
      } else {
        // 准备在前进轨道中捕获
        if (catch_pos > move_pole_pos || catch_pos < start_pos) {
          console.error(`Error: can not catch, range(${start_pos}-${move_pole_pos}), but catch=${catch_pos}`);
          return null;
        }
      }
    } else {
      // 初速度与加速度方向相同，包含初速度为0的场景
      if (acc * catch_direction < 0) {
        // 准备在返回轨道中进行捕获，但速度与加速度同向，无返回轨道，无法捕捉
        console.error("Error: can not catch, direction incorrect");
        return null;
      }
      // 准备在前进轨道中捕获
      if (catch_pos < start_pos) {
        console.error(`Error: can not catch, range(>${start_pos}), but catch=${catch_pos}`);
        return null;
      }
    }

    // 方向恢复
    if (direction_revert) {
      catch_pos = -catch_pos;
      move_pole_pos = -move_pole_pos;
    }

    // 记录拐点信息
    start_params.hasPole = trace_include_pole;
    start_params.polePosition = move_pole_pos;

    // 刷新Target信息
    if (x_or_y === 0) {
      // X轴方向运动
      this._Target[0] = catch_pos;
      this._Target[1] = this._Current[1];
    } else {
      // Y轴方向运动
      this._Target[0] = this._Current[0];
      this._Target[1] = catch_pos;
    }

    return start_params;
  }

  _BuildAccelAnimation(current_array, tos_array, start_params) {
    const anim = new Forge.ThrowAnimation(
      current_array[0],
      current_array[1],
      start_params.xOrY,
      start_params.initV,
      start_params.acc,
      (start_params.xOrY === 0 ? tos_array[0] : tos_array[1]),
      start_params.hasPole,
      start_params.polePosition
    );
    anim.SetPoleCallback(start_params.poleCallback);
    return anim;
  }

  _BuildUniformMoveAnimation(current_array, tos_array, start_params) {
    const affect_x = (start_params.xOrY === 0);
    const from_pos = (affect_x ? current_array[0] : current_array[1]);
    const to_pos = (affect_x ? tos_array[0] : tos_array[1]);
    let anim = null;

    if (start_params.repeatSet !== null) {
      // 进行Repeat处理
      const repeat_set = start_params.repeatSet;

      // Repeat动画中，循环运动区域为repeatSet.start 到 to_pos，
      // 但首次动画从from_pos开始运行，首次运动完成后，第二次运行再从repeatSet.start开始
      const start_percent = (from_pos - repeat_set.start) / (to_pos - repeat_set.start);
      if (start_percent > 1 || start_percent < 0) {
        console.error(`Error: current=${from_pos} out of repeat range[${
          repeat_set.start}-${to_pos}]`);
        return null;
      }

      anim = new Forge.TranslateFrameAnimation(
        repeat_set.start, to_pos,
        start_params.speed, affect_x,
        current_array[0], current_array[1]
      );
      anim.SetStartPos(start_percent);
      anim.EnableInfinite();
    } else {
      // 单次动画，无repeat
      anim = new Forge.TranslateFrameAnimation(
        from_pos, to_pos,
        start_params.speed, affect_x,
        current_array[0], current_array[1]
      );
    }

    return anim;
  }

  _BuildJumpAnimation(current_array, tos_array, start_params) {
    // 使用时长为0的Translate动画来完成jump动作
    const anim = new Forge.TranslateAnimation(
      tos_array[0], tos_array[0],
      tos_array[1], tos_array[1],
      1, null);
    return anim;
  }

  _ReCalculateAccelCurrent(froms, tos, progress, start_params) {
    const position = { x: { value: froms[0] }, y: { value: froms[1] } };
    let from = (start_params.xOrY === 0 ? position.x.value : position.y.value);
    let to = (start_params.xOrY === 0 ? tos[0] : tos[1]);
    const result_position_ref = (start_params.xOrY === 0 ? position.x : position.y);
    let result_pos_value = 0;

    // 转换坐标系，使运动始终向正方向以简化计算处理
    from = (start_params.isPositiveMove ? from : -from);
    to = (start_params.isPositiveMove ? to : -to);
    const pole_position = (start_params.isPositiveMove ? start_params.polePosition : -start_params.polePosition);

    if (start_params.hasPole) {
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
    result_position_ref.value = Math.floor(start_params.isPositiveMove ? result_pos_value : -result_pos_value);

    // 记录Current
    this._Current[0] = position.x.value;
    this._Current[1] = position.y.value;
  }


  _ReCalculateUMoveCurrent(froms, tos, progress, start_params) {
    if (start_params.xOrY === 0) {
      const value = (tos[0] - froms[0]) * progress + froms[0];
      const direction = value >= 0 ? 1 : -1;
      this._Current[0] = direction * Math.floor(Math.abs(value));
    } else {
      const value = (tos[1] - froms[1]) * progress + froms[1];
      const direction = value >= 0 ? 1 : -1;
      this._Current[1] = direction * Math.floor(Math.abs(value));
    }
  }

  _ReCalculateJumpCurrent(froms, tos, progress, start_params) {
    this._Current[0] = tos[0];
    this._Current[1] = tos[1];
  }

  // 异常内部函数
  start() {}

  // Override
  _WrapBuildAnimation(current_array, tos_array, start_params) {
    if (start_params.type === CONST_MOVE_TYPE_ACC) {
      // 加速运动
      return this._BuildAccelAnimation(current_array, tos_array, start_params);
    } if (start_params.type === CONST_MOVE_TYPE_UNIFORM) {
      // 匀速运动
      return this._BuildUniformMoveAnimation(current_array, tos_array, start_params);
    } if (start_params.type === CONST_MOVE_TYPE_JUMP) {
      // 位置调整
      return this._BuildJumpAnimation(current_array, tos_array, start_params);
    }
    console.error("Error:Undefined yet");
  }

  // Override
  _WrapAddExtraListener(listener, start_params) {
    if (start_params.type === CONST_MOVE_TYPE_UNIFORM) {
      // 重复运动时，需要设定repeat回调
      if (start_params.repeatSet !== null && start_params.repeatSet.repeatCallback) {
        const repeat_callback = start_params.repeatSet.repeatCallback;
        listener.OnRepeat((times) => {
          repeat_callback(times);
        });
      }
    }
  }

  // Override
  _WrapCallback(currents, callback, start_params) {
    if (callback) {
      callback(currents[0], currents[1]);
    }
  }

  // Override
  _WrapReCalculateCurrent(froms, tos, progress, start_params) {
    if (start_params.type === CONST_MOVE_TYPE_ACC) {
      this._ReCalculateAccelCurrent(froms, tos, progress, start_params);
    } else if (start_params.type === CONST_MOVE_TYPE_UNIFORM) {
      // 匀速运动
      return this._ReCalculateUMoveCurrent(froms, tos, progress, start_params);
    } else if (start_params.type === CONST_MOVE_TYPE_JUMP) {
      // 位置调整
      return this._ReCalculateJumpCurrent(froms, tos, progress, start_params);
    } else {
      console.error("Error:Undefined yet");
    }
  }
}

export {
  _ActorControl as JsvActorMoveControl,
  JsvActorBase as JsvActorMove
};
