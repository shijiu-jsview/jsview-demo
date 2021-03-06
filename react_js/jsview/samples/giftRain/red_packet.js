/**
 * Created by luocf on 2019/12/3.
 */
import React, { Component } from 'react';
import { createImpactTracer, createImpactCallback } from '../../utils/JsViewReactTools/JsvImpactTracer';
import { JsvActorMove, JsvActorMoveControl } from "../../utils/JsViewReactWidget/JsvActorMove";

class SpriteTranslate extends Component {
  constructor(props) {
    super(props);
    const control = new JsvActorMoveControl();
    this._Control = control;
  }

  _onDestroy=() => {
    if (this.props.onDestory) {
      this.props.onDestory(this.props.item.key);
    }
  }

  _InitItemEle(item, ele) {
    if (ele && !item.ele) {
      item.ele = ele;
      if (this.props.MoneyBag) {
        const giftrain_sensor = createImpactTracer(this.props.MoneyBag, ele, createImpactCallback(
          () => {
            this.props.onImpactTracer(item);//
            this._onDestroy();
          },
          () => {

          })
        );
        item.sensor = giftrain_sensor;
      }
    }
  }

  render () {
    const item = this.props.item;
    return (
            <div>
                <JsvActorMove key={`translate${item.key}`}
                                                        style={{ left: item.left, top: item.top, width: item.width, height: item.height }}
                                                        control={this._Control}>
                    <div key={`bg${item.key}`} ref={ele => this._InitItemEle(item, ele)}
                             style={{
                               backgroundImage: `url(${item.src})`, left: 0, top: 0, width: item.width, height: item.height,
                             }}/>
                </JsvActorMove>
            </div>
    );
  }

  componentDidMount() {
    this._Control.moveToY(720, 720 / this.props.item.duration, ()=>{
      this._onDestroy();
    });
  }

  componentWillUnmount() {

  }
}
class RedPacket extends Component {
  constructor(props) {
    super(props);
    this._Index = 0;
    // 随机生成列表
    this._RedImage = 'http://oss.image.qcast.cn/demo_images/red_packet_rain/red.png';
    this._BigRedImage = 'http://oss.image.qcast.cn/demo_images/red_packet_rain/bigred.png';
    this._BoomImage = 'http://oss.image.qcast.cn/demo_images/red_packet_rain/boom.png';
    this._ScoreBg = "http://oss.image.qcast.cn/demo_images/red_packet_rain/score_bg.png";
    this.state = { itemList: [], timer: 60, score: 0 };
    this.onImpactTracer = props.onImpactTracer;
    this.addRandomItemList();
    this._TimerOutId = null;
    this._GameTimerID = null;
    this._IsRunning = false;
    this._Count = 0;
  }

  componentDidMount() {
    this.startGame();
    this.startTimer();
  }

  componentWillUnmount() {
    console.log("RedPacket componentWillUnmount in");
    if (this._GameTimerID !== null) {
      clearInterval(this._GameTimerID);
      this._GameTimerID = null;
    }

    if (this._TimerOutId !== null) {
      clearInterval(this._TimerOutId);
      this._TimerOutId = null;
    }

    this.stopGame();
  }

  addRandomItemList() {
    const total_num = 1;
    let ret_obj = "";
    for (let i = 0; i < total_num; i++) {
      const random_index = Math.floor(Math.random() * 3);
      const duration = 2 + Math.floor(Math.random() * 2);
      const index = ++this._Index;
      const left = 300 + Math.floor(Math.random() * (1280 - 500));
      const top = -20;

      switch (random_index) {
        case 0:
          ret_obj = { key: index.toString(), type: 0, src: this._RedImage, left, top, width: 87, height: 118, duration,
          };
          break;
        case 1:
          ret_obj = { key: index.toString(), type: 1, src: this._BigRedImage, left, top, width: 210, height: 114, duration,
          };
          break;
        case 2:
          ret_obj = { key: index.toString(), type: 2, src: this._BoomImage, left, top, width: 100, height: 116, duration
          };
          break;
        default:
          break;
      }

      console.log("initRandomItemList ret_obj:", ret_obj);
      this.state.itemList.push(ret_obj);
    }
  }

  startTimer() {
    this._TimerOutId = setInterval(() => {
      const timer = this.state.timer - 1;
      this.setState({
        timer
      });

      if (timer === 0) {
        this.stopGame();
        this.setState({ itemList: [] });
      }
    }, 1000);
  }

  startGame() {
    console.log("startGame ");

    this._IsRunning = true;
    this._Refresh();
  }

  stopGame() {
    console.log("stopGame ");
    this._IsRunning = false;
    if (this._TimerOutId !== null) {
      clearInterval(this._TimerOutId);
      this._TimerOutId = null;
    }
    if (this._onRainDown) {
      this._onRainDown(null);
    }
  }

    _RemoveItem=(key) => {
      const itemList = this.state.itemList;
      console.log("_RemoveItem in itemList.length:", itemList.length);
      for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].key === key) {
          const item = itemList[i];
          if (item.sensor) {
            item.sensor.Recycle();
          }
          console.log("_RemoveItem key:", itemList[i].key);
          itemList.splice(i, 1);
          break;
        }
      }
      console.log("_RemoveItem out itemList.length:", itemList.length);
      this.setState({ itemList });
    }

    _Refresh() {
      if (this._IsRunning === false) {
        return;
      }
      const delay = 500;// Math.floor(Math.random()*600);
      this._GameTimerID = setTimeout(() => {
        if (this._IsRunning === true) {
          this.addRandomItemList();
          const itemList = this.state.itemList;
          this.setState({
            itemList
          });
          this._Refresh();
        }
      }, delay);
    }

    render() {
      const itemList = this.state.itemList;
      console.log("render itemList.length:", itemList.length);

      return (
            <div>
                <div key="timer" style={{ width: 140,
                  height: 140,
                  backgroundImage: `url(${this._ScoreBg})`,
                  top: 40,
                  left: 40,
                  textAlign: "center",
                  lineHeight: '140px',
                  color: "rgba(255,0,0,1.0)",
                  fontSize: 72 }}>{this.state.timer}</div>
                {
                    itemList.map((item) => {
                      console.log("render item:", item.key);
                      return (
                            <SpriteTranslate MoneyBag={this.props.MoneyBag} onImpactTracer={this.onImpactTracer}
                                                             onDestory={this._RemoveItem} key={`spritetranslate${item.key}`} item={item}/>
                      );
                    })
                }
            </div>
      );
    }
}

export default RedPacket;
