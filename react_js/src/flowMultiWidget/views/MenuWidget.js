import React from 'react';
import { SimpleWidget, VERTICAL, SlideStyle } from "../../jsview-utils/jsview-react/index_widget";
import { FocusBlock } from "../../jsview-utils/JsViewReactTools/BlockDefine";

const Title = ({ text, style }) => {
    return <div style={style}>{text}</div>;
};

const ItemTitle = ({ text, style }) => {
    return <div style={style}>{text}</div>;
};

class Item extends React.Component {
    constructor(props) {
        super(props);
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
        this.setState({
            focus: false,
        })
    }

    render() {
        return (
            <ItemTitle text={this.props.data.title} style={this.state.focus ? this.props.pageTheme.content.title.focusStyle : this.props.pageTheme.content.title.normalStyle} />
        )
    }
}

class MenuWidget extends FocusBlock {
    constructor(props) {
        super(props);
        this._onClick = this._onClick.bind(this);
        this._measures = this._measures.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onItemBlur = this._onItemBlur.bind(this);
        this._onItemFocus = this._onItemFocus.bind(this);
    }

    _onClick(id) {
        // close self
        this.props.onClose();
    }

    _measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub);
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

    _renderItem(item, on_edge, query, view_obj) {
        return (
            <Item ref={ele => view_obj.view = ele} data={item} pageTheme={this.props.pageTheme}/>
        )
    }

    onFocus() {
        this.changeFocus(`${this.props.branchName}/MenuList`);
    }

    renderContent() {
        console.log("render MenuWidget");
        return (
            <div style={this.props.style}>
                <Title key="title" text={this.props.title} style={this.props.pageTheme.title.style} />
                <div key="content" style={{ left: this.props.pageTheme.content.left, top: this.props.pageTheme.content.top }}>
                    <SimpleWidget
                        width={this.props.pageTheme.content.width}
                        height={this.props.pageTheme.content.height}
                        padding={this.props.pageTheme.content.padding}
                        direction={VERTICAL}
                        data={this.props.data}
                        dispatcher={this.props.dispatcher}
                        slideStyle={SlideStyle.seamless}
                        onEdge={this.props.onEdge}
                        renderItem={this._renderItem}
                        onItemFocus={this._onItemFocus}
                        onItemBlur={this._onItemBlur}
                        measures={this._measures}
                        onClick={this._onClick}
                        branchName={`${this.props.branchName}/MenuList`}
                    />
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        console.log("componentWillUnmount MenuWidget");
    }

    componentDidMount() {
        console.log("componentDidMount MenuWidget");
    }
}

export default MenuWidget;
