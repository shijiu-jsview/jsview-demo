import React from 'react';
import { SimpleWidget, VERTICAL, SlideStyle } from "../../jsview-utils/jsview-react/index_widget.js";
import JsvMarquee from "../../jsview-utils/JsViewReactWidget/JsvMarquee";
import { FocusBlock } from "../../demoCommon/BlockDefine";

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
                           }}/>;
  }
  return <div style={style}>{text}</div>;
};

const ItemImage = ({ key, style, onAnimationEnd = null }) => {
  return <div key={key} style={style} onAnimationEnd={onAnimationEnd}></div>;
};

class TitleMetroWidget extends FocusBlock {
  constructor(props) {
    super(props);
    this._Measures = this._Measures.bind(this);
    this._RenderItem = this._RenderItem.bind(this);
    this._RenderFocus = this._RenderFocus.bind(this);
    this._RenderBlur = this._RenderBlur.bind(this);
  }

  _Measures(item) {
    return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub);
  }

  _RenderFocus(item) {
    const image_width = item.blocks.w - this.props.pageTheme.content.gap.width;
    const scale_width = parseInt(image_width * this.props.pageTheme.content.scale);
    const left = -parseInt((scale_width - image_width) / 2);
    const image_height = item.blocks.h - this.props.pageTheme.content.gap.height - this.props.pageTheme.content.title.focusStyle.height;
    const scale_height = parseInt(image_height * this.props.pageTheme.content.scale);
    const top = -parseInt((scale_height - image_height) / 2);
    console.log(`_RenderFocus left:${left}, top:${top},width:${scale_width}, height:${scale_height}`);
    const image_style = Object.assign({}, this.props.pageTheme.content.image.focusStyle, {
      backgroundImage: `url(${item.content.url})`,
      left,
      top,
      width: scale_width,
      height: scale_height,
    });

    return (
            <div>
                <ItemImage style={image_style}/>
                <ItemTitle focus={true} text={item.content.title} style={this.props.pageTheme.content.title.focusStyle}/>
            </div>
    );
  }

  _RenderBlur(item, callback) {
    const image_style = Object.assign({}, this.props.pageTheme.content.image.normalStyle, {
      backgroundImage: `url(${item.content.url})`,
      width: item.blocks.w - this.props.pageTheme.content.gap.width,
      height: item.blocks.h - this.props.pageTheme.content.gap.height - this.props.pageTheme.content.title.normalStyle.height,
    });
    return (
            <div>
                <ItemImage style={image_style}
                    onAnimationEnd={callback}>
                </ItemImage>
                <ItemTitle focus={false} text={item.content.title} style={this.props.pageTheme.content.title.normalStyle}/>
            </div>
    );
  }

  _RenderItem(item) {
    const image_style = Object.assign({}, this.props.pageTheme.content.image.normalStyle, {
      backgroundImage: `url(${item.content.url})`,
      width: item.blocks.w - this.props.pageTheme.content.gap.width,
      height: item.blocks.h - this.props.pageTheme.content.gap.height - this.props.pageTheme.content.title.normalStyle.height,
    });
    return (
            <div>
                <ItemImage style={image_style}/>
                <ItemTitle focus={false} text={item.content.title} style={this.props.pageTheme.content.title.normalStyle}/>
            </div>
    );
  }

  onFocus() {
    this.changeFocus(`${this.props.branchName}/titleM`);
  }

  renderContent() {
    console.log("render TitleMetroWidget");
    return (
            <div style={this.props.style}>
                <Title text={this.props.title} style={this.props.pageTheme.title.style}/>
                <div style={{ left: this.props.pageTheme.content.left, top: this.props.pageTheme.content.top }}>
                    <SimpleWidget
                        width={ this.props.pageTheme.content.width }
                        height={ this.props.pageTheme.content.height}
                        padding={ this.props.pageTheme.content.padding}
                        direction={ VERTICAL }
                        data={ this.props.data }
                        dispatcher={this.props.dispatcher}
                        slideStyle={ SlideStyle.seamless }
                        onEdge={ this.props.onEdge}
                        renderBlur={ this._RenderBlur }
                        renderItem={ this._RenderItem }
                        renderFocus={ this._RenderFocus }
                        measures={ this._Measures }
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
