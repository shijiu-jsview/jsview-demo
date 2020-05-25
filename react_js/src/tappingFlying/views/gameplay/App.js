import React from 'react';
import "./App.css"
import Theme from "./Theme"
import Game from "../../common/Game"
import GameAppBase from "../base/GameAppBase"
import BackGround from "../component/Background";
import Role from "../component/Role"
import Obstacles from "../component/Obstacles"
import ProgressBar from "../component/ProgressBar";
import GameOver from "../component/GameOver"
class App extends GameAppBase {
    constructor(props) {
        super(props);
        this.game = Game;
        this._ObstaclesRef = null;
        this._ProgreessRef = null;
        this._AudioRef = null;
        this._CurObstacle = null;
        this._RoleRef = null;
        this.stageIndex = 0;
        this.roundIndex = 0;
        this.repeatCount = 0;
        this._RoleTranslateEnd = this._RoleTranslateEnd.bind(this);
        this._OnProgress = this._OnProgress.bind(this);
        this._onPassed = this._onPassed.bind(this);
        this._Init();
    }

    _Init() {
        this._IsPlaying = true;
        this.state = {
            clashObstacleVisible:"hidden",
            progress:1,
            repeatCount: this.repeatCount,
            stageIndex:this.stageIndex,
            roundIndex:this.roundIndex,
            roleRef:null,
        }
        this._InitGame();
        this._Create();

    }

    _OnProgress() {
        this._StopGame();
    }

    _RoleTranslateEnd() {
        console.log("_RoleTranslateEnd this._IsPlaying:"+this._IsPlaying)
        if (this._IsPlaying) {
            //主角入场动画结束
            this._ObstaclesRef.play();
            this._BgRef.play();
            this._ProgreessRef.play();
        } else {
            //主角出场动画结束
            if (this.count < this.targetNum) {
                this._ShowGameSuccess('uncomplete');
            } else {
                if (this.game.roundIndex) {
                    this.game.roundIndex += 1;
                } else {
                    this.game.roundIndex = 1;
                }
                console.log(this.game.roundIndex, this.roundsNum);
                if (this.game.roundIndex == this.roundsNum) {
                    this.game.roundIndex = 0;
                    this._ShowGameSuccess('complete');
                } else {
                    this.game.state.restart();
                }
            }
        }
    }

    _ShowGameSuccess(result) {
        if (result == 'complete') {
            //显示完成页面
            let focus_name = this.props.branchName ? this.props.branchName : "";
            this.changeFocus(focus_name + "/gameover")
        } else {
            //显示未完成页面
        }
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
        this.isHit = false;
        this.isObstacleOffset = false;
        this.hitObsNums = 0;
        this.distancePos = 400;
        if (this.game.Config.common.ratio === "4/3") {
            this.width = 960;
            this.height = 640;
        }
        else {
            this.width = 1280;
            this.height = 720;
        }
        this.stageIndex = this.getStageIndex();
        this.roundIndex = this.getRoundIndex();

        this.currStage = this.getCurrentStage(this.stageIndex);
        this.setAssetsKeyWithStage();
        //加载atlas infos
        this._RequireAltasInfo(this.currStage);

        this.roundsNum = this.game.Config.stages[this.stageIndex].roundsNum;
        this.scrollSpeed = this.currStage.game.roleSpeed;
        this.velocityUp = this.currStage.game.roleUpSpeed;
        this.garavity = this.currStage.game.roleDownSpeed;
        this.obstacleSpeed = this.currStage.assets['obstacle'].speed;
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
        this.isFlyingMode = this.currStage.game.isFlyingMode;

        this.isStartAnim = this.currStage.game.isStartAni;
    }

    _RequireAltasInfo(cur_stage) {
        //加载资源包中的json文件，对于jsview来说，将json文件改成全局变量的方式使用。
        for(let o in this.currStage.assets) {
            if (this.currStage.assets[o].detail) {
                console.log("this.currStage.assets["+o+"].detail:"+this.currStage.assets[o].detail);
                require("../../assets/atlas/"+this.currStage.assets[o].detail);
            }
        }
    }

    _Create() {
        this.BGWidth = this.width;
        this.totalDistance = (this.midImageNum - 1) * this.BGWidth;
        this.targetTime = ((this.midImageNum - 2) * this.BGWidth + this.width / 3 + this.offsetX) / (this.appearNum * this.scrollSpeed);
        this.obstacleTime = ((this.midImageNum - 2) * this.BGWidth) / (this.obstacleNum * this.scrollSpeed);
        this.targetSpeed = this.scrollSpeed;
        //this.distancePos = parseInt(this.obstacleTime *  this.obstacleSpeed / 2);
        if (this.isTarget) {
            //this.loadNumberCounter();
        } else {
            this.targetNum = 0;
        }
        this.createAudios();
    }

    createAudios() {
        //创建音频对象
        //jsview同一时间只支持2个audio标签，背景音乐占用一个audio，其他的特效音使用一个audio
        this.flySound = this.game.audio(this.flySoundKey);
        this.ambientSound = this.game.audio(this.ambientMusicKey);
        if (this.isTarget === true) {
            this.crossTargetSound = this.game.audio(this.crossTargetSoundKey);
        }
        if (this.isObstacle === true) {
            this.clashSound = this.game.audio(this.clashSoundKey);
        }
        this.clickSound = this.game.audio(this.clickSoundKey);

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
        console.log("getAssetsKey key:" + key);
        const stageKey = "stage-" + this.stageIndex + "_";
        var key_key = this.game.assetData[stageKey + key].key;
        console.log("getAssetsKey key:" + key + ", value:" + this.game.assetData[stageKey + key].value);

        return key_key;
    }

    getRoundAssetsKey(key) {
        console.log("getRoundAssetsKey key:" + key);
        const stageKey = "stage-" + this.stageIndex + "_rounds-" +
            this.roundIndex + "_";
        var key_key = this.game.assetData[stageKey + key].key
        console.log("getRoundAssetsKey key_key:" + key_key + ", value:" + this.game.assetData[stageKey + key].value);

        return key_key;
    }

    restart() {
        //初始化变量，刷新页面
        this._Init();
        let repeat_count = ++this.repeatCount;
        this._StartGame(repeat_count);
    }

    onFocus() {

    }

    onBlur() {
        //失去焦点时触发
    }

    _InitRoleRef(ref) {
        if(!this._RoleRef && ref != null) {
            this._RoleRef = ref;
            this.setState({roleRef:this._RoleRef});
            this._RoleRef.play();
        }
    }

    _onPassed() {
        let obstaclePassedCount = this.state.obstaclePassedCount+1;
        this.setState({obstaclePassedCount:obstaclePassedCount});
    }

    _onImpactTracer(obstacle) {
        if (!this._IsPlaying) {
            console.log("_onImpactTracer game over");
            return;
        }

        let obstaclePassedCount = this.state.obstaclePassedCount;
        if (this._CurObstacle !== obstacle) {
            this._CurObstacle = obstacle;
            obstaclePassedCount = obstaclePassedCount - 1;
        }

        this.setState({
            obstaclePassedCount: obstaclePassedCount < 0 ? 0 : obstaclePassedCount,
            clashObstacleVisible: "visible"
        });

        //发生碰撞,游戏暂停，并更新角色、进度条的显示状态
        this.clashSound.play();

        this._BgRef.pause();
        this._ObstaclesRef.pause();
        this._ProgreessRef.pause(()=>{
           this._Replay(obstacle);
        });
    }

    _Replay(obstacle) {
        //暂停几秒后，重启动画
        if (this.ObstaclesTimer) {
            clearTimeout(this.ObstaclesTimer);
            this.ObstaclesTimer = null;
        }
        this.ObstaclesTimer = setTimeout(()=>{
            if (!this._IsPlaying) {
                console.log("_onImpactTracer game over");
                return;
            }
            this._BgRef.play();
            this._ObstaclesRef.play();
            this._ProgreessRef.play((obstacle.key)/this.obstacleNum);

            this.setState({clashObstacleVisible:"hidden"});
        }, this.isFlyingMode?2000:1500);
    }

    /**
     * 描画部分：背景、角色、障碍物、进度条、背景音乐audio、用于越过的障碍物(透明的border)
     * @return {XML}
     */
    renderContent() {
        let basekey = "Game_"+this.state.stageIndex+"_"+this.state.roundIndex+this.state.repeatCount;
        console.log("debugjump renderContent ,key:"+(basekey));

        return (<div key={basekey}>
            {/*滚动背景*/}
            <BackGround key={basekey+"_BackGround"} ref={(ref) => {this._BgRef = ref;}}
                        style={{left:0,top:0, width: this.width, height: this.height, backgroundImage: `url(${require("../../assets/images/" + this.backgroundKey)})`}}
                        scrollPageNums={this.midImageNum}
                        scrollSpeed={this.scrollSpeed}
                        distancePos={ this.distancePos}
                        direction="horizontal"/>

            {/*碰撞物*/}
            <Obstacles  key={basekey+"_Obstacles"} roleRef={this._RoleRef}
                       worldWidth={this.width}
                       worldHeight={this.height}
                       direction="horizontal"
                       config={this.currStage.assets["obstacle"]}
                       obstacleNum={this.obstacleNum}
                       obstacleMinY={this.obstacleMinY}
                       obstacleMaxY={this.obstacleMaxY}
                       isflyingmode={this.isFlyingMode}
                       obstacleTime={this.obstacleTime}
                       distancePos={ this.distancePos}
                       ref={(ref)=>{this._ObstaclesRef=ref}}
                       onImpactTracer={(obstacle) => {
                           this._onImpactTracer(obstacle)}}
            />

            {/*角色*/}
            <Role key={basekey+"_Role"}
                  branchName={(this.props.branchName ? this.props.branchName : "")+"/role"} ref={(ref) => {this._InitRoleRef(ref)}}
                  worldSize={{width:this.width,height:this.height}}
                  offsetX={this.offsetX}
                  clickSound={this.clickSound}
                  isFlyingMode={this.isFlyingMode}
                  roleUpSpeed = {this.velocityUp}
                  roleDownSpeed = { this.garavity}
                  onTransitionEnd={this._RoleTranslateEnd}
                  assets={this.currStage.assets}
                  clashObstacle={{
                      style:{visibility:this.state.clashObstacleVisible, left:130, top:20},
                      config: this.currStage.assets["clashObstacle"]
                  }}/>

            {/*进度条*/}
           <ProgressBar key={basekey+"_ProgressBar"} ref={(ref)=>{this._ProgreessRef=ref}}
                        style={{left:(this.width-455)/2, top:(this.height-80),width:455,height:45}}
                        speed={455*this.scrollSpeed/this.totalDistance}
                        totalBG={`url(${require("../../assets/images/progress_bar_1.png")})`}
                        progressBG={`url(${require("../../assets/images/progress_bar_2.png")})`}
                        direction="horizontal"
                        onEnd={this._OnProgress}/>

            <GameOver key={basekey+"_GameOver"}
                      branchName={(this.props.branchName ? this.props.branchName : "") + "/gameover"}
                      theme={Theme.gameover}/>

            {/*背景音乐*/}
            <audio  loop="loop" src={require("../../assets/audio/"+this.backgroundSoundKey)} ref={(ref) => {
                this._AudioRef = ref
                if (this._AudioRef) {
                    this._AudioRef.play();
                }
            }} />
        </div>)
    }

    _StartGame(repeat_count) {
        let focus_name = this.props.branchName ? this.props.branchName : "";
        this.changeFocus(focus_name + "/role")
        this._IsPlaying = true;
        this.setState({//主角入场
            stageIndex:this.stageIndex,
            roundIndex:this.roundIndex,
            repeatCount:repeat_count,
        })

    }

    _StopGame() {
        console.log("_StopGame in");
        this._IsPlaying = false;
        this._BgRef.pause();
        this._ObstaclesRef.pause();
        if (this.ObstaclesTimer) {
            clearTimeout(this.ObstaclesTimer);
            this.ObstaclesTimer = null;
        }

        if (this._RoleRef) {
            this._RoleRef.stop();
            this._RoleRef = null;
        }
    }

    componentWillUnmount() {
        console.log("GamePlay app componentWillUnmount");
        this._StopGame();
        this._AudioRef.unload();
    }

    componentDidMount() {
        console.log("GamePlay app componentDidMount");
        this._StartGame(this.repeatCount);
    }
}

export default App;
