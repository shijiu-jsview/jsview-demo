import React from 'react';
import {Fdiv,EdgeDirection} from "../../../jsview-utils/jsview-react/index_widget"
import { FocusBlock } from "../../../demoCommon/BlockDefine"
import PageTheme from "../../common/PageTheme"
import ConstantVar from "../../common/ConstantVar"
import {Button} from "../../common/CommonWidget";
import InputPanel from "./InputPanel"
import CommonApi from "../../common/CommonApi"
class GetPrizePage extends FocusBlock {
    constructor(props) {
        super(props);
        this._PageTheme = PageTheme.get().MainPage.GetPrizePage;
        this._GoTo = this.props.goTo;
        this._onEdge = this._onEdge.bind(this);
        this._inputStr = null;
        this._Timer = null;
        this.state = {
            visible: "hidden",
            focusBranchName: "InputPanel",
            tipsVisible:"hidden",
            tipsInfo:"",
            needCleanInput:false
        }
        this._RequestToken = 0;
    }

    _onEdge(edge_info, input_str) {
        if (edge_info.direction === EdgeDirection.bottom) {
            this.setState({focusBranchName: "Confirm"});
            this.changeFocus("Confirm");
            this._inputStr = input_str;
        }
    }

    onFocus() {
        this.setState({
            visible: "visible",
            focusBranchName: "InputPanel",
            tipsVisible:"hidden",
            tipsInfo:"",
            needCleanInput:false
        });
        this.changeFocus("InputPanel");
        console.log("GetPrizePage _onFocus ");
        this._Timer = setTimeout(()=>{
            //2小时失效，退出到主页面
            if (this._GoTo) {
                this._GoTo(ConstantVar.BranchName.SmashEggsPage, true);
            }
            this._Timer = null;
        }, 2*60*60*1000);
    }

    onBlur() {
        this.setState({visible: "hidden", needCleanInput:true})
        console.log("GetPrizePage _onBlur ");
        if (this._Timer !== null) {
            clearTimeout(this._Timer);
            this._Timer = null;
        }
    }

    onKeyDown(ev) {
        let use_key = true;
        switch(ev.keyCode) {
            case ConstantVar.KeyCode.Left:
                if (this.state.focusBranchName === "Return") {
                    this.setState({"focusBranchName":"Confirm"});
                    this.changeFocus("Confirm")
                }
                break;
            case ConstantVar.KeyCode.Right:
                if (this.state.focusBranchName === "Confirm") {
                    this.setState({"focusBranchName":"Return"});
                    this.changeFocus("Return")
                }
                break;
            case ConstantVar.KeyCode.Up:
                if (this.state.focusBranchName === "Return"
                    || this.state.focusBranchName === "Confirm") {
                    this.setState({"focusBranchName":"InputPanel",tipsVisible:"hidden"});
                    this.changeFocus("InputPanel")
                }
                break;
            case ConstantVar.KeyCode.Down:
                if (this.state.focusBranchName === "InputPanel") {
                    this.setState({"focusBranchName":"Confirm"});
                    this.changeFocus("Confirm");
                }
                break;
            case ConstantVar.KeyCode.Ok:
                switch(this.state.focusBranchName) {
                    case "Confirm":
                        let reqeustToken = ++this._RequestToken;
                        let promise = CommonApi.postContactInfo(this._inputStr, this.props.data.id, this.props.account);
                        promise.then((data) => {
                            if (reqeustToken === this._RequestToken){
                                if (this._GoTo) {
                                    this._GoTo(ConstantVar.BranchName.GetPrizeFinishPage);
                                }
                            }
                        })
                            .catch((error) => {
                                if(typeof error === "string") {
                                    this.setState({"tipsInfo": error, tipsVisible: "inherit"})
                                }
                            })


                        break;
                    case "Return":
                        if (this._GoTo) {
                            this._GoTo(ConstantVar.BranchName.SmashEggsPage, true);
                        }
                        break;
                    default:
                        break;
                }
                break;
            case ConstantVar.KeyCode.Back:
            case ConstantVar.KeyCode.Back2:
                if (this._GoTo) {
                    this._GoTo(ConstantVar.BranchName.SmashEggsPage, true);
                }
                break;
            default:
                break;
        }
        return use_key;
    }

    renderContent() {
        let data = this.props.data;
        let prize = "";
        if (data) {
            if (data.prize_id<=ConstantVar.Prize.length) {
                prize = ConstantVar.Prize[data.prize_id -1].prize;
            }
        }
        return (
            <div style={{visibility:this.state.visible}}>
                <div style={this._PageTheme.bgStyle}/>
                <div style={{...this._PageTheme.tipsInfo.style, ...{visibility: this.state.tipsVisible}}}>
                    {this.state.tipsInfo}</div>
                <div style={this._PageTheme.title.style}>{this._PageTheme.title.text+"【"+prize+"】"}</div>
                <div style={this._PageTheme.tips1.style}>{this._PageTheme.tips1.text}</div>
                <div style={this._PageTheme.tips2.style}>{this._PageTheme.tips2.text}</div>
                <InputPanel branchName="InputPanel" onEdge={this._onEdge} needCleanInput={this.state.needCleanInput}/>
                <Button branchName="Confirm" theme={this._PageTheme.btn1} text={this._PageTheme.btn1.text} isFocus={this.state.focusBranchName === "Confirm"}/>
                <Button branchName="Return" theme={this._PageTheme.btn2} text={this._PageTheme.btn2.text} isFocus={this.state.focusBranchName === "Return"}/>
            </div>
        )
    }

    componentDidMount() {
    }
}
export default GetPrizePage;
