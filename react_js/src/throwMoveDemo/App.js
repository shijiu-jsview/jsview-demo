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
		this._ThrowControl1 = new JsvActorMoveControl(); // 抛物运动体控制器
		this._MoveControl1 = new JsvActorMoveControl(); // 平移运动体控制器
		this._ThrowControl2 = new JsvActorMoveControl(); // 抛物运动体控制器
		this._MoveControl2 = new JsvActorMoveControl(); // 平移运动体控制器
		this._ThrowControl3 = new JsvActorMoveControl(); // 抛物运动体控制器
		this._MoveControl3 = new JsvActorMoveControl(); // 平移运动体控制器
		this._ThrowControl4 = new JsvActorMoveControl(); // 抛物运动体控制器
		this._MoveControl4 = new JsvActorMoveControl(); // 平移运动体控制器
        this._LeftOrRight = 1; // -1:left, 1:right
        this.state = {
            direction: this._LeftOrRight
        }
        this._ToggleDirection = 1;
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
			this._MoveControl.moveToX(195 * this._LeftOrRight, 250, (x, y) => {
				console.log("Move end with x=" + x + " y=" + y);
			});
			this._ThrowControl.throwAlongY(-500, 750, { type: "catch", position: 0, direction: 1 }, (x, y) => {
				console.log("Throw end with x=" + x + " y=" + y);
			});

			this._ThrowControl1.throwAlongY(-500 * this._ToggleDirection, 750 * this._ToggleDirection, {
				type: "catch",
				position: 100 * this._ToggleDirection,
				direction: this._ToggleDirection
			}, (x, y) => {
				console.log("Throw end with x=" + x + " y=" + y);
			});

			this._MoveControl2.moveToX(195 * this._LeftOrRight, 250, (x, y) => {
				console.log("Move end with x=" + x + " y=" + y);
			});
			this._ThrowControl2.throwAlongY(-500, 750, { type: "catch", position: -100, direction: 1 }, (x, y) => {
				console.log("Throw end with x=" + x + " y=" + y);
			});

			//向上向下加速度
			this._ThrowControl3.throwAlongY(0, 750 * this._ToggleDirection, {
				type: "catch",
				position: 200 * this._ToggleDirection,
				direction: this._ToggleDirection
			}, (x, y) => {
				console.log("Throw end with x=" + x + " y=" + y);
			});

			this._MoveControl4.moveToX(195 * this._LeftOrRight, 250, (x, y) => {
				console.log("Move end with x=" + x + " y=" + y);
			});
			let position = -100 * this._ToggleDirection / 2;
			this._ThrowControl4.throwAlongY(-500 * this._ToggleDirection, 750 * this._ToggleDirection, {
				type: "catch",
				position: position,
				direction: -1 * this._ToggleDirection
			}, (x, y) => {
				console.log("Throw end with x=" + x + " y=" + y);
			});
			this._ToggleDirection = this._ToggleDirection * -1;
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
                    <div key="GuidText" className={CssStyles.FontStyle.getName()}
                         style={{top:625, left:425, width:430, height:40}}>
                        按OK键进行跳跃和转向
                    </div>
                    <div key="DirectText" className={CssStyles.FontStyle.getName()}
                         style={{top:250, left:425, width:430, height:40}}>
                        {"当前方向:" + (this.state.direction > 0 ? "->" : "<-")}
                    </div>
                </React.Fragment>
				<div style={{top:50, left:50}}>
					<div style={{backgroundColor:"#0916ff",width:20,height:20}}></div>
					<div key="sample1" className={CssStyles.DetailFontStyle.getName()}
						 style={{top:0, left:30, width:800, height:30}}>初始速度-500/500、加速度750/-750，着落点为抛物线左侧-50、右侧50</div>
				</div>
				<div style={{top:590, left:300}}>
					<JsvActorMove key="move1" control={this._MoveControl4}>
						<JsvActorMove key="throw1" control={this._ThrowControl4}>
							<div style={{backgroundColor:"#0916ff",width:30,height:30}}></div>
						</JsvActorMove>
					</JsvActorMove>
				</div>
				<div style={{top:80, left:50}}>
					<div style={{backgroundColor:"#00FF00",width:20,height:20}}></div>
					<div key="sample1" className={CssStyles.DetailFontStyle.getName()}
						 style={{top:0, left:30, width:800, height:30}}>抛物线运动</div>
				</div>
                <div style={{top:590, left:625}}>
                    <JsvActorMove key="move" control={this._MoveControl}>
                        <JsvActorMove key="throw" control={this._ThrowControl}>
                            <div style={{backgroundColor:"#00FF00",width:30,height:30}}></div>
                        </JsvActorMove>
                    </JsvActorMove>
                </div>

				<div style={{top:110, left:50}}>
					<div style={{backgroundColor:"#ffb915",width:20,height:20}}></div>
					<div key="sample1" className={CssStyles.DetailFontStyle.getName()}
						 style={{top:0, left:30, width:800, height:30}}>初始速度500/-500、加速度750</div>
				</div>
                <div style={{top:290, left:300}}>
                    <JsvActorMove key="move1" control={this._MoveControl1}>
                        <JsvActorMove key="throw1" control={this._ThrowControl1}>
                            <div style={{backgroundColor:"#ffb915",width:30,height:30}}></div>
                        </JsvActorMove>
                    </JsvActorMove>
                </div>

				<div style={{top:140, left:50}}>
					<div style={{backgroundColor:"#abaa20",width:20,height:20}}></div>
					<div key="sample1" className={CssStyles.DetailFontStyle.getName()}
						 style={{top:0, left:30, width:800, height:30}}>初始速度-500、加速度750、着落点为抛物线左侧-100</div>
				</div>
                <div style={{top:590, left:925}}>
                    <JsvActorMove key="move1" control={this._MoveControl2}>
                        <JsvActorMove key="throw1" control={this._ThrowControl2}>
                            <div style={{backgroundColor:"#abaa20",width:30,height:30}}></div>
                        </JsvActorMove>
                    </JsvActorMove>
                </div>

				<div style={{top:170, left:50}}>
					<div style={{backgroundColor:"#FF0000",width:20,height:20}}></div>
					<div key="sample1" className={CssStyles.DetailFontStyle.getName()}
						 style={{top:0, left:30, width:800, height:30}}>初始速度0、加速度750/-750，上下运动</div>
				</div>
                <div style={{top:290, left:925}}>
					<JsvActorMove key="move1" control={this._MoveControl3}>
						<JsvActorMove key="throw1" control={this._ThrowControl3}>
							<div style={{backgroundColor:"#FF0000",width:30,height:30}}></div>
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
