import React from 'react';
import {Fdiv, EdgeDirection} from "../../../jsview-utils/jsview-react/index_widget"
import SmashEggsPage from "./SmashEggsPage";
import MyPrizeRecordPage from "./MyPrizeRecordPage";
import GetPrizePage from "./GetPrizePage";
import GetPrizeFinishPage from "./GetPrizeFinishPage";
import NoPrizePage from "./NoPrizePage"
import PageTheme from "../../common/PageTheme"
import CommonApi from "../../common/CommonApi";
import ConstantVar from "../../common/ConstantVar"
import { FocusBlock } from "../../../demoCommon/BlockDefine"

class MainPage extends FocusBlock {
    constructor(props) {
        super(props);
        this._onEdge = this._onEdge.bind(this);
        this._doSmashEggs = this._doSmashEggs.bind(this);
        this._goTo = this._goTo.bind(this);
        this._PagetTheme = PageTheme.get().MainPage;
        this._UserId = CommonApi.getUserId();
        this._TotalSmash = 3;
        this._RoadMap = null;
        this.state = {
            visible: "hidden",
            data: null,
            prize: null,
            focusBranchName: null,
            mainPageContainerVisible:"inherit"
        }
    }

    _goTo(branchName, need_update_page) {
        //返回到主页面
        let mainPageContainerVisible = "inherit"
        console.log("_goToHome , branchName:"+branchName);
        switch(branchName){
            case ConstantVar.BranchName.MyPrizeRecordPage:
            case ConstantVar.BranchName.NoPrizePage:
            case ConstantVar.BranchName.GetPrizePage:
            case ConstantVar.BranchName.GetPrizeFinishPage:
                mainPageContainerVisible = "hidden";
                break;
            default:
                break;
        }
        //防止页面切换闪烁，隐藏主页内容
        this.setState({
                mainPageContainerVisible: mainPageContainerVisible,
            });
        this.changeFocus(branchName);
        if (need_update_page) {
           this._updatePageData();
        }
    }

    _onEdge(edge_info) {
        if (edge_info.direction === EdgeDirection.top) {
            this._UpdateFocus(ConstantVar.KeyCode.Up);
        }
    }

    _InitPage(data) {
        let focusBranchName = ConstantVar.BranchName.GetDiscountBtn;
        //先确定焦点 & 初始化按钮的style
        if (this.props.AlreadyPurchased) {
            focusBranchName = ConstantVar.BranchName.SmashEggsPage;
        }
        console.log("_InitPage, data:", data);
        this.changeFocus(focusBranchName);
        this.setState(
            {
                visible: "visible",
                data: data,
                "focusBranchName": focusBranchName,
            });
    }

    _UpdateFocus(keycode) {
        this._ensureRoadMap();
        let preFocusBranchName = this.state.focusBranchName;
        let branch_road_map = this._RoadMap[preFocusBranchName];
        if (branch_road_map) {
            let curFocusBranchName = branch_road_map[keycode];
            if (curFocusBranchName) {//焦点切换,否则什么也不做
                this.changeFocus(curFocusBranchName);
                this.setState({
                    "focusBranchName": curFocusBranchName
                });
            }
        } else {
            console.log("This branchName is not Exist in roadmap!");
        }
    }

    onFocus() {
        console.log("MainPage onFocus");
        let promise = CommonApi.getActivityInfo(this._UserId);
        promise.then(data => {
            //焦点设置
            this._InitPage(data);
        }).catch(error => {
            console.log("MainPage data fetch error", error);
            this._InitPage([]);
        })
    }

    onBlur() {
        console.log("MainPage onBlur");
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
                    case ConstantVar.BranchName.GetPrizeFinishPage:
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
                    case ConstantVar.BranchName.MyPrizeRecordBtn:
                        this.changeFocus(ConstantVar.BranchName.MyPrizeRecordPage);
                        key_use = true;
                        break;
                    case ConstantVar.BranchName.GetDiscountBtn:
                        // start app
                        CommonApi.gotoBuy();
                        key_use = true;
                        break;
                    case ConstantVar.BranchName.EnterStudyingBtn:
                        // start app
                        CommonApi.gotoStudy();
                        key_use = true;
                        break;
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
        let btn_theme = this._PagetTheme.btn;
        console.log("this.state.prize:", this.state.prize);
        return (
            <div style={{visibility: this.state.visible}}>
                <Fdiv style={{visibility:this.state.mainPageContainerVisible}}>
                    <div style={this._PagetTheme.bgStyle}></div>
                    <ActivityBtn branchName={ConstantVar.BranchName.GetDiscountBtn} btnTheme={this._PagetTheme.btn}
                                 isFocus={ConstantVar.BranchName.GetDiscountBtn === this.state.focusBranchName}
                                 text={btn_theme.getdiscount.text} hasGetDiscountBtn={!this.props.AlreadyPurchased}/>
                    <ActivityBtn branchName={ConstantVar.BranchName.EnterStudyingBtn} btnTheme={this._PagetTheme.btn}
                                 isFocus={ConstantVar.BranchName.EnterStudyingBtn === this.state.focusBranchName}
                                 text={btn_theme.enterstudying.text} hasGetDiscountBtn={!this.props.AlreadyPurchased}/>
                    <ActivityBtn branchName={ConstantVar.BranchName.MyPrizeRecordBtn} btnTheme={this._PagetTheme.btn}
                                 isFocus={ConstantVar.BranchName.MyPrizeRecordBtn === this.state.focusBranchName}
                                 text={btn_theme.myrecord.text} hasGetDiscountBtn={!this.props.AlreadyPurchased}/>
                    <SmashEggsPage branchName="SmashEggsPage" activityData={this.state.data} onEdge={this._onEdge}
                                   doSmashEggs={this._doSmashEggs} alreadyPurchased={this.props.AlreadyPurchased}/>
                </Fdiv>
                <MyPrizeRecordPage branchName="MyPrizeRecordPage" data={this.state.data} goTo={ this._goTo}/>
                <NoPrizePage branchName="NoPrizePage" goTo={ this._goTo}/>
                <GetPrizePage branchName="GetPrizePage" data={this.state.prize} goTo={ this._goTo} account={this._UserId}/>
                <GetPrizeFinishPage branchName="GetPrizeFinishPage" goTo={ this._goTo}/>
            </div>
        )
    }

    componentDidMount() {
        console.log("MainPage componentDidMount");

    }
    componentWillUnMount() {
        console.log("MainPage componentWillUnMount");
    }
    _updatePageData() {
        //砸蛋后更新数据
        let promise = CommonApi.getActivityInfo(this._UserId);
        promise.then(data => {
            this.setState({data: data})
        }).catch(error => {
            console.log("MainPage data fetch error", error);
        })
    }

    _doSmashEggs() {
        let promise = CommonApi.hitEggs(this._UserId);
        promise.then(data => {
            console.log("_doSmashEggs, data:", data);
            if (data.prize_id === ConstantVar.NoPrize) {
                this.changeFocus(ConstantVar.BranchName.NoPrizePage);
                this._updatePageData();
            } else {
                if (data.prize_id < ConstantVar.Prize.length) {
                    this.setState({prize: data})
                    this.changeFocus(ConstantVar.BranchName.GetPrizePage);
                } else {
                    console.log("_doSmashEggs the prize not exist, prize_id:" + data.prize_id);
                }
            }
        })
            .catch(error => {
                console.log("_doSmashEggs, error:", error);
            })
    }

    _ensureRoadMap() {
        if (this._RoadMap == null) {
            this._RoadMap = {};
            if (this.props.AlreadyPurchased) {
                this._RoadMap[ConstantVar.BranchName.EnterStudyingBtn] = {};
                this._RoadMap[ConstantVar.BranchName.EnterStudyingBtn][ConstantVar.KeyCode.Right] = ConstantVar.BranchName.MyPrizeRecordBtn;
                this._RoadMap[ConstantVar.BranchName.EnterStudyingBtn][ConstantVar.KeyCode.Down] = ConstantVar.BranchName.SmashEggsPage;
                this._RoadMap[ConstantVar.BranchName.EnterStudyingBtn][ConstantVar.KeyCode.Up] = ConstantVar.BranchName.MyPrizeRecordBtn;
                this._RoadMap[ConstantVar.BranchName.MyPrizeRecordBtn] = {};
                this._RoadMap[ConstantVar.BranchName.MyPrizeRecordBtn][ConstantVar.KeyCode.Left] = ConstantVar.BranchName.EnterStudyingBtn;
                this._RoadMap[ConstantVar.BranchName.MyPrizeRecordBtn][ConstantVar.KeyCode.Down] = ConstantVar.BranchName.EnterStudyingBtn;
                this._RoadMap[ConstantVar.BranchName.SmashEggsPage] = {};
                this._RoadMap[ConstantVar.BranchName.SmashEggsPage][ConstantVar.KeyCode.Up] = ConstantVar.BranchName.EnterStudyingBtn;
            } else {
                this._RoadMap[ConstantVar.BranchName.GetDiscountBtn] = {};
                this._RoadMap[ConstantVar.BranchName.GetDiscountBtn][ConstantVar.KeyCode.Right] = ConstantVar.BranchName.EnterStudyingBtn;
                this._RoadMap[ConstantVar.BranchName.GetDiscountBtn][ConstantVar.KeyCode.Down] = ConstantVar.BranchName.SmashEggsPage;
                this._RoadMap[ConstantVar.BranchName.EnterStudyingBtn] = {};
                this._RoadMap[ConstantVar.BranchName.EnterStudyingBtn][ConstantVar.KeyCode.Left] = ConstantVar.BranchName.GetDiscountBtn;
                this._RoadMap[ConstantVar.BranchName.EnterStudyingBtn][ConstantVar.KeyCode.Right] = ConstantVar.BranchName.MyPrizeRecordBtn;
                this._RoadMap[ConstantVar.BranchName.EnterStudyingBtn][ConstantVar.KeyCode.Up] = ConstantVar.BranchName.MyPrizeRecordBtn;
                this._RoadMap[ConstantVar.BranchName.EnterStudyingBtn][ConstantVar.KeyCode.Down] = ConstantVar.BranchName.SmashEggsPage;
                this._RoadMap[ConstantVar.BranchName.MyPrizeRecordBtn] = {};
                this._RoadMap[ConstantVar.BranchName.MyPrizeRecordBtn][ConstantVar.KeyCode.Left] = ConstantVar.BranchName.EnterStudyingBtn;
                this._RoadMap[ConstantVar.BranchName.MyPrizeRecordBtn][ConstantVar.KeyCode.Down] = ConstantVar.BranchName.EnterStudyingBtn;
                this._RoadMap[ConstantVar.BranchName.SmashEggsPage] = {};
                this._RoadMap[ConstantVar.BranchName.SmashEggsPage][ConstantVar.KeyCode.Up] = ConstantVar.BranchName.GetDiscountBtn;
            }
        }
    }
}
export default MainPage;

const ActivityBtn = ({branchName, text, btnTheme, isFocus, hasGetDiscountBtn}) => {
    //根据branchName获取theme
    let forgroundStyle = null;
    let backgroundStyle = null;
    let forgroundFocusStyle = null;
    let backgroundFocusStyle = null;

    switch (branchName) {
        case ConstantVar.BranchName.GetDiscountBtn:{
            if (hasGetDiscountBtn) {
                let theme_name = "getdiscount";
                forgroundStyle = {...btnTheme.common.normalStyle, ...btnTheme[theme_name].style};
                backgroundStyle = {...btnTheme.common.normalBgStyle, ...btnTheme[theme_name].style};

                forgroundFocusStyle = {...btnTheme.common.focusStyle, ...btnTheme[theme_name].focusStyle};
                backgroundFocusStyle = {...btnTheme.common.focusBgStyle, ...btnTheme[theme_name].focusStyle}
            }
            break;
        }
        case ConstantVar.BranchName.MyPrizeRecordBtn:{
                let theme_name = "myrecord";
                forgroundStyle = {...btnTheme.common.normalStyle, ...btnTheme[theme_name].style};
                backgroundStyle = {...btnTheme.common.normalBgStyle, ...btnTheme[theme_name].style};

                forgroundFocusStyle = {...btnTheme.common.focusStyle, ...btnTheme[theme_name].focusStyle};
                backgroundFocusStyle = {...btnTheme.common.focusBgStyle, ...btnTheme[theme_name].focusStyle}
            break;
        }
        case ConstantVar.BranchName.EnterStudyingBtn: {
            let theme_name = "enterstudying";
            let enter_study_theme = btnTheme[theme_name].style;
            let btn_theme = btnTheme.common.normalStyle;
            let btn_bg_theme = btnTheme.common.normalBgStyle;
            if (!hasGetDiscountBtn) {
                enter_study_theme = btnTheme[theme_name].centerStyle;
            }
            backgroundStyle = {...btn_bg_theme, ...enter_study_theme};
            forgroundStyle = {...btn_theme, ...enter_study_theme};

            enter_study_theme = btnTheme[theme_name].focusStyle;
            btn_theme = btnTheme.common.focusStyle;
            if (!hasGetDiscountBtn) {
                enter_study_theme = btnTheme[theme_name].centerFocusStyle;
            }
            btn_bg_theme = btnTheme.common.focusBgStyle;
            forgroundFocusStyle = {...btn_theme, ...enter_study_theme};
            backgroundFocusStyle = {...btn_bg_theme, ...enter_study_theme};
            break;
        }
        default:
            break;
    }

    if (backgroundStyle) {
        console.log("branchName:"+branchName+", forgroundStyle:", forgroundStyle);
        return (
            <Fdiv key={branchName} branchName={branchName}>
                <div key="normal" style={{visibility:isFocus?"hidden":"inherit"}}>
                    <div style={backgroundStyle}></div>
                    <div style={forgroundStyle}>{text}</div>
                </div>
                <div key="focus" style={{visibility:isFocus?"inherit":"hidden"}}>
                    <div style={backgroundFocusStyle}></div>
                    <div style={forgroundFocusStyle}>{text}</div>
                </div>
            </Fdiv>
        )
    } else {
        console.log("ActivityBtn branchName is not support:", branchName);
        return null;
    }
}