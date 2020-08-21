import "core-js/stable";
import "regenerator-runtime/runtime";
import {loadJsViewProxy,initEntry,confirmEntry} from './jsview-utils/jsview-react/index_hook.js'

initEntry();

// 异步根据端的信息，加载JsView或者Html wrapper框架
loadJsViewProxy(()=>{
	import("./main.js").then((entry)=>{
		console.log("main.js loaded...");
		entry.default(confirmEntry);
		console.log("main.js done...");
	});
}, "/static/js/", {screenWidth:1280, displayScale:1.0});
// 补充说明：
// /static/js/: (可选配置)填写main.js或者bundle.js相对于index.html的相对位置，用于image/import.then的相对寻址
// {screenWidth:1280, displayScale:1.0}: (可选配置)设置屏幕坐标映射值，前者为屏幕画布定义的宽度，后者为清晰度，
//                                     默认值是画布宽度1280px, 清晰度为1.0

console.log("index.js loaded");
