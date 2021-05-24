import React from 'react';
import {JsvMediaVideo} from './JsvMedia'
import JsvNativeSharedDiv from '../../JsViewReactWidget/JsvNativeSharedDiv'

class JsvVideo extends React.Component {
	constructor(props) {
		super(props);
		this.video = null;
		this.holeId = "";

		this._GetHoleId = this._GetHoleId.bind(this);
	}

	render() {
		// console.log("width:"+this.props.style.width);
		// console.log("height:"+this.props.style.height);
		// console.log("left:"+this.props.videoleft);
		// console.log("top:"+this.props.videotop);

		// if(this.video != null){
		// 	if(this.props.style){
				
		// 		this.video.left = this.props.videoleft;
		// 		this.video.top = this.props.videotop;
					
		// 		if(this.props.style.width)
		// 			this.video.width = this.props.style.width;
					
		// 		if(this.props.style.height)
		// 			this.video.height = this.props.style.height;
		// 	}
		// }

		let key = "JsvVideo";
		if(this.props.playerkey){
			key = this.props.playerkey;
		}
		return <JsvNativeSharedDiv 
			key={key}
			style={{
				width:this.props.style.width,
				height:this.props.style.height
			}}
			getId={this._GetHoleId}
			/>;
	}
	
	_GetHoleId(id){
		this.holeId = id;
	}
    
	componentDidMount() {
		let key = "JsvVideo";
		if(this.props.playerkey){
			key = this.props.playerkey;
		}

		let player_type = 1;
		if(this.props.playertype)
			player_type = this.props.playertype;

		let background = true;
		if(!this.props.background)
			background = this.props.background;

		let is_surface_view = true;
		if(this.props.usetexture)
			is_surface_view = !this.props.usetexture;

		console.log("is_surface_view:"+is_surface_view);

		const designMap = window.Forge.DesignMap();

		this.video = new JsvMediaVideo(this.holeId, player_type, key, background, designMap.width,is_surface_view);


		if(this.video != null){
			if(this.props.onEnded && typeof this.props.onEnded == "function"){
				this.video.addEventListener("end", this.props.onEnded);
			}

			if(this.props.onError && typeof this.props.onError == "function"){
				this.video.addEventListener("error", this.props.onError);
			}

			if(this.props.onAbort && typeof this.props.onAbort == "function"){
				this.video.addEventListener("abort", this.props.onAbort);
			}

			if(this.props.onTimeUpdate && typeof this.props.onTimeUpdate == "function"){
				this.video.addEventListener("timeupdate", this.props.onTimeUpdate);
			}

			if(this.props.onLoadStart && typeof this.props.onLoadStart == "function"){
				this.video.addEventListener("loadstart", this.props.onLoadStart);
			}

			if(this.props.onCanPlayThrough && typeof this.props.onCanPlayThrough == "function"){
				this.video.addEventListener("canplaythrough", this.props.onCanPlayThrough);
			}

			if(this.props.onProgress && typeof this.props.onProgress == "function"){
				this.video.addEventListener("progress", this.props.onProgress);
			}

			if(this.props.onLoadedMetaData && typeof this.props.onLoadedMetaData == "function"){
				this.video.addEventListener("loadedmetadata", this.props.onLoadedMetaData);
			}

			if(this.props.onLoad && typeof this.props.onLoad == "function"){
				this.video.addEventListener("load", this.props.onLoad);
			}

			if(this.props.onDurationChange && typeof this.props.onDurationChange == "function"){
				this.video.addEventListener("durationchange", this.props.onDurationChange);
			}

			if(this.props.onSeeking && typeof this.props.onSeeking == "function"){
				this.video.addEventListener("seeking", this.props.onSeeking);
			}

			if(this.props.onSeeked && typeof this.props.onSeeked == "function"){
				this.video.addEventListener("seeked", this.props.onSeeked);
			}

			if(this.props.onStalled && typeof this.props.onStalled == "function"){
				this.video.addEventListener("stalled", this.props.onStalled);
			}

			if(this.props.onPlaying && typeof this.props.onPlaying == "function"){
				this.video.addEventListener("playing", this.props.onPlaying);
			}

			if(this.props.onCanPlay && typeof this.props.onCanPlay == "function"){
				this.video.addEventListener("canplay", this.props.onCanPlay);
			}

			if(this.props.onAudioFocusLoss && typeof this.props.onAudioFocusLoss == "function"){
				this.video.addEventListener("audiofocusloss", this.props.onAudioFocusLoss);
			}

			if(this.props.onAudioFocusGain && typeof this.props.onAudioFocusGain == "function"){
				this.video.addEventListener("audiofocusgain", this.props.onAudioFocusGain);
			}

			if(this.props.src)
				this.video.src = this.props.src;
			
			if(this.props.currenttime)
				this.video.currentTime = this.props.currenttime;

			// if(this.props.style){
			// 	this.video.left = this.props.videoleft;

			// 	this.video.top = this.props.videotop;
					
			// 	if(this.props.style.width)
			// 		this.video.width = this.props.style.width;
					
			// 	if(this.props.style.height)
			// 		this.video.height = this.props.style.height;
			// }

			if(typeof this.props.videoref != "undefined" && this.props.videoref){
				this.props.videoref(this.video);
			}
		}
	}

	componentWillUnmount(){
		if(this.video != null){
			this.video.releasePlayer();
		}
	}
}
export default JsvVideo