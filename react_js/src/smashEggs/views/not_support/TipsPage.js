import React from 'react';
import {Fdiv} from "../../../jsview-utils/jsview-react/index_widget"
import PageTheme from "../../common/PageTheme"
import ConstantVar from "../../common/ConstantVar"
import { FocusBlock } from "../../../demoCommon/BlockDefine"
class TipsPage extends FocusBlock{
    constructor(props) {
        super(props);
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
        this._PageTheme = PageTheme.get().TipsPage;
        this.state = {
            visible: "hidden",
            focusBranchName: "GetWelfare"
        }
    }

    _onFocus() {
        this.setState({visible: "visible"});
    }

    _onBlur() {
        this.setState({visible: "hidden"})
    }

    onKeyDown(ev) {
        let use_key = true;
        switch(ev.keyCode) {
            case ConstantVar.KeyCode.Back:
                use_key = false;
                break;
            default:
                break;
        }
        return use_key;
    }

    renderContent() {
        return (
            <Fdiv branchName={this.props.branchName} onFocus={this._onFocus} onBlur={this._onBlur}
                  style={{visibility:this.state.visible}}>
                <div style={this._PageTheme.bgStyle}/>
                <div style={this._PageTheme.tips.style}>{this._PageTheme.tips.text}</div>
            </Fdiv>
        )
    }

    componentDidMount() {
        //nothing to do
    }
}


export default TipsPage;
