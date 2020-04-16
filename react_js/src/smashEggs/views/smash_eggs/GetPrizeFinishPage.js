import React from 'react';
import {Fdiv} from "../../../jsview-utils/jsview-react/index_widget"
import { FocusBlock } from "../../../demoCommon/BlockDefine"
import PageTheme from "../../common/PageTheme"
import ConstantVar from "../../common/ConstantVar"
import {Button} from "../../common/CommonWidget";
class GetPrizeFinishPage extends FocusBlock {
    constructor(props) {
        super(props);
        this._PageTheme = PageTheme.get().MainPage.GetPrizeFinishPage;
        this._GoTo = this.props.goTo;
        this.state = {
            visible: "hidden"
        }
    }

    onFocus() {
        console.log("GetPrizeFinishPage _onFocus ");
        this.setState({visible: "inherit"});

    }

    onBlur() {
        console.log("GetPrizeFinishPage _onBlur ");
        this.setState({visible: "hidden"})
    }

    onKeyDown(ev) {
        console.log("GetPrizeFinishPage onKeyDown keycode:"+ev.keyCode);
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
                    this._GoTo(ConstantVar.BranchName.SmashEggsPage, true);
                }
                break;
            default:
                break;
        }
        return use_key;
    }

    renderContent() {
        console.log("GetPrizeFinishPage renderContent this.state.visible:"+this.state.visible);
        return (
            <div style={{visibility:this.state.visible}}>
                <div style={this._PageTheme.bgStyle}/>
                <div style={this._PageTheme.title.style}>{this._PageTheme.title.text}</div>
                <div style={this._PageTheme.tips.style}>{this._PageTheme.tips.text}</div>
                <Button theme={this._PageTheme.btn} text={this._PageTheme.btn.text}/>
            </div>
        )
    }

    componentDidMount() {

    }
}
export default GetPrizeFinishPage;
