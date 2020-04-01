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
}, "/static/js/");
// 补充说明： /static/js/: (可选配置)填写main.js或者bundle.js相对于index.html的相对位置，用于image/import.then的相对寻址

console.log("index.js loaded");
