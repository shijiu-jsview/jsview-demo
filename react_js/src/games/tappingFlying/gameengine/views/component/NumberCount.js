/**
 * Created by luocf on 2020/5/12.
 */
import React from 'react';
import Game from "../../common/Game";

class NumberCount extends React.Component {
  /**
     * @param config icon Image Config
     */
  constructor(props) {
    super(props);
    console.log("NumberCount constructor");
    this._Config = this.props.config;
    this._CounterOffset = this.props.counterOffset;
    this.width = this.props.worldWidth;
    this.height = this.props.worldHeight;
  }

  render() {
    const target_num = this.props.targetNum;
    const count = this.props.count;
    return (
            <div style={{
              left: 20 + this._CounterOffset.x,
              top: 360 + this._CounterOffset.y,
              width: 162,
              height: 80,
              backgroundImage: `url(${require(`../../../${Game.apppath}/assets/images/number_counter.png`)})`
            }}>
                {
                    <div style={{
                      left: this._Config.x,
                      top: this._Config.y,
                      width: 81,
                      height: 51,
                      backgroundImage: `url(${require(`../../../${Game.apppath}/assets/images/${this._Config.icon}`)})`
                    }}></div>
                }
                <div style={{ left: 33 + 70, top: 2, width: 200, height: 60, lineHeight: 60, fontSize: 30, color: "#ffff00" }}>{`${count}/${target_num}`}</div>
            </div>
    );
  }

  componentDidMount() {

  }
}

export default NumberCount;
