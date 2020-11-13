/**
 * Created by luocf on 2020/11/16.
 */
import React, { Component } from 'react'
import { SimpleWidget, EdgeDirection, VERTICAL } from "../jsview-utils/jsview-react/index_widget.js"
import { FocusBlock } from "../demoCommon/BlockDefine"

class FullKeyboard extends FocusBlock {
    constructor(props) {
        super(props);
        this._Data = this._initData();
        this._ScaleRate = 1.05;
        this._renderItem = this._renderItem.bind(this);
        this._renderFocus = this._renderFocus.bind(this);
        this._renderBlur = this._renderBlur.bind(this);
        this._measures = this._measures.bind(this);
        this._onClick = this._onClick.bind(this);
    }
    _initData() {
        let result = [];
        result.push({
            blocks: {
                w: 120,
                h: 40,
            },
            focusable: true,
            content: "删除",
        })
        result.push({
            blocks: {
                w: 120,
                h: 40,
            },
            focusable: true,
            content: "清空",
        })
        for (let i = 0; i < 36; ++i) {
            result.push({
                blocks: {
                    w: 40,
                    h: 40,
                },
                focusable: true,
                content: i < 26 ? String.fromCharCode(i + 65) : String.fromCharCode(i - 26 + 48),
            })
        }
        return result;
    }

    _measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
    }

    _renderItem(item, onedge) {
        return (
            <div style={{ width: item.blocks.w, height: item.blocks.h, fontSize: "25px", textAlign: "center", lineHeight: item.blocks.h + "px", color: "#FFFFFF" }}>
                {item.content}
            </div>
        )
    }

    _renderFocus(item) {
        let width = item.blocks.w * this._ScaleRate;
        let height = item.blocks.h * this._ScaleRate;
        let x = (item.blocks.w - width) / 2
        let y = (item.blocks.h - height) / 2
        return (
            <div style={{ animation: "focusScale 0.5s", backgroundColor: "#44DD00", top: y, left: x, width: width, height: height, fontSize: "25px", textAlign: "center", lineHeight: item.blocks.h + "px", color: "#FFFFFF" }}>
                {item.content}
            </div>
        )
    }

    _renderBlur(item, callback) {
        return (
            <div style={{
                animation: "blurScale 0.5s", width: item.blocks.w, height: item.blocks.h,
                fontSize: "25px", textAlign: "center", lineHeight: item.blocks.h + "px", color: "#FFFFFF"
            }}
                 onAnimationEnd={callback}>
                {item.content}
            </div>
        )
    }

    _onClick(item) {
        if (this.props.onClick) {
            this.props.onClick(item.content);
        }
    }

    onFocus() {
        this.changeFocus(this.props.branchName + "/full_keyboard");
    }

    renderContent() {
        return (
            <SimpleWidget
                width={260}
                height={300}
                padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
                direction={VERTICAL}
                data={this._Data}
                onClick={this._onClick}
                renderBlur={this._renderBlur}
                onEdge={this.props.onEdge}
                renderItem={this._renderItem}
                renderFocus={this._renderFocus}
                measures={this._measures}
                branchName={this.props.branchName + "/full_keyboard"}
            />
        )
    }
}


export default  FullKeyboard;