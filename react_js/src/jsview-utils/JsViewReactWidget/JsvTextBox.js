import React from 'react'
import PropTypes from 'prop-types'

class JsvTextBox extends React.Component {
	constructor (props) {
		super(props)
	}

	render () {
		const {left, top, backgroundColor, ...others} = this.props.style;
		if (window.JsvDisableReactWrapper) {
			return (
				<div style={{overflow: 'hidden', display: 'table', ...this.props.style}}>
					<div style={{
						display: 'table-cell',
						...others,
						verticalAlign: this.props.verticalAlign,
					}}>{this.props.children}</div>
				</div>)
		} else {
			return (
				<div style={{overflow: 'hidden', ...this.props.style}}>
					<div jsv_vertical_align={this.props.verticalAlign} style={{
						...others,
					}}>{this.props.children}</div>
				</div>)
		}
	}
}

JsvTextBox.propTypes = {
	verticalAlign: PropTypes.string, //字符串
	style: PropTypes.object //文字样式
}

JsvTextBox.defaultProps = {
	verticalAlign: 'middle',
	style: {
		left: 0,
		top: 0,
		width: 100,
		height: 20,
		color: 'rgba(255,255,255,1.0)',
		backgroundColor: 'rgba(0,0,0,0)',
		fontSize: 10,
		textAlign: 'center',
		lineHeight: '20px'
	}
}

export default JsvTextBox