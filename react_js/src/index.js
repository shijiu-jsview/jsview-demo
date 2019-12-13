import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './giftRain/App';   // 红包雨
//import App from './simpleMetroWidget/App'; // 简易版本的MetroWidget样例
//import App from './advanceMetroWidget/App'; // 升级版本的MetroWidget例子(MetroWidget嵌套)

if(!!window.JsView) { // 如果使用JsView
	window.JsView.React.DesignMap = {width:1280, displayRatio:1.0}; // 可选参数，默认值也是1280, 1.0
	window.JsView.React.JsSubPath = "/static/js/"; // 可选参数，填写bundle.js相对于react主地址的相对位置，用于image的相对寻址
	window.JsView.React.Render = function() {
		ReactDOM.render(<App />, document.getElementById('root'));
	}
} else {
	ReactDOM.render(<App />, document.getElementById('root'));
}
