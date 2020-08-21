import React from 'react';
import {
    VERTICAL,
    SimpleWidget,
    SlideStyle
} from "../../../jsview-utils/jsview-react/index_widget"
import PageTheme from "../../common/PageTheme"
import {FocusBlock} from "../../../demoCommon/BlockDefine"
class PrizeList extends FocusBlock {
    constructor(props) {
        super(props);
        this._PageTheme = PageTheme.get().MainPage;
        this._Measures = this._Measures.bind(this);
        this._RenderItem = this._RenderItem.bind(this);
        this._RenderFocus = this._RenderFocus.bind(this);
    }

    onFocus() {
        this.changeFocus(this.props.branchName + "/PrizeListWidget");
        console.log("PrizeList onFocus");
    }

    onBlur() {
        console.log("PrizeList onBlur");
    }

    _Measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _RenderFocus(item) {
        let level_list = ["一等奖", "二等奖", "三等奖", "四等奖", "五等奖", "六等奖", "七等奖", "八等奖", "九等奖", "十等奖"]
        let level_str = "";
        if (item.info.prize_id > 0 && (item.info.prize_id - 1 < level_list.length)) {
            level_str = level_list[item.info.prize_id - 1];
        }
        return (
            <div style={this._PageTheme.PrizeList.widget.item.bgBorder}>
                <div style={{...this._PageTheme.PrizeList.widget.item.bg, left:2,top:2}}>
                    <div style={{
                        ...this._PageTheme.PrizeList.widget.item.icon,
                        backgroundImage: `url(${item.info.image})`
                    }}/>
                    <div style={this._PageTheme.PrizeList.widget.item.title}>{item.info.name}</div>
                    {level_str ? <div style={this._PageTheme.PrizeList.widget.item.level}>{level_str}</div> : null}
                </div>
            </div>
        )
    }

    _RenderItem(item) {
        let level_list = ["一等奖", "二等奖", "三等奖", "四等奖", "五等奖", "六等奖", "七等奖", "八等奖", "九等奖", "十等奖"]
        let level_str = "";
        if (item.info.prize_id > 0 && (item.info.prize_id - 1 < level_list.length)) {
            level_str = level_list[item.info.prize_id - 1];
        }
        return (
            <div style={this._PageTheme.PrizeList.widget.item.bg}>
                <div
                    style={{...this._PageTheme.PrizeList.widget.item.icon, backgroundImage: `url(${item.info.image})`}}/>
                <div style={this._PageTheme.PrizeList.widget.item.title}>{item.info.name}</div>
                {level_str ? <div style={this._PageTheme.PrizeList.widget.item.level}>{level_str}</div> : null}
            </div>
        )
    }

    onKeyDown(ev) {

        return false;
    }

    _FormatData = (prize_info) => {
        let data = [];
        for (let i = 0; i < prize_info.length; i++) {
            data.push({
                "blocks": {w: this._PageTheme.PrizeList.widget.item.w, h: this._PageTheme.PrizeList.widget.item.h},
                "focusable": true,
                "info": prize_info[i]
            })
        }

        return data;
    }

    renderContent() {
        if (!this.props.info
            || !this.props.info.prize_info
            || this.props.info.prize_info.length === 0) {
            return null;
        }
        let data = this._FormatData(this.props.info.prize_info);

        return (
            <div style={this._PageTheme.PrizeList.style}>
                <SimpleWidget
                    width={ this._PageTheme.PrizeList.widget.width}
                    height={this._PageTheme.PrizeList.widget.height}
                    direction={ VERTICAL }
                    data={data}
                    padding={this._PageTheme.PrizeList.widget.padding}
                    slideStyle={ SlideStyle.seamless }
                    onEdge={ this.props.onEdge}
                    renderItem={ this._RenderItem }
                    renderFocus={ this._RenderFocus }
                    measures={ this._Measures }
                    branchName={this.props.branchName + "/PrizeListWidget"}
                />
            </div>
        )
    }

    componentDidMount() {
        console.log("PrizeList componentDidMount");
    }
}
export default PrizeList;
