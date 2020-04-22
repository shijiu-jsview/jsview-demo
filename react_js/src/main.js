import "core-js/stable";
import "regenerator-runtime/runtime";
import './jsview-utils/jsview-react/index_widget.js'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from "./transitPage/App"

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

