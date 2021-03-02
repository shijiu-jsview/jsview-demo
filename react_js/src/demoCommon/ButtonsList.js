/**
 * Created by ludl on 3/2/21.
 */
import React from "react";
import { SimpleWidget, VERTICAL, HORIZONTAL, EdgeDirection, SWidgetDispatcher } from "../jsview-utils/jsview-react/index_widget";

const FRAME_BORDER_WIDTH = 5;
const ITEM_COLOR = ["#89BEB2", "#C9BA83", "#DED38C", "#DE9C53"];
class SingleButton extends React.Component {
    constructor(props) {
        super(props);

        this.props.takeRef.viewRef = this;
        this._bgColor = ITEM_COLOR[Math.floor(Math.random() * 100) % 4];

        this.state = {
            focused: false,
        }
    }

    onFocus() {
        this.setState({
            focused: true,
        })
    }

    onBlur() {
        this.setState({
            focused: false,
        });
    }

    componentWillUnmount() {
        this.props.takeRef.viewRef = null; // Do unref
    }

    render() {
        return (
            <>
                <div key="frame"
                     style={{
                         top: -FRAME_BORDER_WIDTH,
                         left: -FRAME_BORDER_WIDTH,
                         width: this.props.width + 2 * FRAME_BORDER_WIDTH,
                         height: this.props.height + 2 * FRAME_BORDER_WIDTH,
                         backgroundColor: "#0000FF",
                         visibility: this.state.focused ? "visible" : "hidden"
                     }}
                />
                <div key="content"
                     style={{
                         width: this.props.width,
                         height: this.props.height,
                         lineHeight: this.props.lineHeight,
                         fontSize: this.props.fontSize,
                         textOverflow: "ellipsis",
                         backgroundColor: (this._bgColor)
                     }}
                >
                    {this.props.text}
                </div>
            </>
        );
    }
}

/*
    props:
        itemWidth:      按钮宽度
        itemHeight:     按钮高度
        itemGap:        按钮间距
        direction:      VERTICAL | HORIZONTAL  按钮排布方向
        focusBranchName: 获焦的别名
        buttonsData:    {
                            text:   按钮内部显示文字
                            onClick: 按下动作的回调函数
                        }
 */

class ButtonsList extends React.Component {
    constructor(props) {
        super(props);

        // 根据内容自动计算fontSize和lineHeight
        // 原则: 尽量一行装下，若一行时文字小于行高35%，则换成2行装，再长则clip显示
        const text_padding = Math.floor(this.props.itemHeight * 0.2);
        this._FontSize = this.props.itemHeight - text_padding;
        this._LineHeight = this.props.itemHeight;
        for (let one_item_data of this.props.buttonsData) {
            if (one_item_data.text.length * this._FontSize > this.props.itemWidth - text_padding) {
                let new_font_size = Math.floor((this.props.itemWidth - text_padding) / one_item_data.text.length);
                if (new_font_size < this.props.itemHeight * 0.35) {
                    // 采用两行来显示
                    this._FontSize = Math.floor((this.props.itemHeight - text_padding) / 2);
                    this._LineHeight = Math.floor(this.props.itemHeight / 2);
                    break;
                } else {
                    // 仅缩小字号，仍然为一行显示
                    this._FontSize = new_font_size;
                }
            }
        }

        // debug
        window.gButtonsList = this.props.buttonsData;
    }

    _MeasureItem = (data)=>{
        return SimpleWidget.getMeasureObj(
            this.props.itemWidth + this.props.itemGap,
            this.props.itemHeight + this.props.itemGap,
            true, false);
    };

    _DrawItem = (data)=>{
        if (!data.takeRef) {
            // add take ref props
            data.takeRef = { viewRef: null };
        }

        return (
            <SingleButton
                text={data.text}
                width={this.props.itemWidth}
                height={this.props.itemHeight}
                fontSize={this._FontSize}
                lineHeight={this._LineHeight}
                takeRef={data.takeRef}
            />
        );
    };

    _OnItemFocus = (data)=>{
        data.takeRef.viewRef.onFocus();
    };

    _OnItemBlur = (data)=>{
        data.takeRef.viewRef.onBlur();
    };

    _OnItemClick = (data)=>{
        if (data.onClick) {
            data.onClick();
        }
    };

    render() {
        const button_list_length = this.props.buttonsData.length;
        let widget_width, widget_height;
        if (this.props.direction === VERTICAL) {
            widget_width = this.props.itemWidth + this.props.itemGap + 20/* padding */;
            widget_height = (this.props.itemHeight + this.props.itemGap) * button_list_length + 20/* padding */;
        } else {
            widget_width = (this.props.itemWidth + this.props.itemGap) * button_list_length + 20/* padding */;
            widget_height = (this.props.itemHeight + this.props.itemGap) + 20/* padding */
        }

        return (
            <>
            {/*<div style={{backgroundColor:"#00F0F0", width: widget_width, height: widget_height}}/>*/}
            <SimpleWidget
                // Button纵向排列相当于SimpleWidget的横向无限延伸模式，横向排列同理
                direction={(this.props.direction === VERTICAL ? HORIZONTAL : VERTICAL)}
                width={widget_width}
                height={widget_height}
                data={this.props.buttonsData}
                padding={{ top: 10, left: 10, right: 10, bottom: 10 }}
                renderItem={ this._DrawItem }
                onClick={ this._OnItemClick }
                measures={ this._MeasureItem }
                onItemFocus={ this._OnItemFocus }
                onItemBlur={ this._OnItemBlur }
                branchName={ this.props.focusBranchName }
            />
            </>
        );
    }
}

export {
    VERTICAL,
    HORIZONTAL,
    ButtonsList
}