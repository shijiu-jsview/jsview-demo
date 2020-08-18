import React from 'react';

const BORDER_WIDTH = 5;

const font_style = {
	color: "#000000",
	whiteSpace: "nowrap",
	textAlign: "center"
};

class ButtonView extends React.Component {
	render() {
		return (
			<React.Fragment>
				<div key="border" style={{
					top: -BORDER_WIDTH,
					left: -BORDER_WIDTH,
					width: this.props.width + 2 * BORDER_WIDTH,
					height: this.props.height + 2 * BORDER_WIDTH,
					backgroundColor: "#0000FF",
					visibility: (this.props.focused ? "visible" : "hidden")
				}}/>
				<div key="content" style={{
					width:this.props.width,
					height: this.props.height,
					backgroundColor: this.props.backgroundColor,
					lineHeight: this.props.height + "px",
					fontSize: (Math.floor(this.props.height * 0.55)) + "px",
					...font_style
				}}>
					{this.props.text}
				</div>
			</React.Fragment>
		);
	}
}

export default ButtonView;