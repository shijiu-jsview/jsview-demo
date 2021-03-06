/**
 * Created by luocf on 2020/5/12.
 */
import React from 'react';
import { JsvSpriteAnim } from '../../../../../../utils/JsViewReactWidget/JsvSpriteAnim';
import { JsvActorMove, JsvActorMoveControl } from "../../../../../../utils/JsViewReactWidget/JsvActorMove";
import { FocusBlock } from "../../../../../../utils/JsViewReactTools/BlockDefine";
import Game from "../../common/Game";

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
      roleSpriteLeft: 0,
      roleSpriteName: "role",
      clashObstacleVisible: "hidden",
    };
    this.clickSound = this.props.clickSound;
    this.offsetX = this.props.offsetX;
    this.Sprite = null;
    this._SpritDown = false;
    this.TranslateControl = new JsvActorMoveControl();
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
    this.setState({ roleSpriteName: "clashObstacleRole", clashObstacleVisible: "visible" });
  }

  play() {
    this._IsPlaying = true;
    this._IsCollision = false;
    this.setState({ roleSpriteName: "role", clashObstacleVisible: "hidden" });
    if (this._isTarget) {
      const target_y = this.props.worldSize.height / 3;
      console.log(`Role play target_y:${target_y}`);
      this.TranslateControl.throwAlongY(0, this.props.roleDownSpeed,
          {type:"catch", position:target_y, direction: 1},
          ()=>{
            this._onJumpEnd();
          },
          null
      );
    }
  }

  // 主角入场
  enter() {
    console.log("Role enter");
    setTimeout(() => {
      this.setState({
        roleSpriteLeft: parseInt(this.props.worldSize.width / 4 + this.offsetX, 10),
      });
    }, 0);
  }

  // 主角出场
  exit() {
    this._IsPlaying = false;
    console.log("Role exit");
    this.setState({
      roleSpriteLeft: this.props.worldSize.width + this.props.rolesList[0].viewSize.w,
      roleSpriteName: "role"
    });
  }

  fly() {
    console.log("Role fly");
    this._IsPrepareFlying = true;
    this.TranslateControl.pause((x, y) => {
      // this.TranslateControl.jumpTo(x, y);
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

      console.log(`DebugTest init_v=${init_v_y} acc=${this.props.roleDownSpeed} targetY=${target_y}`);
      this.TranslateControl.throwAlongY(
          -init_v_y,
          this.props.roleDownSpeed,
          {type:"catch", position:target_y, direction: 1},
          ()=>{
            this._onJumpEnd();
          },
          ()=>{
            this._SpritDown = true;
          }
      );

      this.clickSound.play();
    }
  }

  onKeyDown(ev) {
    console.log("Role onKeyDown:", ev.keyCode);

    // 按键处理
    if (ev.keyCode === 13) { // OK按键
      if (!this._IsPrepareFlying
                && this._IsPlaying
                && !this._IsCollision) {
        if (this._isTarget) {
          this.fly();
          this.setState({ clashObstacleVisible: "hidden" });
        } else {
          this.jump();
          this.setState({ roleSpriteName: "roleJump", clashObstacleVisible: "hidden" });
        }
      }
      return true;
    }
    return false;
  }

  _onJumpEnd() {
    console.log(`${"Role _onJumpEnd in, now:"}${new Date().getTime()}`);
    this._IsJump = false;
    if (!this._IsCollision) {
      this.setState({ roleSpriteName: "role", clashObstacleVisible: "hidden" });
    }
  }

  renderContent() {
    const { clashObstacle, isFlyingMode } = this.props;
    const clashObstacleConfig = clashObstacle.config;
    const clashObstacleDetailInfo = window.GameSource[clashObstacleConfig.json];
    const clashObstacleViewSize = clashObstacleDetailInfo.viewSize;
    const clashObstacle_duration = clashObstacleDetailInfo.frames.length / clashObstacleConfig.rate;
    let bodySize = this.bodySize;
    if (!bodySize || !this.isFlyingMode) {
      bodySize = { x: 15, y: 30, w: this.props.rolesList[0].viewSize.w - 30, h: this.props.rolesList[0].viewSize.h - 60 };
    }
    const imgUrl = Game.requireUrl(clashObstacleConfig.value);
    return (
            <div style={{ left: this.state.roleSpriteLeft, top: this.props.worldSize.height / 2 - 40, transition: "left 1s linear 0s" }}
                 onTransitionEnd={this.props.onTransitionEnd}>
                <JsvActorMove key="RoleTranslate"
                                    style={{
                                      left: 0,
                                      top: 0, }}
                                    control={this.TranslateControl}>
                    <div key={"role"}>
                        {
                            this.props.rolesList.map((item) => {
                              console.log("render item:", item.key);
                              return (
                                    <div key={item.key} style={{ visibility: this.state.roleSpriteName === item.key ? "visible" : "hidden" }}>
                                        <JsvSpriteAnim
                                            spriteInfo={item.spriteInfo}
                                            loop="infinite"
                                            autostart={true}
                                            viewSize={item.viewSize}
                                            duration={item.duration}
                                            imageUrl={item.imageUrl}/>
                                    </div>
                              );
                            })
                        }

                        {<div style={{ visibility: this.state.clashObstacleVisible,
                          left: (this.props.rolesList[0].viewSize.w - clashObstacleViewSize.w) / 2 + 15,
                          top: (this.props.rolesList[0].viewSize.h - clashObstacleViewSize.h) / 2 - 80 }}>
                            <JsvSpriteAnim
                                spriteInfo={clashObstacleDetailInfo}
                                loop="infinite"
                                autostart={true}
                                viewSize={clashObstacleViewSize}
                                duration={clashObstacle_duration}
                                imageUrl={`url(${imgUrl})`}/>
                        </div>}
                    </div>

                    {/* 碰撞实体保持不变 */}
                    <div ref={(ref) => {
                      this.Sprite = ref;
                    }} style={{
                      left: isFlyingMode ? bodySize.x + 30 : bodySize.x + 50,
                      top: isFlyingMode ? bodySize.y + 30 : bodySize.y + 50,
                      width: isFlyingMode ? (bodySize.w - 60) : (bodySize.w - 100),
                      height: isFlyingMode ? (bodySize.h - 60) : (bodySize.h - 100),
                      backgroundColor: "rgba(0,0,0,0)"
                    }}/>
                </JsvActorMove>

            </div>
    );
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }
}
Role.JumpState = {
  None: 0,
  Up: 1,
  Down: 2,
};
export default Role;
