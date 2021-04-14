/**
 * Created by donglin.lu@qcast.cn on 10/12/20.
 */

// JsvMarquee comes from JsView React Project
/*
 * 【控件介绍】
 * JsvMarquee2：跑马灯控件，区别于JsvMarquee，支持JsvStyleClass输入到style列表中
 *                  text: 控件中显示的文字内容
 *                  layoutStyles {array}  布局样式(必需)，数组中可包含样式对象或者JsvStyleClass对象，
 *                                         样式对象内容为{left:0, top:0, width:xxx, height:xxx}，
 *                                         布局样式为数组中所有样式的合并。
 *                  fontStyles {array} 字体样式数组(必需)，由object或JsvTextStyleClass组成
 *                                       布局样式为数组中所有样式的合并。可加速渲染性能
 *                  styleToken {string}  类似于react html元素的key，当style变化时，由使用者改变此Token通知hoc进行style重新识别。
 *                                      Token不变的场景，props变化不会引起render，以提高渲染性能
 */

import React from 'react';
import './JsvMarquee.css';
import PropTypes from "prop-types";
import { Forge } from "../JsViewEngineWidget/index_widget";
import { JsvStyleClass, JsvTextStyleClass, combinedStyles } from "../JsViewReactTools/JsvStyleClass";

const CONST_SLIDE_SPEED = 60; // 60px per second


const sDefaultLayoutStyle = new JsvStyleClass({
  left: 0,
  top: 0,
  width: 0,
  height: 20,
});

const sDefaultFontStyle = new JsvTextStyleClass({
  color: 'rgba(255,255,255,1.0)',
  fontSize: 10,
  textAlign: 'center',
  lineHeight: '20px'
});

const sCommonFontStyle = new JsvTextStyleClass({
  whiteSpace: 'nowrap'
});

class JsvMarquee2 extends React.Component {
  constructor(props) {
    super(props);
    this._textRef = React.createRef();
    this._sliderRef = React.createRef();
    this._asyncTextLenTimer = -1;
    this._rollTimeId = -1;
    this._animationCount = 0;

    this._LayoutStyle = null;
    this._FontStyle = null;
    this._FontStyleClass = null;
    this._TokenProcessed = null;

    // 解析Style
    this._AnalyzeStyleChange();

    this.state = {
      width: this._LayoutStyle.width,
    };
  }

  shouldComponentUpdate(next_props, next_state) {
    return (
      next_props.styleToken !== this.props.styleToken
            || next_props.text !== this.props.text
    );
  }

  componentDidUpdate() {
    this._asyncStartSlider();
  }

  componentDidMount() {
    this._asyncStartSlider();
  }

  _asyncStartSlider() {
    // 清理之前的Slider处理
    this._resetSlider();

    // 稍进行延迟，以等待JsView的native端描绘文字并回传文字宽度
    if (this._asyncTextLenTimer < 0) {
      this._asyncTextLenTimer = setTimeout(() => {
        if (this._textRef.current.clientWidth > this._LayoutStyle.width) {
          this._slideNextStep();
        }
        this._asyncTextLenTimer = -1;
      }, 500);
    }
  }

  _resetSlider() {
    if (this._rollTimeId >= 0) {
      clearTimeout(this._rollTimeId);
      this._rollTimeId = -1;
    }
    this._animationCount = 0;
    this._sliderRef.current.jsvMaskView.StopAnimation();
  }

  componentWillUnmount() {
    // 清理所有异步处理，并停止Slider动作
    if (this._asyncTextLenTimer >= 0) {
      clearTimeout(this._asyncTextLenTimer);
      this._asyncTextLenTimer = -1;
    }
    this._resetSlider();
  }

  _slideNextStep() {
    const text_width = this._textRef.current.clientWidth;
    if (this._animationCount % 2 === 0) {
      // 文字从原始位置，向左移动出屏幕(每次完整移动，停顿1秒)
      this._rollTimeId = setTimeout(() => {
        this._rollTimeId = -1;
        const anim = new Forge.TranslateFrameAnimation(
          0, -text_width, CONST_SLIDE_SPEED, true, 0, 0);
        anim.SetAnimationListener(new Forge.AnimationListener(null, (ended) => {
          if (ended) {
            // 正常结束，非Cancel时，进行下一个动作
            this._slideNextStep();
          }
        }, null));
        anim.Enable(Forge.AnimationEnable.ReleaseAfterEndCallback);
        this._sliderRef.current.jsvMaskView.StartAnimation(anim);
        this._animationCount += 1;
      }, 1000);
    } else {
      // 文字从右边屏幕外部，移动回屏幕中的文字原始位置
      const anim = new Forge.TranslateFrameAnimation(
        this._LayoutStyle.width, 0, CONST_SLIDE_SPEED, true, this._LayoutStyle.width, 0);
      anim.SetAnimationListener(new Forge.AnimationListener(null, (ended) => {
        if (ended) {
          // 正常结束，非Cancel时，进行下一个动作
          this._slideNextStep();
        }
      }, null));
      this._sliderRef.current.jsvMaskView.StartAnimation(anim);
      this._animationCount += 1;
    }
  }

  render() {
    this._AnalyzeStyleChange();

    return (
            <div key="container"
                 style={{ ...this._LayoutStyle, overflow: "hidden" }}>
                <div key="slider" ref={this._sliderRef}
                     style={{
                       left: 0,
                       top: 0,
                       width: this.state.width,
                       height: this._LayoutStyle.height,
                     }}>
                    <div key="text" ref={this._textRef}
                         className={this._FontStyleClass}
                         style={{ ...this._FontStyle,
                           height: this._LayoutStyle.height}}
                    >
                        {this.props.text}
                    </div>
                </div>
            </div>
    );
  }

  _AnalyzeStyleChange() {
    if (this.props.styleToken !== this._TokenProcessed) {
      // Token变化时，重新解析style array
      const layout_set = combinedStyles(this.props.layoutStyles, true);
      const font_set = combinedStyles([...this.props.fontStyles, sCommonFontStyle]);

      this._LayoutStyle = layout_set.combinedStyle;
      this._FontStyle = font_set.combinedStyle;

      this._FontStyleClass = font_set.combinedClass;
      if (this._FontStyleClass.length === 0) {
        this._FontStyleClass = null;
      }

      this._TokenProcessed = this.props.styleToken;
    }
  }
}

JsvMarquee2.propTypes = {
  text: PropTypes.string, // 跑马灯中的文字
  layoutStyles: PropTypes.array, // 布局样式(包含x,y,width,height,backgroundColor)
  fontStyles: PropTypes.array, // 文字样式
  styleToken: PropTypes.string, // 样式是否变更的标识位
};

JsvMarquee2.defaultProps = {
  text: '',
  layoutStyles: [sDefaultLayoutStyle],
  fontStyle: [sDefaultFontStyle]
};

export default JsvMarquee2;
