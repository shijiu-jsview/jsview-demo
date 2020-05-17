import React from 'react';
import {HORIZONTAL, Fdiv, SimpleWidget, SWidgetDispatcher, SlideStyle} from "../../../jsview-utils/jsview-react/index_widget"
import PageTheme from "../../common/PageTheme"
import CommonApi from "../../common/CommonApi"
import ConstantVar from "../../common/ConstantVar"
import { FocusBlock } from "../../../demoCommon/BlockDefine"

const Hammer = ({visible, style, onAnimationEnd}) => {
    if (visible) {
        return  <Fdiv style={style} onAnimationEnd={onAnimationEnd}></Fdiv>
    } else {
        return null
    }
}

class SmashEggsPage extends FocusBlock {
    constructor(props) {
        super(props);
        this._PageTheme = PageTheme.get().MainPage;
        this._ActivityData = this.props.activityData;
        this._TotalSmashNums = 0;
        this._doSmashEggs = this.props.doSmashEggs;
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._onClick = this._onClick.bind(this);
        this._SmashEggEnd = this._SmashEggEnd.bind(this);
        this._onItemFocus = this._onItemFocus.bind(this);
        this._Dispatcher = new SWidgetDispatcher();
        this._FocusId = 0;
        this._HammerAnimation = null;
        this.state = {
            data:this._PageTheme.SmashEggsPage.widget.data,
            smashInfo:null,
        }
    }

    _SmashEggEnd() {
        console.log("_SmashEggEnd in");
        this._HammerAnimation = null;
        if (this._TotalSmashNums !== 0) {
            //中奖请求
            if (this._doSmashEggs) {
                this._doSmashEggs();
            }
        }
    }

    _UpdateSmashNums() {
        let activity_data = this.props.activityData;
        if (activity_data) {
            //解析数据
            if (this.props.alreadyPurchased) {
                this._TotalSmashNums = 300 - activity_data.length;
                if (this._TotalSmashNums < 0) {
                    this._TotalSmashNums = 0;
                }
            }
            return "您的抽奖次数:"+this._TotalSmashNums+"次";
        } else {
            return "";
        }
    }

    onFocus() {
        this.changeFocus("SmashEggsWidget");
        console.log("SmashEggsPage onFocus");
    }

    onBlur() {
        console.log("SmashEggsPage onBlur");
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _RenderFocus(item) {
        let animation = this._HammerAnimation;

        let hammer_style = {...this._PageTheme.SmashEggsPage.widget.hammer.focusStyle, ...{animation:animation}};
        this._HammerAnimation = null;
        console.log("_RenderFocus hammer_style:"+hammer_style);
        return (
            <Fdiv>
                <Fdiv style={{...this._PageTheme.SmashEggsPage.widget.egg.style, ...{backgroundImage:item.eggUrl}}}></Fdiv>
                <Hammer visible={true} style={hammer_style} onAnimationEnd={this._SmashEggEnd}/>
            </Fdiv>
        )
    }

    _RenderItem(item) {
        return (
            <Fdiv>
                <Fdiv style={{...this._PageTheme.SmashEggsPage.widget.egg.style, ...{backgroundImage:item.eggUrl}}}></Fdiv>
                <Hammer visible={item.id===this._FocusId} style={{...this._PageTheme.SmashEggsPage.widget.hammer.style, ...{animation:null}}}/>

            </Fdiv>
        )
    }

    _onItemFocus(item, pre_edge, query) {
        let pre_focus = this._FocusId;
        this._FocusId = item.id;
        let info = {
            type: SWidgetDispatcher.Type.updateItem,
            data: [pre_focus, this._FocusId]
        };
        this._Dispatcher.dispatch(info);
    }

    _onClick(item) {
        let data = this._PageTheme.SmashEggsPage.widget.data;
        let new_item = CommonApi.Clone(data[item.id]);//更新数据,触发onRedrawFocus
        new_item["smashed"] = true;
        data[item.id] = new_item;
        this._HammerAnimation = "swing-hammer 0.5s";
        if (this._TotalSmashNums === 0) {
            if (this.props.alreadyPurchased) {
                this.setState({smashInfo:"您的抽奖机会已用完，感谢参加本次活动～", data:data})
            } else {
                this.setState({smashInfo:"领取活动优惠，获得免费抽奖机会～",data:data})
            }
        } else {
            this.setState({smashInfo:"",data:data})
        }
        return true;
    }
    onKeyDown(ev) {
        if (ev.keyCode === ConstantVar.KeyCode.Back || ev.keyCode === ConstantVar.KeyCode.Back2) {
            return false;
        }
        return true;
    }
    renderContent() {
        let smash_info = this._UpdateSmashNums();
        return (
            <div style={this._PageTheme.SmashEggsPage.style}>
                <div style={{left:this._PageTheme.SmashEggsPage.widget.left,top:this._PageTheme.SmashEggsPage.widget.top}}>
                    <SimpleWidget
                        width={ this._PageTheme.SmashEggsPage.widget.width }
                        height={this._PageTheme.SmashEggsPage.widget.height}
                        direction={ HORIZONTAL }
                        data={this.state.data}
                        padding={{top: 20}}
                        slideStyle={ SlideStyle.seamless }
                        onEdge={ this.props.onEdge}
                        renderItem={ this._RenderItem }
                        renderFocus={ this._RenderFocus }
                        onItemFocus={this._onItemFocus}
                        dispatcher={this._Dispatcher}
                        onClick={ this._onClick }
                        measures={ this._Measures }
                        branchName="SmashEggsWidget"
                    />
                </div>
                <div style={this._PageTheme.SmashEggsPage.smashNumStyle}>
                    {this.state.smashInfo ? this.state.smashInfo:smash_info}
                </div>
            </div>
        )
    }

    componentDidMount() {
        console.log("SmashEggsPage componentDidMount");
    }
}
export default SmashEggsPage;
