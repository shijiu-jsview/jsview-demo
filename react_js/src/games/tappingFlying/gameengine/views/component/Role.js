/**
 * Created by luocf on 2020/5/12.
 */
import React from 'react';
import JsvSpriteAnim from '../../../../../jsview-utils/JsViewReactWidget/JsvSpriteImg'
import {JsvSpriteTranslate, TranslateControl} from "../../../../../jsview-utils/JsViewReactWidget/JsvSpriteTranslate"
import {FocusBlock} from "../../../../../demoCommon/BlockDefine"
import Game from "../../common/Game"

class Role extends FocusBlock {
    /**
     * @param style role 坐标&大小等信息
     * @param roleSprite  {config,角色的配置
     * @param clashObstacle {config, style} 角色碰撞状态配置
     * @param  isFlyingMode    是否为飞行模式
     * @param roleUpSpeed   jump up 速度
     * @param isTarget
     *
     */
    constructor(props) {
        super(props);
        console.log("Role constructor");
        this.state = {
            roleSpriteLeft:0,
            roleSpriteName: "role",
            clashObstacleVisible:"hidden",
        }
        this.clickSound = this.props.clickSound;
        this.offsetX = this.props.offsetX;
        this.Sprite = null;
        this._SpritDown = false;
        this.TranslateControl = new TranslateControl();
        this.TranslateControl.selectMode("AcceleratedMotion");
        this._IsPlaying = true;
        this._IsCollision = false;
        this.bodySize = this.props.rolesList[0].bodySize;
        this._IsJump = false;
        this._IsPrepareFlying = false;
        this._isTarget = this.props.isTarget;

    }

    pause() {
        if (this._isTarget) {
            this.TranslateControl.pause();
        }
        this._IsCollision = true;
        console.log("Role pause");
        this.setState({roleSpriteName: "clashObstacleRole", clashObstacleVisible:"visible"});
    }

    play() {
        this._IsPlaying = true;
        this._IsCollision = false;
        this.setState({roleSpriteName: "role", clashObstacleVisible:"hidden"});
        if (this._isTarget) {
            let target_y = this.props.worldSize.height / 3;
            console.log("Role play target_y:"+target_y);
            this.TranslateControl.accelerateY(this.props.roleDownSpeed, target_y).start(()=>{
                this._onJumpEnd();
            })
        }
    }

    //主角入场
    enter() {
        console.log("Role enter");
        this.setState({
            roleSpriteLeft:parseInt(this.props.worldSize.width / 4 + this.offsetX),
        });
    }

    //主角出场
    exit() {
        this._IsPlaying = false;
        console.log("Role exit");
        this.setState({
            roleSpriteLeft:this.props.worldSize.width+this.props.rolesList[0].viewSize.w,
            roleSpriteName:"role"
        })
    }

    fly() {
        console.log("Role fly");
        this._IsPrepareFlying = true;
        this.TranslateControl.pause((x,y)=>{
            this.TranslateControl.targetY(y).jump();
            this._IsJump = false;
            this._IsPrepareFlying = false;
            this.jump();
        });
    }

    jump() {
        console.log("Role jump, this._IsJump:", this._IsJump);
        if (!this._IsJump) {
            this._IsJump = true;
            this._SpritDown = false;

            let init_v_y = this.props.roleUpSpeed;
            let target_y = 0;
            if (this._isTarget) {
                init_v_y = this.props.roleDownSpeed;
                target_y = this.props.worldSize.height / 3;
            }
            this.TranslateControl.decelerateY(this.props.roleDownSpeed, -init_v_y).start(()=>{
                console.log("decelerateY end!");
                this._SpritDown = true;
                this.TranslateControl.accelerateY(this.props.roleDownSpeed, target_y).start(()=>{
                    this._onJumpEnd();
                })
            })
            this.clickSound.play();
        }
    }

    onKeyDown(ev) {
        console.log("Role onKeyDown:",ev.keyCode);

        //按键处理
        if (ev.keyCode === 13) { //OK按键
            if (!this._IsPrepareFlying
                && this._IsPlaying
                && !this._IsCollision) {
                if (this._isTarget) {
                    this.fly();
                    this.setState({clashObstacleVisible:"hidden"});
                } else {
                    this.jump();
                    this.setState({roleSpriteName: "roleJump", clashObstacleVisible:"hidden"});
                }

            }
            return true;
        }
        return false;
    }

    _onJumpEnd() {
        console.log("Role _onJumpEnd in"+", now:"+(new Date().getTime()));
        this._IsJump = false;
        if (!this._IsCollision) {
            this.setState({roleSpriteName: "role", clashObstacleVisible:"hidden"});
        }
    }

    renderContent() {
        let {clashObstacle, isFlyingMode} = this.props;
        let clashObstacleConfig = clashObstacle.config;
        let clashObstacleDetailInfo =  window.GameSource[clashObstacleConfig.json];
        let clashObstacleViewSize = clashObstacleDetailInfo.viewSize;
        let clashObstacle_duration = clashObstacleDetailInfo.frames.length/clashObstacleConfig.rate;
        let bodySize = this.bodySize;
        if (!bodySize) {
            bodySize = {x:15,y:30,w:this.props.rolesList[0].viewSize.w-30, h:this.props.rolesList[0].viewSize.h-60}
        }

        return (
            <div style={{left: this.state.roleSpriteLeft, top: this.props.worldSize.height / 2-40, transition:"left 1s linear 0s"}}
                 onTransitionEnd={this.props.onTransitionEnd}>
                <JsvSpriteTranslate key="RoleTranslate"
                                    style={{
                                        left:0,
                                        top:0,}}
                                    control={this.TranslateControl}>
                    <div key={"role"}>
                        {
                            this.props.rolesList.map((item) => {
                                console.log("render item:", item.key);
                                return (
                                    <div key={item.key} style={{visibility: this.state.roleSpriteName === item.key?"visible":"hidden"}}>
                                        <JsvSpriteAnim
                                            spriteInfo={item.spriteInfo}
                                            loop="infinite"
                                            viewSize={item.viewSize}
                                            duration={item.duration}
                                            onAnimEnd= {function() {console.log("anim end")}}
                                            imageUrl={item.imageUrl}/>
                                    </div>
                                )
                            })
                        }

                        {<div style={{visibility:this.state.clashObstacleVisible,
                            left:(this.props.rolesList[0].viewSize.w - clashObstacleViewSize.w)/2+15,
                            top:(this.props.rolesList[0].viewSize.h - clashObstacleViewSize.h)/2-80}}>
                            <JsvSpriteAnim
                                spriteInfo={clashObstacleDetailInfo}
                                loop="infinite"
                                viewSize={clashObstacleViewSize}
                                duration={clashObstacle_duration}
                                onAnimEnd= {function() {console.log("anim end")}}
                                imageUrl={`url(${require("../../../"+Game.apppath+"/assets/atlas/" + clashObstacleConfig.value)})`}/>
                        </div>}
                    </div>

                    {/*碰撞实体保持不变*/}
                    <div ref={(ref) => {
                        this.Sprite = ref;
                    }} style={{
                        left: isFlyingMode?bodySize.x+30:bodySize.x+50,
                        top: isFlyingMode?bodySize.y+30:bodySize.y+50,
                        width: isFlyingMode?(bodySize.w-60):(bodySize.w-100),
                        height: isFlyingMode ?(bodySize.h-60):(bodySize.h-100),
                        backgroundColor:"rgba(0,0,0,0)"
                    }}/>
                </JsvSpriteTranslate>

            </div>
        )
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }
}
Role.JumpState = {
    None:0,
    Up:1,
    Down:2,
}
export default Role;