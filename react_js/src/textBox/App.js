import React from 'react'
import createStandaloneApp from '../demoCommon/StandaloneApp'
import { FocusBlock } from '../demoCommon/BlockDefine'
import JsvTextBox from '../jsview-utils/JsViewReactWidget/JsvTextBox'
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

	componentWillUnmount () {

	}

	componentDidMount () {

	}

	renderContent () {
		const text =
			`静夜思 --唐李白
床前明月光，疑是地上霜；
举头望明月，低头思故乡。`
		return <JsvTextBox verticalAlign="middle"
						   style={{
							   left: 0, top: 0, width: 500, height: 600,
							   position:'static',
							   backgroundColor: 'rgba(255,255,0,0.5)',
							   fontSize: 30,
							   textAlign: 'center',
							   lineHeight: '40px'
						   }}>
			{text}
		</JsvTextBox>
	}
}
let App = createStandaloneApp(MainScene)
export {
	App, // 独立运行时的入口
	MainScene as SubApp, // 作为导航页的子入口时
}
