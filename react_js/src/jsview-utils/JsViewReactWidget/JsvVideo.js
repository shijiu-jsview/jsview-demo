import React from 'react';

class JsvVideo extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let {usetexture, videoref, ...others} = this.props;
		usetexture = usetexture ? usetexture.toString() : "false";
		//确保jsv_media_usetexture属性先被设置，故前后各写一个该属性，防止react属性顺序变更
		return <video ref={videoref} jsv_media_usetexture={usetexture} {...others} jsv_media_usetexture={usetexture}/>
	}
}
export default JsvVideo