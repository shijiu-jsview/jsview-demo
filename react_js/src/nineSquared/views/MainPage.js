/**
 * Created by luocf on 2020/4/23.
 */
import React from 'react';
import { FocusBlock } from "../../demoCommon/BlockDefine";
import ConstantVar from "../common/ConstantVar";
import PageTheme from "../common/PageTheme";
import { Button } from "../common/CommonWidget";
import NineSquared from "./NineSquared";

class MainPage extends FocusBlock {
  constructor(props) {
    super(props);
    this._Theme = PageTheme.get();
    this._FocusBranchName = null;
    this.handleSuccess = this.handleSuccess.bind(this);
    this.state = {
      awardId: -1
    };
  }

  changeFocus(branchName) {
    this._FocusBranchName = branchName;
    super.changeFocus(this.props.branchName + branchName);
  }

  onFocus() {
    this.changeFocus("/NineSquared");
  }

  handleSuccess(index) {
    console.log(`handleSuccess index:${index}`);
    this.setState({ awardId: index });
  }

  renderContent() {
    return (
            <div style={this._Theme.MainPage.bgStyle}>
                <Button branchName={`${this.props.branchName}/prizelist`} theme={this._Theme.MainPage.btn1} text="中奖纪录"></Button>
                <Button branchName={`${this.props.branchName}/morerules`} theme={this._Theme.MainPage.btn2} text="更多规则"></Button>
                <NineSquared branchName={`${this.props.branchName}/NineSquared`} handleSuccess={this.handleSuccess}/>
                <div style={this._Theme.tipsInfo}>{this.state.awardId !== -1 ? `恭喜您获得:【${ConstantVar.Awards[this.state.awardId].name}】` : ""}</div>
            </div>
    );
  }

  onKeyDown(ev) {
    let key_use = true;
    switch (ev.keyCode) {
      case ConstantVar.KeyCode.Up:
        if (this._FocusBranchName === "/NineSquared") {
          this.changeFocus("/prizelist");
        }
        break;
      case ConstantVar.KeyCode.Down:
        if (this._FocusBranchName === "/prizelist" || this._FocusBranchName === "/morerules") {
          this.changeFocus("/NineSquared");
        }
        break;
      case ConstantVar.KeyCode.Left:
        if (this._FocusBranchName === "/prizelist") {
          this.changeFocus("/NineSquared");
        } else if (this._FocusBranchName === "/morerules") {
          this.changeFocus("/prizelist");
        }
        break;
      case ConstantVar.KeyCode.Right:
        if (this._FocusBranchName === "/prizelist") {
          this.changeFocus("/morerules");
        } else if (this._FocusBranchName === "/NineSquared") {
          this.changeFocus("/prizelist");
        }
        break;
      case ConstantVar.KeyCode.Ok:
        switch (this._FocusBranchName) {
          case "/prizelist":
            break;
          case "/morerules":
            break;
          default:
            console.log(`onKeyDown FocusBranchName:${this._FocusBranchName}`);
            break;
        }
        break;
      default:
        console.log(`onKeyDown keycode:${ev.keyCode}`);
        key_use = false;
        break;
    }

    return key_use;
  }

  componentDidMount() {
    // nothing to do
    console.log("MainPage componentDidMount in");
  }

  componentWillUnmount() {
    console.log("MainPage componentWillUnmount in");
  }
}
export default MainPage;
