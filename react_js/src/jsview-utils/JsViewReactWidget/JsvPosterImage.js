import React from 'react';

/*
 <JsvPosterImage style={{...otherStyle}} color_space={"RGB_565"} src={`url:${海报url}`}>
 ...Holder内容
 </JsvPosterImage>
 */

class JsvPosterImage extends React.Component{
	constructor(props) {
		super(props);
	}

	render() {
		let {children, color_space, ...other_props} = this.props; // Remove holders from children
		let jsv_img_color_space = color_space?color_space:"RGBA_8888";
		return(
			<div>
				<div children={children}/>
				<img jsv_enable_fade="true" jsv_poster_on_top="true" jsv_img_scaledown_tex="true" jsv_img_color_space={jsv_img_color_space}
					 {...other_props} />
			</div>
		);
	}
}

export {
	JsvPosterImage
}