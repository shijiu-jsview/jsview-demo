/**
 * Created by luocf on 2020/5/12.
 */
import React from 'react';
import {JsvSpriteTranslate, TranslateControl} from "../../../../../jsview-utils/JsViewReactWidget/JsvSpriteTranslate"
import ScrollPage from "./ScrollPage"

class ProgressBar extends ScrollPage {
    /**
     * @param style {width, height}
     * @param totalBG 进度条背景信息
     * @param progressBG 进度条前景色信息
     * @param speed 速度
     * @param direction 进度条朝向 horizontal/vertical //TODO 需适配vertical
     * @return {XML}
     */
    constructor(props) {
        super(props);
        console.log("ProgressBar constructor");
        this._ClipControl = new TranslateControl();
        this._ClipControl.speed(this.props.speed)
        this._ProgressControl = new TranslateControl();
        this._ProgressControl.speed(this.props.speed);
        this._IsPause = false;
    }

    _onAnimationEnd() {
        console.log("ProgressBar _onAnimationEnd");
        this._IsPause = true;
        if (this.props.onEnd) {
            this.props.onEnd();
        }
    }

    _TriggerPauseEndCallback(clip_already_paused, progress_already_paused, pause_end_callback) {
        if (clip_already_paused && progress_already_paused && pause_end_callback) {
            pause_end_callback();
        }
    }

    pause(pause_end_callback) {
        if (!this._IsPause) {
            this._IsPause = true;
            let clip_already_paused = false;
            let progress_already_paused = false;
            this._ClipControl.pause((x,y)=>{
                clip_already_paused = true;
                this._TriggerPauseEndCallback(clip_already_paused, progress_already_paused, pause_end_callback);
            });

            this._ProgressControl.pause((x,y)=>{
                progress_already_paused = true;
                this._TriggerPauseEndCallback(clip_already_paused, progress_already_paused, pause_end_callback);
            });
        }
    }

    play(percent_distance) {
        if (this._IsPause) {
            this._IsPause = false;
            this._ClipControl.targetX(percent_distance*this.props.style.width).jump();
            this._ProgressControl.targetX(-percent_distance*this.props.style.width).jump();
        }

        this._ClipControl.targetX(this.props.style.width).start(()=>{
            console.log("_ClipControl end");
            this._onAnimationEnd();
        });
        this._ProgressControl.targetX(-this.props.style.width).start(()=>{
            console.log("_ProgressControl end");
        });
    }

    render() {
        return (
            <div style={{
                left:this.props.style.left, top:this.props.style.top, width: this.props.style.width, height: this.props.style.height,
            }}>
                <div style={{
                    width: this.props.style.width, height: this.props.style.height, backgroundImage: this.props.totalBG
                }}></div>
                <JsvSpriteTranslate key="ProgressTranslate1"
                                    style={{left: -this.props.style.width, top:0,
                                        width:this.props.style.width,height:this.props.style.height,
                                        }}
                                    control={this._ClipControl}>
                    <div style={{
                        width: this.props.style.width,
                        height: this.props.style.height,
                        overflow: "hidden"
                    }}>
                        <JsvSpriteTranslate key="ProgressTranslate2"
                                            style={{left:this.props.style.width, top:0,
                                                width:this.props.style.width,height:this.props.style.height,
                                                }}
                                            control={this._ProgressControl}>
                            <div style={{
                                width: this.props.style.width,
                                height: this.props.style.height,
                                backgroundImage: this.props.progressBG
                            }}/>
                        </JsvSpriteTranslate>
                    </div>
                </JsvSpriteTranslate>

            </div>
        )
    }
}

export default ProgressBar;