import initHeaderScriptLoader from "./header_script_loader"

// Forge define
if (typeof window["Forge"] === 'undefined')
	window["Forge"] = {};
var Forge = window["Forge"]

var sForgeReactAppDefine = null;
function loadJsViewProxy(callback, js_sub_path) {
	//if(!!window.JsView) {
		//initHeaderScriptLoader(js_sub_path);
		//import("./jsv_hook_wrapper.js").then((app_define)=>{
			//sForgeReactAppDefine = app_define.ForgeReactApp;
			//window.JsView.ForgeExt = app_define.ForgeExtension;
			//window.JsView.React.JsSubPath = js_sub_path;
			//callback();
		//});
	//} else {
		//import("./forge_html/index.js").then(()=>{
			//import("./browser_hook_wrapper.js").then(()=>{
				callback();
			//});
		//});
	//}
}

// 当confirmEntry和Forge.RunApp都被调用完成后，才会进行ForgeReactApp运行
var sActivityManager = null;
var sEntryConfirmed = false;
var sReactApp = null;

function startApp() {
	if (sActivityManager != null && sEntryConfirmed) {
		console.log("Forge.RunApp().");
		sReactApp = new sForgeReactAppDefine(sActivityManager);
	}
}

function confirmEntry() {
	sEntryConfirmed = true;
	startApp();
}

function initEntry() {
	Forge.RunApp = function (activity_manager) {
		sActivityManager = activity_manager;
		startApp();
	}
}

export {
	loadJsViewProxy,
	initEntry,
	confirmEntry
};
