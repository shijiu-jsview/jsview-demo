/**
 * Created by ludl on 12/16/20.
 */

// JsvScaleTextBox comes from JsView React Project
/*
 * 【控件介绍】
 * JsvScaleTextBox：
 *          创建一个div，可以控制其内部的文字图层的清晰度，
 *          当文字被放大(例如焦点所在位置放大效果)时发现文字显示模糊的场景，
 *          将这些文字都放入到本控件中，设置scale属性等于文字的缩放大小，即可解决显示清晰问题。
 *
 *      prop说明:
 *          definitionScale   内部文字被放大的倍数，写法为"1.0x", "1.6x"
 *          其他    同div的其他props，例如style, class等
 */

import React from "react";
import PropTypes from "prop-types";

class JsvScaleTextBox extends React.Component {
  render() {
    const { definitionScale, ...other_props } = this.props; // Remove holders from children

    return <div jsv_text_definition={definitionScale} {...other_props} />;
  }
}

JsvScaleTextBox.propTypes = {
  definitionScale: PropTypes.string,
};

export default JsvScaleTextBox;
