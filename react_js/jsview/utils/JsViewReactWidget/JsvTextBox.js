/**
 * Created by chunfeng.luo@qcast.cn on 10/13/20.
 */

/*
 * JsvTextBox：React高阶组件，文字的垂直对齐方式显示控件
 *      props说明:
 *          verticalAlign {string}  垂直对齐方式 (必需) top、middle、bottom
 *          stylesList {array}    布局样式(必需)，数组中可包含样式对象或者JsvStyleClass，或者JsvTextStyleClass对象，
 *                                  样式对象内容为{left:0, top:0, width:xxx, height:xxx}，
 *                                  布局样式为数组中所有样式的合并。
 *          styleToken {string}     类似于react html元素的key，当style变化时，由使用者改变此Token通知hoc进行style重新识别。
 *                                  Token不变的场景，props变化不会引起render，以提高渲染性能
 *          enableLatex {bool}     是否启用Latex文字描画模式
 */

import React from "react";
import PropTypes from "prop-types";
import {
  combinedStyles,
  JsvTextStyleClass,
} from "../JsViewReactTools/JsvStyleClass";

const sAreaAlignStyleMap = new Map();

class JsvTextBox extends React.Component {
  constructor(props) {
    super(props);
    this._StyleCombined = null;
    this._StyleClasses = null;
    this._TokenProcessed = null;
  }

  shouldComponentUpdate(next_props, next_state) {
    return (
      next_props.styleToken !== this.props.styleToken ||
      next_props.verticalAlign !== this.props.verticalAlign ||
      next_props.children !== this.props.children
    );
  }

  render() {
    this._AnalyzeStyleChange();

    if (window.JsvDisableReactWrapper) {
      return (
        <div style={this._StyleCombined}>
          <div style={{ position: "static", display: "table" }}>
            <div
              style={{
                position: "static",
                display: "table-cell",
                width: this._StyleCombined.width,
                height: this._StyleCombined.height,
                verticalAlign: this.props.verticalAlign,
              }}
            >
              {this.props.children}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={this._StyleClasses}
        style={{
          ...this._StyleCombined,
        }}
        jsv_text_latex_enable={this.props.enableLatex ? "true" : ""}
      >
        {this.props.children}
      </div>
    );
  }

  _AnalyzeStyleChange() {
    if (this.props.styleToken !== this._TokenProcessed) {
      // Token变化时，重新解析style array
      const style_set = combinedStyles(
        this.props.stylesList,
        !window.JsvDisableReactWrapper // 无ReactWrapper时，全解析style属性
      );

      this._StyleCombined = style_set.combinedStyle;

      if (!window.JsvDisableReactWrapper) {
        this._StyleClasses = style_set.combinedClass;
        if (!sAreaAlignStyleMap.has(this.props.verticalAlign)) {
          const text_class = new JsvTextStyleClass({});
          text_class.setVerticalAlign(this.props.verticalAlign);
          sAreaAlignStyleMap.set(this.props.verticalAlign, text_class);
        }
        const va_set_class = sAreaAlignStyleMap.get(this.props.verticalAlign);
        if (this._StyleClasses.length === 0) {
          this._StyleClasses += va_set_class.getName();
        } else {
          this._StyleClasses =
            this._StyleClasses + " " + va_set_class.getName();
        }
      }
      this._TokenProcessed = this.props.styleToken;
    }
  }
}

JsvTextBox.propTypes = {
  verticalAlign: PropTypes.string, // "top", "middle", "bottom"
  stylesList: PropTypes.array, // JsvStyleClass/JsvTextStyleClass样式列表(包含x,y,width,height,backgroundColor)
  styleToken: PropTypes.string, // 样式是否变更的标识位
  enableLatex: PropTypes.bool,
};

JsvTextBox.defaultProps = {
  verticalAlign: "middle",
  stylesList: [
    {
      left: 0,
      top: 0,
      width: 100,
      height: 20,
      backgroundColor: undefined,
    },
    {
      color: "rgba(255,255,255,1.0)",
      fontSize: 10,
      textAlign: "center",
      lineHeight: "20px",
    },
  ],
  enableLatex: false,
};

export default JsvTextBox;
