
function build_api(name) {
	return (...args)=>{
		if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge[name] == "function") {
			return window.jJsvRuntimeBridge[name](...args);
		}
	}
}

// 显示声明，可以提高执行速度和利用上编辑器的成员名提示功能
let bridge = {
	shutdownApp: build_api("shutdownApp"),
	closeJsView: build_api("closeJsView"),
	notifyPageLoaded: build_api("notifyPageLoaded"),
	getMac: build_api("getMac"),
	getWireMac: build_api("getWireMac"),
	getWifiMac: build_api("getWifiMac"),
	getUUID: build_api("getUUID"),
	getAndroidId: build_api("getAndroidId"),
};


export {
	bridge as jJsvRuntimeBridge
}