import React from 'react';
import {FdivWrapper} from "../jsview-react/index_widget.js"

// 继承的写法，FdivWrapper集成于React.Component，以此为基础再次继承
// changeFocus接口，在FdivWrapper中，可以直接调用
class FocusBlock extends FdivWrapper {
	constructor(props) {
		super(props);
		this._NavigateHome = props.navigateHome;
	}

	// 直接集成自FdivWrapper的场合，使用renderContent而不是render进行布局
	renderContent() {

	}

	onKeyDown(ev) {
		return false;
	}

	onKeyUp(ev) {
		return false;
	}

	onDispatchKeyDown(ev) {
		return false;
	}

	onDispatchKeyUp(ev) {
		return false;
	}

	onFocus() {

	}

	onBlur() {

	}
}

export {
	FocusBlock
}