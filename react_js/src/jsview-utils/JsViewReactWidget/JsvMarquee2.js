import React from 'react';
import './JsvMarquee.css';
import PropTypes from "prop-types";
import {getKeyFramesGroup} from './JsvDynamicKeyFrames'
import {combinedStyles} from "../JsViewReactTools/JsvStyleClass";

// JsvMarquee comes from JsView React Project
/*
 * 【控件介绍】
 * JsvMarquee2：跑马灯控件，区别于JsvMarquee，支持JsvStyleClass输入到style列表中
 *                  text: 控件中显示的文字内容
 *                  layoutStyles {array}  布局样式(必需)，数组中可包含样式对象或者JsvStyleClass对象，
 *                                         样式对象内容为{left:0, top:0, width:xxx, height:xxx}，
 *                                         布局样式为数组中所有样式的合并。
 *                  fontStyles {array} 字体样式数组(必需)，由object或JsvTextStyleClass组成
 *                                                          布局样式为数组中所有样式的合并。
 *                                                          数组中只有单个JsvTextStyleClass时，可加速渲染性能
 *                  styleToken {string}  类似于react html元素的key，当style变化时，由使用者改变此Token通知hoc进行style重新识别。
 *                                      Token不变的场景，props变化不会引起render，以提高渲染性能
 */

class JsvMarquee2 extends React.Component {
    constructor(props) {
        super(props);
        this._textRef = React.createRef();
        this._text = props.text;
        this._timerId = null;
        this._rollTimeId = null;
        this._KeyFrameStyleSheet = getKeyFramesGroup("marquee-tag");
        this._KeyFrameNames = {
            step1: null,
            step2: null,
        };
        this._LayoutStyle = null;
        this._FontStyle = null;
        this._FontStyleClass = null;
        this._TokenProcessed = null;

        // 解析Style
        this._AnalyzeStyleChange();

        this.state = {
            left: 0,
            width: this._LayoutStyle.width,
            animation: null,
            count: 0,
        }
    }

    shouldComponentUpdate(next_props, next_state) {
        return (
            next_props.styleToken !== this.props.styleToken
            || next_props.text !== this.props.text
            || next_state !== this.state.count
        );
    }

    componentDidMount() {
        this._timerId = setTimeout(() => {
            this._startAnimation();
        }, 1000);
    }

    componentWillUnmount() {
        if (this._timerId !== null) {
            clearTimeout(this._timerId);
            this._timerId = null;
        }
        if (this._rollTimeId !== null) {
            clearTimeout(this._rollTimeId);
            this._rollTimeId = null;
        }
    }

    _initKeyFrameAnim() {
        const text_width = this._textRef.current.clientWidth;
        let name1 = `step1-${text_width}-${this._LayoutStyle.width}`;
        let step1 = `@keyframes ${name1} {
                from{
                    transform:translate3d(0,0,0);
                }
                to{
                    transform:translate3d(${-text_width}px,0,0);
                }
            }`;
        let name2 = `step2-${text_width}-${this._LayoutStyle.width}`;
        let step2 = `@keyframes ${name2} {
                from{
                    transform:translate3d(${this._LayoutStyle.width}px,0,0)
                }
                to{
                    transform:translate3d(0,0,0)
                }
            }`;

        if (!this._KeyFrameStyleSheet.hasRule(name1)) {
            this._KeyFrameStyleSheet.insertRule(step1);
        }
        if (!this._KeyFrameStyleSheet.hasRule(name2)) {
            this._KeyFrameStyleSheet.insertRule(step2);
        }
        this._KeyFrameNames.step1 = name1;
        this._KeyFrameNames.step2 = name2;
    }

    _startAnimation() {
        const text_width = this._textRef.current.clientWidth;
        if (text_width > this._LayoutStyle.width) {
            this._initKeyFrameAnim();
            let overflowWidth = text_width;
            let container_left = 0;
            const duration = Math.ceil(text_width / 60);
            this.setState({
                left: container_left,
                width: overflowWidth,
                animation: this._KeyFrameNames.step1 + " " + duration + "s linear",
                count: 0,
            });
        }
    }

    _OnMovedEnd = ()=>{
        const text_width = this._textRef.current.clientWidth;
        if (this.state.count % 2 === 0) {
            let duration = Math.ceil(this._LayoutStyle.width / 60);
            this.setState({
                animation: this._KeyFrameNames.step2 + " " + duration + "s linear",
                count: this.state.count + 1,
            });
        } else {
            this._rollTimeId = setTimeout(() => {
                let duration = Math.ceil(text_width / 60);
                this.setState({
                    animation: this._KeyFrameNames.step1 + " " + duration + "s linear",
                    count: this.state.count + 1,
                });
            }, 1000);
        }
    };

    render() {
        this._AnalyzeStyleChange();

        return (
            <div key="container"
                 style={{...this._LayoutStyle, overflow: "hidden"}}>
                <div key="slider"
                     style={{
                         left: this.state.left,
                         top: 0,
                         width: this.state.width,
                         height: 100,
                         animation: this.state.animation
                     }}
                     onAnimationEnd={this._OnMovedEnd}>
                    <div key="text" ref={this._textRef}
                         className={this._FontStyleClass}
                         style={{...this._FontStyle,
                             height: this._LayoutStyle.height,
                             whiteSpace: 'nowrap'}}
                    >
                        {this._text}
                    </div>
                </div>
            </div>
        )
    }

    _AnalyzeStyleChange() {
        if (this.props.styleToken !== this._TokenProcessed) {
            // Token变化时，重新解析style array
            let layout_set = combinedStyles(this.props.layoutStyles, true);
            let font_set = combinedStyles(this.props.fontStyles);

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
    layoutStyles:[{
        left: 0,
        top: 0,
        width: 0,
        height: 20,
    }],
    fontStyle: [{
        color: 'rgba(255,255,255,1.0)',
        fontSize: 10,
        textAlign: 'center',
        lineHeight: '20px'
    }]
};

export default JsvMarquee2;
