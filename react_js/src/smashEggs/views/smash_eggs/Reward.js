/**
 * 领奖界面
 *
 */
import React from 'react'
import rewardBg from '../../images/reward.jpeg'
import tips_bg from '../../images/tips_bg.png'
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
        <div style={{width: 874, height: 606, left: (1280-874)/2, top: (720-606)/2, backgroundImage: tips_bg}}>
          <div style={{width: 874, height: 50, top: 20, lineHeight: 50, textAlign: 'center', color:"#ffffff", fontSize: 50}}>提示</div>
          <div style={{width: 874, height: 94, top: 215, lineHeight: 94, textAlign: 'center', color:"#ffffff",  fontSize: 70}}>
            你的奖励正在发放中,
          </div>
          <div style={{width: 874, height: 94, top: 309, lineHeight: 94, textAlign: 'center', color:"#ffffff",  fontSize: 70}}>
            请耐心等待。
          </div>
          <div style={{width: 874, height: 30, top: 562, lineHeight: 30, textAlign: 'center', color:"#ffffff", fontSize: 20}}>按【返回】键返回
          </div>
        </div>
      )
    } else {
      let time = this.state.time;//TODO
      return (
        <div style={{width: 1280, height: 720, left: 0, top: 0, backgroundImage: rewardBg}}>
          <div style={{width: 672, height: 32, left: 698, top: 112}}>
            <div style={{fontSize: 20, lineHeight: 32, width: 250, color:"#ffffff"}}>{'用户：' + this.state.account}</div>
          </div>
          <div style={{width: 672, height: 32, left: 698, top: 112+32}}>
            <div style={{fontSize: 20, lineHeight: 32, width: 672, color:"#ffffff"}}>
              {'设备标识码：' + uuid()}
            </div>
          </div>
          <div style={{width: 672, height: 32, left: 698, top: 112+32+32}}>
            <div style={{fontSize: 20, lineHeight: 32, width: 672, color:"#ffffff"}}>
              {'您的获奖码为：' + this.state.key}
            </div>
          </div>
          <div style={{width: 400, left: 119, top: 720-90, height: 62}}>
            <div style={{
              width: 400,
              height: 90,
              lineHeight: 90,
              fontSize: 30,
              textAlign: 'center',
              color: '#ffffff'
            }}>{this.state.reward}</div>
          </div>
          <div style={{width: 400, height: 400, left: 119, top: 230, borderRadius:40, backgroundImage: this.state.rewardImgae}}></div>

          <div style={{left: 698, top: 580, width: 500, height: 64}}>
            <div style={{left: 0, width: 500, height: 32, fontSize: 20, lineHeight: 32, color:"#ffffff"}}>
              1.领奖信息为领取奖励的唯一凭证，请勿外泄！
            </div>
            <div style={{left: 0, top:32,width: 500, height: 32, fontSize: 20, lineHeight: 32, color:"#ffffff"}}>
              2.非因本司导致的信息外泄，本司概不负责。
            </div>
          </div>

          <div style={{width: 335, height: 167, top: 325, left: 698}}>
            <div style={{width: 335, height: 32, left: 0, top: 0, fontSize: 20, lineHeight: 32, color:"#ffffff"}}>1.将我的奖品界面拍下照片；</div>
            <div style={{width: 335, height: 32, left: 0, top: 32, fontSize: 20, lineHeight: 32, color:"#ffffff"}}>2.扫描右侧二维码关注微信公众号；
            </div>
            <div style={{width: 335, height: 32, left: 0, top: 64, fontSize: 20, lineHeight: 32, color:"#ffffff"}}>3.在公众号内点击人工客服，发送
            </div>
            <div style={{width: 335, height: 28, left: 8, top: 64+28, fontSize: 20, lineHeight: 28, color:"#ffffff"}}>【领奖】文字与您的奖品信息照片
            </div>
            <div style={{width: 335, height: 28, left: 8, top: 64+28+28, fontSize: 20, lineHeight: 28, color:"#ffffff"}}>领取奖励。</div>
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
