import React from 'react';

class JsvVideo extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let {usetexture, videoref, ...others} = this.props;
		usetexture = usetexture ? usetexture.toString() : "false";
		return <video ref={videoref} jsvusetexture={usetexture} {...others}/>
	}
}
export default JsvVideo