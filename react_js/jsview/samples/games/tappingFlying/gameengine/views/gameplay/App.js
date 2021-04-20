import React from 'react';
import "./App.css";
import Game from "../../common/Game";
import GameAppBase from "../base/GameAppBase";
import BackGround from "../component/Background";
import Role from "../component/Role";
import Obstacles from "../component/Obstacles";
import ProgressBar from "../component/ProgressBar";
import GameOver from "../component/GameOver";
import NumberCount from "../component/NumberCount";
import Targets from "../component/Targets";
import { ReaxAudios } from "../../common/ReaxAudios";

class App extends GameAppBase {
  constructor(props) {
    super(props);
    console.log(" gameplay app constructor");
    this.game = Game;
    this.Theme = this.game.GamePlayTheme;
    this._TargetsRef = null;
    this._ObstaclesRef = null;
    this._ProgreessRef = null;
    this._AudioRef = null;
    this._RoleRef = null;
    this.stageIndex = 0;
    this.roundIndex = 0;
    this.repeatCount = 0;
    this._onImpactTracer = this._onImpactTracer.bind(this);
    this._onTargetImpactTracer = this._onTargetImpactTracer.bind(this);
    this._RoleTranslateEnd = this._RoleTranslateEnd.bind(this);
    this._OnProgress = this._OnProgress.bind(this);
    this._Init();
  }

  _Init(restart) {
    this._IsPlaying = true;
    if (restart) {
      this.setState({
        // visible:"hidden",
        progress: 1,
        count: 0,
        repeatCount: this.repeatCount,
        stageIndex: this.stageIndex,
        roundIndex: this.roundIndex,
        roleRef: null,
        gameResult: "uncomplete",
      });
    } else {
      this.state = {
        // visible:"hidden",
        progress: 1,
        count: 0,
        repeatCount: this.repeatCount,
        stageIndex: this.stageIndex,
        roundIndex: this.roundIndex,
        roleRef: null,
        gameResult: "uncomplete",
      };
    }

    this._InitGame();
    this._Create();
  }

  _OnProgress() {
    this._StopGame();
  }

  _RoleTranslateEnd() {
    console.log(`_RoleTranslateEnd this._IsPlaying:${this._IsPlaying}`);
    if (this._IsPlaying) {
      // 主角入场动画结束
      if (this._ObstaclesRef) {
        this._ObstaclesRef.play();
      }
      if (this._TargetsRef) {
        this._TargetsRef.play();
      }
      this._RoleRef.play();
      this._BgRef.play();
      this._ProgreessRef.play();
    } else {
      // 主角出场动画结束
      if (this.count < this.targetNum) {
        this._ShowGameSuccess('uncomplete');
      } else {
        if (this.game.roundIndex) {
          this.game.roundIndex += 1;
        } else {
          this.game.roundIndex = 1;
        }
        console.log(this.game.roundIndex, this.roundsNum);
        if (this.game.roundIndex === this.roundsNum) {
          this.game.roundIndex = 0;
          this._ShowGameSuccess('complete');
        } else {
          this.game.state.restart();
        }
      }
    }
  }

  _ShowGameSuccess(result) {
    if (result === 'complete') {
      this.setState({ gameResult: result });
    } else {
      // 显示未完成页面
      this.setState({ gameResult: result });
    }
    // 显示完成页面
    const focus_name = this.props.branchName ? this.props.branchName : "";
    this.changeFocus(`${focus_name}/gameover`);
  }

  _InitGame() {
    this.start = false;
    this.dizznessStatus = false;
    this.overlap = false;
    this.targetScore = 1;
    this.targetCount = 0;
    this.obstaclecount = 0;
    this.distance = 0;
    this.distanceCount = 0;
    this.sparkleTouchSprites = null;
    this.sparkleTouchAnimation = null;
    this.helpTimer = null;
    this.helpTouchSign = false;
    this.reaxMusic = null;
    this.pause = false;
    this.icon = null;
    this.addSprite = false;
    this.isObstacleOffset = false;
    this.distancePos = 400;
    if (this.game.Config.common.ratio === "4/3") {
      this.width = 960;
      this.height = 640;
    } else {
      this.width = 1280;
      this.height = 720;
    }
    this.stageIndex = this.getStageIndex();
    this.roundIndex = this.getRoundIndex();

    this.currStage = this.getCurrentStage(this.stageIndex);
    this.setAssetsKeyWithStage();

    this.roundsNum = this.game.Config.stages[this.stageIndex].roundsNum;
    this.scrollSpeed = this.currStage.game.roleSpeed;
    this.velocityUp = this.currStage.game.roleUpSpeed;
    this.garavity = this.currStage.game.roleDownSpeed;
    this.obstacleSpeed = this.currStage.assets.obstacle.speed ? this.currStage.assets.obstacle.speed : this.scrollSpeed / 2;
    this.offsetX = this.currStage.game.offsetX;
    this.isTarget = this.currStage.game.isTarget;
    this.isTargetDown = this.currStage.game.isTargetDown;
    this.isObstacle = this.currStage.game.isObstacle;
    this.targetNum = this.currStage.game.targetNum;
    this.appearNum = this.currStage.game.appearNum;
    this.obstacleNum = this.currStage.game.obstacleNum;
    this.midImageNum = this.currStage.game.midImageNum;
    this.count = this.currStage.game.crossTargetNum;
    this.isIconImage = this.currStage.game.isIconImage;
    this.counterOffset = this.currStage.game.counterOffset;
    this.topMargin = this.currStage.game.topBorder;
    this.bottomMargin = this.currStage.game.rangeHeight + this.topMargin;
    this.targetMinY = this.currStage.game.targetMinY;
    this.targetMaxY = this.currStage.game.targetMaxY;
    this.obstacleMinY = this.currStage.game.obstacleMinY;
    this.obstacleMaxY = this.currStage.game.obstacleMaxY;
    this.isFlyingMode = typeof this.currStage.game.isFlyingMode !== "undefined" ? this.currStage.game.isFlyingMode : true;// 默认为飞行模式
    this.isStartAnim = this.currStage.game.isStartAni;
    this.startAnimRate = this.currStage.assets.startAni.rate;
    this.startAnimX = this.currStage.assets.startAni.x;
    this.startAnimY = this.currStage.assets.startAni.y;
    this.iconImageX = this.currStage.assets.iconImage.x;
    this.iconImageY = this.currStage.assets.iconImage.y;
    this.iconValue = this.currStage.assets.iconImage.value;

    // 加载atlas infos
    this._UpdateCurrentStateResource(this.currStage);
  }

  _UpdateCurrentStateResource(cur_stage) {
    // 加载资源包中的json文件，对于jsview来说，将json文件改成全局变量的方式使用。
    const rolesList = [];
    if (!cur_stage) {
      return rolesList;
    }
    Object.keys(cur_stage.assets).forEach((o) => {
      const json_name = cur_stage.assets[o].json;
      if (json_name && !window.GameSource[json_name]) {
        const config_json = Game.requireUrl(json_name);
        window.GameSource[json_name] = this.game.convertToSpriteInfo(config_json);
      }
      // 生成精灵信息
      if (o.toLocaleLowerCase().indexOf("role") >= 0) {
        rolesList.push({
          key: o,
          spriteInfo: window.GameSource[json_name],
          imageUrl: `url(${Game.requireUrl(cur_stage.assets[o].value)})`,
          duration: window.GameSource[json_name].frames.length / cur_stage.assets[o].rate,
          viewSize: window.GameSource[json_name].viewSize,
          bodySize: cur_stage.assets[o].bodySize,
        });
        if (o.toLocaleLowerCase() === "role") {
          // 追加碰撞后角色信息
          if (!this.isFlyingMode) {
            rolesList.push({
              key: "clashObstacleRole",
              spriteInfo: { frames: [window.GameSource[json_name].frames[0]], meta: window.GameSource[json_name].meta },
              imageUrl: `url(${Game.requireUrl(cur_stage.assets[o].value)})`,
              duration: window.GameSource[json_name].frames.length / cur_stage.assets[o].rate,
              bodySize: cur_stage.assets[o].bodySize,
              viewSize: window.GameSource[json_name].viewSize
            });
          } else {
            rolesList.push({
              key: "clashObstacleRole",
              spriteInfo: window.GameSource[json_name],
              imageUrl: `url(${Game.requireUrl(cur_stage.assets[o].value)})`,
              duration: window.GameSource[json_name].frames.length / cur_stage.assets[o].rate,
              viewSize: window.GameSource[json_name].viewSize,
              bodySize: cur_stage.assets[o].bodySize,
            });
          }
        }
      }
    });
    cur_stage.rolesList = rolesList;
    // 附加star_burst_big资源
    try {
      if (!window.GameSource["star_burst_big.json"]) {
        const config_json = Game.requireUrl("star_burst_big.json");
        window.GameSource["star_burst_big.json"] = this.game.convertToSpriteInfo(config_json);
      }
      cur_stage.assets.star_burst_big = {
        type: "atlas",
        key: "star_burst_big",
        value: "star_burst_big.png",
        json: "star_burst_big.json"
      };
    } catch (e) {
      console.log("star_burst_big not exist!");
    }
  }

  _Create() {
    this.BGWidth = this.width;
    this.totalDistance = (this.midImageNum - 1) * this.BGWidth;
    this.targetTime = ((this.midImageNum - 2) * this.BGWidth + this.width / 3 + this.offsetX) / (this.appearNum * this.scrollSpeed);
    this.obstacleTime = ((this.midImageNum - 2) * this.BGWidth) / (this.obstacleNum * this.scrollSpeed);
    this.targetSpeed = this.scrollSpeed;
    if (this.isTarget) {
      this.distancePos = 0;
    } else {
      this.targetNum = 0;
    }
    this.createAudios();
  }

  createAudios() {
    // 创建音频对象
    this.audioReas = new ReaxAudios(this.game);
    this.flySound = this.game.audio(this.flySoundKey);
    this.ambientSound = this.game.audio(this.ambientMusicKey);
    if (this.isTarget === true) {
      this.crossTargetSound = this.game.audio(this.crossTargetSoundKey);
    }
    if (this.isObstacle === true) {
      this.clashSound = this.game.audio(this.clashSoundKey);
    }
    this.clickSound = this.game.audio(this.clickSoundKey);

    this._bgUrl = Game.requireUrl(this.backgroundSoundKey, "audio");
  }

  getRoundIndex() {
    return this.game.roundIndex ? this.game.roundIndex : 0;
  }

  getStageIndex() {
    return this.game.stageIndex ? this.game.stageIndex : 0;
  }

  getCurrentStage(index) {
    return this.game.Config.stages[index].rounds[this.roundIndex];
  }

  setAssetsKeyWithStage() {
    this.backgroundKey = this.getRoundAssetsKey("backgroundImage");
    this.backgroundSoundKey = this.getAssetsKey("backgroundSound");

    this.flySoundKey = this.getAssetsKey("flySound");
    this.clashSoundKey = this.getAssetsKey("clashSound");
    this.crossTargetSoundKey = this.getAssetsKey("crossTargetSound");
    this.narrationKey = this.getAssetsKey("narration");
    this.ambientMusicKey = this.getAssetsKey("ambientSound");
    this.clickSoundKey = this.getAssetsKey("clickSound");

    this.throughFailKey = this.getAssetsKey("throughFail");
    this.clashObstacleKey = this.getRoundAssetsKey("clashObstacle");
    this.targetUpKey = this.getRoundAssetsKey("targetUp");
    this.targetDownKey = this.getRoundAssetsKey("targetDown");
    this.obstacleKey = this.getRoundAssetsKey("obstacle");
    this.roleKey = this.getRoundAssetsKey("role");
    this.roleJumpKey = this.getRoundAssetsKey("roleJump");
    this.startAnimKey = this.getRoundAssetsKey("startAni");
    this.iconImageKey = this.getRoundAssetsKey("iconImage");
  }

  getAssetsKey(key) {
    console.log(`getAssetsKey key:${key}`);
    const stageKey = `stage-${this.stageIndex}_`;
    let key_key = null;
    if (this.game.assetData[stageKey + key]) {
      key_key = this.game.assetData[stageKey + key].key;
      console.log(`getAssetsKey key:${key}, value:${this.game.assetData[stageKey + key].value}`);
    }
    return key_key;
  }

  getRoundAssetsKey(key) {
    console.log(`getRoundAssetsKey key:${key}`);
    const stageKey = `stage-${this.stageIndex}_rounds-${
      this.roundIndex}_`;
    let key_key = null;
    if (this.game.assetData[stageKey + key]) {
      key_key = this.game.assetData[stageKey + key].key;
      console.log(`getRoundAssetsKey key_key:${key_key}, value:${this.game.assetData[stageKey + key].value}`);
    }

    return key_key;
  }

  restart() {
    // 初始化变量，刷新页面
    this._Init(true);
    const repeat_count = ++this.repeatCount;
    this._StartGame(repeat_count);
  }

  onFocus() {
    // this.setState({visible:"visible"})
  }

  onBlur() {
    // 失去焦点时触发
    // this.setState({visible:"hidden"})
  }

  _InitRoleRef(ref) {
    if (this._RoleRef !== ref && ref !== null) {
      console.log("_InitRoleRef ref:", ref);
      this._RoleRef = ref;
      this.setState({ roleRef: this._RoleRef });
      this._RoleRef.enter();
    }
  }

  _onTargetImpactTracer(target) {
    if (!this._IsPlaying) {
      console.log("_onTargetImpactTracer game over");
      return;
    }
    this.crossTargetSound.play();
    this.audioReas.showPositiveHumm();
    if (this.count < this.targetNum) {
      this.count++;
    }

    // 更新number
    this.setState({ count: this.count });
  }

  _onImpactTracer(obstacle) {
    if (!this._IsPlaying) {
      console.log("_onImpactTracer game over");
      return;
    }

    // 发生碰撞,游戏暂停，并更新角色、进度条的显示状态
    this.clashSound.play();
    this.audioReas.showNegativeHumm();
    this._RoleRef.pause();
    this._BgRef.pause();
    if (this._ObstaclesRef) {
      this._ObstaclesRef.pause();
    }
    if (this._TargetsRef) {
      this._TargetsRef.pause();
    }
    this._ProgreessRef.pause(() => {
      this._Replay(obstacle);
    });
  }

  _Replay(obstacle) {
    // 暂停几秒后，重启动画
    if (this.ObstaclesTimer) {
      clearTimeout(this.ObstaclesTimer);
      this.ObstaclesTimer = null;
    }
    this.ObstaclesTimer = setTimeout(() => {
      if (!this._IsPlaying) {
        console.log("_onImpactTracer game over");
        return;
      }
      this._RoleRef.play();
      this._BgRef.play();
      if (this._ObstaclesRef) {
        this._ObstaclesRef.play();
      }
      if (this._TargetsRef) {
        this._TargetsRef.play();
      }
      this._ProgreessRef.play((obstacle.key) / this.obstacleNum);
    }, this.isFlyingMode ? 2000 : 1500);
  }

  renderBackground(basekey) {
    return (<BackGround key={`${basekey}_BackGround`} ref={(ref) => { this._BgRef = ref; }}
                        style={{ left: 0, top: 0, width: this.width, height: this.height, backgroundImage: `url(${Game.requireUrl(this.backgroundKey, "images")})` }}
                        scrollPageNums={this.midImageNum}
                        scrollSpeed={this.scrollSpeed}
                        distancePos={ this.distancePos}
                        direction="horizontal"/>
    );
  }

  renderObstacle(basekey) {
    if (!this.isObstacle) {
      return null;
    }
    return <Obstacles key={`${basekey}_Obstacles`} roleRef={this._RoleRef}
                               worldWidth={this.width}
                               worldHeight={this.height}
                               direction="horizontal"
                               config={this.currStage.assets.obstacle}
                               obstacleNum={this.obstacleNum}
                               obstacleMinY={this.obstacleMinY}
                               obstacleMaxY={this.obstacleMaxY}
                               isFlyingMode={this.isFlyingMode}
                               obstacleTime={this.obstacleTime}
                               distancePos={ this.distancePos}
                               scrollSpeed={this.obstacleSpeed}
                               ref={(ref) => { this._ObstaclesRef = ref; }}
                               onImpactTracer={this._onImpactTracer}
                      />;
  }

  renderTarget(basekey) {
    if (!this.isTarget) {
      return null;
    }
    return <Targets key={`${basekey}_Targets`} roleRef={this._RoleRef}
                                  worldWidth={this.width}
                                  worldHeight={this.height}
                                  direction="horizontal"
                                  config={this.currStage.assets.targetUp}
                                  appearNum={this.appearNum}
                                  targetMinY={this.targetMinY}
                                  targetMaxY={this.targetMaxY}
                                  targetTime={this.targetTime}
                                  distancePos={ this.distancePos}
                                  scrollSpeed={this.targetSpeed}
                                  ref={(ref) => { this._TargetsRef = ref; }}
                                  onTargetImpactTracer={this._onTargetImpactTracer}
      />;
  }

  renderRole(basekey) {
    return <Role key={`${basekey}_Role`}
                branchName={`${this.props.branchName ? this.props.branchName : ""}/role`} ref={(ref) => { this._InitRoleRef(ref); }}
                worldSize={{ width: this.width, height: this.height }}
                offsetX={this.offsetX}
                clickSound={this.clickSound}
                isFlyingMode={this.isFlyingMode}
                roleUpSpeed = {this.velocityUp}
                roleDownSpeed = { this.garavity}
                isTarget = {this.isTarget}
                onTransitionEnd={this._RoleTranslateEnd}
                rolesList={this.currStage.rolesList}
                clashObstacle={{
                  config: this.currStage.assets.clashObstacle
                }}/>;
  }

  renderProgressBar(basekey) {
    return <ProgressBar key={`${basekey}_ProgressBar`} ref={(ref) => { this._ProgreessRef = ref; }}
                        style={this.Theme.play.ProgressBar}
                        speed={this.Theme.play.ProgressBar.width * this.scrollSpeed / (this.totalDistance)}
                        totalBG={`url(${Game.requireUrl("progress_bar_1.png", "images")})`}
                        progressBG={`url(${Game.requireUrl("progress_bar_2.png", "images")})`}
                        direction="horizontal"
                        onEnd={this._OnProgress}/>;
  }

  renderNumberCount(basekey) {
    if (!this.isTarget) {
      return null;
    }
    return <NumberCount NumberCount key={`${basekey}_NumberCount`}
                        config={{ icon: this.iconImageKey, x: this.iconImageX, y: this.iconImageY }}
                        count={this.state.count} targetNum={this.targetNum}
                        worldWidth={this.width} worldHeight={this.height}
                        counterOffset={this.counterOffset}/>;
  }

  /**
     * 描画部分：背景、角色、障碍物、进度条、背景音乐audio、用于越过的障碍物(透明的border)
     * @return {XML}
     */
  renderContent() {
    const basekey = `Game_${this.state.stageIndex}_${this.state.roundIndex}${this.state.repeatCount}`;
    return (<div key={basekey}>
            {/* 滚动背景 */}
            { this.renderBackground(basekey) }

            {/* 碰撞物 */}
            { this.renderObstacle(basekey) }

            {/* 目标物 */}
            { this.renderTarget(basekey) }

            {/* 角色 */}
            { this.renderRole(basekey) }

            {/* 进度条 */}
            { this.renderProgressBar(basekey) }

            { this.renderNumberCount(basekey) }

            <GameOver key={`${basekey}_GameOver`}
                      result={this.state.gameResult}
                      branchName={`${this.props.branchName ? this.props.branchName : ""}/gameover`}
                      theme={ this.Theme.gameover}/>

            {/* 背景音乐 */}
            <audio key={`${basekey}_audio`} loop="loop" src={this._bgUrl} autoPlay="autoplay"/>
        </div>);
  }

  onKeyDown(ev) {
    super.onKeyDown(ev);
    console.log("GamePlay onKeyDown:", ev.keyCode);
    return false;
  }

  _StartGame(repeat_count) {
    const focus_name = this.props.branchName ? this.props.branchName : "";
    this.changeFocus(`${focus_name}/role`);
    this._IsPlaying = true;
    this.setState({ // 主角入场
      stageIndex: this.stageIndex,
      roundIndex: this.roundIndex,
      repeatCount: repeat_count,
    });
  }

  _StopGame() {
    console.log("_StopGame in");
    this._IsPlaying = false;
    this._BgRef.pause();
    if (this._ObstaclesRef) {
      this._ObstaclesRef.pause();
    }
    if (this._TargetsRef) {
      this._TargetsRef.pause();
    }
    if (this.ObstaclesTimer) {
      clearTimeout(this.ObstaclesTimer);
    }

    if (this._RoleRef) {
      this._RoleRef.exit();
    }
  }

  componentWillUnmount() {
    console.log("GamePlay app componentWillUnmount");
    this._StopGame();
    if (this._AudioRef) {
      this._AudioRef.unload();
      this._AudioRef = null;
    }
  }

  componentDidMount() {
    console.log("GamePlay app componentDidMount");
    this._StartGame(this.repeatCount);
  }
}

export default App;
