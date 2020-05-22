/**
 * Created by luocf on 2020/5/12.
 */
import React from 'react';
import JsvSpriteAnim from '../../../jsview-utils/JsViewReactWidget/JsvSpriteImg'
import Until from "../../common/Until"
import {JsvSpriteTranslate, TranslateControl} from "../../../jsview-utils/JsViewReactWidget/JsvSpriteTranslate"
import {createImpactTracer, createImpactCallback} from '../../../jsview-utils/jsview-react/index_widget';

import GameAppBase from "../base/GameAppBase"

class Role extends GameAppBase {
    /**
     * @param style role 坐标&大小等信息
     * @param roleSprite  {config,角色的配置
     * @param clashObstacle {config, style} 角色碰撞状态配置
     * @param  isFlyingMode    是否为飞行模式
     * @param roleUpSpeed   jump up 速度
     *
     */
    constructor(props) {
        super(props);
        this.state = {
            roleSpriteName: "role"
        }
        this.Sprite = null;
        this._SpritDown = false;
        this.TranslateControl = new TranslateControl();
        this.TranslateControl.selectMode("AcceleratedMotion");
        this._IsPlaying = true;
        this._IsCollision = false;
        this.bodySize = this.props.assets[this.state.roleSpriteName].bodySize;
        this._IsJump = false;
    }

    GameOver() {
        this._IsPlaying = false;

        this.setState({roleSpriteName: "role"})
    }

    jump() {
        if (!this._IsJump) {
            this._IsJump = true;
            this._SpritDown = false;
            this.TranslateControl.decelerateY(this.props.roleDownSpeed, -this.props.roleUpSpeed).start(()=>{
                console.log("decelerateY end!");
                this._SpritDown = true;
                this.TranslateControl.accelerateY(this.props.roleDownSpeed, 0).start(()=>{
                    this._IsJump = false;
                })
            })
        }
    }
    onKeyDown(ev) {
        //按键处理
        if (ev.keyCode === 13) { //OK按键
            if (!this._IsJump && this._IsPlaying && !this._IsCollision) {
                this.jump();
                this.setState({roleSpriteName: "roleJump"});
                //TODO this.clickSound.play();
            }
            return true;
        }

        return false;
    }

    _onJumpEnd() {
        console.log("debugjump _onJumpEnd in"+", now:"+(new Date().getTime()));
        this.setState({roleSpriteName: "role"});
    }

    renderContent() {
        let {assets, clashObstacle, isFlyingMode, branchName, roleDownSpeed, roleUpSpeed, ...others} = this.props;
        let roleconfig = assets[this.state.roleSpriteName];
        let roleDetailInfo = Until.clone(window.Game[roleconfig.detail]);
        let roleViewSize = roleDetailInfo.frames[0].sourceSize;
        let clashObstacleConfig = clashObstacle.config;
        let clashObstacleDetailInfo =  window.Game[clashObstacleConfig.detail];
        let clashObstacleViewSize = clashObstacleDetailInfo.frames[0].sourceSize;
        let role_duration = roleDetailInfo.frames.length/roleconfig.rate;
        let clashObstacle_duration = clashObstacleDetailInfo.frames.length/clashObstacleConfig.rate;

        console.log("debugjump clashObstacle.style.visibility:"+clashObstacle.style.visibility+", now:"+(new Date().getTime()));
        if (clashObstacle.style.visibility === "visible") {
            this._IsCollision = true;
            //只显示最后一帧数据
            roleDetailInfo.frames = roleDetailInfo.frames.splice(0,1);
        } else {
            this._IsCollision = false;
        }

        console.log("debugjump roleDetailInfo length:"+roleDetailInfo.frames.length+", now:"+(new Date().getTime()));
        return (
            <div {...others}>
                <JsvSpriteTranslate key="RoleTranslate"
                                    style={{
                                        left:0,
                                        top:0,
                                        width: roleViewSize.w,
                                        height:roleViewSize.h}}
                                    control={this.TranslateControl}>
                    <div key={roleconfig.value+"/"+clashObstacle.style.visibility}>{
                        /*通过key控制role 信息变化时，对象重建 TODO 高阶组件问题，修正后，可不设置key*/}
                        <JsvSpriteAnim
                            spriteInfo={roleDetailInfo}
                            loop="infinite"
                            viewSize={roleViewSize}
                            duration={role_duration}
                            onAnimEnd= {function() {console.log("anim end")}}
                            imageUrl={`url(${require("../../assets/atlas/" + roleconfig.value)})`}/>
                        {<div style={clashObstacle.style}>
                            <JsvSpriteAnim
                                spriteInfo={clashObstacleDetailInfo}
                                loop="infinite"
                                viewSize={clashObstacleViewSize}
                                duration={clashObstacle_duration}
                                onAnimEnd= {function() {console.log("anim end")}}
                                imageUrl={`url(${require("../../assets/atlas/" + clashObstacleConfig.value)})`}/>
                        </div>}
                    </div>
                    {/*碰撞实体保持不变*/}
                    <div ref={(ref) => {
                        this.Sprite = ref;
                    }} style={{
                        left: isFlyingMode?this.bodySize.x+30:this.bodySize.x+50,
                        top: isFlyingMode?this.bodySize.y+30:this.bodySize.y+50,
                        width: isFlyingMode?(this.bodySize.w-60):(this.bodySize.w-100),
                        height: isFlyingMode ?(this.bodySize.h-60):(this.bodySize.h-100),
                        backgroundColor:"rgba(0,0,0,0)"
                    }}/>

                </JsvSpriteTranslate>
                {/*下坠时碰撞物，提高精灵图变化的时机*/}
                <div ref={(ref) => {
                    this.DownSprite = ref;
                }} style={{
                    left:0,
                    top:parseInt(roleViewSize.h/2),
                    width: roleViewSize.w,
                    height:10,
                    backgroundColor:"rgba(0,0,0,0)"
                }}/>
            </div>
        )
    }

    componentDidMount() {
        this._DownSpriteSensor = createImpactTracer(this.Sprite, this.DownSprite, createImpactCallback(
            () => {
                //碰撞开始
                console.log("Role 碰撞开始 ");
                if (this._SpritDown) {
                    this._onJumpEnd();
                }
            },
            () => {
                //碰撞结束
                console.log("Role 碰撞结束 ");
            })
        );
    }

    componentWillUnmount() {
        this._DownSpriteSensor.Recycle();
    }
}
Role.JumpState = {
    None:0,
    Up:1,
    Down:2,
}
export default Role;