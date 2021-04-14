/**
 * Created by luocf on 2020/11/16.
 */
import React from 'react';
import { SimpleWidget, VERTICAL } from "../../utils/JsViewEngineWidget/index_widget";
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";


class Item extends React.Component {
    constructor(props) {
        super(props);
        this._ScaleRate = 1.05;
        this.state = {
            focus: false,
        }
    }

    focus() {
        this.setState({
            focus: true,
        })
    }

    blur() {
        console.log("item blur")
        this.setState({
            focus: false,
        })
    }

    render() {
        let item = this.props.data;
        const width = this.state.focus ? item.blocks.w * this._ScaleRate : item.blocks.w;
        const height = this.state.focus ? item.blocks.h * this._ScaleRate : item.blocks.h;
        const x = this.state.focus ? (item.blocks.w - width) / 2 : 0;
        const y = this.state.focus ? (item.blocks.h - height) / 2 : 0;
        return (
            <div key ={this.state.focus ? "focus" : "normal"} style={{
                animation: "focusScale 0.5s",
                backgroundColor: this.state.focus ? "#44DD00" : null,
                top: y, left: x, width, height,
                fontSize: "25px", textAlign: "center", lineHeight: `${item.blocks.h}px`, color: "#FFFFFF"
            }}>
                {item.content}
            </div>
        );
    }
}

class FullKeyboard extends FocusBlock {
    constructor(props) {
        super(props);
        this._Data = this._initData();
        this._renderItem = this._renderItem.bind(this);
        this._measures = this._measures.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onItemFocus = this._onItemFocus.bind(this);
        this._onItemBlur = this._onItemBlur.bind(this);
    }

    _initData() {
        const result = [];
        result.push({
            blocks: {
                w: 120,
                h: 40,
            },
            focusable: true,
            content: "删除",
        });
        result.push({
            blocks: {
                w: 120,
                h: 40,
            },
            focusable: true,
            content: "清空",
        });
        for (let i = 0; i < 36; ++i) {
            result.push({
                blocks: {
                    w: 40,
                    h: 40,
                },
                focusable: true,
                content: i < 26 ? String.fromCharCode(i + 65) : String.fromCharCode(i - 26 + 48),
            });
        }
        return result;
    }

    _measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub);
    }

    _renderItem(item, onedge, query, view_obj) {
        return (
            <Item ref={ele => view_obj.view = ele} data={item} />
        )
    }

    _onItemBlur(data, qurey, view_obj) {
        if (view_obj && view_obj.view) {
            view_obj.view.blur();
        }
    }

    _onItemFocus(item, pre_dege, query, view_obj) {
        if (view_obj && view_obj.view) {
            view_obj.view.focus();
        }
    }

    _onClick(item) {
        if (this.props.onClick) {
            this.props.onClick(item.content);
        }
    }

    onFocus() {
        this.changeFocus(`${this.props.branchName}/full_keyboard`);
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
                onItemFocus={this._onItemFocus}
                onItemBlur={this._onItemBlur}
                measures={this._measures}
                branchName={`${this.props.branchName}/full_keyboard`}
            />
        );
    }
}


export default FullKeyboard;
