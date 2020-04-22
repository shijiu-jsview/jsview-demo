import React from 'react';
import {SimpleWidget, VERTICAL, SlideStyle} from "../../jsview-utils/jsview-react/index_widget.js"
import { FocusBlock } from "../../demoCommon/BlockDefine"

const Title = ({text, style}) => {
	return <div style={style}>{text}</div>
};

const ItemTitle = ({text, style}) => {
	return <div style={style}>{text}</div>
}

class MenuWidget extends FocusBlock {
	constructor(props) {
		super(props);
		this._OnClick = this._OnClick.bind(this);
		this._Measures = this._Measures.bind(this);
		this._RenderItem = this._RenderItem.bind(this);
		this._RenderFocus = this._RenderFocus.bind(this);
		this._RenderBlur = this._RenderBlur.bind(this);
	}
	_OnClick(id) {
		//close self
		this.props.onClose();
	}
	_Measures(item) {
		return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
	}

	_RenderFocus(item) {
		return (
			<ItemTitle text={item.title} style={this.props.pageTheme.content.title.focusStyle}/>
		)
	}

	_RenderBlur(item, callback) {
		return (
			<ItemTitle text={item.title} style={this.props.pageTheme.content.title.normalStyle}/>
		)
	}

	_RenderItem(item) {
		return (
			<ItemTitle text={item.title} style={this.props.pageTheme.content.title.normalStyle}/>
		)
	}

	onFocus() {
		this.changeFocus(this.props.branchName + "/MenuList");
	}

	renderContent() {
		console.log("render MenuWidget");
		return (
			<div style={this.props.style}>
				<Title key="title" text={this.props.title} style={this.props.pageTheme.title.style}/>
				<div key="content" style={{left: this.props.pageTheme.content.left, top: this.props.pageTheme.content.top}}>
					<SimpleWidget
						width={ this.props.pageTheme.content.width }
						height={ this.props.pageTheme.content.height}
						padding={ this.props.pageTheme.content.padding}
						direction={ VERTICAL }
						data={ this.props.data }
						dispatcher={this.props.dispatcher}
						slideStyle={ SlideStyle.seamless }
						onEdge={ this.props.onEdge}
						renderBlur={ this._RenderBlur }
						renderItem={ this._RenderItem }
						renderFocus={ this._RenderFocus }
						measures={ this._Measures }
						onClick={this._OnClick}
						branchName={this.props.branchName + "/MenuList"}
					/>
				</div>
			</div>
		)
	}

	componentWillUnmount() {
		console.log("componentWillUnmount MenuWidget");
	}

	componentDidMount() {
		console.log("componentDidMount MenuWidget");
	}
}

export default MenuWidget;
