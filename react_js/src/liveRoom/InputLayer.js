import React from 'react';
import LiveStyle from './LiveStyle'
import { FocusBlock } from "../demoCommon/BlockDefine"
import eventProxy  from './eventProxy';

class InputLayer extends FocusBlock {
    constructor(props) {
        super(props)
        this._style = LiveStyle.get().inputLayer;
        this.state = {
            input_focused: false,
            send_focused: true
		}
    }

    onKeyDown(ev) {
        switch (ev.keyCode) {
            case 37: // Left
                this.setState({input_focused: true, send_focused: false})
                break;
            case 39: // Right
                this.setState({input_focused: false, send_focused: true})
                break;
            case 13: // ok
                eventProxy.trigger('OnMessage',{text:"主播你唱歌很好听"})
                break;  
            case 40: // Down
                this.setState({input_focused: false, send_focused: false})
                this.changeFocus('/liveRoom/GiftLayer')
                break;
			case 38: // Up
     
            default:
                //todo
		}
    }

    componentDidMount() {
        console.log("InputLayer componentDidMount in");
        this.changeFocus("/liveRoom/InputLayer");
    }

    onFocus() {
        console.log("InputLayer is focused")
        this.setState({ send_focused: true })
    }

    renderContent() {
        return (
            <span>
                <div style={{ ...this._style.input_bg_style, backgroundColor: this.state.input_focused?"rgba(0,171,250,0.9)":"rgba(0,0,0,0.45)" }}>
                    <div style={ this._style.up_bg_style }/>
                    <div style={ this._style.input_text_style }>选择默认弹幕发送</div>
                </div>    
                <div style={{ ...this._style.sender_bg_style,backgroundColor: this.state.send_focused?"rgba(0,171,250,0.9)":"rgba(0,0,0,0.7)" }}>发送</div>
            </span>     
        )
    }
}

export default InputLayer