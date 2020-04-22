import React from 'react';
import {SimpleWidget, SWidgetDispatcher, VERTICAL, SlideStyle, EdgeDirection} from "../../../jsview-utils/jsview-react/index_widget"
import { FocusBlock } from "../../../demoCommon/BlockDefine"

import PageTheme from "../../common/PageTheme"
import {Button} from "../../common/CommonWidget";
import ConstantVar from "../../common/ConstantVar"
class InputPanel extends FocusBlock {
    constructor(props) {
        super(props);
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._RenderBlur = this._RenderBlur.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onEdgeInterval = this._onEdgeInterval.bind(this);
        this._BackToBtn = this.props.onEdge;
        this._PageTheme = PageTheme.get().MainPage.GetPrizePage.InputPanel;
        this._InputStr = "";
        this._NumWidgetDispatcher = new SWidgetDispatcher();
        this.state = {
            inputToggle:false,
            tipsVisible: "hidden",
        }
    }

    _onEdgeInterval(edge_info) {
        if (edge_info.direction === EdgeDirection.bottom) {
            if (this._InputStr.length !== 11) {
                this.setState({tipsVisible:"inherit"})
            } else {
                if(this._BackToBtn) {
                    this._BackToBtn(edge_info, this._InputStr);
                }
            }
        }
    }

    _onClick(item) {
        let input_str = this._InputStr;
        let tips_visible = "hidden";
        if (item.id === "删除") {
            console.log("删除 前input_str:", input_str);
            input_str = input_str.length > 0?input_str.slice(0,input_str.length-1):"";
            console.log("删除 后input_str:", input_str);
            if (input_str.length > 11) {
                tips_visible = "visible"
            }
        } else if (item.id === "清空") {
            input_str = "";
        } else {
            //检查手机格式
            input_str = input_str + item.id;
            if (input_str.length > 11) {
                tips_visible = "visible"
            }
        }
        this._InputStr = input_str;
        this.setState({tipsVisible:tips_visible, inputToggle:!this.state.inputToggle});
        return true;
    }
    onFocus() {
        console.log("InputPanel _onFocus ");
        this._NumWidgetDispatcher.dispatch({
            type: SWidgetDispatcher.Type.setFocusId,
            data: 0
        });
        this.changeFocus("NumWidget")
    }

    onBlur() {
        console.log("InputPanel _onBlur ");
        this.setState({tipsVisible:"hidden"});
    }

    onKeyDown(ev) {
        if (ev.keyCode === ConstantVar.KeyCode.Back||ev.keyCode === ConstantVar.KeyCode.Back2) {
            return false;
        }
        return true;
    }

    renderContent() {
        if (this.props.needCleanInput && this._InputStr.length > 0) {
            this._InputStr = "";
        }

        return (
            <div>
                <div style={this._PageTheme.input.style}>
                    <div style={{...this._PageTheme.input.hint.style, ...{visibility: this._InputStr.length > 0?"hidden":"inherit"}}}>
                        {this._PageTheme.input.hint.text}</div>
                    <div style={this._PageTheme.input.textStyle}>{this._InputStr}</div>
                </div>

                <div style={{...this._PageTheme.phone_format_tips.style, ...{visibility: this.state.tipsVisible}}}>
                    {this._PageTheme.phone_format_tips.text}</div>
                <div style={this._PageTheme.widget.style}>
                    <SimpleWidget
                        width={ this._PageTheme.widget.style.width }
                        height={this._PageTheme.widget.style.height}
                        direction={ VERTICAL }
                        dispatcher={this._NumWidgetDispatcher}
                        data={ this._PageTheme.widget.data }
                        slideStyle={ SlideStyle.seamless }
                        onEdge={ this._onEdgeInterval}
                        renderBlur={ this._RenderBlur }
                        renderItem={ this._RenderItem }
                        renderFocus={ this._RenderFocus }
                        onClick={ this._onClick }
                        measures={ this._Measures }
                        branchName="NumWidget"
                    />
                </div>
            </div>
        )
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _RenderFocus(item) {
        console.log("input _RenderFocus");
        return (
            <Button branchName={item.id} theme={this._PageTheme.widget.item} text={item.id} isFocus={true}/>
        )
    }

    _RenderBlur(item, callback) {
        console.log("input _RenderBlur");
        return (
            <Button branchName={item.id} theme={this._PageTheme.widget.item} text={item.id}/>
        )
    }

    _RenderItem(item) {
        return (
            <Button branchName={item.id} theme={this._PageTheme.widget.item} text={item.id}/>
        )
    }


    componentDidMount() {
    }
}
export default InputPanel;
