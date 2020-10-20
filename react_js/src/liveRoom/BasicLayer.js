import React from 'react';
import LiveStyle from './LiveStyle'
import './animation.css';

class BasicLayer extends React.Component {
    constructor(props) {
        super(props)
        this._style = LiveStyle.get().basicLayer;
    }
    render() {

        return (
            <div>
                <div style={ this._style.name_bg_style }>
                    <div style={ this._style.name_text_style }>李佳琪买它买它</div>
                </div>
                <div style={ this._style.header_style }/>
                <div style={ this._style.hot_bg_style }>
                    <div style={{ ...this._style.hot_fire_style,animation: "heart-bounce 1s infinite" }}/>
                    <div style={ this._style.hot_text_style }>55555</div>
                    <div style={ this._style.hot_arrow_style }/>
                </div>    
                <div style={{ ...this._style.notify_bg_style }}>
                    <div style={ this._style.notify_logo_style }/>
                    <div style={{ ...this._style.notify_text_style, animation: "AnimRotate 2s infinite " }}>公告：创造富强民主的社会</div>
                </div> 
                <div style={{ ...this._style.fans_bg_style, animation: "fadeInLeft 5s infinite 100"  }}>
                    <div style={{...this._style.fans_text_style, left:23 }}>欢迎超级粉丝</div>
                    <div style={{...this._style.fans_name_style, left:135 }}>飞翔吧牛蛙</div>
                    <div style={{...this._style.fans_text_style, left:233 }}>进入间</div>
                </div>
                <div style={this._style.golden_text_style}>我的金币: 500</div>
                <div style={{...this._style.golden_gift_style, animation: "heart-bounce 1s infinite"}}/>
            </div>
        )
    }
}

export default BasicLayer;
