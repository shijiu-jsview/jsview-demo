/**
 * Created by luocf on 2020/5/12.
 */
import React from 'react';
import ScrollPage from "./ScrollPage"
import {JsvSpriteTranslate, TranslateControl} from "../../../../../jsview-utils/JsViewReactWidget/JsvSpriteTranslate"

class BackGround extends ScrollPage {
    /**
     * @param scrollPageNums 翻页次数
     * @param scrollSpeed 滚动速度
     * @param direction 方向
     * @param ref reference
     * @param style 背景大小
     * @param distancePos
     */
    constructor(props) {
        console.log("BackGround constructor");
        super(props);
        this._TranslateControl = new TranslateControl();
        this._TranslateControl.speed(this.props.scrollSpeed).enableRepeatFrom(0,0);
        this._ScrollPage = 0;
        this._ScrollPageNums = this.props.scrollPageNums;
        this._Direction = this.props.direction;
        this._DistancePos = this.props.distancePos?this.props.distancePos:0;
        this._Width = this.props.style.width?this.props.style.width:1280;
        this._Height = this.props.style.height?this.props.style.height:720;
        this._Left = this.props.style.left?this.props.style.left:0;
        this._Top = this.props.style.top?this.props.style.top:0;
        this._IsPause = false;
        this._TestCount = 0;
    }

    pause() {
        this._IsPause = true;
        console.log("BackGround pause "+",  this._TestCount:"+(--this._TestCount));
        this._TranslateControl.pause((x,y)=>{
            console.log("_TranslateControl1 pause x:"+x);
        });
    }

    _PlayControl(control) {
        console.log("BackGround _PlayControl this._ScrollPage:"+this._ScrollPage+",  this._TestCount:"+(++this._TestCount));
        if (this._Direction === 'horizontal') {
            if (this._IsPause) {//状态切换时，回滚
                control.targetX(-(this._DistancePos)).jump();
            }
            control.targetX(-this._Width).start();
        } else {
            if (this._IsPause) {//状态切换时，回滚
                control.targetY(-(this._DistancePos)).jump();
            }
            control.targetY(-this._Height).start();
        }
    }

    play() {
        this._PlayControl(this._TranslateControl);
        this._IsPause = false;
    }

    render() {
        console.log("Background this.props.style:", this.props.style);
        return (
            <div>
                <JsvSpriteTranslate key="BgTranslate"
                                    style={{width:this._Width, height:this._Height, left:this._Left,top:this._Top}}
                                    control={this._TranslateControl}>
                    <div style={this.props.style}/><div style={{...this.props.style, ...{left:this._Width-1}}}/>
                </JsvSpriteTranslate>
            </div>
        )
    }

    componentDidMount() {

    }
}

export default BackGround;