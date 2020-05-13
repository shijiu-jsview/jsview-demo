/*
 * 【界面概述】
 * 用于展示FDiv控件来进行按键响应区块划分的样例。
 * 界面分为主界面(main)和副界面(sideBar)，当主界面右边缘再按下右键时，焦点跳到SiderBar区域，
 * 同理，焦点在SiderBar中，按下左键时，焦点调回main区域。
 * 除此外，为区域内焦点移动。
 *
 * 【控件介绍】
 * Fdiv：焦点控制节点，可由继承自FdivWrapper或者enableFocusable(基础类)生成衍生类两种方式获得
 *      属性(props):
 *          style {Object} 同div的style设置
 *          branchName {string} 焦点名称，用于changeFocus()函数进行焦点切换的id
 *
 *      FdivWrapper方式的类接口列表:
 *          onKeyDown(ev)  ev的结构为{keyCode:按键值, repeat:是否是重复按键}，响应按键按下事件，
 *                          返回值为true时，父节点的onKeyDown不会再被触发
 *          onKeyUp(ev)  ev的结构同上，响应按键抬起事件
 *          onDispatchKeyDown(ev) ev的结构同上，响应按键按下事件，返回值为true时，子节点的onDispatchKeyDown不会被触发
 *          onDispatchKeyUp(ev) ev的结构同上，响应按键抬起事件
 *          onFocus()   当被changeFocus改变焦点后，该节点获焦时被调用
 *          onBlur()    当被changeFocus改变焦点后，该节点丢失焦点时被调用
 *          renderContent()     替代render()函数，返回控件描绘内容
 *          changeFocus(branchName) 主动进行焦点切换
 *
 *      enableFocusable(基础类)生成衍生类时的节点列表：
 *          onKeyDown(ev) 同上
 *          onKeyUp(ev) 同上
 *          onDispatchKeyDown(ev) 同上
 *          onDispatchKeyUp(ev) 同上
 *          onFocus(ev) 同上
 *          onBlur(ev) 同上
 *          changeFocus(branchName) 同上
 *          注意: render()函数没有被renderContent()函数替代
 *
 * 【技巧说明】
 * Q: 如何进行按键响应？
 * A: 重载函数onKeyDown/onKeyUp/onDispatchKeyDown/onDispatchKeyUp中任何一个关心的按键事件响应函数，
 *    处理ev.keyCode判断按键值，通过返回值控制消息传递链是否中止
 *
 * Q: 如何进行焦点切换？
 * A: 首先为子焦点设置branchName属性，当需要进行焦点切换的时候，调用FDiv类中的this.changeFocus()接口，
 *    传入目标的branchName，即可进行焦点切换。在同一个FdivRouter节点的所有Fdiv，只要指定对方的branchName，就可以进行切换。
 *    不限制切换目标是自己的子节点、兄弟节点或者是父几点。一般一个场景定义一个FdivRouter
 */

import React, { Suspense } from 'react';
import {MainArea} from './MainArea'
import {SideBarArea} from './SideBarArea'
import { globalHistory } from '../demoCommon/RouterHistory';
import { FocusBlock } from "../demoCommon/BlockDefine"

class App extends FocusBlock{
	constructor(props) {
		super(props);
		this._FocusControl = null;
	}

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            globalHistory.goBack();
            this.changeFocus("/main");
        }
        return true;
    }

	renderContent() {
		return (
			<div>
				<MainArea style={{left:0}}/>
				<SideBarArea style={{left:300}}/>
			</div>
		)
	}

	componentDidMount() {
		// this.changeFocus("/main/L0C0");
		this.changeFocus("/sideBar/L0C0");
	}
}
export default App;
