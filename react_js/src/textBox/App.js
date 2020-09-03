import React from 'react'
import createStandaloneApp from '../demoCommon/StandaloneApp'
import { FocusBlock } from '../demoCommon/BlockDefine'
import JsvTextBox from '../jsview-utils/JsViewReactWidget/JsvTextBox'
/*
 * 【界面概述】
 * 展示文字垂直对齐方式显示控件的用法
 *
 * 【控件介绍】
 * JsvTextBox：文字的垂直对齐方式显示控件
 *                  verticalAlign {string}  垂直对齐方式 (必需) top、middle、bottom
 *                  style {object}  文字显示样式 (必需){left:0, top:0, width:xxx, height:xxx, fontSize:xxx, lineHeight:xxx,textAlign:xxxx, color:xxx}
 *
 * 【技巧说明】
 * Q: 如何实现文字居中对齐方式显示?
 * A: verticalAlign属性设置为middle
 *
 */
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
