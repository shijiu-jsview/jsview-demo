/*
 * @Author: ChenChanghua
 * @Date: 2020-04-07 11:25:20
 * @LastEditTime: 2020-04-09 18:32:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /jsview-export-react-sample/react_js/src/spriteImage/App.js
 */
import React from 'react';
// import './App.css';
import JsvSpriteAnim from '../jsview-utils/JsViewReactWidget/JsvSpriteImg'
import sprite from './images/sprite.png'
import cat_run from './images/cat_run.png'

let sprite_info = {"frames": [

    {
        "frame": {"x":0,"y":0,"w":512,"h":256},
    },
    {
        "frame": {"x":512,"y":0,"w":512,"h":256},
    },
    {
        "frame": {"x":1024,"y":0,"w":512,"h":256},
    },
    {
        "frame": {"x":1536,"y":0,"w":512,"h":256},
    },
    {
        "frame": {"x":0,"y":256,"w":512,"h":256},
    },
    {
        "frame": {"x":512,"y":256,"w":512,"h":256},
    },
    {
        "frame": {"x":1024,"y":256,"w":512,"h":256},
    },
    {
        "frame": {"x":1536,"y":256,"w":512,"h":256},
    }
],
    "meta": {
        "app": "https://www.codeandweb.com/texturepacker",
        "version": "1.0",
        "image": "target_2.png",
        "format": "RGBA8888",
        "size": {"w":2048,"h":512},
        "scale": "1",
        "smartupdate": "$TexturePacker:SmartUpdate:6b895b10049e3e44bb1433676e457c49:c962f50d33ad949bb5f27266dd144cae:9ea127d7b5db876ab2a98a7f69391dc2$"
    }
}

class App extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            stop: false
        }
    }
	render() {
        return(
            <JsvSpriteAnim 
            spriteInfo={sprite_info} 
            loop="2" 
            viewSize={{w:1024, h:512}} 
            duration={0.8} 
            onAnimEnd= {function() {console.log("anim end")}}
            stop={ this.state.stop }
            imageUrl={cat_run}/>
        )

	}
}
export default App;
