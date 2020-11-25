import React from 'react';
import { Fdiv, EdgeDirection } from "../../../jsview-utils/jsview-react/index_widget";
import SmashEggsPage from "./SmashEggsPage";
import MyPrizeRecordPage from "./MyPrizeRecordPage";
import GetPrizePage from "./GetPrizePage";
import NoPrizePage from "./NoPrizePage";
import PageTheme from "../../common/PageTheme";
import CommonApi from "../../common/CommonApi";
import ConstantVar from "../../common/ConstantVar";
import { FocusBlock } from "../../../demoCommon/BlockDefine";
import Rules from "./Rules";
import PrizeList from "./PrizeList";

class MainPage extends FocusBlock {
  constructor(props) {
    super(props);
    this._onEdge = this._onEdge.bind(this);
    this._doSmashEggs = this._doSmashEggs.bind(this);
    this._goTo = this._goTo.bind(this);
    this._PagetTheme = PageTheme.get().MainPage;
    this._TotalSmash = 3;
    this._RoadMap = null;
    this._KeyLockSwitch = false;
    this.state = {
      visible: "hidden",
      data: null,
      prizerecord: null,
      prize: null,
      focusBranchName: null,
      mainPageContainerVisible: "inherit"
    };
  }

  _goTo(branchName, need_update_page) {
    // 返回到主页面
    let mainPageContainerVisible = "inherit";
    console.log(`_goToHome , branchName:${branchName}`);
    switch (branchName) {
      case ConstantVar.BranchName.MyPrizeRecordPage:
      case ConstantVar.BranchName.NoPrizePage:
      case ConstantVar.BranchName.GetPrizePage:
        mainPageContainerVisible = "hidden";
        break;
      default:
        break;
    }
    // 防止页面切换闪烁，隐藏主页内容
    this.setState({
      focusBranchName: branchName,
      mainPageContainerVisible,
    });
    this.changeFocus(branchName);
    if (need_update_page) {
      this._updatePageData(this.state.data);
    }
  }

  _onEdge(edge_info) {
    if (edge_info.direction === EdgeDirection.top) {
      this._UpdateFocus(ConstantVar.KeyCode.Up);
    } else if (edge_info.direction === EdgeDirection.left) {
      this._UpdateFocus(ConstantVar.KeyCode.Left);
    } else if (edge_info.direction === EdgeDirection.right) {
      this._UpdateFocus(ConstantVar.KeyCode.Right);
    }
  }

  _InitPage(data) {
    const focusBranchName = ConstantVar.BranchName.SmashEggsPage;
    console.log("_InitPage, data:", data);
    this.changeFocus(focusBranchName);
    this.setState(
      {
        visible: "visible",
        data,
        focusBranchName,
      });
  }

  _UpdateFocus(keycode) {
    this._ensureRoadMap();
    const preFocusBranchName = this.state.focusBranchName;
    const branch_road_map = this._RoadMap[preFocusBranchName];
    if (branch_road_map) {
      const curFocusBranchName = branch_road_map[keycode];
      if (curFocusBranchName) { // 焦点切换,否则什么也不做
        this.changeFocus(curFocusBranchName);
        this.setState({
          focusBranchName: curFocusBranchName
        });
      }
    } else {
      console.log("This branchName is not Exist in roadmap!");
    }
  }

  onFocus() {
    console.log("MainPage onFocus");
    const promise = CommonApi.getTimes();// TODO 获取抽奖次数
    promise.then(data => {
      // 焦点设置
      this._InitPage(data);
    }).catch(error => {
      console.log("MainPage data fetch error", error);
      this._InitPage({ alias: "", total: 0 });
    });
  }

  onBlur() {
    console.log("MainPage onBlur");
  }

  onDispatchKeyDown(ev) {
    if (this._KeyLockSwitch) {
      return true;
    }
    return false;
  }

  onKeyDown(ev) {
    let key_use = false;
    switch (ev.keyCode) {
      case ConstantVar.KeyCode.Left:
      case ConstantVar.KeyCode.Up:
      case ConstantVar.KeyCode.Down:
      case ConstantVar.KeyCode.Right:
        this._UpdateFocus(ev.keyCode);
        key_use = true;
        break;
      case ConstantVar.KeyCode.Back:
      case ConstantVar.KeyCode.Back2:
        switch (this.state.focusBranchName) {
          case ConstantVar.BranchName.GetPrizePage:
          case ConstantVar.BranchName.NoPrizePage:
            this.changeFocus(ConstantVar.BranchName.SmashEggsPage);
            key_use = true;
            break;
          case ConstantVar.BranchName.MyPrizeRecordPage:
            this.changeFocus(ConstantVar.BranchName.MyPrizeRecordBtn);
            key_use = true;
            break;
          default:
            break;
        }
        break;
      case ConstantVar.KeyCode.Ok:
        switch (this.state.focusBranchName) {
          case ConstantVar.BranchName.MyPrizeRecordBtn: {
            const promise = CommonApi.getPrizes();
            promise.then((data) => {
              this.setState({ prizerecord: data });
              this.changeFocus(ConstantVar.BranchName.MyPrizeRecordPage);
            }).catch((error) => {
              console.log(`goto prizes record error:${error}`);
              // TODO toast 显示
              this.setState({ prizerecord: [] });
              this.changeFocus(ConstantVar.BranchName.MyPrizeRecordPage);
            });
            key_use = true;
            break;
          }
          default:
            break;
        }
        break;
      default:
        break;
    }

    return key_use;
  }

  renderContent() {
    const btn_theme = this._PagetTheme.btn;
    console.log("this.state.prize:", this.state.prize);
    return (
            <div style={{ visibility: this.state.visible }}>

                <Fdiv style={{ visibility: this.state.mainPageContainerVisible }}>
                    <div style={{
                      ...this._PagetTheme.bgStyle,
                      backgroundImage: this.props.info ? `url(${this.props.info.bg_url})` : null
                    }}></div>
                    <div style={this._PagetTheme.userInfo.bg.style}>
                      {this.state.data ? <div style={this._PagetTheme.userInfo.text.style}>
                        {`游客：${this.state.data.alias}`}
                      </div> : null}
                    </div>
                    <ActivityBtn branchName={ConstantVar.BranchName.MyPrizeRecordBtn} btnTheme={this._PagetTheme.btn}
                                 isFocus={ConstantVar.BranchName.MyPrizeRecordBtn === this.state.focusBranchName}
                                 text={btn_theme.myrecord.text}/>
                    <SmashEggsPage branchName="SmashEggsPage" activityData={this.state.data} onEdge={this._onEdge}
                                   doSmashEggs={this._doSmashEggs} info={this.props.info}
                                   onLockKey={(value) => {
                                     this._KeyLockSwitch = value;
                                   }}/>
                    <Rules theme={this._PagetTheme.Rules} info={this.props.info}/>
                    <PrizeList branchName={ConstantVar.BranchName.PrizeList} info={this.props.info} onEdge={this._onEdge}/>
                </Fdiv>
                {this.state.data ? <div>
                    <MyPrizeRecordPage branchName="MyPrizeRecordPage" data={this.state.prizerecord} info={this.props.info} account={this.state.data.alias} goTo={ this._goTo}/>
                    <NoPrizePage branchName="NoPrizePage" goTo={ this._goTo}/>
                    <GetPrizePage branchName="GetPrizePage" data={this.state.prize} goTo={ this._goTo}
                                  info={this.props.info}/>
                </div> : null}

            </div>
    );
  }

  componentDidMount() {
    console.log("MainPage componentDidMount");
  }

  componentWillUnMount() {
    console.log("MainPage componentWillUnMount");
  }

  _updatePageData(data) {
    // 砸蛋后更新数据
    this.setState({ data });
  }

  _doSmashEggs() {
    const promise = CommonApi.hitEggs();// TODO 砸蛋接口对接
    promise.then(data => {
      console.log("_doSmashEggs, data:", data);
      let prize = null;
      for (let i = 0; i < this.props.info.prize_info.length; i++) {
        const prize_info = this.props.info.prize_info[i];
        if (prize_info.prize_id === data.prize_id) {
          prize = prize_info;
          break;
        }
      }
      if (prize) {
        this.setState({ prize });
        this.changeFocus(ConstantVar.BranchName.GetPrizePage);
      } else {
        this.changeFocus(ConstantVar.BranchName.NoPrizePage);
      }
      this._updatePageData({ ...this.state.data, total: data.total });
    }).catch(error => {
      console.log("_doSmashEggs, error:", error);
      this.changeFocus(ConstantVar.BranchName.NoPrizePage);
    });
  }

  _ensureRoadMap() {
    if (this._RoadMap === null) {
      this._RoadMap = {};
      this._RoadMap[ConstantVar.BranchName.SmashEggsPage] = {};
      this._RoadMap[ConstantVar.BranchName.SmashEggsPage][ConstantVar.KeyCode.Up] = ConstantVar.BranchName.MyPrizeRecordBtn;
      this._RoadMap[ConstantVar.BranchName.SmashEggsPage][ConstantVar.KeyCode.Right] = ConstantVar.BranchName.PrizeList;

      this._RoadMap[ConstantVar.BranchName.MyPrizeRecordBtn] = {};
      this._RoadMap[ConstantVar.BranchName.MyPrizeRecordBtn][ConstantVar.KeyCode.Left] = ConstantVar.BranchName.SmashEggsPage;
      this._RoadMap[ConstantVar.BranchName.MyPrizeRecordBtn][ConstantVar.KeyCode.Down] = ConstantVar.BranchName.SmashEggsPage;

      this._RoadMap[ConstantVar.BranchName.PrizeList] = {};
      this._RoadMap[ConstantVar.BranchName.PrizeList][ConstantVar.KeyCode.Left] = ConstantVar.BranchName.SmashEggsPage;
      this._RoadMap[ConstantVar.BranchName.PrizeList][ConstantVar.KeyCode.Up] = ConstantVar.BranchName.MyPrizeRecordBtn;
    }
  }
}
export default MainPage;

const ActivityBtn = ({ branchName, text, btnTheme, isFocus }) => {
  // 根据branchName获取theme
  let forgroundStyle = null;
  let backgroundStyle = null;
  let forgroundFocusStyle = null;
  let backgroundFocusStyle = null;

  switch (branchName) {
    case ConstantVar.BranchName.MyPrizeRecordBtn: {
      const theme_name = "myrecord";
      forgroundStyle = { ...btnTheme.common.normalStyle, ...btnTheme[theme_name].style };
      backgroundStyle = { ...btnTheme.common.normalBgStyle, ...btnTheme[theme_name].style };

      forgroundFocusStyle = { ...btnTheme.common.focusStyle, ...btnTheme[theme_name].focusStyle };
      backgroundFocusStyle = { ...btnTheme.common.focusBgStyle, ...btnTheme[theme_name].focusStyle };
      break;
    }
    default:
      break;
  }

  if (backgroundStyle) {
    console.log(`branchName:${branchName}, forgroundStyle:`, forgroundStyle);
    return (
            <Fdiv key={branchName} branchName={branchName}>
                <div key="normal" style={{ visibility: isFocus ? "hidden" : "inherit" }}>
                    <div style={backgroundStyle}></div>
                    <div style={forgroundStyle}>{text}</div>
                </div>
                <div key="focus" style={{ visibility: isFocus ? "inherit" : "hidden" }}>
                    <div style={backgroundFocusStyle}></div>
                    <div style={forgroundFocusStyle}>{text}</div>
                </div>
            </Fdiv>
    );
  }
  console.log("ActivityBtn branchName is not support:", branchName);
  return null;
};
