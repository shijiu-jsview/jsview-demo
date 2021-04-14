/**
 * Created by luocf on 2020/4/23.
 */
import React from 'react';
import { FocusBlock } from "../../jsview-utils/JsViewReactTools/BlockDefine";
import PageTheme from "../common/PageTheme";
import ConstantVar from "../common/ConstantVar";
import { Button } from "../common/CommonWidget";
import CommonApi from "../../api/CommonApi";

class NineSquared extends FocusBlock {
  constructor(props) {
    super(props);
    this._Theme = PageTheme.get();
    this._onAnimationEnd = this._onAnimationEnd.bind(this);
    this.awardId = 0;
    this.PreAwardId = 0;

    const translate_info = this._Theme.NineSquared.data[this.awardId];
    const style = { left: translate_info.left,
      top: translate_info.top,
      width: translate_info.width,
      height: translate_info.height,
      backgroundImage: this._Theme.NineSquared.moveFocusBg.backgroundImage,
      animation: null };

    this.state = {
      isRunning: false,
      moveStyle: style,
      count: 13,
      round: 4, // 跑几圈
    };
  }

  _onAnimationEnd() {
    console.log(`handleSuccess this.awardId:${this.awardId}`);
    const translate_info = this._Theme.NineSquared.data[this.awardId];
    const style = { left: translate_info.left,
      top: translate_info.top,
      width: translate_info.width,
      height: translate_info.height,
      backgroundImage: this._Theme.NineSquared.moveFocusBg.backgroundImage,
      animation: null };
    this.setState({
      moveStyle: style,
      isRunning: false
    });
    this.props.handleSuccess(this.awardId);
  }

  onFocus() {
    this.changeFocus(`${this.props.branchName}/Go`);
  }

  onBlur() {
    // 停止动画
  }

  _StartGame() {
    const count = --this.state.count;
    if (count < 0) {
      console.log(`init 无抽奖机会 count:${count}`);
      return;
    }

    const length = this._Theme.NineSquared.data.length;
    const awardID = parseInt(Math.random() * length, 10);// TODO ，后台请求
    // 生成step

    const step = this.state.round * length + awardID + 1;// 一共几周*总奖品数
    const duration = 5;
    const animation_name = `translate_to_${step}${parseInt((Math.random() * 10), 10)}`;
    const animation = `${animation_name} ${duration}s steps(1,start)`;
    const pre_transloate_name = CommonApi.getNineSquaredTranslateName();
    console.log("animation:", animation);
    const ballRunKeyframes = this.getkeyframes(pre_transloate_name);
    if (ballRunKeyframes !== null) {
      ballRunKeyframes.styleSheet.deleteRule(ballRunKeyframes.index);
      let runkeyframes = `@keyframes ${animation_name} {`;
      let used_time = 0;
      const cubicbezier = CommonApi.cubicbezier(0.25, 0.1, 0.25, 1);
      for (let i = this.PreAwardId; i < step; i++) {
        const translate = this._Theme.NineSquared.data[(i) % length];
        const time = cubicbezier.solve(((i - this.PreAwardId) / (step - this.PreAwardId))) * 100;
        used_time = parseInt((time * 1000), 10) / 1000;
        if (i === 0) {
          used_time = 0;
        } else if (i === step - 1) {
          used_time = 100;// 对齐
        }
        runkeyframes += `
                ${used_time}% {
                    transform: translate3d(${translate.left}px,${translate.top}px,0);
                }`;
      }
      runkeyframes += `
            }`;
      // console.log('runkeyframes:',runkeyframes);
      if (ballRunKeyframes.styleSheet) {
        ballRunKeyframes.styleSheet.insertRule(runkeyframes, ballRunKeyframes.index);
      }
      CommonApi.saveNineSquaredTranslateName(animation_name);
    }

    this.awardId = awardID;
    this.PreAwardId = this.awardId;
    const translate_info = this._Theme.NineSquared.data[this.awardId];
    const style = { width: translate_info.width,
      height: translate_info.height,
      backgroundImage: this._Theme.NineSquared.moveFocusBg.backgroundImage,
      animation };
    this.setState({
      moveStyle: style,
      count,
      isRunning: true
    });
  }

  getkeyframes(name) {
    let animation = null;
    // 获取所有的style
    const ss = document.styleSheets;
    for (let i = 0; i < ss.length; ++i) {
      const item = ss[i];
      if (item.cssRules[0] && item.cssRules[0].name && item.cssRules[0].name === name) {
        animation = {};
        animation.cssRule = item.cssRules[0];
        animation.styleSheet = ss[i];
        animation.index = 0;
      }
    }
    return animation;
  }

  onKeyDown(ev) {
    let keyused = false;
    if (this.state.isRunning) {
      console.log("_StartGame this.state.isRunning");
      return true;
    }

    switch (ev.keyCode) {
      case ConstantVar.KeyCode.Ok:
        // 启动动画
        this._StartGame();
        keyused = true;
        break;
      default:
        break;
    }

    return keyused;
  }

  renderContent() {
    return (
            <div>
                <div style={this.state.moveStyle} onAnimationEnd={this._onAnimationEnd}
                    />
                <div style={this._Theme.NineSquared.data[0]}/>
                <div style={this._Theme.NineSquared.data[1]}/>
                <div style={this._Theme.NineSquared.data[2]}/>
                <div style={this._Theme.NineSquared.data[3]}/>
                <div style={this._Theme.NineSquared.data[4]}/>
                <div style={this._Theme.NineSquared.data[5]}/>
                <div style={this._Theme.NineSquared.data[6]}/>
                <div style={this._Theme.NineSquared.data[7]}/>
                <div style={this._Theme.NineSquared.data[8]}/>
                <Button branchName={`${this.props.branchName}/Go`} theme={this._Theme.NineSquared.goBtn}/>
                <div style={this._Theme.NineSquared.goBtn.font}>{this.state.count}</div>
            </div>
    );
  }

  componentDidMount() {
    // nothing to do
    console.log("NineSquared componentDidMount in");
  }

  componentWillUnmount() {
    console.log("NineSquared componentWillUnmount in");
  }
}

export default NineSquared;
