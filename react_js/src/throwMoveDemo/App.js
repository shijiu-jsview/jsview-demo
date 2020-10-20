import React from 'react';
import createStandaloneApp from "../demoCommon/StandaloneApp"
import { FocusBlock } from "../demoCommon/BlockDefine"
import {JsvActorMoveControl, JsvActorMove} from "../jsview-utils/JsViewReactWidget/JsvActorMove"
import CssStyles from "./Styles"

class MainScene extends FocusBlock {
    constructor(props) {
        super(props);
        this._ThrowControl = new JsvActorMoveControl(); // 抛物运动体控制器
        this._MoveControl = new JsvActorMoveControl(); // 平移运动体控制器
        this._LeftOrRight = 1; // -1:left, 1:right
        this.state = {
            direction: this._LeftOrRight
        }
    }

    onKeyDown(ev) {
        if (ev.keyCode === 10000 || ev.keyCode === 27) {
            if (this._NavigateHome) {
                this._NavigateHome();
            }
        } else if (ev.keyCode === 13) {
            // 开始进行动画
            this._LeftOrRight = -this._LeftOrRight;
            this.setState({
                direction: this._LeftOrRight
            });

            // 195 = (MoveRange / 2 - boxWidth / 2) = 420 / 2 - 30 / 2
            this._MoveControl.moveToX(195 * this._LeftOrRight, 250, (x, y)=>{
                console.log("Move end with x=" + x + " y=" + y);
            });
            this._ThrowControl.throwAlongY(-500, 750, {type:"catch", position:0, direction: 1}, (x, y)=>{
                console.log("Throw end with x=" + x + " y=" + y);
            });
            // this._ThrowControl.moveToY(250 * this._LeftOrRight, 500, (x, y)=>{
            //     console.log("Move quick end with x=" + x + " y=" + y);
            // });
        }
        return true;
    }

    renderContent() {
        return (
            <>
                <div key="bg" style={{width:1280, height:720, backgroundColor:"#000000"}}/>
                <React.Fragment>
                    <div key="leftWall" style={{top:0, left:425, width:5, height:620, backgroundColor:"#F0F000"}}/>
                    <div key="rightWall" style={{top:0, left:850, width:5, height:620, backgroundColor:"#F0F000"}}/>
                    <div key="bottomWall" style={{top:620, left:425, width:430, height:5, backgroundColor:"#F0F000"}}/>
                    <div key="GuidText" class={CssStyles.FontStyle.getName()}
                         style={{top:625, left:425, width:430, height:40}}>
                        按OK键进行跳跃和转向
                    </div>
                    <div key="DirectText" class={CssStyles.FontStyle.getName()}
                         style={{top:250, left:425, width:430, height:40}}>
                        {"当前方向:" + (this.state.direction > 0 ? "->" : "<-")}
                    </div>
                    <div key="bottomWall" style={{top:620, left:425, width:430, height:5, backgroundColor:"#F0F000"}}/>
                </React.Fragment>
                <div style={{top:590, left:625}}>
                    <JsvActorMove key="move" control={this._MoveControl}>
                        <JsvActorMove key="throw" control={this._ThrowControl}>
                            <div style={{backgroundColor:"#00FF00",width:30,height:30}}></div>
                        </JsvActorMove>
                    </JsvActorMove>
                </div>
            </>
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
