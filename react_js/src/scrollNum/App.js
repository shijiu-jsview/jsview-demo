import React from 'react';
import createStandaloneApp from '../demoCommon/StandaloneApp';
import { FocusBlock } from '../demoCommon/BlockDefine';
import JsvScrollNum from '../jsview-utils/JsViewReactWidget/JsvScrollNum';

class MainScene extends FocusBlock {
  constructor (props) {
    super(props);
    this._UpdateTimer = null;
  }

  onKeyDown (ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      if (this._NavigateHome) {
        this._NavigateHome();
      }
      return true;
    }
    return false;
  }

    _initNormalScrollerRef = (ref) => {
      this._NormalScrollerRef = ref;
    }

    componentWillUnmount () {
      if (this._UpdateTimer) {
        clearInterval(this._UpdateTimer);
        this._UpdateTimer = null;
      }
    }

    componentDidMount () {
      if (this._NormalScrollerRef) {
        let num = 10000;
        this._NormalScrollerRef.start(num);
        this._UpdateTimer = setInterval(() => {
          if (num < 1000000) {
            num += 456;
            this._NormalScrollerRef.scrollTo(num);
          }
        }, 2000);
      }
    }

    renderContent () {
      return <div>
            <div style={{ left: 200, top: 200, width: 200, height: 50, backgroundColor: 'rgba(255,255,255,0.5)' }}>
                <JsvScrollNum
                    ref={this._initNormalScrollerRef}
                    value={0}
                    interval={1000}
                    itemWidth={30}
                    height={50}
                    separatorType={JsvScrollNum.SEPARATOR.NONE}
                    separator={''}/>
            </div>
        </div>;
    }
}
const App = createStandaloneApp(MainScene);
export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
