import React from 'react';
import ReactDOM from 'react-dom';
import { FdivRoot } from "../jsview/utils/JsViewEngineWidget/index_widget"; // 焦点控制系统

// import { App } from './App';
import App from "jsview/samples/transitPage/App"; // 测试主页面

ReactDOM.render(
  <React.StrictMode>
    <FdivRoot>
      <App />
    </FdivRoot>
  </React.StrictMode>,
  document.getElementById("root")
);