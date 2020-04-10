import "core-js/stable";
import "regenerator-runtime/runtime";
import './jsview-utils/jsview-react/index_widget.js'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './basic/App'
// import App from './giftRain/App';   // 红包雨，带音效和背景音乐
// import App from './simpleMetroWidget/App'; // 简易版本的SimpleWidget样例
// import App from './advanceMetroWidget/App'; // 升级版本的SimpleWidget例子(MetroWidget嵌套)
// import App from './videoDemo/App'; // 视频播放控制demo
// import App from './tabWidgetSample/App'; // 多TAB主页场景Demo
// import App from './turntableDemo/App'; // 轮盘游戏demo
// import App from './showcaseDemo/App'; // 橱窗界面Demo(SimpleWidget的一个使用场景)
// import App from './flowMultiWidget/App' //界面切换demo
// import App from './InputDemo/App'
// import App from './ninePatchDemo/App'
// import App from './routerDemo/App'
import App from './spriteImage/App'

function startApp(confirm_entry) {
	if(!!window.JsView) { // 如果使用JsView
		// (可选配置)按键接受的扩展，例如将静音按键(JAVA键值为164)映射为JS键值20001，PS:注意"164"的引号
		window.JsView.addKeysMap({"keys":{"164":20001},"syncKeys":{}});

		// (可选配置)localStorage支持
		window.JsView.enableStorageNames("value1", "value2");

		// React相关配置
		window.JsView.React.DesignMap = {width:1280, displayScale:1.0}; // (可选配置)设置View坐标映射值，默认值也是1280, 1.0
		window.JsView.React.Render = function() {
			ReactDOM.render(<App />, document.getElementById('root'));
		}
		confirm_entry();
	} else {
		ReactDOM.render(<App />, document.getElementById('root'));
	}
}

export default startApp;

