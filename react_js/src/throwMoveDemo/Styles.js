/**
 * Created by ludl on 10/15/20.
 */

import {JsvTextStyleClass} from "../jsview-utils/JsViewReactTools/JsvStyleClass"

let CssStyle = {};

CssStyle.FontStyle = new JsvTextStyleClass({
    fontSize:`32px`,
    color:'#73665C',
    lineHeight:`40px`,
    overflow: "hidden",
    whiteSpace: 'nowrap',
    textOverflow: "ellipsis",
    textAlign: 'center',
});
CssStyle.DetailFontStyle = new JsvTextStyleClass({
	fontSize:`16px`,
	color:'#f7f7eb',
	lineHeight:`30px`,
	overflow: "hidden",
	whiteSpace: 'nowrap',
	textOverflow: "ellipsis",
	textAlign: 'left',
});

export default CssStyle;
