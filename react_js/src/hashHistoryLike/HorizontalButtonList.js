import React from 'react';
import {FocusBlock} from "../demoCommon/BlockDefine"
import {SimpleWidget, VERTICAL, EdgeDirection} from "../jsview-utils/jsview-react/index_widget.js"
import ButtonView from "./ButtonView"

let CONST_FOCUS_FRAME_PADDING = 10; // 留给显示焦点框的余白控件(防止被overflow:hidden的裁剪

/**
 * @description: 属性说明
 *      data {object}  (必需)按钮设定，每个包含
 *                      w : 单个按钮宽度
 *                      h : 单个按钮高度
 *                      name: 按钮的文字描素
 *                      click: 点击后的响应函数
 *      gap        {int}    (必需)按钮之间的缝隙宽度
 *      branchName {String} (必需)用于Fdiv焦点控制的别名
 *      maxWidth   {int}    (可选)渲染区域的总宽度，按钮会在这个区域内居中，如果不设置则为左对齐
 */

class HorizontalButtonList extends React.Component{
	constructor(props) {
		super(props);
	}

	_RenderItem = (item) => {
		return (
			<ButtonView
				width = {item.w}
				height = {item.h}
				backgroundColor = {"#0FF000"}
				focused = {false}
				text = {item.name}
			/>
		);
	}

	_RenderFocus = (item) => {
		return (
			<ButtonView
				width = {item.w}
				height = {item.h}
				backgroundColor = {"#0FF000"}
				focused = {true}
				text = {item.name}
			/>
		);
	}

	_Measures = (item) => {
		return SimpleWidget.getMeasureObj(
			item.w + this.props.gap,
			item.h,
			true, false)
	}

	_onClick = (item) => {
		item.click();
	}

	shouldComponentUpdate(next_props, next_state) {
		// 仅当数据变更时刷新
		return (next_props.data != this.props.data);
	}

	render() {
		// 根据maxWidth，计算buttons的左边位置
		let left_offset = 0;
		let list_width = 0;
		let list_height = 0;
		for (let item of this.props.data) {
			list_width += item.w + this.props.gap;
			if (item.h > list_height) {
				list_height = item.h;
			}
		}

		if (this.props.maxWidth > 0) {
			let width_center = list_width - this.props.gap; // 减去最后一个元素的gap
			if (width_center < this.props.maxWidth) {
				left_offset = Math.floor((this.props.maxWidth - width_center) / 2);
			}
		}

		return(
			<SimpleWidget
				left={left_offset}
				width={list_width + CONST_FOCUS_FRAME_PADDING * 2}
				height={list_height + CONST_FOCUS_FRAME_PADDING * 2}
				padding={{
					left: CONST_FOCUS_FRAME_PADDING,
					right: CONST_FOCUS_FRAME_PADDING,
					top: CONST_FOCUS_FRAME_PADDING,
					bottom: CONST_FOCUS_FRAME_PADDING
				}}
				direction={ VERTICAL } // 选择一行行排布，纵向无限排列下去的方式
				data={ this.props.data }
				onClick={this._onClick}
				renderItem={ this._RenderItem }
				renderFocus={ this._RenderFocus }
				measures={ this._Measures }
				branchName={this.props.branchName}
			/>
		)
	}
}

export default HorizontalButtonList;