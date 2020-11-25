import React from 'react';
import { SimpleWidget, VERTICAL, SlideStyle, SWidgetDispatcher } from "../../jsview-utils/jsview-react/index_widget";
import TitleMetroWidget from './TitleMetroWidget';
import { FocusBlock } from "../../demoCommon/BlockDefine";

class FlowMetroWidget extends FocusBlock {
  constructor(props) {
    super(props);
    this._Measures = this._Measures.bind(this);
    this._FrameMeasure = this._FrameMeasure.bind(this);
    this._FrameRenderItem = this._FrameRenderItem.bind(this);
    this._FrameOnItemFocus = this._FrameOnItemFocus.bind(this);
    this._FrameOnItemBlur = this._FrameOnItemBlur.bind(this);
    this._dispatcherMap = new Map();
    this._dispatcherMap.set("flow", new SWidgetDispatcher());
    this._preFocusId = 0;
    this.state = {
      flowData: this.props.data
    };
    this._InitDispatcher();
  }

  _Measures(item) {
    return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub);
  }

  _InitDispatcher() {
    for (let i = 0; i < this.props.data.length; i++) {
      const item = this.props.data[i];
      this._dispatcherMap.set(`flow_${item.id}`, new SWidgetDispatcher());
    }
  }

  _FrameRenderItem(item, onedge) {
    console.log("_FrameRenderItem  ", (`item${item.id}`));
    return (
            <TitleMetroWidget style={{ left: 0, top: 0, width: item.width, height: item.height }}
                              pageTheme={this.props.pageTheme}
                              onEdge={onedge}
                              dispatcher={ this._dispatcherMap.get(`flow_${item.id}`) }
                              title={this.state.flowData[item.id].title}
                              data={this.state.flowData[item.id].data}
                              branchName={`${this.props.branchName}/item${item.id}`}/>
    );
  }

  _FrameMeasure(item) {
    return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub);
  }

  _FrameOnItemFocus(item, enter_rect) {
    console.log("_FrameOnItemFocus ", (`item${item.id}`), enter_rect);
    if (enter_rect !== null) {
      const focus_info = {
        type: SWidgetDispatcher.Type.setFocusRect,
        data: enter_rect
      };
      this._dispatcherMap.get(`flow_${item.id}`).dispatch(focus_info);
    }
    this.changeFocus(`${this.props.branchName}/item${item.id}`);
  }

  _FrameOnItemBlur(item) {
    console.log(`frame item blur ${item.id}`);
  }

  onFocus() {
    this.changeFocus(`${this.props.branchName}/titleFlowMetro`);
  }

  renderContent() {
    console.log("render FlowMetroWidget");
    return (
            <div style={{ top: this.props.style.top, left: this.props.style.left }}>
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
                    branchName={`${this.props.branchName}/titleFlowMetro`}
                />
            </div>
    );
  }

  componentWillUnmount() {
    console.log("componentWillUnmount FlowMetroWidget");
  }

  componentDidMount() {
    console.log("componentDidMount FlowMetroWidget");
  }
}
export default FlowMetroWidget;
