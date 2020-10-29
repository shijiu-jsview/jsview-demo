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
	if(!!window.JsView) {
		// 运行在JsView引擎中

		// 检查配套引擎的版本
		if (window.JsView.CodeRevision !== 539 /* Native引擎版本(由APK启动参数 CORE 决定) */
				|| window.Forge.Version !== "1.0.727" /* JS引擎版本(由APK启动参数 ENGINEJS 决定) */) {
			console.warn("Warning: JsView Engine version miss matched, some effect will be lost");
			/* Engine js 727版本地址: http://cdn.release.qcast.cn/forge_js/master/JsViewES6_react_r727.jsv.21a7f7ce.js */
		}

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

