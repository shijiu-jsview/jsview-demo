/**
 * Created by luocf on 2020/5/12.
 */
import React from 'react';
import JsvSpriteAnim from '../../../jsview-utils/JsViewReactWidget/JsvSpriteImg'
import Until from "../../common/Until"
import {JsvSpriteTranslate, TranslateControl} from "../../../jsview-utils/JsViewReactWidget/JsvSpriteTranslate"
import {createImpactTracer, createImpactCallback} from '../../../jsview-utils/jsview-react/index_widget';
import {FocusBlock} from "../../../demoCommon/BlockDefine"
class Role extends FocusBlock {
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
    }

    play() {
        this.setState({//主角入场
            roleSpriteLeft:parseInt(this.props.worldSize.width / 4 + this.offsetX),
        });
    }

    stop() {
        this._IsPlaying = false;
        this.setState({//主角出场
            roleSpriteLeft:this.props.worldSize.width,
            roleSpriteName:"role"
        })
    }

    jump() {
        if (!this._IsJump) {
            this._IsJump = true;
            this._SpritDown = false;
            this.TranslateControl.decelerateY(this.props.roleDownSpeed, -this.props.roleUpSpeed).start(()=>{
                console.log("decelerateY end!");
                this._SpritDown = true;
                this.TranslateControl.accelerateY(this.props.roleDownSpeed, 0).start(()=>{
                    this._onJumpEnd();
                })
            })
        }
    }

    onKeyDown(ev) {
        //按键处理
        if (ev.keyCode === 13) { //OK按键
            if (!this._IsJump && this._IsPlaying && !this._IsCollision) {
                this.jump();
                this.setState({roleSpriteName: "roleJump", clashObstacleVisible:"hidden"});
                this.clickSound.play();
            }
            return true;
        }

        return false;
    }

    _onJumpEnd() {
        console.log("debugjump _onJumpEnd in"+", now:"+(new Date().getTime()));
        this._IsJump = false;
        if (!this._IsCollision) {
            this.setState({roleSpriteName: "role", clashObstacleVisible:"hidden"});
        }
    }

    triggerClashObstacle(is_clash) {
        console.log("debugjump triggerClashObstacle is_clash:"+is_clash+", now:"+(new Date().getTime()));

        if (is_clash) {
            this._IsCollision = true;
            this.setState({roleSpriteName: "clashObstacleRole", clashObstacleVisible:"visible"});
        } else {
            this._IsCollision = false;
            this.setState({roleSpriteName: "role", clashObstacleVisible:"hidden"});
        }
    }

    renderContent() {
        let {clashObstacle, isFlyingMode} = this.props;
        let clashObstacleConfig = clashObstacle.config;
        let clashObstacleDetailInfo =  window.GameSource[clashObstacleConfig.json];
        let clashObstacleViewSize = clashObstacleDetailInfo.frames[0].sourceSize;
        let clashObstacle_duration = clashObstacleDetailInfo.frames.length/clashObstacleConfig.rate;
        return (
            <div style={{left: this.state.roleSpriteLeft, top: this.props.worldSize.height / 2-40, transition:"left 1s linear 0s"}}
                 onTransitionEnd={this.props.onTransitionEnd}>
                <JsvSpriteTranslate key="RoleTranslate"
                                    style={{
                                        left:0,
                                        top:0}}
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
                        {<div style={{visibility:this.state.clashObstacleVisible, left:130,top:20}}>
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