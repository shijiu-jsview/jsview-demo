import React from 'react';
import {
    HORIZONTAL,
    Fdiv,
    SimpleWidget,
    SWidgetDispatcher,
    SlideStyle
} from "../../../jsview-utils/jsview-react/index_widget"
import PageTheme from "../../common/PageTheme"
import CommonApi from "../../common/CommonApi"
import ConstantVar from "../../common/ConstantVar"
import {FocusBlock} from "../../../demoCommon/BlockDefine"
import JsvSpray from '../../../jsview-utils/JsViewReactWidget/JsvSpray'
import {JsvSpriteAnim} from '../../../jsview-utils/JsViewReactWidget/JsvSpriteAnim'

import "../../App.css"
import GoldenCoin1 from "../../images/goldencoin1.png"
import GoldenCoin2 from "../../images/goldencoin2.png"
import RedPacket1  from "../../images/redpacket1.png"
import RedPacket2  from "../../images/redpacket2.png"
import Star1       from "../../images/star1.png"
import Star2       from "../../images/star2.png"
import Star3       from "../../images/star3.png"
import Star4       from "../../images/star4.png"
const Hammer = ({visible, style, onAnimationEnd}) => {
    if (visible) {
        return <Fdiv style={style} onAnimationEnd={onAnimationEnd}></Fdiv>
    } else {
        return null
    }
}

class ParticleView extends React.Component {
    render() {
        const spray_style = {
            type: 0,
            particleNum: 8,
            deltaAngle: 30,
            deltaWidth: 100,
            deltaHeight: 0,
            pointSizeMin: 5,
            pointSizeMax: 40,
            speedMin: 10,
            speedMax: 20,
            lifeMin: 500,
            lifeMax: 2000,
            accelerateX: 0,
            accelerateY: -200,
            addNumSpeed: 0.001,
            enableFade: true,
            enableShrink: false
        }
        return (
            <div style={this.props.style}>
                <JsvSpray pointRes={`url(${GoldenCoin1})`} sprayStyle={spray_style}/>
                <JsvSpray pointRes={`url(${GoldenCoin2})`} sprayStyle={spray_style}/>
                <JsvSpray pointRes={`url(${RedPacket1})`} sprayStyle={spray_style}/>
                <JsvSpray pointRes={`url(${RedPacket2})`} sprayStyle={spray_style}/>
                <JsvSpray pointRes={`url(${Star1})`} sprayStyle={spray_style}/>
                <JsvSpray pointRes={`url(${Star2})`} sprayStyle={spray_style}/>
                <JsvSpray pointRes={`url(${Star3})`} sprayStyle={spray_style}/>
                <JsvSpray pointRes={`url(${Star4})`} sprayStyle={spray_style}/>
            </div>
        )
    }
}

class BrokenEgg extends React.Component {
    render() {
        return (
            <div>
                <div style={{width: this.props.w, height: this.props.h, backgroundImage: this.props.backImg}}/>
                <div style={{width: this.props.w, height: this.props.h, backgroundImage: this.props.foreImg}}/>
            </div>
        )
    }
}
class RecoveryAnim extends React.Component {
    constructor(props) {
        super(props);
        this._getView = this._getView.bind(this);
        this._onAnimEnd = this._onAnimEnd.bind(this);
        this.state = {
            recoveryEnd: false
        }
    }

    _onAnimEnd() {
        this.setState({recoveryEnd: true});
        this.props.onRecoveryEnd(this.props.itemId);
    }

    _getView() {
        if (this.state.recoveryEnd) {
            return (
                <div style={{width: this.props.w, height: this.props.h, backgroundImage: this.props.eggUrl}}/>
            )
        } else {
            const theme = this.props.theme;
            return (
                <div>
                    <div style={{
                        top: 0,
                        width: this.props.w,
                        height: this.props.h,
                        clipPath: "inset(0px 0px 0px 0px)",
                        animation: "recovery-clip 0.8s"
                    }} onAnimationEnd={this._onAnimEnd}>
                        <div style={{
                            top: 0,
                            width: this.props.w,
                            height: this.props.h,
                            backgroundImage: this.props.eggUrl,
                            animation: "recovery-img 0.8s"
                        }}/>

                    </div>
                    {<div style={{
                        left: (this.props.w - theme.line.viewSize.w) / 2,
                        top: -theme.line.viewSize.h / 2,
                        overflow: "hidden",
                        width: theme.line.viewSize.w, height: theme.line.viewSize.h,
                        animation: "recovery-line 0.8s"
                    }}>

                        <JsvSpriteAnim
                            spriteInfo={theme.line.detailInfo}
                            loop="infinite"
                            autostart={true}
                            viewSize={theme.line.viewSize}
                            duration={0.2}
                            imageUrl={theme.line.url}/>
                    </div>}

                </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this._getView()}
            </div>
        )
    }
}

class BreakAnim extends React.Component {
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
            const theme = this.props.theme;
            return (
                <div>
                    <BrokenEgg w={this.props.w} h={this.props.h} backImg={this.props.backImg}
                               foreImg={this.props.foreImg}/>
                    <div style={{
                        left: (this.props.w - theme.light.size.width) / 2,
                        top: (this.props.h - theme.light.size.height) / 2,
                        width: theme.light.size.width,
                        height: theme.light.size.height,
                        backgroundImage: theme.light.url,
                        animation: "recovery-light 0.5s infinite"
                    }}></div>
                </div>
            )
        } else {
            return (
                <div>
                    <div style={{width: this.props.w, height: this.props.h, backgroundImage: this.props.eggUrl}}/>
                    <div style={{
                        top: 0,
                        width: this.props.w,
                        height: this.props.h,
                        clipPath: "inset(0px 0px 0px 0px)",
                        animation: "crack-clip 0.5s"
                    }} onAnimationEnd={this._onAnimEnd}>
                        <div style={{
                            top: 0,
                            width: this.props.w,
                            height: this.props.h,
                            backgroundImage: this.props.crackImg,
                            animation: "crack-img 0.5s"
                        }}/>
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this._getView()}
                {this.state.crackEnd ? <ParticleView style={{top: 120, left: 0}}/> : null}
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
        this._Dispatcher = new SWidgetDispatcher();
        this._FocusId = 0;
        this._HammerAnimation = null;
        this._RecoveryEggsCount = 0;
        this.state = {
            data: this._PageTheme.SmashEggsPage.widget.data,
            smashInfo: null,
        }
    }

    _RecoveryEnd = (id) => {
        console.log("_RecoveryEnd in, id:" + this._FocusId);
        this.state.data[id].smashState = 0;
        ++this._RecoveryEggsCount;
        //所有蛋复原
        if (this._RecoveryEggsCount >= this.state.data.length) {
            this._RecoveryEggsCount = 0;
            this.props.onLockKey(false)
        }
    }

    _CrackEnd() {
        this.state.data[this._FocusId].smashState = 1;
        setTimeout(() => {
            this.props.onLockKey(false)
        }, 1500);
        if (this._TotalSmashNums !== 0) {
            //中奖请求
            if (this._doSmashEggs) {
                setTimeout(() => {
                    this._doSmashEggs()
                }, 1500);
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
            this._TotalSmashNums = activity_data.total;
            if (this._TotalSmashNums < 0) {
                this._TotalSmashNums = 0;
            }
            return "您的抽奖次数:" + this._TotalSmashNums + "次";
        } else {
            return "";
        }
    }

    tryResetEggsStatus() {
        if (!this.state.data) {
            return;
        }
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].smashState !== 1) {
                return;//未砸完
            }
        }
        let data_list = [];
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].smashState === 1) {
                this.state.data[i].smashState = 3;
            }
            if (this._FocusId !== i) {
                data_list.push(i);
            }
        }

        //刷新蛋的描画
        let info = {
            type: SWidgetDispatcher.Type.updateItem,
            data: data_list
        };
        this._Dispatcher.dispatch(info);
    }

    onFocus() {
        this.changeFocus("SmashEggsWidget");
        //TODO 检查是否所有的蛋被砸过了。都砸过则恢复愿状态
        this.tryResetEggsStatus();
        console.log("SmashEggsPage onFocus");
    }

    onBlur() {
        console.log("SmashEggsPage onBlur");
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _RenderEggs(item, is_focus) {
        let img_width = this._PageTheme.SmashEggsPage.widget.egg.style.width;
        let img_height = this._PageTheme.SmashEggsPage.widget.egg.style.height;
        console.log("this.state.data[item.id].smashState:" + this.state.data[item.id].smashState + ", itemId:" + item.id);
        switch (this.state.data[item.id].smashState) {
            default:
            case 0: {//正常蛋
                return <div style={{width: img_width, height: img_height, backgroundImage: item.eggUrl}}/>
            }
            case 1: {//碎蛋
                return <BrokenEgg w={img_width} h={img_height} backImg={item.brokenBack} foreImg={item.brokenFore}/>;
            }
            case 2: {//破碎中的蛋
                return <BreakAnim w={img_width} h={img_height} backImg={item.brokenBack} foreImg={item.brokenFore}
                                  theme={this._PageTheme.SmashEggsPage.widget.egg}
                                  crackImg={this._PageTheme.SmashEggsPage.widget.egg.crack.url} eggUrl={item.eggUrl}
                                  onCrackEnd={this._CrackEnd}/>
            }
            case 3: {//复原中的蛋
                //焦点项只对focusview做动画：
                if (this._FocusId === item.id && !is_focus) {
                    return <div style={{width: img_width, height: img_height, backgroundImage: item.eggUrl}}/>
                } else {
                    this.props.onLockKey(true);
                    return <RecoveryAnim w={img_width} h={img_height} eggUrl={item.eggUrl}
                                         itemId={item.id}
                                         theme={this._PageTheme.SmashEggsPage.widget.egg.recovery}
                                         onRecoveryEnd={this._RecoveryEnd}/>
                }
            }
        }
    }

    _RenderFocus(item) {
        let animation = this._HammerAnimation;
        let hammer_style = {...this._PageTheme.SmashEggsPage.widget.hammer.focusStyle, ...{animation: animation}};
        this._HammerAnimation = null;
        console.log("_RenderFocus hammer_style:" + hammer_style);
        return (
            <Fdiv>
                <div style={this._PageTheme.SmashEggsPage.widget.egg.style}>
                    {
                        this._RenderEggs(item, true)
                    }
                </div>
                <Hammer visible={true} style={hammer_style} onAnimationEnd={this._SmashEggEnd}/>
            </Fdiv>
        )
    }

    _RenderItem(item) {
        return (
            <Fdiv>
                <div style={this._PageTheme.SmashEggsPage.widget.egg.style}>
                    {
                        this._RenderEggs(item, false)
                    }
                </div>
                <Hammer visible={item.id === this._FocusId}
                        style={{...this._PageTheme.SmashEggsPage.widget.hammer.style, ...{animation: null}}}/>

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
        if (!this.props.info) {
            return true;
        }
        let data = this.state.data;
        this._HammerAnimation = "swing-hammer 0.5s";
        let cur_time = Date.now();
        let start_time = new Date(this.props.info.start_time).getTime();
        let end_time = new Date(this.props.info.end_time+" 24:00:00").getTime();
        if (cur_time >= start_time && cur_time <= end_time) {
            if (this._TotalSmashNums === 0) {
                this.setState({smashInfo: "您的抽奖机会已用完，感谢参加本次活动～"})
            } else {
                let new_item = CommonApi.Clone(data[item.id]);//更新数据,触发onRedrawFocus
                if (new_item.smashState === 0) {
                    new_item["smashState"] = 2;
                    this.props.onLockKey(true);
                }
                data[item.id] = new_item;
                this.setState({smashInfo: "", data: data})
            }
        } else if (cur_time < start_time) {
            this.setState({smashInfo: "活动暂未开始，敬请期待"})
        } else if (cur_time > end_time) {
            this.setState({smashInfo: "活动已经结束"})
        }

        return true;
    }

    onKeyDown(ev) {
        if (ev.keyCode === ConstantVar.KeyCode.Back || ev.keyCode === ConstantVar.KeyCode.Back2) {
            return false;
        }
        return true;
    }

    _PreloadImage() {
        if (!this.state.data) {
            return null;
        }
        return (<div style={{left: 1920/2, top: 1080/2+300}}>
            <div style={{left: 0, top: 0, width: 1, height: 1, backgroundImage: this.state.data[0].brokenFore}}></div>
            <div style={{left: 0, top: 0, width: 1, height: 1, backgroundImage: this.state.data[1].brokenFore}}></div>
            <div style={{left: 0, top: 0, width: 1, height: 1, backgroundImage: this.state.data[2].brokenFore}}></div>
            <div style={{left: 0, top: 0, width: 1, height: 1,
                backgroundImage: this._PageTheme.SmashEggsPage.widget.egg.recovery.line.url
            }}></div>
            <div style={{left: 0, top: 0, width: 1, height: 1,
              backgroundImage: this._PageTheme.SmashEggsPage.widget.egg.light.url
            }}></div>
            <div style={{left: 0, top: 0, width: 1, height: 1, backgroundImage: `url(${GoldenCoin1})`}}></div>
            <div style={{left: 0, top: 0, width: 1, height: 1, backgroundImage: `url(${GoldenCoin2})`}}></div>
            <div style={{left: 0, top: 0, width: 1, height: 1, backgroundImage: `url(${RedPacket1})`}}></div>
            <div style={{left: 0, top: 0, width: 1, height: 1, backgroundImage: `url(${RedPacket2})`}}></div>
            <div style={{left: 0, top: 0, width: 1, height: 1, backgroundImage: `url(${Star1})`}}></div>
            <div style={{left: 0, top: 0, width: 1, height: 1, backgroundImage: `url(${Star2})`}}></div>
            <div style={{left: 0, top: 0, width: 1, height: 1, backgroundImage: `url(${Star3})`}}></div>
            <div style={{left: 0, top: 0, width: 1, height: 1, backgroundImage: `url(${Star4})`}}></div>
        </div>)
    }

    renderContent() {
        let smash_info = this._UpdateSmashNums();
        return (
            <div style={this._PageTheme.SmashEggsPage.style}>
                {this._PreloadImage()}
                <div style={{
                    left: this._PageTheme.SmashEggsPage.widget.left - 600,
                    top: this._PageTheme.SmashEggsPage.widget.top - 600
                }}>
                    <SimpleWidget
                        width={ this._PageTheme.SmashEggsPage.widget.width + 1200 }
                        height={this._PageTheme.SmashEggsPage.widget.height + 1200}
                        direction={ HORIZONTAL }
                        data={this.state.data}
                        initFocusId={this._FocusId}
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
                    {this.state.smashInfo ? this.state.smashInfo : smash_info}
                </div>

            </div>
        )
    }

    componentDidMount() {
        console.log("SmashEggsPage componentDidMount");
    }
}
export default SmashEggsPage;
