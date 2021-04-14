/*
 * 【界面概述】
 * 用来测试JsvActorMove组件和通过 createImpactAutoFroze + createImpactTracer 组合完成碰撞停止功能的测试界面。
 * 界面操作：
 * 1. 界面分为4个平面，左中右三个托板和一个白粉色底座
 * 2. 左右键为在当前平板上移动
 * 3. OK键进行跳跃，跳跃同时会进行平移，平移的方向在落在左平板和右平板时会反向，当前方向显示在屏幕正上方
 * 4. 当滑块落在底部时会被重置回初始位置
 * 5. 滑块在初始位置时，只按OK键进行跳跃时，会精确的落在左平板右侧，所有设备的落点应该相同(无论设备性能)
 *
 *
 * 【控件介绍】
 * JsvActorMove：一个支持X或Y轴单轴运动的控件
 *      refDefine {Object} 由 React.createRef() 创建，或者传入函数获得实例，同div元素的ref属性
 *                         用于碰撞体设置时用到的element对象
 *      control {Object} 通过 new JsvActorMoveControl() 创建，控件运动的控制器，支持抛物运动和匀速运动
 * createImpactAutoFroze: 一个函数，创建碰撞自动停止管理对象，将多个element进行捆绑，
 *                        可以通过update函数进行更新管理对象
 *
 * 【技巧说明】
 * Q: 如何完成碰撞自停止行为?
 * A: 通过 createImpactAutoFroze 创建管理对象，传入碰撞后要停止的元素的reference。创建的对象作为
 *    createImpactTracer的参数传给碰撞体跟踪器生成函数。
 *    碰撞停止方式分为两类，一类为停止在碰撞发生前一帧，另一类为停止在碰撞发生的当前帧。
 *    【重要】：碰撞自停止功能，目前只对JsvActorMove的reference做了支持，其他元素不支持
 *
 * Q: 如何防止碰撞穿模？
 * A: createImpactAutoFroze时，选用停止放生在碰撞的前一帧的模式，然后收到碰撞回调后，根据坐标信息，
 *    再将碰撞体调整到碰撞的精确位置。
 *
 * Q: 如何设置抛物运动？
 * A: 创建两个JsvActorMove组件，一个管水平匀速运动，一个管竖直运动，竖直运动的控制器使用如下接口：
 *    throwAlongY(
 *          初速度[单位: 每秒运动x个点],
 *          加速度[与初速度反向],
 *          {type:"catch", position: 相对于起点的底座位置, direction: -1}, // 结束方式:采用接住从上方来的物体的方式
 *          动画结束后的回调函数,
 *          动画到拐点的回调函数)
 *    初速度和加速中，通过正负号来描述方向，方向与屏幕坐标系相同，向上为负，想下为正
 */

import React from "react";
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import { JsvActorMoveControl, JsvActorMove } from "../../utils/JsViewReactWidget/JsvActorMove";
import CssStyles from "./Styles";
import './Animation.css';
import KeyMap from "../../utils/JsViewReactTools/DefaultKeyMap";
import {
  createImpactTracer,
  createImpactCallback,
  createImpactAutoFroze
} from "../../utils/JsViewReactTools/JsvImpactTracer";

const CONST_BOARD_LEFT = 0;
const CONST_BOARD_RIGHT = 1;
const CONST_BOARD_MID = 2;

const CONST_BOX_WIDTH = 30;
const CONST_BOX_HEIGHT = 30;

class MainScene extends FocusBlock {
  constructor(props) {
    super(props);

    this._HorizontalControl = new JsvActorMoveControl(); // 水平运动控制器
    this._VerticalControl = new JsvActorMoveControl(); // 垂直抛物控制器

    this._ImpactBoxLeft = React.createRef();
    this._ImpactBoxMid = React.createRef();
    this._ImpactBoxRight = React.createRef();

    this._ActorVertical = React.createRef();
    this._ActorHorizontal = React.createRef();
    this._Actor = React.createRef();

    this._ViewsAutoFroze = null;
    this._SensorList = [];

    this._OnBoard = CONST_BOARD_LEFT;
    this._KeyPressed = false;
    this._ActorState = {
      jumping: false,
      hMoving: false,
    };

    this.state = {
      showPrecisionGuild: true,
      direction: 1, // -1:向左运动, 1: 向右运动
      bodyState: 0, // 0:静止, 1:跳起, 2:落下
    };
  }

  onKeyDown(ev) {
    if (ev.keyCode === KeyMap.Back || ev.keyCode === 27) {
      if (this._NavigateHome) {
        this._NavigateHome();
      }
    }

    if (this._ActorState.jumping) {
      // 跳跃中，键盘锁定
      return true;
    }

    if (this._KeyPressed) {
      // KeyPress控制按键连点
      return true;
    }

    // 控制按键按下时，键盘锁定
    this._KeyPressed = true;

    // 滑块位置可能发生变更，所以消除动画精度测试的描素文字
    if (this.state.showPrecisionGuild) {
      this.setState({ showPrecisionGuild: false });
    }

    if (ev.keyCode === KeyMap.Ok) {
      // 滑块跳跃(纵向和横向的配置值都是计算过的，为了进行第一跳的精度测试)
      this._ActorState.jumping = true;
      // 垂直方向抛物运动
      this.setState({ bodyState: 1 });
      this._VerticalControl.throwAlongY(
        -1000,
        2450,
        { type: "catch", position: 100, direction: 1 },
        () => { this._onLanding(); }, // 未碰撞落地时，对滑块位置进行重置
        () => { this.setState({ bodyState: 2 }); } // 调整成落下状态
      );
      // 水平方向，按照direction的值，移动到屏幕两端
      if (this.state.direction > 0) {
        this._HorizontalControl.moveToX(1200 - CONST_BOX_WIDTH, 400, null);
      } else {
        this._HorizontalControl.moveToX(0, 400, null);
      }
    } else if (ev.keyCode === KeyMap.Left) {
      // 滑块向左移动
      this._ActorState.hMoving = true;
      // 分三个区域设定移动范围
      let target_x = 0;
      if (this._OnBoard === CONST_BOARD_LEFT) {
        target_x = 0;
      } else if (this._OnBoard === CONST_BOARD_MID) {
        target_x = 500;
      } else if (this._OnBoard === CONST_BOARD_RIGHT) {
        target_x = 800;
      }
      this._HorizontalControl.moveToX(target_x, 300, null);
    } else if (ev.keyCode === KeyMap.Right) {
      // 滑块向右移动
      this._ActorState.hMoving = true;
      // 分三个区域设定移动范围
      let target_x = 0;
      if (this._OnBoard === CONST_BOARD_LEFT) {
        target_x = 396 - CONST_BOX_WIDTH;
      } else if (this._OnBoard === CONST_BOARD_MID) {
        target_x = 699 - CONST_BOX_WIDTH;
      } else if (this._OnBoard === CONST_BOARD_RIGHT) {
        target_x = 1199 - CONST_BOX_WIDTH;
      }
      this._HorizontalControl.moveToX(target_x, 350, null);
    }

    return true;
  }

  onKeyUp() {
    this._KeyPressed = false;

    if (this._ActorState.hMoving) {
      // 停止用户通过左右键发起的水平移动
      this._HorizontalControl.pause(null);
      this._ActorState.hMoving = false;
    }
  }

  renderContent() {
    return (
      <>
                <div key="bg" style={{ width: 1280, height: 720, backgroundColor: "#000000" }}/>
            {!window.JsView ? <div style={{ textAlign: "center",
              fontSize: "30px",
              lineHeight: "50px",
              color: "#ffffff",
              left: 100,
              top: 20,
              width: (1280 - 200),
              height: 50,
              backgroundColor: "rgba(27,38,151,0.8)"
            }}>{`JsView环境下不会穿透模型`}</div> : null}
                <React.Fragment>
                    <div key="bottomWall" style={{ top: 620, left: 40, width: 1200, height: 5, backgroundColor: "#F0FFF0" }}/>

                    <div key="leftFloor" style={{ top: 520, left: 40, width: 397, height: 5, backgroundColor: "#F0F000" }}/>
                    {/* 碰撞体的高度要比每帧移动距离大，因为碰撞判断是每帧内进行判断，并不连续，距离太小可能穿模 */}
                    <div key="leftFloorImp" ref={this._ImpactBoxLeft}
                         style={{ top: 520, left: 40, width: 397, height: 15, backgroundColor: "rgba(255,255,255,0.2)" }}/>

                    <div key="midFloor" style={{ top: 320, left: 540, width: 200, height: 5, backgroundColor: "#F0F000" }}/>
                    <div key="midFloorImp" ref={this._ImpactBoxMid}
                         style={{ top: 320, left: 540, width: 200, height: 15, backgroundColor: "rgba(0,0,0,0)" }}/>

                    <div key="rightFloor" style={{ top: 520, left: 840, width: 400, height: 5, backgroundColor: "#F0F000" }}/>
                    <div key="rightFloorImp" ref={this._ImpactBoxRight}
                         style={{ top: 520, left: 820, width: 400, height: 15, backgroundColor: "rgba(0,0,0,0)" }}/>

                    {(() => {
                      if (this.state.showPrecisionGuild) {
                        return (
                                <div key="PrecisionGuideText" className={CssStyles.FontStyle.getName()}
                                      style={{ top: 528, left: 40, width: 405, height: 40 }}>
                                    {"JSV下,立刻起跳会精确到边缘"}
                                </div>
                        );
                      }
                    })()}

                    <div key="GuideText1" className={CssStyles.FontStyle.getName()}
                         style={{ top: 625, left: 370, width: 540, height: 40 }}>
                        左右键调整跳跃起点，按OK键进行跳跃
                    </div>
                    <div key="DirectText" className={CssStyles.FontStyle.getName()}
                         style={{ top: 150, left: 425, width: 430, height: 40 }}>
                        {`当前方向:${this.state.direction > 0 ? "->" : "<-"}`}
                    </div>
                </React.Fragment>
                <div key="actor" style={{ top: 520 - CONST_BOX_HEIGHT - 2, left: 40 }}>
                    <JsvActorMove key="horizontal" refDefine={this._ActorHorizontal} control={this._HorizontalControl}>
                        <JsvActorMove key="vertical" refDefine={this._ActorVertical} control={this._VerticalControl}>
                            <div ref={this._Actor} style={{
                              backgroundColor: (() => {
                                switch (this.state.bodyState) {
                                  case 0: // 静止
                                    return "#FF00FF";
                                  case 1: // 跳起
                                    return "#FFFF00";
                                  case 2: // 落下
                                    return "#00FFFF";
                                  default:
                                    break;
                                }
                              })(),
                              width: CONST_BOX_WIDTH,
                              height: CONST_BOX_HEIGHT }}></div>
                        </JsvActorMove>
                    </JsvActorMove>
                </div>

                {/* 一个无限动画元素，来测试卡顿 */}
                <div style={{ top: 100,
                  left: 50,
                  height: 150,
                  width: 150,
                  backgroundColor: "#334455",
                  animation: 'ImpactStopAnimRotate 1s infinite linear' }}/>
      </>
    );
  }

  componentDidMount() {
    /* 关联碰撞体处理要在didMount中进行 */

    /* 将碰撞发生后要停止动画的元素打包 */
    this._ViewsAutoFroze = createImpactAutoFroze(
      [this._ActorVertical.current, this._ActorHorizontal.current],
      null
    ); // 此句柄最好保留，未来可以通过此句柄统一进行views list更新

    /* 构建左边碰撞区 */
    this._SensorList.push(
      createImpactTracer(
        this._Actor.current,
        this._ImpactBoxLeft.current,
        createImpactCallback(() => { this._onImpact(CONST_BOARD_LEFT); }, null),
        this._ViewsAutoFroze)
    );

    /* 构建中间碰撞区 */
    this._SensorList.push(
      createImpactTracer(
        this._Actor.current,
        this._ImpactBoxMid.current,
        createImpactCallback(() => { this._onImpact(CONST_BOARD_MID); }, null),
        this._ViewsAutoFroze)
    );

    /* 构建右边碰撞区 */
    this._SensorList.push(
      createImpactTracer(
        this._Actor.current,
        this._ImpactBoxRight.current,
        createImpactCallback(() => { this._onImpact(CONST_BOARD_RIGHT); }, null),
        this._ViewsAutoFroze)
    );

    this._reset();
  }

  componentWillUnmount() {
    /* 重要! 退出后应该释放所有碰撞监听者 */
    for (const sensor of this._SensorList) {
      sensor.Recycle();
    }
  }

  _onImpact(impact_type) {
    // 根据碰撞层来调整滑块的状态(接触板信息)
    console.log(`On impacted type=${impact_type}`);
    this.setState({ bodyState: 0 });
    this._OnBoard = impact_type;
    switch (impact_type) {
      case CONST_BOARD_MID:
        this._VerticalControl.jumpTo(0, -200); // jumpTo处理微小穿模的复位，-200为中间层和起始位置的高度差
        this._HorizontalControl.pause();
        break;
      case CONST_BOARD_LEFT:
        this._VerticalControl.jumpTo(0, 0);
        this._HorizontalControl.pause();
        this.setState({ direction: 1 });
        break;
      case CONST_BOARD_RIGHT:
        this._VerticalControl.jumpTo(0, 0);
        this._HorizontalControl.pause();
        this.setState({ direction: -1 }); // 反向
        break;
      default:
        break;
    }
    this._ActorState.jumping = false;
  }

  _onLanding() {
    // 滑块未与左中右任何一个板发生碰撞，落在了地板的时候
    console.log("On landing");
    this.setState({ bodyState: 0 });
    this._ActorState.jumping = false;
    this._reset();
  }

  _reset() {
    console.log("On reset");
    // 将两个运动都停止后再进行jumpTo，以保证两个jumpTo动作在同一帧完成
    this._VerticalControl.pause(() => {
      this._HorizontalControl.pause(() => {
        this._VerticalControl.jumpTo(0, 0);
        this._HorizontalControl.jumpTo(0, 0);
        this._OnBoard = CONST_BOARD_LEFT;
        this.setState({
          showPrecisionGuild: true,
          direction: 1,
        });
      });
    });
  }
}
const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
