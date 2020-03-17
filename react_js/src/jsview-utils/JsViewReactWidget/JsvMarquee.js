import React from 'react';
import './JsvMarquee.css';

// JsvMarquee comes from JsView React Project

/*
	top: 控件的Y坐标
	left: 控件的X坐标
	width: 控件的宽度
	height: 控件的高度
	text: 控件中显示的文字内容
	fontStyle: style中的文字相关属性设置，例如font, color, fontSize, lineHeight
 */

class JsvMarquee extends React.Component {
	constructor(props) {
		super(props);
		this._textRef = React.createRef();
		this._text = props.text;
		this._timerId = null;

		this.state = {
			container_inner: {
				left: 0,
				width: props.width,
				animation: null,
			}
		}
	}

	componentDidMount() {
		var _this = this;
		this._timerId = setTimeout(() => {
			_this._startAnimation();
		}, 1000);
	}

	componentWillUnmount() {
		if (this._timerId != null) {
			clearTimeout(this._timerId);
			this._timerId = null;
		}
	}

	_startAnimation() {
		const text_width = this._textRef.current.clientWidth;
		if (text_width > this.props.width) {
			let overflowWidth = text_width;
			let container_left = 0;
			const duration = Math.ceil(5 * text_width / this.props.width);
			this.setState({
				container_inner: {
					left: container_left,
					width: overflowWidth,
					animation:"marqueeFirst " + duration + "s linear"
				}
			});
		}
	}

	render() {
		let container_inner = this.state.container_inner;
		return (
			<div key="container"
			     style={{
				     left: this.props.left,
				     top: this.props.top,
				     width: this.props.width,
				     height: this.props.height,
				     overflow: "hidden"
			     }}>
				<div key="slider"
				     style={{
					     left: container_inner.left,
					     top: 0,
					     width: container_inner.width,
					     height: 100,
					     animation: container_inner.animation
				     }}
				     onAnimationEnd={
					     () => {
						     console.log("onAnimationEnd ");
						     const text_width = this._textRef.current.clientWidth;
						     const duration = Math.ceil(5 * text_width / this.props.width+ 2.5) ;
						     this.setState({
							     container_inner: {
								     left: this.props.width,
								     width: this.props.width + text_width,
								     animation: "marqueeInfinite " + duration + "s infinite linear"
							     }
						     });
					     }
				     }>
					<div key="text" ref={this._textRef} style={{
						...this.props.fontStyle,
						height: this.props.height,
						whiteSpace: 'nowrap'
					}}>
						{this._text}
					</div>
				</div>
			</div>
		)
	}
}

JsvMarquee.defaultProps = {
	top: 0,
	left: 0,
	width: 0,
	height: 0,
	fontStyle: {}
}

export default JsvMarquee;
