import React from 'react';
import { FocusBlock } from "../demoCommon/BlockDefine"
import { SimpleWidget, HORIZONTAL } from "../jsview-utils/jsview-react/index_widget.js"
import { EdgeDirection } from "../jsview-utils/jsview-react/index_widget"
import eventProxy  from './eventProxy';
import LiveStyle from './LiveStyle'
import homePageData from './common'
import './animation.css';
import focusImg from './img/focus.png'

const GiftDiv = ({ mystyle, item, visible, callback }) => {

    return (
        <div key={ item && item.inx>=0 ? item.inx: -1} style={{ ...mystyle, backgroundImage:item && item.imgUrl?item.imgUrl:null, visibility: visible, animation: "wings 2s 3" }} onAnimationEnd={callback}/>    
    )    
}

class GiftLayer extends FocusBlock {

    constructor(props) {
        super(props);
        this._style = LiveStyle.get().giftLayer;
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
        this._OnClick = this._OnClick.bind(this);
        this._OnEdge = this._OnEdge.bind(this);

        this.state = {
            visible: 'hidden',
            ani_visible: 'hidden',
            item: null,
            counter:0
        };
        this._Timer = null;

    }

    _hiddenAniDiv = () => {
        this.setState({ani_visible:'hidden'})
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(128, 163, item.focusable, false)
    }

    _RenderFocus(item) {
        return (
            <div style={{ width:128,height:163, backgroundImage:focusImg}}>
                <div style={{ ...this._style.gift_bg_style, backgroundImage:item.imgUrl}}/>
                <div style={{ ...this._style.gift_text_style, top:133 }}>赠送</div>
            </div>  
        )
    }

    _RenderItem(item) {
        return (
            <div style={{ width:128,height:163 }}> 
                <div style={{ ...this._style.gift_bg_style, backgroundImage:item.imgUrl}}/>
                <div style={ this._style.gift_text_style }>{item.text}</div>
            </div>    
        )
    }

    onKeyDown(ev) {
        return false;
    }

    _OnClick(item) { // enter
        this.setState({item:item, ani_visible:'hidden'})
        this.changeFocus("/liveRoom/InputLayer")
        eventProxy.trigger('OnMessage',{text:null,img:item.imgUrl})
        this.setState({visible:'hidden'})
        this.setState({item:item, ani_visible:'visible'})
        // this._DoAnimation()
    }

    _OnEdge(edge_info) {
        console.log("SimpleWidget onEdge", edge_info)
        if(edge_info && edge_info.direction === EdgeDirection.top){
            this.setState({ visible: 'hidden' })
            this.changeFocus("/liveRoom/InputLayer");
        }
    }

    onFocus() {
        console.log("GiftLayer is focused")
        this.setState({ visible: 'visible' })
        this.changeFocus(this.props.branchName + "/gift")
    }

    renderContent() {
        return (
            <span>
                <div style={{ ...this._style.bg_style, visibility:this.state.visible }}>
                    <div style={{top: 0, left: 0}}>
                        <SimpleWidget
                            width={1280}
                            height={200}
                            // padding={{left: 0, top: 20, right: 20, bottom: 20}}
                            direction={HORIZONTAL}
                            data={homePageData}
                            onClick={this._OnClick}
                            renderItem={this._RenderItem}
                            renderFocus={this._RenderFocus}
                            measures={this._Measures}
                            branchName={this.props.branchName + "/gift"}
                            onEdge={this._OnEdge}
                        />
                    </div>   
                </div>
                <GiftDiv mystyle={this._style.ani_bg_style} item = {this.state.item} visible = {this.state.ani_visible} callback={this._hiddenAniDiv} />
            </span>
        )
    }
}

export default GiftLayer;