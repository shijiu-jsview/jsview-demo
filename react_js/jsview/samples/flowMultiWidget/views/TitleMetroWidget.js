import React from 'react';
import { SimpleWidget, VERTICAL, SlideStyle } from "../../../utils/JsViewEngineWidget/index_widget";
import JsvMarquee from "../../../utils/JsViewReactWidget/JsvMarquee";
import { FocusBlock } from "../../../utils/JsViewReactTools/BlockDefine";

const Title = ({ text, style }) => {
    return <div key={text} style={style}>{text}</div>;
};

const ItemTitle = ({ focus, text, style }) => {
    if (focus) {
        return <JsvMarquee text={text} width={style.width} height={style.height} left={style.left} top={style.top}
            fontStyle={{
                color: style.color,
                fontSize: style.fontSize,
                lineHeight: `${style.height}px`
            }} />;
    }
    return <div style={style}>{text}</div>;
};

const ItemImage = ({ key, style, onAnimationEnd = null }) => {
    return <div key={key} style={style} onAnimationEnd={onAnimationEnd}></div>;
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
        let item = this.props.data;
        let image_style;
        if (this.state.focus) {
            image_style = Object.assign({}, this.props.pageTheme.content.image.focusStyle, {
                backgroundImage: `url(${item.content.url})`,
                transition: "transform 0.25s linear",
                width: item.blocks.w - this.props.pageTheme.content.gap.width,
                height: item.blocks.h - this.props.pageTheme.content.gap.height - this.props.pageTheme.content.title.normalStyle.height,
            });
        } else {
            image_style = Object.assign({}, this.props.pageTheme.content.image.normalStyle, {
                backgroundImage: `url(${item.content.url})`,
                transition: "transform 0.25s linear",
                width: item.blocks.w - this.props.pageTheme.content.gap.width,
                height: item.blocks.h - this.props.pageTheme.content.gap.height - this.props.pageTheme.content.title.normalStyle.height,
            });
        }
        return (
            <div key={"myItem"}>
                <ItemImage style={image_style} />
                <ItemTitle focus={this.state.focus} text={item.content.title} style={this.state.focus ? this.props.pageTheme.content.title.focusStyle : this.props.pageTheme.content.title.normalStyle} />
            </div>
        )
    }
}

class TitleMetroWidget extends FocusBlock {
    constructor(props) {
        super(props);
        this._measures = this._measures.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onItemFocus = this._onItemFocus.bind(this);
        this._onItemblur = this._onItemBlur.bind(this);
    }

    _measures(item) {
        return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub);
    }

    _renderItem(item, on_edge, query, view_obj) {
        return (
            <Item ref={ele => view_obj.view = ele} data={item} pageTheme={this.props.pageTheme} />
        )
    }

    onFocus() {
        this.changeFocus(`${this.props.branchName}/titleM`);
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

    renderContent() {
        console.log("render TitleMetroWidget");
        return (
            <div style={this.props.style}>
                <Title text={this.props.title} style={this.props.pageTheme.title.style} />
                <div style={{ left: this.props.pageTheme.content.left, top: this.props.pageTheme.content.top }}>
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
                        branchName={`${this.props.branchName}/titleM`}
                    />
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        console.log("componentWillUnmount TitleMetroWidget");
    }

    componentDidMount() {
        console.log("componentDidMount TitleMetroWidget");
    }
}

export default TitleMetroWidget;
