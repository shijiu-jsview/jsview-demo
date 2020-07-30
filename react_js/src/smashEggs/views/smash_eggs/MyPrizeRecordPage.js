import React from 'react';
import PageTheme from "../../common/PageTheme"
import {
    VERTICAL,
    SimpleWidget,
    SlideStyle,
    EdgeDirection
} from "../../../jsview-utils/jsview-react/index_widget"
import ConstantVar from "../../common/ConstantVar"
import {Button} from "../../common/CommonWidget";
import {FocusBlock} from "../../../demoCommon/BlockDefine"

class MyPrizeRecordPage extends FocusBlock {
    constructor(props) {
        super(props);
        this._PageTheme = PageTheme.get().MainPage.MyPrizeRecordPage;
        this._GoTo = this.props.goTo;
        this.state = {
            visible: "hidden",
            renderCount:0,
            focusName:null,
            prizeRecord: null,
        }
    }

    onFocus() {
        let prize_record = this._FilterData(this.props.data);
        let focusName = null;
        //设置焦点
        if (prize_record.length === 0) {
            focusName = this.props.branchName + "/go";
        } else {
            //TODO 判断是否为领奖时间，领奖时间时，则焦点为list widget
            focusName = this.props.branchName + "/PrizeListWidget";
        }
        this.changeFocus(focusName)
        this.setState({visible: "visible", prizeRecord: prize_record, focusName:focusName, renderCount:++this.state.renderCount});
        console.log("MyPrizeRecordPage _onFocus ");
    }

    onBlur() {
        this.setState({visible: "hidden"})
        console.log("MyPrizeRecordPage _onBlur ");
    }

    onKeyDown(ev) {
        let use_key = true;
        switch (ev.keyCode) {
            case ConstantVar.KeyCode.Left:
                break;
            case ConstantVar.KeyCode.Right:
                break;
            case ConstantVar.KeyCode.Down:
                if (this.state.focusName === this.props.branchName + "/PrizeListWidget") {
                    let focusName = this.props.branchName + "/go";
                    this.changeFocus(focusName)
                    this.setState({focusName:focusName});
                }
                break;
            case ConstantVar.KeyCode.Up:
                if (this.state.focusName === this.props.branchName + "/go") {
                    let focusName = this.props.branchName + "/PrizeListWidget";
                    this.changeFocus(focusName)
                    this.setState({focusName:focusName});
                }
                break;
            case ConstantVar.KeyCode.Ok:
            case ConstantVar.KeyCode.Back:
            case ConstantVar.KeyCode.Back2:
                if (this._GoTo) {
                    this._GoTo(ConstantVar.BranchName.MyPrizeRecordBtn);
                }
                break;
            default:
                break;
        }
        return use_key;
    }

    _FilterData(data) {
        let prize_record = [];
        let theme = this._PageTheme.records;
        if (data && this.props.info) {
            let count = 0;
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                for (let j = 0; j < this.props.info.prize_info.length; j++) {
                    let prize_info = this.props.info.prize_info[j];
                    if (prize_info.prize_id === item.prize_id) {
                        prize_record.push({
                            blocks: {w: theme.content.item.width, h: theme.content.item.height},
                            focusable: true,
                            index: count++,
                            account: this.props.account,
                            prizeName: prize_info.name,
                            contact: item.contact
                        })
                        break;
                    }
                }
            }
        }
        return prize_record;
    }

    _onEdge = (edge_info) => {
        if (edge_info.direction === EdgeDirection.bottom) {
            this.onKeyDown({keyCode: ConstantVar.KeyCode.Down});
        }
    }

    _RenderItem = (item) => {
        let theme = this._PageTheme.records;
        //TODO 领奖时间，显示领取按钮
        return (<div key={"row:" + item.index}>
            <div key={"item-0" + item.index}
                 style={theme.content.item.account.style}>{item.account}</div>
            <div key={"item-1" + item.index}
                 style={theme.content.item.prize.style}>{item.prizeName}</div>
            <div key={"item-2" + item.index}
                 style={theme.content.item.phone.style}>{item.contact}</div>
        </div>)
    }

    _RenderFocus = (item) => {
        let theme = this._PageTheme.records;
        return (<div key={"row:" + item.index}>
            <div key={"item-0" + item.index}
                 style={theme.content.item.account.focusStyle}>{item.account}</div>
            <div key={"item-1" + item.index}
                 style={theme.content.item.prize.focusStyle}>{item.prizeName}</div>
            <div key={"item-2" + item.index}
                 style={theme.content.item.phone.focusStyle}>{item.contact}</div>
        </div>)
    }

    _Measures = (item) => {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _onClick=(item)=>{
        //TODO 非领奖时间、不作任何处理
    }
    renderContent() {
        console.log("this.props.data:",);
        if (!this.state.prizeRecord) {
            return null;
        }
        return (
            <div key={"record_"+this.state.renderCount}style={{visibility: this.state.visible}}>
                <div style={this._PageTheme.bgStyle}/>
                <div style={this._PageTheme.title.style}>{this._PageTheme.title.text}</div>
                <div
                    style={{...this._PageTheme.tips.style, ...{visibility: this.state.prizeRecord.length > 0 ? "hidden" : "inherit"}}}>{this._PageTheme.tips.text}</div>
                <div style={{visibility: this.state.prizeRecord.length > 0 ? "inherit" : "hidden"}}>
                    <div key="headAccount"
                         style={this._PageTheme.records.head.account.style}>{this._PageTheme.records.head.account.text}</div>
                    <div key="headPrize"
                         style={this._PageTheme.records.head.prize.style}>{this._PageTheme.records.head.prize.text}</div>
                    <div key="headPhone"
                         style={this._PageTheme.records.head.phone.style}>{this._PageTheme.records.head.phone.text}</div>
                    <div key="Line" style={this._PageTheme.records.line.style}>{this._PageTheme.records.line.text}</div>
                    <div key="Container" style={this._PageTheme.records.content.container.style}>
                        <SimpleWidget
                            width={ this._PageTheme.records.content.container.width }
                            height={ this._PageTheme.records.content.container.height }
                            direction={ VERTICAL }
                            data={this.state.prizeRecord}
                            slideStyle={ SlideStyle.seamless }
                            onClick={this._onClick}
                            onEdge={ this._onEdge}
                            renderItem={ this._RenderItem }
                            renderFocus={ this._RenderFocus }
                            measures={ this._Measures }
                            branchName={this.props.branchName + "/PrizeListWidget"}
                        />
                    </div>
                </div>
                <Button branchName={this.props.branchName + "/go"} theme={this._PageTheme.btn}
                        text={this._PageTheme.btn.text} isFocus={this.state.focusName === (this.props.branchName + "/go")}/>
            </div>
        )
    }

    componentDidMount() {

    }
}
export default MyPrizeRecordPage;
