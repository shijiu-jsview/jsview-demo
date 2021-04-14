/**
 * Created by luocf on 2020/5/12.
 */
import React from 'react';
import { JsvActorMove, JsvActorMoveControl } from "../../../../../jsview-utils/JsViewReactWidget/JsvActorMove";
import ScrollPage from "./ScrollPage";

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
    this._ClipControl = new JsvActorMoveControl();
    this._ProgressControl = new JsvActorMoveControl();
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
      this._ClipControl.pause((x, y) => {
        clip_already_paused = true;
        this._TriggerPauseEndCallback(clip_already_paused, progress_already_paused, pause_end_callback);
      });

      this._ProgressControl.pause((x, y) => {
        progress_already_paused = true;
        this._TriggerPauseEndCallback(clip_already_paused, progress_already_paused, pause_end_callback);
      });
    }
  }

  play(percent_distance) {
    if (this._IsPause) {
      this._IsPause = false;
      this._ClipControl.jumpTo(percent_distance * this.props.style.width, 0);
      this._ProgressControl.jumpTo(-percent_distance * this.props.style.width, 0);
    }

    this._ClipControl.moveToX(this.props.style.width, this.props.speed * 1.5, () => {
      console.log("_ClipControl end");
      this._onAnimationEnd();
    });
    this._ProgressControl.moveToX(-this.props.style.width, this.props.speed * 1.5, () => {
      console.log("_ProgressControl end");
    });
  }

  render() {
    return (
            <div style={{
              left: this.props.style.left, top: this.props.style.top, width: this.props.style.width, height: this.props.style.height,
            }}>
                <div style={{
                  width: this.props.style.width, height: this.props.style.height, backgroundImage: this.props.totalBG
                }}></div>
                <JsvActorMove key="ProgressTranslate1"
                                    style={{ left: -this.props.style.width,
                                      top: 0,
                                      width: this.props.style.width,
                                      height: this.props.style.height,
                                    }}
                                    control={this._ClipControl}>
                    <div style={{
                      width: this.props.style.width,
                      height: this.props.style.height,
                      overflow: "hidden"
                    }}>
                        <JsvActorMove key="ProgressTranslate2"
                                            style={{ left: this.props.style.width,
                                              top: 0,
                                              width: this.props.style.width,
                                              height: this.props.style.height,
                                            }}
                                            control={this._ProgressControl}>
                            <div style={{
                              width: this.props.style.width,
                              height: this.props.style.height,
                              backgroundImage: this.props.progressBG
                            }}/>
                        </JsvActorMove>
                    </div>
                </JsvActorMove>

            </div>
    );
  }
}

export default ProgressBar;
