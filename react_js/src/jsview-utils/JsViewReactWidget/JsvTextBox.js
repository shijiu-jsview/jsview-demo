/*
 * 【控件介绍】
 * JsvTextBox：文字的垂直对齐方式显示控件
 *                  verticalAlign {string}  垂直对齐方式 (必需) top、middle、bottom
 *                  layoutStyles {array}  布局样式(必需)，数组中可包含样式对象或者JsvStyleClass对象，
 *                                         样式对象内容为{left:0, top:0, width:xxx, height:xxx}，
 *                                         布局样式为数组中所有样式的合并。
 *                  fontStyles {array} 字体样式数组(必需)，由object或JsvTextStyleClass组成
 *                                                          布局样式为数组中所有样式的合并。
 *                                                          数组中只有单个JsvTextStyleClass时，可加速渲染性能
 *                  styleToken {string}  类似于react html元素的key，当style变化时，由使用者改变此Token通知hoc进行style重新识别。
 *                                      Token不变的场景，props变化不会引起render，以提高渲染性能
 */

import React from "react";
import PropTypes from "prop-types";
import {combinedStyles, JsvTextStyleClass} from "../JsViewReactTools/JsvStyleClass";

const JSV_TEXT_VERTICAL_ALIGN_NAME = "jsv_text_vertical_align";
class JsvTextBox extends React.Component {
    constructor(props) {
        super(props);
        this._LayoutStyle = null;
        this._FontStyle = null;
        this._FontStyleClass = null;
        this._TokenProcessed = null;
    }

    shouldComponentUpdate(next_props, next_state) {
        return (
            next_props.styleToken !== this.props.styleToken
            || next_props.verticalAlign !== this.props.verticalAlign
            || next_props.children !== this.props.children
        );
    }

    render() {
        this._AnalyzeStyleChange();

        if (window.JsvDisableReactWrapper) {
            return (
                <div style={this._LayoutStyle}>
                    <div style={{position: "static", display: 'table'}}>
                        <div className={this._FontStyleClass}
                             style={{
                                 position: "static",
                                 display: 'table-cell',
                                 width: this._LayoutStyle.width, height: this._LayoutStyle.height,
                                 ...this._FontStyle,
                                 verticalAlign: this.props.verticalAlign,
                             }}
                        >{this.props.children}</div>
                    </div>
                </div>
            )
        } else {
            return (
                <div style={this._LayoutStyle}>
                    <div className={this._FontStyleClass}
                         jsv_text_vertical_align={this.props.verticalAlign}
                         style={{
                             width: this._LayoutStyle.width, height: this._LayoutStyle.height,
                             ...this._FontStyle,
                         }}
                    >{this.props.children}</div>
                </div>)
        }
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

            // 校验 vertical align 变化，看是否能加速文字描画
            if (this.props.fontStyles.length === 1 && this.props.fontStyles[0] instanceof JsvTextStyleClass) {
                if (!this.props.fontStyles[0].appendJsvAttributes(JSV_TEXT_VERTICAL_ALIGN_NAME, this.props.verticalAlign)) {
                    console.warn("WARN: found vertical align changed of class, may cause lower performance");
                }
            }

            this._TokenProcessed = this.props.styleToken;
        }
    }
}

JsvTextBox.propTypes = {
    verticalAlign: PropTypes.string, // "top", "middle", "bottom"
    layoutStyles: PropTypes.array, // 布局样式(包含x,y,width,height,backgroundColor)
    fontStyles: PropTypes.array, // 文字样式
    styleToken: PropTypes.string, // 样式是否变更的标识位
}

JsvTextBox.defaultProps = {
    verticalAlign: 'middle',
    layoutStyles:[{
        left: 0,
        top: 0,
        width: 100,
        height: 20,
        backgroundColor: undefined,
    }],
    fontStyle: [{
        color: 'rgba(255,255,255,1.0)',
        fontSize: 10,
        textAlign: 'center',
        lineHeight: '20px'
    }]
}

export default JsvTextBox
