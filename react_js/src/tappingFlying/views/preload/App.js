import React from 'react';
import "./App.css"
import JsvSpriteAnim from './../../../jsview-utils/JsViewReactWidget/JsvSpriteImg'
import Theme from "./Theme"
import ProgressBar from "../../views/component/ProgressBar"
import Game from "../../common/Game"
import GameAppBase from "../base/GameAppBase"
class App extends GameAppBase{
	constructor(props) {
		super(props);

        this._IsLoaded = false;
        this._AudioRef = null;
        this._AudioPlayEnded = this._AudioPlayEnded.bind(this);
        this._OnTransitionEnd = this._OnTransitionEnd.bind(this);
        this._ProgreessRef = null;
	}

    _OnTransitionEnd() {
		console.log("preload _OnTransitionEnd");
        this._IsLoaded = true;
	}

    _AudioPlayEnded() {
        this.gotoNextState();
	}

	onFocus() {

	}

	onBlur() {

	}

	onKeyDown(ev) {
		if (ev.keyCode === 13 && this._IsLoaded){
			if (this._AudioRef) {
                this._AudioRef.src = Theme.audio.src;
				this._AudioRef.play();

			}
            return true;
		}
		return false;
	}

	renderContent() {
		console.log("Theme.audio.src:"+Theme.audio.src);
        return (<div style={Theme.bg.style}>
			<div style={Theme.mickey.style}></div>
			<ProgressBar style={Theme.loading.total.style}
						 		 speed={Theme.loading.total.style.width/2/* TODO 2s显示完毕*/}
								 totalBG={`url(${Theme.loading.total.style.backgroundImage})`}
								 progressBG={`url(${Theme.loading.process.style.backgroundImage})`}
								 direction="horizontal"
								 ref={(ref) => {
									 this._ProgreessRef = ref
								 }}
								 onEnd={this._OnTransitionEnd}/>
			<div style={Theme.tipsinfo.style}>
				<JsvSpriteAnim
					loop="infinite"
					duration={0.8}
					onAnimEnd= {function() {console.log("anim end")}}
					stop={true}
					spriteInfo={Theme.tipsinfo.en}
					viewSize={{w:Theme.tipsinfo.style.width, h:Theme.tipsinfo.style.height}}
					imageUrl={Theme.tipsinfo.en.url}/>
			</div>

			<audio ref={(ref) => {
                this._AudioRef = ref
            }} onEnded={this._AudioPlayEnded}/>
		</div>)
	}

	gotoNextState() {
        //Game.state.start("Difficult");
        Game.state.start("GamePlay");
	}

	componentWillUnmount() {
		if (this._AudioRef) {
            this._AudioRef.unload();
		}
        console.log("Preload app componentWillUnmount");
	}
	componentDidMount() {
		console.log("Preload app componentDidMount");
        this._ProgreessRef.play();
	}
}

export default App;
