import React from 'react';
import createStandaloneApp from "../demoCommon/StandaloneApp"
import { FocusBlock } from "../demoCommon/BlockDefine"
import {JsvActorMoveControl, JsvActorMove} from "../jsview-utils/JsViewReactWidget/JsvActorMove"

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);
        this._MoveControl = new JsvActorMoveControl();
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            if (this._NavigateHome) {
                this._NavigateHome();
            }
        } else if (ev.keyCode === 13) {
            // 开始进行动画
            console.log("start throw");
            this._MoveControl.throwAlongY(-500, 980, {type:"catch", position:3, direction: 1}, (x, y)=>{
                console.log("End with x=" + x + " y=" + y);
            });
        }
        return true;
    }

    renderContent() {
        return (
            <div style={{top:350, left:250}}>
              <JsvActorMove control={this._MoveControl}>
                  <div style={{backgroundColor:"#00FF00",width:30,height:30}}></div>
              </JsvActorMove>
            </div>
        );
    }

    componentDidMount() {

    }
}
let App = createStandaloneApp(MainScene);

export {
    App, // 独立运行时的入口
    MainScene as SubApp, // 作为导航页的子入口时
};
