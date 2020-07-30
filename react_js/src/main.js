import "core-js/stable";
import "regenerator-runtime/runtime";
import { FdivRoot } from './jsview-utils/jsview-react/index_widget.js'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from "./transitPage/App"

function getHostName() {
	let full_url = window.location.href;
	let idx = full_url.indexOf('://');
	let protocol = (idx > 0 ? full_url.substring(0, idx + 1) : "");
	let host_path = (idx > 1 ? full_url.substring(idx + 3) : "");

	idx = host_path.indexOf('/');
	let host = (idx > 0 ? host_path.substring(0, idx) : "");

	return host;
}

function startApp(confirm_entry) {
	if(!!window.JsView) { // 如果使用JsView
		// (可选配置)按键接受的扩展，例如将静音按键(JAVA键值为164)映射为JS键值20001，PS:注意"164"的引号
		window.JsView.addKeysMap({"keys":{"164":20001},"syncKeys":{}});

		// (可选配置)localStorage支持
		window.JsView.setStorageDomain(getHostName()); // Domain可以为任意字符串，各Domain的localStorage互相隔离
		window.JsView.enableStorageNames("value1", "value2");

		// React相关配置
		window.JsView.React.Render = function() {
			ReactDOM.render(<FdivRoot><App /></FdivRoot>, document.getElementById('root'));
		}
		confirm_entry();
	} else {
		ReactDOM.render(<FdivRoot><App /></FdivRoot>, document.getElementById('root'));
	}
}

export default startApp;

