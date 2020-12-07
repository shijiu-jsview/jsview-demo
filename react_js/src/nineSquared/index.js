import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

if (window.JsView) { // 如果使用JsView
  window.JsView.React.DesignMap = { width: 1920, displayRatio: 1.0 }; // 可选参数，默认值也是1280, 1.0
  window.JsView.React.Render = function() {
    ReactDOM.render(<App />, document.getElementById('root'));
  };
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}
