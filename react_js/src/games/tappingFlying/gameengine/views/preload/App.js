import React from 'react';
import "./App.css"
import {JsvSpriteAnim} from './../../../../../jsview-utils/JsViewReactWidget/JsvSpriteAnim'
import ProgressBar from "../../views/component/ProgressBar"
import Game from "../../common/Game"
import GameAppBase from "../base/GameAppBase"
class App extends GameAppBase{
	constructor(props) {
		super(props);
		this.Theme = Game.PreloadTheme;
        this._IsLoaded = false;
        this._AudioRef = null;
        this._AudioPlayEnded = this._AudioPlayEnded.bind(this);
        this._OnTransitionEnd = this._OnTransitionEnd.bind(this);
        this._ProgreessRef = null;
	}

    _OnTransitionEnd() {
		console.log("preload _OnTransitionEnd");
        this._IsLoaded = true;
        if (this._AudioRef) {
            this._AudioRef.src = this.Theme.audio.src;
            this._AudioRef.play();
        } else {
            this._AudioPlayEnded();
		}
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
                this._AudioRef.src = this.Theme.audio.src;
				this._AudioRef.play();
			} else {
                this._AudioPlayEnded();
			}
            return true;
		}
		return false;
	}

	renderContent() {
        return (<div style={this.Theme.bg.style}>
			<div style={this.Theme.mickey.style}></div>
			<ProgressBar style={this.Theme.loading.total.style}
						 		 speed={this.Theme.loading.total.style.width/this.Theme.loading.duration/* 2s显示完毕*/}
								 totalBG={`url(${this.Theme.loading.total.style.backgroundImage})`}
								 progressBG={`url(${this.Theme.loading.process.style.backgroundImage})`}
								 direction="horizontal"
								 ref={(ref) => {
									 this._ProgreessRef = ref
								 }}
								 onEnd={this._OnTransitionEnd}/>
			{this.Theme.tipsinfo?<div style={this.Theme.tipsinfo.style}>
				<JsvSpriteAnim
					loop="infinite"
					duration={0.8}
					stop={true}
					spriteInfo={this.Theme.tipsinfo.en}
					viewSize={{w:this.Theme.tipsinfo.style.width, h:this.Theme.tipsinfo.style.height}}
					imageUrl={this.Theme.tipsinfo.en.url}/>
			</div>:null
			}

            {
                this.Theme.audio?<audio ref={(ref) => {
                this._AudioRef = ref
            }} onEnded={this._AudioPlayEnded}/>:null
            }
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
        //Game.state.preload("GamePlay");//TODO 调整preload
	}
}

export default App;
