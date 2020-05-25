/**
 * Created by luocf on 2020/5/12.
 */
import React from 'react';
import JsvSpriteAnim from './../../../jsview-utils/JsViewReactWidget/JsvSpriteImg'
import Game from "../../common/Game"
import {FocusBlock} from "../../../demoCommon/BlockDefine"

class GameOver extends FocusBlock {
    /**
     * @param theme game over 主题
     * @param visible 是否可视
     */
    constructor(props) {
        console.log("GameOver constructor");
        super(props);
        this.game = Game;
        this._Theme = this.props.theme;
        this._FocusBtn = GameOver.Btn.replayBtn;
        this.state = {
            visible:"hidden",
            focusStyle:{...this._Theme.gesturetiperHandImage.style, ...this._Theme.gesturetiperHandImage[this._FocusBtn]}
        }
        this.completeSound = this.game.audio('ending_sound_complete.mp3');
        this.tryAgainSound = this.game.audio('ending_sound_tryagain.mp3');
        this.charSound = this.game.audio('ending_sound_char.mp3');
        this.contBtnSound = this.game.audio('ending_sound_continue.mp3');
    }

    onKeyDown(ev) {
        //按键处理
        switch (ev.keyCode) {
            case 37://left
                if (this._FocusBtn === GameOver.Btn.continueBtn) {
                    this._FocusBtn = GameOver.Btn.replayBtn;
                    this.setState({
                        focusStyle:{...this._Theme.gesturetiperHandImage.style, ...this._Theme.gesturetiperHandImage[this._FocusBtn]}
                    })
                } else if (this._FocusBtn === GameOver.Btn.replayBtn) {
                    this._FocusBtn = GameOver.Btn.closeBtn;
                    this.setState({
                        focusStyle:{...this._Theme.gesturetiperHandImage.style, ...this._Theme.gesturetiperHandImage[this._FocusBtn]}
                    })
                }
                break;
            case 38://up;
                if (this._FocusBtn === GameOver.Btn.replayBtn || this._FocusBtn === GameOver.Btn.continueBtn) {
                    this._FocusBtn = GameOver.Btn.closeBtn;
                    this.setState({
                        focusStyle:{...this._Theme.gesturetiperHandImage.style, ...this._Theme.gesturetiperHandImage[this._FocusBtn]}
                    })
                }
                break;
            case 39://right
                if (this._FocusBtn === GameOver.Btn.replayBtn) {
                    this._FocusBtn = GameOver.Btn.continueBtn;
                    this.setState({
                        focusStyle:{...this._Theme.gesturetiperHandImage.style, ...this._Theme.gesturetiperHandImage[this._FocusBtn]}
                    })
                } else if (this._FocusBtn === GameOver.Btn.closeBtn) {
                    this._FocusBtn = GameOver.Btn.replayBtn;
                    this.setState({
                        focusStyle:{...this._Theme.gesturetiperHandImage.style, ...this._Theme.gesturetiperHandImage[this._FocusBtn]}
                    })
                }
                break;
            case 40://down
                if (this._FocusBtn === GameOver.Btn.closeBtn) {
                    this._FocusBtn = GameOver.Btn.replayBtn;
                    this.setState({
                        focusStyle:{...this._Theme.gesturetiperHandImage.style, ...this._Theme.gesturetiperHandImage[this._FocusBtn]}
                    })
                }
                break;
            case 13: //OK按键
                switch(this._FocusBtn) {
                    case GameOver.Btn.replayBtn:
                    case GameOver.Btn.continueBtn:
                        this.game.state.restart();
                        break;
                    case GameOver.Btn.closeBtn:
                        this.game.state.close();
                        break;
                }

                break;
        }
        return true;
    }

    renderContent() {
        return (
            <div style={{visibility: this.state.visible}}>
                <div style={this._Theme.bg.style}>
                    <div style={this._Theme.content.style}>
                        <div style={this._Theme.content.closeSprite.style}>
                            <JsvSpriteAnim
                                onAnimEnd={function () {
                                    console.log("anim end")
                                }}
                                stop={true}
                                spriteInfo={this._Theme.content.closeSprite.sprite.spriteInfo}
                                viewSize={this._Theme.content.closeSprite.sprite.viewSize}
                                imageUrl={this._Theme.content.closeSprite.sprite.imageUrl}/>
                        </div>
                        <div style={this._Theme.content.wheelSprite.style}/>
                        <div style={this._Theme.content.charSprite.style}/>
                        <div style={this._Theme.content.barSprite.style}/>
                        <div style={this._Theme.content.replayBtn.style}>
                            <JsvSpriteAnim
                                onAnimEnd={function () {
                                    console.log("anim end")
                                }}
                                stop={true}
                                spriteInfo={this._Theme.content.replayBtn.sprite.spriteInfo}
                                viewSize={this._Theme.content.replayBtn.sprite.viewSize}
                                imageUrl={this._Theme.content.replayBtn.sprite.imageUrl}/>
                        </div>
                        <div style={this._Theme.content.continueBtn.style}>
                            <JsvSpriteAnim
                                onAnimEnd={function () {
                                    console.log("anim end")
                                }}
                                stop={true}
                                spriteInfo={this._Theme.content.continueBtn.sprite.spriteInfo}
                                viewSize={this._Theme.content.continueBtn.sprite.viewSize}
                                imageUrl={this._Theme.content.continueBtn.sprite.imageUrl}/>
                        </div>
                        <div style={this.state.focusStyle}/>
                    </div>
                </div>
            </div>)
    }
    onFocus() {
        this.setState({visible:"visible"})
    }

    onBlur() {
        this.setState({visible:"hidden"})
    }

    componentDidMount() {
        console.log("GameOver componentDidMount");
    }

    componentWillUnmount() {
        console.log("GameOver componentWillUnmount");

    }
}
GameOver.Btn = {
    "replayBtn":"replayBtn",
    "continueBtn":"continueBtn",
    "closeBtn":"closeSprite",
}
export default GameOver;