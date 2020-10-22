/**
 * Created by ludl on 10/12/20.
 */

import {Forge} from "../jsview-react/index_widget.js"
import { JsvActorBase, ActorControlBase } from "./JsvActorBase"

let CONST_MOVE_TYPE_ACC = 1; // 抛物变速运动
let CONST_MOVE_TYPE_UNIFORM = 2; // 匀速运动
let CONST_MOVE_TYPE_JUMP = 3; // 无动画，直接调整坐标到目标位置

// 单向运动控制模块，单方向指的是只能进行一个方向的运动，要不是x，要不是y
class _ActorControl extends ActorControlBase {
    constructor() {
        // 0: X位置,
        // 1: Y位置，
        super(2);
    }

    /*
     * 平移运动接口，包含 moveToX, moveToY
     */
    moveToX(target_x, speed, end_callback) {
        this._UniformMove(0, target_x, NaN, speed, null, end_callback);
    }

    moveToY(target_y, speed, end_callback) {
        this._UniformMove(1, NaN, target_y, speed, null, end_callback);
    }

    /*
     * Repeat平移运动接口，包含repeatMoveAlongX, repeatMoveAlongY
     * 注意: Actor当前位置，必须在repeat_start 到 target_x之间，目前不支持当前位置不在范围内的场景
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
        let start_params = {
            type: CONST_MOVE_TYPE_UNIFORM,
            xOrY: x_or_y,
            speed: speed,
            repeatSet: repeat_set,
        };
        this._Target[0] = target_x;
        this._Target[1] = target_y;
        super.start(start_params, end_callback);
    }

    /*
     * 抛掷运动接口，包含 throwAlongX, throwAlongY
     * init_v : 初速度
     * acc : 加速度
     * end_condition: 包含两种方式
     *  方式1: 以捕捉方式结束，格式{type:"catch", position:xxx, offset:xxx, direction: 1 or -1}
     *  例如:
     *      1. Y轴方向运动，在相对于起始点上方30px位置，接住向上运动的物体时，设置 direction = -1, offset = -30
     *      2. Y轴方向运动，在相对于起始点下方30px位置，接住运动到高点后跌落下来的运动的物体时，
     *          设置 direction = 1, offset = 30
     *          position为相对于元素0点位置的绝对坐标，和offset的设定二选一
     */
    throwAlongX(init_v, acc, end_condition, end_callback) {
        this._Throw(0, init_v, acc, end_condition, end_callback);
    }

    throwAlongY(init_v, acc, end_condition, end_callback) {
        this._Throw(1, init_v, acc, end_condition, end_callback);
    }

    _Throw(x_or_y, init_v, acc, end_condition, end_callback) {
        // 需要先进行动画停止，以确定本次动画的起始点(this._Current)
        super.pause(()=>{
            let start_params = this._CalculateTerminalStatus(x_or_y, init_v, acc, end_condition);
            if (start_params !== null) {
                super.start(start_params, end_callback);
            } else {
                // 无法确定终止点，动画无法启动
            }
        });
    }

    /*
     * 定位动作，移动表演者到指定位置
     */
    jumpTo(new_x, new_y) {
        this._Target[0] = new_x;
        this._Target[1] = new_y;

        let start_params = {
            type: CONST_MOVE_TYPE_JUMP,
        };
        super.start(start_params, null);
    }

    _CalculateTerminalStatus(x_or_y, init_v, acc, end_condition) {
        let start_params = {
            type: CONST_MOVE_TYPE_ACC,
            xOrY: x_or_y,
            initV: init_v,
            acc: acc,
            hasPole: false,
            polePosition: 0,
            isPositiveMove: (init_v > 0 || (init_v === 0 && acc > 0))
        };
        let start_pos = (x_or_y === 0 ? this._Current[0] : this._Current[1]);

        if (acc === 0) {
            console.error("Error: Acceleration is not inited!");
            return null;
        }

        let direction_revert = false;
        let catch_direction = end_condition["direction"];
        let catch_pos = end_condition.hasOwnProperty("position") ?
                        end_condition["position"]
                        : (end_condition["offset"] + start_pos);
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
                    console.error("Error: can not catch, range(<" + move_pole_pos + "), but catch=" + catch_pos);
                    return null;
                }
                trace_include_pole = true;
            } else {
                // 准备在前进轨道中捕获
                if (catch_pos > move_pole_pos || catch_pos < start_pos) {
                    console.error("Error: can not catch, range(" + start_pos + "-" + move_pole_pos + "), but catch=" + catch_pos);
                    return null;
                }
            }
        } else {
            // 初速度与加速度方向相同，包含初速度为0的场景
            if (acc * catch_direction < 0) {
                // 准备在返回轨道中进行捕获，但速度与加速度同向，无返回轨道，无法捕捉
                console.error("Error: can not catch, direction incorrect");
                return null;
            } else {
                // 准备在前进轨道中捕获
                if (catch_pos < start_pos) {
                    console.error("Error: can not catch, range(>" + start_pos + "), but catch=" + catch_pos);
                    return null;
                }
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
        return new Forge.ThrowAnimation(
            current_array[0],
            current_array[1],
            start_params.xOrY,
            start_params.initV,
            start_params.acc,
            (start_params.xOrY === 0 ? tos_array[0] : tos_array[1]),
            start_params.hasPole,
            start_params.polePosition
        );
    }

    _BuildUniformMoveAnimation(current_array, tos_array, start_params) {
        let affect_x = (start_params.xOrY === 0);
        let from_pos = (affect_x ?  current_array[0] : current_array[1]);
        let to_pos = (affect_x ?  tos_array[0] : tos_array[1]);
        let anim = null;

        if (start_params.repeatSet !== null) {
            // 进行Repeat处理
            let repeat_set = start_params.repeatSet;

            // Repeat动画中，循环运动区域为repeatSet.start 到 to_pos，
            // 但首次动画从from_pos开始运行，首次运动完成后，第二次运行再从repeatSet.start开始
            let start_percent = (from_pos - repeat_set.start) / (to_pos - repeat_set.start);
            if (start_percent > 1 || start_percent < 0) {
                console.error("Error: current=" + from_pos + " out of repeat range["
                    + repeat_set.start + "-" + to_pos + "]");
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
        let anim = new Forge.TranslateAnimation(
            current_array[0], tos_array[0],
            current_array[1], tos_array[1],
            1, null);
        return anim;
    }

    _ReCalculateAccelCurrent(froms, tos, progress, start_params) {
        let position = {x:{value:froms[0]}, y:{value:froms[1]}};
        let from = (start_params.xOrY === 0 ? position.x.value : position.y.value);
        let to = (start_params.xOrY === 0 ? tos[0] : tos[1]);
        let result_position_ref = (start_params.xOrY === 0 ? position.x : position.y);
        let result_pos_value = 0;

        // 转换坐标系，使运动始终向正方向以简化计算处理
        from = (start_params.isPositiveMove ? from : -from);
        to = (start_params.isPositiveMove ? to : -to);
        let pole_position = (start_params.isPositiveMove ? start_params.polePosition : -start_params.polePosition);

        if (start_params.hasPole) {
            let moved = (pole_position * 2 - from - to) * progress;
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
            this._Current[0] = Math.floor((tos[0] - froms[0]) * progress + froms[0]);
        } else {
            this._Current[1] = Math.floor((tos[1] - froms[1]) * progress + froms[1]);
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
        } else if (start_params.type === CONST_MOVE_TYPE_UNIFORM) {
            // 匀速运动
            return this._BuildUniformMoveAnimation(current_array, tos_array, start_params)
        } else if (start_params.type === CONST_MOVE_TYPE_JUMP) {
            // 位置调整
            return this._BuildJumpAnimation(current_array, tos_array, start_params);
        } else {
            console.error("Error:Undefined yet");
        }
    }

    // Override
    _WrapAddExtraListener(listener, start_params) {
        if (start_params.type === CONST_MOVE_TYPE_UNIFORM) {
            // 重复运动时，需要设定repeat回调
            if (start_params.repeatSet !== null && start_params.repeatSet.repeatCallback) {
                let repeat_callback = start_params.repeatSet.repeatCallback;
                listener.OnRepeat((times)=>{
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
            return this._ReCalculateUMoveCurrent(froms, tos, progress, start_params)
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
}

