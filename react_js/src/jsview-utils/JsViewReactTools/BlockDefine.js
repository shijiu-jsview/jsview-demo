/**
 * Created by donglin.lu@qcast.cn on 11/13/2020.
 */

/*
 * 【模块 export 内容】
 * FocusBlock: React高阶组件/ 面向对象的类，被FdivRouter统一管理的可获焦控件，
 *			控制按键事件按照焦点链进行流转
 *
 *      props说明:
 *          branchName {String} 节点名称，用于changeFocus时指定的参数
 *
 *      接口函数: (参数说明见函数本体)
 *          changeFocus(branch_name, keep_child_focus)
 *              主动式控制焦点切换
 *
 *      需要重载的事件回调/处理：(参数说明见函数本体)
 *          renderContent()
 *              功能：替代React控件的render，描绘的内容写在此函数中
 *          onKeyDown(ev)
 *              功能：本控件或子控件获焦时，按键按下时的回调处理，处理子控件处理完后流出的事件
 *              处理子控件处理完后流出的事件，可以阻止事件流出到自己的父控件
 *          onKeyUp(ev)
 *              功能：本控件或子控件获焦时，按键抬起时的回调处理，
 *              处理子控件处理完后流出的事件，可以阻止事件流出到自己的父控件
 *          onDispatchKeyDown(ev)
 *              功能：本控件或子控件获焦时，按键按下时的回调处理，
 *              在子控件处理前处理事件，可以阻止子控件收到事件
 *          onDispatchKeyUp(ev)
 *              功能：本控件或子控件获焦时，按键抬起时的回调处理，
 *              在子控件处理前处理事件，可以阻止子控件收到事件
 *          onFocus()
 *              功能：当本控件或子控件从非焦点状态变更成焦点状态时的回调
 *              子控件获焦时，回调调用顺序先于子控件
 *          onBlur()
 *              功能：当本控件或子控件从焦点状态变更成非焦点状态时的回调
 *              子控件失焦时，回调调用顺序晚于子控件
 *
 * convertToFocusBlock: 函数，将一个React组件包装成FocusBlock，注意:描画函数不用改成renderContent
 */

import React from 'react';
import { FdivWrapper,enableFocusable } from "../jsview-react/index_widget.js"

class FocusBlock extends FdivWrapper {
	constructor(props) {
		super(props);

		// TODO: 将来吧 _NavigateHome 这个与 FocusBlock 无关，但所有Demo界面用到的属性封装到外部
		this._NavigateHome = null;
		if (props) {
			this._NavigateHome = props.navigateHome;
		}
	}

	/*
	 * changeFocus 参数说明:
	 *      branch_name (String) 焦点切换目标FocusBlock的名字
	 *      keep_child_focus (Boolean) 是否延续子焦点的获焦状态，
	 *                              例如指定目标控件为一个父控件，在此父控件失焦前，其某个子控件是焦点。
	 *                              当这个父控件重新获焦时，子控件获焦的焦点链继续保持
	 *  返回值
	 *      boolean     branch_name对应的控件是否找到
	 */
	changeFocus(branch_name, keep_child_focus) {
		return super.changeFocus(branch_name, keep_child_focus)
	}

	/*
	 * renderContent 参数说明:
	 *      无
	 */
	renderContent() {

	}

	/*
	 * onKeyDown 参数说明:
	 *      ev (Object) 标准html的按键事件格式，含有keyCode, repeat
	 */
	onKeyDown(ev) {
		return false;
	}

	/*
	 * onKeyUp 参数说明:
	 *      ev (Object) 标准html的按键事件格式，含有keyCode, repeat
	 */
	onKeyUp(ev) {
		return false;
	}

	/*
	 * onDispatchKeyDown 参数说明:
	 *      ev (Object) 标准html的按键事件格式，含有keyCode, repeat
	 */
	onDispatchKeyDown(ev) {
		return false;
	}

	/*
	 * onDispatchKeyUp 参数说明:
	 *      ev (Object) 标准html的按键事件格式，含有keyCode, repeat
	 */
	onDispatchKeyUp(ev) {
		return false;
	}

	/*
	 * onFocus 参数说明:
	 *      无
	 */
	onFocus() {

	}

	/*
	 * onBlur 参数说明:
	 *      无
	 */
	onBlur() {

	}
}

/*
 * convertToFocusBlock 参数说明:
 *      base_class (React.Component) 需要转化成FocusBlock的React组件,
 *                                  传入的组件不需要重载renderContent，使用render进行渲染即可
 *                                  传入的组件应重载onKeyDown/onKeyUp/onFocus/onBlur...(非必须)等关注的回调
 *                                  转化完成后，可以使用this.changeFocus来切换焦点
 */
function convertToFocusBlock(base_class) {
	return enableFocusable(base_class);
}

export {
	FocusBlock,
	convertToFocusBlock
}