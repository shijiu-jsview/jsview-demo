import React from 'react';
import './JsvMarquee.css';
import {getKeyFramesGroup} from './JsvDynamicKeyFrames'

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
        this._KeyFrameStyleSheet = getKeyFramesGroup("marquee-tag");
        this._rollTimeId = -1;
        this._KeyFrameNames = {
            step1: null,
            step2: null,
        }

		this.state = {
            left: 0,
            width: props.width,
            animation: null,
            count: 0,
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
    
    _initKeyFrameAnim() {
        const text_width = this._textRef.current.clientWidth;
        let name1 = `step1-${text_width}-${this.props.width}`;
            let step1 = `@keyframes ${name1} {
                from{
                    transform:translate3d(0,0,0);
                }
                to{
                    transform:translate3d(${-text_width}px,0,0);
                }
            }`;
            let name2 = `step2-${text_width}-${this.props.width}`;
            let step2 = `@keyframes ${name2} {
                from{
                    transform:translate3d(${this.props.width}px,0,0)
                }
                to{
                    transform:translate3d(0,0,0)
                }
            }`;

            if (!this._KeyFrameStyleSheet.hasRule(name1)) {
                this._KeyFrameStyleSheet.insertRule(step1);
            }
            if (!this._KeyFrameStyleSheet.hasRule(name2)) {
                this._KeyFrameStyleSheet.insertRule(step2);
            }
            this._KeyFrameNames.step1 = name1,
            this._KeyFrameNames.step2 = name2;
    }

	_startAnimation() {
        const text_width = this._textRef.current.clientWidth;
		if (text_width > this.props.width) {
            this._initKeyFrameAnim();
			let overflowWidth = text_width;
			let container_left = 0;
			const duration = Math.ceil(text_width / 60);
			this.setState({
				left: container_left,
                width: overflowWidth,
                animation: this._KeyFrameNames.step1 + " " + duration + "s linear",
                count: 0,
			});
        }
	}

	render() {
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
					     left: this.state.left,
					     top: 0,
					     width: this.state.width,
					     height: 100,
					     animation: this.state.animation
				     }}
				     onAnimationEnd={
					     () => {
                            const text_width = this._textRef.current.clientWidth;
                             if (this.state.count % 2 === 0) {
                                let duration = Math.ceil(this.props.width / 60);
                                 this.setState({
                                     animation: this._KeyFrameNames.step2 + " " + duration + "s linear",
                                     count: this.state.count + 1,
                                 });
                             } else {
                                 this._rollTimeId = setTimeout(() => {
                                    let duration = Math.ceil(text_width / 60);
                                    this.setState({
                                        animation: this._KeyFrameNames.step1 + " " + duration + "s linear",
                                        count: this.state.count + 1,
                                    });
                                 }, 1000);
                             }
                             console.log("onAnimationEnd "); 
						    //  const text_width = this._textRef.current.clientWidth;
						    //  const duration = Math.ceil(5 * text_width / this.props.width + 2.5) ;
						    //  this.setState({
                            //     left: this.props.width,
                            //     width: this.props.width + text_width,
                            //     animation: "marqueeInfinite " + duration + "s infinite linear 5s"
						    //  });
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
