import React from 'react';
import {Fdiv,EdgeDirection} from "../../../jsview-utils/jsview-react/index_widget"
import { FocusBlock } from "../../../demoCommon/BlockDefine"
import PageTheme from "../../common/PageTheme"
import ConstantVar from "../../common/ConstantVar"
import {Button} from "../../common/CommonWidget";
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
            focusBranchName: "Confirm",
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
            focusBranchName: "Confirm",
            tipsVisible:"hidden",
            tipsInfo:"",
            needCleanInput:false
        });
        this.changeFocus("Confirm");
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
            case ConstantVar.KeyCode.Ok:
                switch(this.state.focusBranchName) {
                    case "Confirm":
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
        let prize = this.props.data;
        if (!prize || this.state.visible === "hidden") {
            return null;
        }
        console.log("GetPrizePage renderContent");
        return (
            <div>
                <div style={this._PageTheme.bgStyle}/>
                <div style={{...this._PageTheme.tipsInfo.style, ...{visibility: this.state.tipsVisible}}}>
                    {this.state.tipsInfo}</div>
                <div style={this._PageTheme.title.style}>{this._PageTheme.title.text+"【"+prize.name+"】"}</div>
                <div style={{...this._PageTheme.icon.style, backgroundImage:prize.image}}/>
                <Button branchName="Confirm" theme={this._PageTheme.btn1} text={this._PageTheme.btn1.text} isFocus={this.state.focusBranchName === "Confirm"}/>
                <Button branchName="Return" theme={this._PageTheme.btn2} text={this._PageTheme.btn2.text} isFocus={this.state.focusBranchName === "Return"}/>
            </div>
        )
    }

    componentDidMount() {
    }
}
export default GetPrizePage;
