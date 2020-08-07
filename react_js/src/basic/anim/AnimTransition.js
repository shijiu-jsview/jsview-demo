import React from 'react';
import {ContentFont} from '../CommonFontStyle'

class AnimTransition extends React.Component {
  constructor(props) {
    super(props);
    console.log("AnimGroup.constructor().");

    this.state = {
      transform:null,
      transformOrigin:null,
      transformTranslate:null,
      transformRotate:null,
    };
    this._changeState();
    this._Timer = setInterval(() => {
      this._changeState();
    }, 6000)
  }

  _changeState=()=>{
    setTimeout(()=>{
      //状态变更
      this.setState({
        transformScale:'scale3d(0.2,0.2,1.0)',
        transformRotate:'rotate3d(0, 0, 1.0, 360deg)',
        transformTranslate:'translate3d(180px,0px,0)',
        transform: 'translate3d(80px,0px,0) scale3d(2,2,1.0) rotate3d(0.5, 0.5, 1, 360deg)',
        transformOrigin: 'center center'
      })
      //状态变更
      setTimeout(()=>{
        this.setState({
          transformScale:'scale3d(1.2,1.2,1.0)',
          transformRotate:'rotate3d(0, 0, 1.0, -360deg)',
          transformTranslate:'translate3d(-80px,0px,0)',
          transform: 'translate3d(30px,30px,0) scale3d(0.2,0.2,1.0) rotate3d(0.5, 0.5, 1, -360deg)',
          transformOrigin: 'left top'
        })
      }, 3000);
    }, 3000);
  }
  render() {
        const titleStyle = {
            ...ContentFont,
            width: 100,
            height: 20,
            textAlign: 'left',
            lineHeight: '20px'
        };

        const blockStyle = {
            top:20,
            width:50,
            height:50,
            backgroundColor:'rgba(255, 0, 0, 1)'
        };

        return <div id='layout-root' style={this.props.style}>
                <div>
                    <div style={{...titleStyle}}>坐标变化</div>
                    <div style={{...blockStyle,
                        left:this.props.timeCount * 10 % 200,
                        transition: "left 1s linear"}}/>
                </div>
                <div style={{top:70}}>
                    <div style={{...titleStyle}}>坐标和尺寸变化</div>
                    <div style={{...blockStyle,
                        left:this.props.timeCount * 10 % 200,
                        width:this.props.timeCount * 10 % 100 + 10,
                        transition: "left 0.5s linear, width 1s linear 1s"}}/>
                </div>
              <div style={{top:140,width:240,height:160, backgroundColor:"rgba(0, 0, 255, 0.5)"}}>
                <div style={{...titleStyle}}>transform</div>
                <div style={{...blockStyle,
                  top:20,
                  transition:"transform 2.5s linear 0.5s",
                  transform:this.state.transform,
                  transformOrigin: this.state.transformOrigin}}/>
                <div style={{...blockStyle,
                  top:140,
                  transition:"transform 2.5s linear 0.5s",
                  transformOrigin: 'center center',
                  transform:this.state.transformTranslate}}/>
                <div style={{...blockStyle,
                  left:140,
                  top:20,
                  transition:"transform 2.5s linear 0.5s",
                  transformOrigin: 'center center',
                  transform:this.state.transformScale}}/>
                <div style={{...blockStyle,
                  top:75,
                  left:140,
                  transition:"transform 2.5s linear 0.5s",
                  transformOrigin: 'center center',
                  transform:this.state.transformRotate}}/>
              </div>
            </div>
    }
    componentWillUnmount() {
      if (this._Timer >= 0) {
        window.clearInterval(this._Timer);
        this._Timer = -1;
      }
    }
}

export default AnimTransition;
