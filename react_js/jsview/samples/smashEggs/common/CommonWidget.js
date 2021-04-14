/**
 * Created by luocf on 2020/3/21.
 */
import React from 'react';
import { Fdiv } from "../../../utils/JsViewEngineWidget/index_widget";


const Button = ({ branchName, theme, text, isFocus = false }) => {
  let style = theme.style;
  if (isFocus) {
    style = { ...style, ...theme.focusStyle };
  }
  return (<Fdiv branchName={branchName} style={style}>{text}</Fdiv>);
};
export { Button };
