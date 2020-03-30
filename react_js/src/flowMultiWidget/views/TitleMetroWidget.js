import React from 'react';
import {Router, Fdiv, SimpleWidget, VERTICAL, SlideStyle} from "../../jsview-utils/jsview-react/index.js"
import JsvMarquee from "../../jsview-utils/JsViewReactWidget/JsvMarquee"
const Title = ({text, style}) => {
	return <div key={text} style={style}>{text}</div>
};

const ItemTitle = ({focus, text, style}) => {
	if (focus) {
        return <JsvMarquee text={text} width={style.width} height={style.height} left={style.left} top={style.top}
						   fontStyle={{
                               color: style.color,
                               fontSize: style.fontSize,
                               lineHeight:style.height+"px"
                           }}/>
	} else {
		return <div style={style}>{text}</div>
	}
}

const ItemImage = ({key, style, onAnimationEnd = null}) => {
	return <div key={key} style={style} onAnimationEnd={onAnimationEnd}></div>;
}

class TitleMetroWidget extends React.Component {
	constructor(props) {
		super(props);
		this._Router = new Router();
		this._Measures = this._Measures.bind(this);
		this._RenderItem = this._RenderItem.bind(this);
		this._RenderFocus = this._RenderFocus.bind(this);
		this._RenderBlur = this._RenderBlur.bind(this);
	}

	_Measures(item) {
		return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub)
	}

	_RenderFocus(item) {
		let image_width = item.blocks.w - this.props.pageTheme.content.gap.width;
		let scale_width = parseInt(image_width * this.props.pageTheme.content.scale);
		let left = -parseInt((scale_width - image_width) / 2);
		let image_height = item.blocks.h - this.props.pageTheme.content.gap.height - this.props.pageTheme.content.title.focusStyle.height;
		let scale_height = parseInt(image_height * this.props.pageTheme.content.scale);
		let top = -parseInt((scale_height - image_height) / 2);
		console.log("_RenderFocus left:" + left + ", top:" + top + ",width:" + scale_width + ", height:" + scale_height);
		let image_style = Object.assign({}, this.props.pageTheme.content.image.focusStyle, {
			backgroundImage: `url(${item.content.url})`,
			left: left,
			top: top,
			width: scale_width,
			height: scale_height,
		});

		return (
			<Fdiv>
				<ItemImage style={image_style}/>
				<ItemTitle focus={true} text={item.content.title} style={this.props.pageTheme.content.title.focusStyle}/>
			</Fdiv>
		)
	}

	_RenderBlur(item, callback) {
		let image_style = Object.assign({}, this.props.pageTheme.content.image.normalStyle, {
			backgroundImage: `url(${item.content.url})`,
			width: item.blocks.w - this.props.pageTheme.content.gap.width,
			height: item.blocks.h - this.props.pageTheme.content.gap.height - this.props.pageTheme.content.title.normalStyle.height,
		});
		return (
			<Fdiv>
				<ItemImage style={image_style}
					onAnimationEnd={callback}>
				</ItemImage>
				<ItemTitle focus={false} text={item.content.title} style={this.props.pageTheme.content.title.normalStyle}/>
			</Fdiv>
		)
	}

	_RenderItem(item) {
		let image_style = Object.assign({}, this.props.pageTheme.content.image.normalStyle, {
			backgroundImage: `url(${item.content.url})`,
			width: item.blocks.w - this.props.pageTheme.content.gap.width,
			height: item.blocks.h - this.props.pageTheme.content.gap.height - this.props.pageTheme.content.title.normalStyle.height,
		});
		return (
			<Fdiv>
				<ItemImage style={image_style}/>
				<ItemTitle focus={false} text={item.content.title} style={this.props.pageTheme.content.title.normalStyle}/>
			</Fdiv>
		)
	}

	render() {
		console.log("render TitleMetroWidget");
		return (
			<Fdiv style={this.props.style} branchName={this.props.branchName}
			      onFocus={ () => {
				      this._Router.focus("titleM");
			      }} router={this._Router}>
				<Title text={this.props.title} style={this.props.pageTheme.title.style}/>
				<Fdiv style={{left: this.props.pageTheme.content.left, top: this.props.pageTheme.content.top}}>
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
						branchName="titleM"
					/>
				</Fdiv>
			</Fdiv>
		)
	}

	componentWillUnmount() {
		console.log("componentWillUnmount TitleMetroWidget");
	}

	componentDidMount() {
		console.log("componentDidMount TitleMetroWidget");
	}
}

export default TitleMetroWidget;
