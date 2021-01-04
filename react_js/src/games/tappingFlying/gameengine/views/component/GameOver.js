/**
 * Created by luocf on 2020/5/12.
 */
import React from 'react';
import { JsvSpriteAnim } from "../../../../../jsview-utils/JsViewReactWidget/JsvSpriteAnim";
import Game from "../../common/Game";
import { FocusBlock } from "../../../../../demoCommon/BlockDefine";

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
    this._FocusBtn = GameOver.Btn.controlBtn;
    this.state = {
      visible: "hidden",
      focusStyle: { ...this._Theme.gesturetiperHandImage.style, ...this._Theme.gesturetiperHandImage[this._FocusBtn] }
    };
    this.completeSound = this.game.audio('ending_sound_complete.mp3');
    this.tryAgainSound = this.game.audio('ending_sound_tryagain.mp3');
    this.charSound = this.game.audio('ending_sound_char.mp3');
    this.contBtnSound = this.game.audio('ending_sound_continue.mp3');
  }

  onKeyDown(ev) {
    // 按键处理
    switch (ev.keyCode) {
      case 37:// left
        if (this._FocusBtn === GameOver.Btn.controlBtn) {
          this._FocusBtn = GameOver.Btn.closeBtn;
          this.setState({
            focusStyle: { ...this._Theme.gesturetiperHandImage.style, ...this._Theme.gesturetiperHandImage[this._FocusBtn] }
          });
        }
        break;
      case 38:// up;
        if (this._FocusBtn === GameOver.Btn.controlBtn) {
          this._FocusBtn = GameOver.Btn.closeBtn;
          this.setState({
            focusStyle: { ...this._Theme.gesturetiperHandImage.style, ...this._Theme.gesturetiperHandImage[this._FocusBtn] }
          });
        }
        break;
      case 39:// right
        if (this._FocusBtn === GameOver.Btn.closeBtn) {
          this._FocusBtn = GameOver.Btn.controlBtn;
          this.setState({
            focusStyle: { ...this._Theme.gesturetiperHandImage.style, ...this._Theme.gesturetiperHandImage[this._FocusBtn] }
          });
        }
        break;
      case 40:// down
        if (this._FocusBtn === GameOver.Btn.closeBtn) {
          this._FocusBtn = GameOver.Btn.controlBtn;
          this.setState({
            focusStyle: { ...this._Theme.gesturetiperHandImage.style, ...this._Theme.gesturetiperHandImage[this._FocusBtn] }
          });
        }
        break;
      case 13: // OK按键
        switch (this._FocusBtn) {
          case GameOver.Btn.controlBtn:
            if (this.props.result === "complete") {
              this.contBtnSound.play();
              this.game.close();
            } else {
              this.tryAgainSound.play();
              this.game.state.restart();
            }
            break;
          case GameOver.Btn.closeBtn:
            this.completeSound.play();
            this.game.close();
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    return true;
  }

  renderContent() {
    const result = this.props.result;
    const charSprite = result === "complete" ? this._Theme.content.charSprite : this._Theme.content.charFailedSprite;
    const btn = result === "complete" ? this._Theme.content.continueBtn : this._Theme.content.replayBtn;
    return (
            <div style={{ visibility: this.state.visible }}>
                <div style={this._Theme.bg.style}>
                    <div style={this._Theme.content.style}>
                        <div style={this._Theme.content.closeSprite.style}>
                            {this._Theme.content.closeSprite.sprite ? <JsvSpriteAnim
                                stop={true}
                                spriteInfo={this._Theme.content.closeSprite.sprite.spriteInfo}
                                viewSize={this._Theme.content.closeSprite.sprite.viewSize}
                                imageUrl={this._Theme.content.closeSprite.sprite.imageUrl}/> : null}
                        </div>
                        {this._Theme.content.wheelSprite ? <div style={this._Theme.content.wheelSprite.style}/> : null}
                        <div style={charSprite.style}/>
                        { this._Theme.content.barSprite ? <div style={this._Theme.content.barSprite.style}/> : null}
                        { this._Theme.content.starSprite && result === "complete" ? <div style={this._Theme.content.starSprite.style}/> : null}
                        <div style={btn.style}>
                            {btn.sprite ? <JsvSpriteAnim
                                stop={true}
                                spriteInfo={btn.sprite.spriteInfo}
                                viewSize={btn.sprite.viewSize}
                                imageUrl={btn.sprite.imageUrl}/> : null}
                        </div>
                        <div style={this.state.focusStyle}/>
                    </div>
                </div>
            </div>);
  }

  onFocus() {
    this.setState({ visible: "visible" });
  }

  onBlur() {
    this.setState({ visible: "hidden" });
  }

  componentDidMount() {
    console.log("GameOver componentDidMount");
  }

  componentWillUnmount() {
    console.log("GameOver componentWillUnmount");
  }
}
GameOver.Btn = {
  controlBtn: "controlBtn",
  closeBtn: "closeSprite",
};
export default GameOver;
