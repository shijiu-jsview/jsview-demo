import React from 'react'
import createStandaloneApp from '../demoCommon/StandaloneApp'
import { FocusBlock } from '../demoCommon/BlockDefine'
import Scroller from './scroller'
class MainScene extends FocusBlock {
  constructor (props) {
    super(props)

  }

  onKeyDown (ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      if (this._NavigateHome) {
        this._NavigateHome()
      }
      return true
    }
    return false
  }

  _initNormalScrollerRef = (ref) => {
     this._NormalScrollerRef = ref;
  }

  _initTimeScrollerRef = (ref) => {
    this._TimeScrollerRef = ref;
  }

  componentDidMount () {

  }

  renderContent () {
    return <div>
      <div style={{left: 200, top: 200}}>
        <Scroller
          ref={this._initNormalScrollerRef}
          direction={Scroller.DIRECTION.UP}
          interval={1000}
          width={400}
          amount={50}
          separatorType={Scroller.SEPARATOR.THOUSAND}
          separator={''}
          style={{backgroundColor: '#00ff00', color: '#ff0000'}}/>
      </div>
      {/*<div style={{left: 200, top: 400}}>
        <Scroller
          ref={this._initTimeScrollerRef}
          direction={Scroller.DIRECTION.DOWN}
          width={200}
          amount={40}
          interval={600}
          separatorType={Scroller.SEPARATOR.TIME}
          separator={':'}
          style={{backgroundColor: '#00ff00', color: '#ff0000'}}/>
      </div>*/}
    </div>
  }
}
let App = createStandaloneApp(MainScene)
export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
}
