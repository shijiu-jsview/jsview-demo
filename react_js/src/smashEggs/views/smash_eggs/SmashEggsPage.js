import React from 'react';
import {HORIZONTAL, Fdiv, SimpleWidget, SWidgetDispatcher, SlideStyle} from "../../../jsview-utils/jsview-react/index_widget"
import PageTheme from "../../common/PageTheme"
import CommonApi from "../../common/CommonApi"
import ConstantVar from "../../common/ConstantVar"
import { FocusBlock } from "../../../demoCommon/BlockDefine"
import JsvSpray from '../../../jsview-utils/JsViewReactWidget/JsvSpray'
import "../../App.css"

const Hammer = ({visible, style, onAnimationEnd}) => {
    if (visible) {
        return  <Fdiv style={style} onAnimationEnd={onAnimationEnd}></Fdiv>
    } else {
        return null
    }
}

class ParticleView extends React.Component{
    render() {
        let spray_style = {
            type:0,
            particleNum: 100,
            deltaAngle: 30,
            deltaWidth: 100,
            pointSizeMin: 6,
            pointSizeMax: 9,
            speedMin: 10,
            speedMax: 20,
            lifeMin: 500,
            lifeMax: 2000,
            accelerateX: 0,
            accelerateY: -200
        }
        
        return(
            <div style={this.props.style}>
                <JsvSpray pointRes="rgba(0,0,255,1)" sprayStyle={spray_style}/>
                <JsvSpray pointRes="rgba(255,0,0,1)" sprayStyle={spray_style}/>
                <JsvSpray pointRes="rgba(0,255,0,1)" sprayStyle={spray_style}/>
                <JsvSpray pointRes="rgba(255,255,0,1)" sprayStyle={spray_style}/>
            </div>
        )
    }
}

class BrokenEgg extends React.Component{
    render() {
        return(
            <div>
                <div style={{width: this.props.w, height: this.props.h, backgroundImage: this.props.backImg}}/>
                <div style={{width: this.props.w, height: this.props.h, backgroundImage: this.props.foreImg}}/>
            </div>
        )
    }
}

class BreakAnim extends React.Component{
    constructor(props) {
        super(props);
        this._getView = this._getView.bind(this);
        this._onAnimEnd = this._onAnimEnd.bind(this);
        this.state = {
            crackEnd: false
        }
    }

    _onAnimEnd() {
        this.setState({crackEnd: true});
        this.props.onCrackEnd();
    }

    _getView() {
        if (this.state.crackEnd) {
            return (
                <BrokenEgg w={this.props.w} h={this.props.h} backImg={this.props.backImg} foreImg={this.props.foreImg}/>
            )
        } else {
            return(
            <div>
                <div style={{width: this.props.w, height: this.props.h, backgroundImage: this.props.eggUrl}}/>
                <div style={{top: 0, width: this.props.w, height: this.props.h, clipPath: "inset(0px 0px 0px 0px)", animation: "crack-clip 0.5s"}} onAnimationEnd={this._onAnimEnd}>
                    <div style={{top: 0, width: this.props.w, height: this.props.h, backgroundImage: this.props.crackImg, animation: "crack-img 0.5s"}}/>
                </div>
            </div>
            )
        }
    }

    render() {
        return(
            <div>
                {this._getView()}
                {this.state.crackEnd ? <ParticleView style={{top:120, left: 0}}/> : null}
            </div>
        )
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
        this._CrackEnd = this._CrackEnd.bind(this);
        this._onItemFocus = this._onItemFocus.bind(this);
        this._GetEggFocusView = this._GetEggFocusView.bind(this);
        this._Dispatcher = new SWidgetDispatcher();
        this._FocusId = 0;
        this._HammerAnimation = null;
        this.state = {
            data:this._PageTheme.SmashEggsPage.widget.data,
            smashInfo:null,
        }
    }

    _CrackEnd() {
        setTimeout(() => {
            this.props.onLockKey(false)
        }, 1500);
        if (this._TotalSmashNums !== 0) {
            //中奖请求
            if (this._doSmashEggs) {
                setTimeout(() => {
                    this._doSmashEggs()
                }, 1500 );
            }
        }
    }

    _SmashEggEnd() {
        console.log("_SmashEggEnd in");
        this._HammerAnimation = null;
    }

    _UpdateSmashNums() {
        console.log("_UpdateSmashNums ", this.props.activityData);
        let activity_data = this.props.activityData;
        if (activity_data) {
            //解析数据
            if (this.props.alreadyPurchased) {
                this._TotalSmashNums = 600 - activity_data.length;
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

    _GetEggFocusView(item) {
        let img_width = this._PageTheme.SmashEggsPage.widget.egg.style.width;
        let img_height = this._PageTheme.SmashEggsPage.widget.egg.style.height;
        if (this.state.data[item.id].smashing) {
            this.state.data[item.id].smashing = false;
            return(
                <BreakAnim w={img_width} h={img_height} backImg={item.brokenBack} foreImg={item.brokenFore} crackImg={this._PageTheme.SmashEggsPage.widget.egg.crack.url} eggUrl={item.eggUrl} onCrackEnd={this._CrackEnd}/>
            )
        } else {
            return this.state.data[item.id].smashed ? 
            <BrokenEgg w={img_width} h={img_height} backImg={item.brokenBack} foreImg={item.brokenFore}/> :
            <div style={{width: img_width, height: img_height, backgroundImage:item.eggUrl}}/>
        }
    }

    _RenderFocus(item) {
        let animation = this._HammerAnimation;

        let hammer_style = {...this._PageTheme.SmashEggsPage.widget.hammer.focusStyle, ...{animation:animation}};
        this._HammerAnimation = null;
        console.log("_RenderFocus hammer_style:"+hammer_style);
        return (
            <Fdiv>
                <div style={this._PageTheme.SmashEggsPage.widget.egg.style}>
                    {
                        this._GetEggFocusView(item)
                    }
                </div>
                <Hammer visible={true} style={hammer_style} onAnimationEnd={this._SmashEggEnd}/>
            </Fdiv>
        )
    }

    _RenderItem(item) {
        let img_width = this._PageTheme.SmashEggsPage.widget.egg.style.width;
        let img_height = this._PageTheme.SmashEggsPage.widget.egg.style.height;
        return (
            <Fdiv>
                <div style={this._PageTheme.SmashEggsPage.widget.egg.style}>
                    {
                        this.state.data[item.id].smashed ? 
                        <BrokenEgg w={img_width} h={img_height} backImg={item.brokenBack} foreImg={item.brokenFore}/> :
                        <div style={{width: img_width, height: img_height, backgroundImage:item.eggUrl}}/>
                    }
                </div>
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
        if (!new_item.smashed) {
            new_item["smashing"] = true;
            this.props.onLockKey(true);
        }
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
                <div style={{left:this._PageTheme.SmashEggsPage.widget.left - 600, top:this._PageTheme.SmashEggsPage.widget.top - 600}}>
                    <SimpleWidget
                        width={ this._PageTheme.SmashEggsPage.widget.width + 1200 }
                        height={this._PageTheme.SmashEggsPage.widget.height + 1200}
                        direction={ HORIZONTAL }
                        data={this.state.data}
                        padding={{top: 20 + 600, left: 600, right: 600, bottom: 600}}
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
