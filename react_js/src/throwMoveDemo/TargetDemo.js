import React from 'react';
import { FocusBlock } from "../demoCommon/BlockDefine"
import {JsvActorMoveControl, JsvActorMove} from "../jsview-utils/JsViewReactWidget/JsvActorMove"
import CssStyles from "./Styles"

class TargetDemo extends FocusBlock {
    constructor(props) {
        super(props);
		this._ThrowControl = new JsvActorMoveControl(); // 抛物运动体控制器
		this._MoveControl = new JsvActorMoveControl(); // 平移运动体控制器
        this._LeftOrRight = 1; // -1:left, 1:right
        this.state = {
            direction: this._LeftOrRight,
			visible:false
        }
        this._ToggleDirection = 1;
    }

	onFocus() {
    	this.setState({visible:true})
	}
	onBlur() {
		this.setState({visible:false})
	}

    onKeyDown(ev) {
       if (ev.keyCode === 13) {
            // 开始进行动画
            this._LeftOrRight = -this._LeftOrRight;
            this.setState({
                direction: this._LeftOrRight
            });

		   this._MoveControl.moveToX(195 * this._LeftOrRight, 250, (x, y) => {
			   console.log("Move end with x=" + x + " y=" + y);
		   });
		   let position = -100 * this._ToggleDirection / 2;
		   this._ThrowControl.throwAlongY(-500 * this._ToggleDirection, 750 * this._ToggleDirection, {
			   type: "catch",
			   position: position,
			   direction: -1 * this._ToggleDirection
		   }, (x, y) => {
			   console.log("Throw end with x=" + x + " y=" + y);
		   });

		   this._ToggleDirection = this._ToggleDirection * -1;

			return true;
        }
        return false;
    }

    renderContent() {
    	if (!this.state.visible) {
    		return null;
		}
        return (
            <div>
				<div key="sample1" className={CssStyles.DetailFontStyle.getName()}
					 style={{top:150, left:425, width:430, height:40}}>拐点前触碰目标点</div>
				<div key="DirectText" className={CssStyles.FontStyle.getName()}
					 style={{top:250, left:425, width:430, height:40}}>
					{"当前方向:" + (this.state.direction > 0 ? "->" : "<-")}
				</div>
				<div style={{top:490, left:625}}>
					<JsvActorMove key="move4" control={this._MoveControl}>
						<JsvActorMove key="throw4" control={this._ThrowControl}>
							<div style={{backgroundColor:"#0916ff",width:30,height:30}}></div>
						</JsvActorMove>
					</JsvActorMove>
				</div>
            </div>
        );
    }

    componentDidMount() {

    }
}

export default TargetDemo;
