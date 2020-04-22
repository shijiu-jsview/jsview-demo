import React from 'react';
import {Fdiv} from "../../../jsview-utils/jsview-react/index_widget"
import PageTheme from "../../common/PageTheme"
import ConstantVar from "../../common/ConstantVar"
import {Button} from "../../common/CommonWidget";
import { FocusBlock } from "../../../demoCommon/BlockDefine"

class NoPrizePage extends FocusBlock {
    constructor(props) {
        super(props);
        this._PageTheme = PageTheme.get().MainPage.NoPrizePage;
        this._GoTo = this.props.goTo;
        this.state = {
            visible: "hidden"
        }
    }

    onFocus() {
        this.setState({visible: "visible"});
        console.log("NoPrizePage _onFocus ");
    }

    onBlur() {
        this.setState({visible: "hidden"})
        console.log("NoPrizePage _onBlur ");
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
                    this._GoTo(ConstantVar.BranchName.SmashEggsPage);
                }
                break;
            default:
                break;
        }
        return use_key;
    }

    renderContent() {
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
export default NoPrizePage;
