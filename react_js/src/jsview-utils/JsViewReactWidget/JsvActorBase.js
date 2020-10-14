/**
 * Created by ludl on 10/12/20.
 */

import React from 'react';
import {Forge, ForgeExtension} from "../jsview-react/index_widget.js"

// JsvSpriteBase comes from JsView React Project

class JsvControl {
    constructor(params_count) {
        this._Current = new Array(params_count).fill(0);
        this._Target = new Array(params_count).fill(0);
        this._RepeatStart = new Array(params_count).fill(0);
        this._JumpTarget = null;
        this._Jumping = false;
        this._ParameterCount = params_count;
        this._StateIndex = 0; // 0: idle, 1:running
        this._StateLocked = false;
        this._StartSwitcher = false;
        this._StartingParams = null; // 临时存储启动时的参数，启动真正开始后，此缓存就作废
        this._PausedCallback = null;
        this._EndCallback = null;
        this._NextEndCallback = null;
        this._Token = 0;
        this._Repeat = false;
        this._OnRepeatCallback = null;
        this._SpriteView = null;
    }

    setRepeat(enable, repeat_callback) {
        this._Repeat = enable;
        if (enable) {
            this._OnRepeatCallback = repeat_callback;
        } else {
            this._OnRepeatCallback = null;
        }
    }

    resetRepeat() {
        this._Repeat = false;
        this._OnRepeatCallback = null;
    }

    start(start_params, end_callback) {
        // 取消旧的Callback
        this._NextEndCallback = end_callback;
        this._EndCallback = null;

        this._StartingParams = start_params;
        this._StartSwitcher = true;
        this._Jumping = false;
        this._StateMachineNext();
    }

    pause(paused_callback) {
        // 执行pause动作时，相当于取消start()动作，所以EndCallback同时也应该被取消
        if (this._EndCallback != null || this._NextEndCallback != null) {
            this._EndCallback = null;
            this._NextEndCallback = null;
        }

        // 根据当前状态，已经处于Pause则直接回调，否则发送pause指令
        if (this._StateIndex == 0) {
            if (paused_callback) {
                this._CallbackWithCatch(this._Current, paused_callback, this._StartingParams/* 使用最后一次启动参数作为回调 */);
            }
        } else {
            if (paused_callback) {
                this._PausedCallback = paused_callback;
            }
            this._StateMachineNext();
        }
    }

    jump() {
        this._JumpTarget = [...this._Target];
        this._Jumping = true;
        this._StartSwitcher = true;
        this._StateMachineNext();
    }

    startFpsTesting() {
        Forge.sRenderBridge.SetStepFpsSwitch(true);
    }

    stopFpsTesting() {
        Forge.sRenderBridge.SetStepFpsSwitch(false);
    }

    _WrapBuildAnimation(repeat_start_array, current_array, tos_array, act_jump, start_params) {
        console.warn("Should Override");
    }

    _WrapCallback(currents, callback) {
        console.warn("Should Override");
    }

    _WrapReCalculateCurrent(froms, tos, progress, start_params) {
        console.warn("Should Override");
    }

    _CallbackWithCatch(currents, callback, start_params) {
        try {
            this._WrapCallback(currents, callback, start_params);
        } catch(e) {
            console.error("Error:in callback:", e);
        }
    }

    _StateMachineNext() {
        if (this._StateLocked) {
            // 内部处理进行中，暂停状态切换
            return;
        }

        if (this._StateIndex == 0) {
            // Idle -> play, need switcher
            if (this._StartSwitcher) {
                this._StartSwitcher = false;
                if (this._StartAnimation()) {
                    this._StateIndex = 1;
                }
            }
        } else if (this._StateIndex == 1) {
            // Play -> idle, no need switcher
            this._StopAnimation();
        }
    }

    _StartAnimation() {
        // 当动画开始后才进行回调设置，防止Pause过程中直接调用了新设置进的回调
        this._EndCallback = this._NextEndCallback;
        this._NextEndCallback = null;

        let start_params = this._StartingParams;
        this._StartingParams = null;

        let froms = (this._JumpTarget ? [...this._JumpTarget] : [...this._Current]);
        let tos = this._Target;
        let repeat_starts = (this._Repeat ? [...this._RepeatStart] : null);

        let token = this._Token++;

        let anim = this._WrapBuildAnimation(repeat_starts, froms, tos, this._Jumping, start_params);

        // clear jump status
        this._JumpTarget = null;
        this._Jumping = false;

        if (anim == null) {
            return;
        }

        // 生成OnFinalProgress处理监听，memo在 _WrapBuildAnimation()处理后生成，因为build处理中可能改变tos
        let memo_tos = [...tos];
        let that = this;
        let listener = (new Forge.AnimationListener())
            .OnFinalProgress((progress)=>{
                that._OnPaused((repeat_starts != null ? repeat_starts : froms), memo_tos, progress, start_params);
            });

        if (this._OnRepeatCallback) {
            listener.OnRepeat((times)=>{
                if (that._OnRepeatCallback) {
                    that._OnRepeatCallback(times);
                }
            });
        }

        anim.AddAnimationListener(listener);
        anim.Enable(Forge.AnimationEnable.KeepTransform);
        if(this._Repeat) {
            anim.EnableInfinite();
        }
        this._SpriteView.StartAnimation(anim);

        return true; // success
    }

    _StopAnimation() {
        this._SpriteView.StopAnimation();
    }

    _OnPaused(froms, tos, progress, start_params) {
        // 根据froms, tos, progress信息更新this._Current
        this._WrapReCalculateCurrent(froms, tos, progress, start_params);

        this._StateLocked = true;
        // 换出callbacks，回调时可能加入新的callbacks
        let paused_callback = this._PausedCallback;
        let ended_callback = this._EndCallback;
        this._PausedCallback = null;
        this._EndCallback = null;

        // 回调所有callback
        if (paused_callback) {
            // Paused callback
            this._CallbackWithCatch(this._Current, paused_callback, start_params);
        }
        if (ended_callback && progress == 1) {
            // Ended callback
            this._CallbackWithCatch(this._Current, ended_callback, start_params);
        }

        this._StateLocked = false;

        this._StateIndex = 0; // mark idle
        let that = this;
        that._StateMachineNext(); // Trigger next start
    }

    _SetView(jsv_view) {
        this._SpriteView = jsv_view;
    }
}

var ActorControlBase = JsvControl;

class JsvActorBase extends React.Component{
    /**
     * @description: 属性说明
     * @param {ActorControlBase} Actor动作控制器 必需
     */
    constructor(props) {
        super(props);
        this._LinkedControl = props.control;
        this._ElementRef = React.createRef();

        // 校验合法性
        if (!this._LinkedControl || !(this._LinkedControl instanceof ActorControlBase)) {
            console.error("Error: Need set Control!");
        }
    }

    render() {
        let {control, ...other_prop} = this.props;
        return (
            <div ref={this._ElementRef} {...other_prop} />
        );
    }

    componentDidMount() {
        // 将JsView的Forge.LayoutView关联给control
        this._LinkedControl._SetView(this._ElementRef.current.jsvMainView);
    }
}

export {
    JsvActorBase,
    ActorControlBase
};
