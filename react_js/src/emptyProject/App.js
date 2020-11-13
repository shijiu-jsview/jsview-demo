import React from 'react';
import createStandaloneApp from '../jsview-utils/JsViewReactTools/StandaloneApp'
import { FocusBlock } from '../jsview-utils/JsViewReactTools/BlockDefine'

class MainScene extends FocusBlock{
    constructor(props) {
        super(props);
    }

    onKeyDown(ev) {
        console.log("keydown ev=" + ev.keyCode);
        return false;
    }
    
    renderContent() {
        return(
            <div style={{left: 0, top: 110, width: 200, height: 30, color: "#00AA00", fontSize: "20px"}}>
                这是空项目
            </div>
        );
    }
}
let App = createStandaloneApp(MainScene);

export {
    App,
    MainScene as SubApp
}