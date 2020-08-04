/**
 * 领奖界面
 *
 */
import React from 'react'
import rewardBg from '../../images/reward.png'
import bg from '../../images/tips_bg.png'
import { uuid} from '../../common/commonData'
import ConstantVar from '../../common/ConstantVar'
import { FocusBlock } from '../../../demoCommon/BlockDefine'

class Reward extends FocusBlock {
  constructor (props) {
    super(props)
    this.state = {
      visible: 'hidden',
      redeem:'',
      key: '',
      reward: '',
      rewardImgae: ''
    }
  }

  onKeyDown (ev) {
    if (ev.keyCode === ConstantVar.KeyCode.Back || ev.keyCode === ConstantVar.KeyCode.Back2) {
      if (this.props.back) {
        this.props.back()
      }
    }

    return true;
  }

  onFocus () {
    this.setState({visible: 'visible',
      account:this.props.info.account,
      redeem:this.props.info.redeem,
      key: this.props.info.key,
      reward:this.props.info.reward,
      rewardImgae: this.props.info.rewardImgae,
      time:this.props.info.time
    })
  }

  onBlur () {
    this.setState({visible: 'hidden'})
  }

  renderMessage () {
    if (this.state.redeem) {
      return (
        <div style={{width: 796, height: 484, left: 240, top: 116, backgroundImage: bg}}>
          <div style={{width: 784, height: 40, top: 75, lineHeight: 40, textAlign: 'center', fontSize: 40}}>提示</div>
          <div style={{width: 784, height: 50, top: 157, lineHeight: 50, textAlign: 'center', fontSize: 50}}>
            你的奖励正在发放中,
          </div>
          <div style={{width: 784, height: 50, top: 227, lineHeight: 50, textAlign: 'center', fontSize: 50}}>
            请耐心等待。
          </div>
          <div style={{width: 784, height: 30, top: 353, lineHeight: 30, textAlign: 'center', fontSize: 30}}>按【返回】键返回
          </div>
        </div>
      )
    } else {
      let time = this.state.time;//TODO
      return (
        <div style={{width: 706, height: 672, left: 287, top: 24, backgroundImage: rewardBg}}>
          <div style={{
            width: 706,
            height: 32,
            top: 67,
            lineHeight: 32,
            color: '	#ff4e00',
            fontSize: 32,
            textAlign: 'center'
          }}>我的奖品
          </div>
          <div style={{width: 672, height: 38, left: 16, top: 126}}>
            <div style={{fontSize: 20, lineHeight: 38, left: 42, width: 250}}>{'用户：' + this.state.account}</div>
          </div>
          <div style={{width: 672, height: 22, left: 16, top: 164}}>
            <div style={{left: 42, fontSize: 15, lineHeight: 22, width: 672,}}>
              {'设备标识码：' + uuid()}
            </div>
          </div>
          <div style={{width: 672, height: 22, left: 16, top: 188}}>
            <div style={{left: 42, fontSize: 15, lineHeight: 22, width: 672,}}>
              {'您的获奖码为：' + this.state.key}
            </div>
          </div>
          <div style={{width: 350, left: 50, top: 252, height: 62}}>
            <div style={{
              width: 350,
              height: 31,
              top: 0,
              lineHeight: 31,
              fontSize: 30,
              textAlign: 'center',
              color: '#ff4e00'
            }}>恭喜您获得
            </div>
            <div style={{
              width: 350,
              height: 31,
              top: 40,
              lineHeight: 31,
              fontSize: 30,
              textAlign: 'center',
              color: '#ff4e00'
            }}>{this.state.reward}</div>
          </div>
          <div style={{width: 150, height: 150, left: 499, top: 215, backgroundImage: this.state.rewardImgae}}></div>

          <div style={{left: 28, top: 416, width: 672, height: 15}}>
            <div style={{width: 40, height: 15, color: '#FF0000', fontSize: 15, fontWeight: 'bold', lineHeight: 15}}>
              注意:
            </div>
            <div style={{
              left: 40,
              width: 600,
              height: 15,
              fontSize: 15,
              fontWeight: 'bold',
              lineHeight: 15
            }}>{'领奖信息仅在' + time + '18点前有效！'}</div>
          </div>
          <div style={{left: 28, top: 436, width: 672, height: 15}}>
            <div style={{width: 40, height: 15, color: '#FF0000', fontSize: 15, fontWeight: 'bold', lineHeight: 15}}>
              注意:
            </div>
            <div style={{left: 40, width: 600, height: 15, fontSize: 15, fontWeight: 'bold', lineHeight: 15}}>
              领奖信息为领取奖励的唯一凭证，请勿外泄！非因本司导致的信息外泄，本司概不负责。
            </div>
          </div>

          <div style={{width: 500, height: 167, top: 502, left: 0}}>
            <div style={{width: 500, height: 25, left: 28, top: 14, textAlign: 'center', fontSize: 25, lineHeight: 25}}>
              领奖说明
            </div>
            <div style={{width: 472, height: 15, left: 28, top: 46, fontSize: 15, lineHeight: 15}}>1. 将我的奖品界面拍下照片；</div>
            <div style={{width: 472, height: 15, left: 28, top: 81, fontSize: 15, lineHeight: 15}}>2. 扫描右侧二维码关注微信公众号；
            </div>
            <div style={{width: 472, height: 15, left: 28, top: 116, fontSize: 15, lineHeight: 15}}>3.
              在公众号内点击人工客服，发送【领奖】文字与您的奖品信息照片
            </div>
            <div style={{width: 453, height: 15, left: 47, top: 138, fontSize: 15, lineHeight: 15}}>领取奖励。</div>
          </div>
        </div>
      )
    }
  }

  renderContent () {
    if (this.state.visible === 'hidden') {
      return null
    }
    return (
      <div style={{left:(1920-1280)/2,top:(1080-720)/2,width: 1280, height: 720, backgroundColor: 'rgba(0,0,0,0.8)',
        transform: 'scale3d(1.5,1.5,1.0)'}}>
        {this.renderMessage()}
      </div>)
  }

  componentDidMount () {
    console.log('reward')

  }

  componentWillUnmount () {

  }
}

export default Reward
