import React from 'react';

/*
	<JsvPosterDiv style={{...otherStyle, backgroundImage:`url:${海报url}`}}>
		...Holder内容
	</JsvPosterDiv>
 */

class JsvPosterDiv extends React.Component{
	constructor(props) {
		super(props);
	}

	render() {
		let {children, ...other_props} = this.props; // Remove holders from children

		return(
			<div>
				<div children={children}/>
				<div jsv_enable_fade="true" jsv_poster_on_top="true"
				     {...other_props} />
			</div>
		);
	}
}

export {
	JsvPosterDiv
}