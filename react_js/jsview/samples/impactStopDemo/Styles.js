/**
 * Created by ludl on 10/15/20.
 */

import { JsvTextStyleClass } from "../jsview-utils/JsViewReactTools/JsvStyleClass";

const CssStyle = {};

CssStyle.FontStyle = new JsvTextStyleClass({
  fontSize: `30px`,
  color: '#73665C',
  lineHeight: `40px`,
  overflow: "hidden",
  whiteSpace: 'nowrap',
  textOverflow: "ellipsis",
  textAlign: 'center',
});

export default CssStyle;
