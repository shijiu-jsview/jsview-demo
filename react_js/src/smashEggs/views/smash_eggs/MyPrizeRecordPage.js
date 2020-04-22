import React from 'react';
import {Fdiv} from "../../../jsview-utils/jsview-react/index_widget"
import PageTheme from "../../common/PageTheme"
import ConstantVar from "../../common/ConstantVar"
import {Button} from "../../common/CommonWidget";
import { FocusBlock } from "../../../demoCommon/BlockDefine"

class MyPrizeRecordPage extends FocusBlock {
    constructor(props) {
        super(props);
        this._PageTheme = PageTheme.get().MainPage.MyPrizeRecordPage;
        this._GoTo = this.props.goTo;
        this.state = {
            visible: "hidden",
        }
    }

    onFocus() {
        this.setState({visible: "visible"});
        console.log("MyPrizeRecordPage _onFocus ");
    }

    onBlur() {
        this.setState({visible: "hidden"})
        console.log("MyPrizeRecordPage _onBlur ");
    }

    onKeyDown(ev) {
        let use_key = true;
        switch(ev.keyCode) {
            case ConstantVar.KeyCode.Left:
                break;
            case ConstantVar.KeyCode.Right:
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
        if (data) {
            for(let i=0; i<data.length; i++) {
                if (data[i].prizeid !== "5" && data[i].state !== "0") {
                    prize_record.push(data[i])
                }
            }
        }
        return prize_record;
    }
    renderContent() {
        console.log("this.props.data:", );
        let prize_record = this._FilterData(this.props.data);
        return (
            <div style={{visibility:this.state.visible}}>
                <div style={this._PageTheme.bgStyle}/>
                <div style={this._PageTheme.title.style}>{this._PageTheme.title.text}</div>
                <div style={{...this._PageTheme.tips.style, ...{visibility:prize_record.length > 0?"hidden":"inherit"}}}>{this._PageTheme.tips.text}</div>
                <div style={{visibility:prize_record.length > 0?"inherit":"hidden"}}>
                    <div key="headAccount" style={this._PageTheme.records.head.account.style}>{this._PageTheme.records.head.account.text}</div>
                    <div key="headPrize" style={this._PageTheme.records.head.prize.style}>{this._PageTheme.records.head.prize.text}</div>
                    <div key="headPhone" style={this._PageTheme.records.head.phone.style}>{this._PageTheme.records.head.phone.text}</div>
                    <div key="Line" style={this._PageTheme.records.line.style}>{this._PageTheme.records.line.text}</div>
                    <div key="Container" style={this._PageTheme.records.content.container.style}>
                        <RecordList key="RecordList" data={prize_record} theme={this._PageTheme.records}/>
                    </div>
                </div>
                <Button theme={this._PageTheme.btn} text={this._PageTheme.btn.text}/>
            </div>
        )
    }
    componentDidMount() {
    }
}

const RecordList = ({data, theme}) => {
    let item_index = 0;
    if (data) {
        return data.map(function(value){
            let item_top = (item_index++)*80;
            return <div key={"row:"+item_index}>
                <div key={"item-0"+item_index} style={{...theme.content.item.account.style,...{top:item_top}}}>{value.account}</div>
                <div key={"item-1"+item_index} style={{...theme.content.item.prize.style,...{top:item_top}}}>{ConstantVar.Prize[value.prizeid-1].prize}</div>
                <div key={"item-2"+item_index} style={{...theme.content.item.phone.style,...{top:item_top}}}>{value.contact}</div>
            </div>
        })
    } else {
        return null;
    }

}
export default MyPrizeRecordPage;
