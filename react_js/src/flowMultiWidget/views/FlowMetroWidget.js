import React from 'react';
import {Router, Fdiv, SimpleWidget, VERTICAL, SlideStyle, SWidgetDispatcher} from "../../jsview-utils/jsview-react/index_widget.js"
import TitleMetroWidget from './TitleMetroWidget'

class FlowMetroWidget extends React.Component {
	constructor(props) {
		super(props);
		this._Router = new Router();
		this._Measures = this._Measures.bind(this);
		this._FrameMeasure = this._FrameMeasure.bind(this);
		this._FrameRenderItem = this._FrameRenderItem.bind(this);
		this._FrameOnItemFocus = this._FrameOnItemFocus.bind(this);
		this._FrameOnItemBlur = this._FrameOnItemBlur.bind(this);
		this._dispatcherMap = new Map();
		this._dispatcherMap.set("flow", new SWidgetDispatcher());
		this._preFocusId = 0;
		this.state = {
			flowData:this.props.data
		}
		this._InitDispatcher();
	}

	_Measures(item) {
		return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
	}
	_InitDispatcher() {
		for(let i = 0;i<this.props.data.length; i++) {
			let item = this.props.data[i];
			this._dispatcherMap.set("flow_" + item.id, new SWidgetDispatcher());
		}
	}
	_FrameRenderItem(item, onedge) {
		console.log("_FrameRenderItem  ", ("item" + item.id));
		return (
			<TitleMetroWidget style={{left: 0, top: 0, width: item.width, height: item.height}}
			                  pageTheme={this.props.pageTheme}
			                  onEdge={onedge}
			                  dispatcher={ this._dispatcherMap.get("flow_" + item.id) }
			                  title={this.state.flowData[item.id].title}
			                  data={this.state.flowData[item.id].data}
			                  branchName={"item" + item.id}/>
		)
	}

	_FrameMeasure(item) {
		return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
	}

	_FrameOnItemFocus(item, enter_rect) {
		console.log("_FrameOnItemFocus ", ("item" + item.id), enter_rect);
		if (enter_rect != null ){
			let focus_info = {
				type: SWidgetDispatcher.Type.setFocusRect,
				data: enter_rect
			};
			this._dispatcherMap.get("flow_" + item.id).dispatch(focus_info);
		}

		this._Router.focus("item" + item.id)
	}

	_FrameOnItemBlur(item) {
		console.log("frame item blur " + item.id);
	}

	render() {
		console.log("render FlowMetroWidget");
		return (
			<Fdiv style={{top: this.props.style.top, left: this.props.style.left}} branchName={this.props.branchName} router={this._Router}
			      onFocus={ () => {
				      this._Router.focus("titleFlowMetro");
			      }}
				>
				<SimpleWidget
					width={ this.props.style.width }
					height={ this.props.style.height }
					direction={ VERTICAL }
					data={ this.state.flowData }
					slideStyle={ SlideStyle.seamless }
					onItemFocus={ this._FrameOnItemFocus }
					onItemBlur={ this._FrameOnItemBlur }
					renderItem={ this._FrameRenderItem }
					measures={ this._FrameMeasure }
					onWidgetMount={ this.props.onWidgetMount }
					onFocus={ () => {
						console.log("titleFlowMetro onFocus");
					}}
					branchName="titleFlowMetro"
				/>
			</Fdiv>
		)
	}

	componentWillUnmount() {
		console.log("componentWillUnmount FlowMetroWidget");
	}

	componentDidMount() {
		console.log("componentDidMount FlowMetroWidget");
	}
}
export default FlowMetroWidget;