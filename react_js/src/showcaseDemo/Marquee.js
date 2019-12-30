import React from 'react';
import './App.css';
class Marquee extends React.Component {
	constructor(props) {
		super(props);
		this._textRef = null;
		this._style = props.style;
		this._text = props.text;
		this._timerId = null;
		this.state = {
			container_inner: {
				left: 0,
				width: this._style.width,
				animation: null,
			}
		}
	}

	componentDidMount() {
		this._timerId = setTimeout(() => {
			this._startAnimation();
		}, 1000);
	}

	componentWillUnmount() {
		if (this._timerId != null) {
			clearTimeout(this._timerId);
			this._timerId = null;
		}
	}
	_startAnimation() {
		const text_width = this._textRef.clientWidth;
		if (text_width > this._style.width) {
			let overflowWidth = text_width;
			let container_left = 0;
			const duration = Math.ceil(5 * text_width / this._style.width);
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
				     left: this._style.left,
				     top: this._style.top,
				     width: this._style.width,
				     height: this._style.height,
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
						     const text_width = this._textRef.clientWidth;
						     const duration = Math.ceil(5 * text_width / this._style.width+ 2.5) ;
						     this.setState({
							     container_inner: {
								     left: this._style.width,
								     width: this._style.width + text_width,
								     animation: "marqueeInfinite " + duration + "s infinite linear"
							     }
						     });
					     }
				     }>
					<div key="text" ref={(ref) => {
						this._textRef = ref;
					}} style={{
						height: this._style.height,
						color: this._style.color,
						fontSize: this._style.fontSize,
						lineHeight:this._style.height+"px",
						whiteSpace: 'nowrap'
					}}>
						{this._text}
					</div>
				</div>
			</div>
		)
	}
}
export default Marquee;
