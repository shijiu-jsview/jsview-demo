let direct_call_map = {};
function direct_call(name, ...args) {
    if (direct_call_map.hasOwnProperty(name)) {
        let func = direct_call_map[name];
        if (func) {
            return func(...args);
        }
    } else {
        let func = null;
        if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge[name] === "function") {
            func = window.jJsvRuntimeBridge[name];
        } else if (window.jContentShellJBridge && typeof window.jContentShellJBridge[name] === "function") {
            func = window.jContentShellJBridge[name];
        }
        direct_call_map[name] = func;
        if (func) {
            return func(...args);
        }
    }

    return null;
}

/**
 * 在新的activity打开另外一个小程序
 * @param {string} url 小程序url
 * @param {string} startup_image 启动图url
 * @param {string} startup_video 启动视频url
 * @param {int} startup_duration 启动图时长，默认0
 * @param {int} add_history 是否添加历史，0不添加，1添加
 * 
 */
 function startUrlInNewTab(url, startup_image, startup_video, startup_duration, add_history){
    let setting = {};
    if(startup_image != null && startup_image !== "")
      setting.startupImage = startup_image;

    if(startup_video != null && startup_video !== "")
      setting.startupVideo = startup_video;

    setting.startupDuration = startup_duration;

    setting.addHistory = add_history;

    direct_call("startUrlInNewTab", url, JSON.stringify(setting));
}
/**
 * 退出小程序，同closePage
 *
 */
function backToHomepage(){
    direct_call("backToHomepage");
}

/**
 * 获取小程序之家渠道号
 * @returns {string} 渠道号
 *
 */
function getAppVendor () {
    let vendor = "100";
    let json_str = getAppInfo();
    if(json_str != null && json_str !== ""){
        let json_obj = JSON.parse(json_str);
        vendor = json_obj.Vendor;
    }

    return vendor;
}

/**
 * 获取网速
 * @returns {string} 网速，单位KBps
 *
 */
function getNetSpeedValue() {
    return direct_call("getNetSpeedValue");
}

/**
 * 获取小程序之家apk信息
 * @returns {string} APK信息，JSON数据结构
 *
 */
function getAppInfo() {
    return direct_call("getAppInfo");
}

/**
 * 获取小程序之家apk名称
 * @returns {string} APK名称
 *
 */
function getAppName() {
    return direct_call("getAppName");
}

/**
 * 是否测试模式
 * @returns {int} 1:测试模式，0:非测试模式
 *
 */
function isAppStoreTestMode(){
    let mode = direct_call("isAppStoreTestMode");
    if(mode != null)
        return mode;

    return 0;
}

/**
 * 是否触屏模式
 * @returns {int} 1:触屏模式，0:非触屏模式
 *
 */
function isInTouchMode(){
    let mode = direct_call("isInTouchMode");
    if(mode != null)
        return mode;

    return 0;
}

/**
 * 获取当前小程序AppName，类似于apk包名，唯一标识
 * @returns {string} 小程序App Name
 *
 */
function getTvMiniAppName() {
    return direct_call("getTvMiniAppName");
}

/**
 * 获取当前小程序名称
 * @returns {string} 小程序名称
 *
 */
function getTvMiniAppTitle() {
    return direct_call("getTvMiniAppTitle");
}

/**
 * 获取当前小程序版本号
 * @returns {string} 小程序版本号
 *
 */
function getTvMiniAppVersion() {
    return direct_call("getTvMiniAppVersion");
}

/**
 * 注册启动图或者启动视频拿掉后的通知接口
 * @param {function} 回调函数
 *
 */
function registerStartupImageRemoved(callback){
    if(!!window.JsView)
        window.JsView.addEventListener("MiniAppPageLoad", callback);
}

/**
 * 注销启动图或者启动视频拿掉后的通知接口
 * @param {function} 回调函数
 *
 */
 function unregisterStartupImageRemoved(callback){
    if(!!window.JsView)
        window.JsView.removeEventListener("MiniAppPageLoad", callback);
}


/**
 * 注册消息通知接口
 * @param {function} 回调函数
 *
 */
 function registerMessage(callback){
    if(!!window.JsView)
        window.JsView.addEventListener("MiniAppMessage", callback);
}

/**
 * 注销消息通知接口
 * @param {function} 回调函数
 *
 */
 function unregisterMessage(callback){
    if(!!window.JsView)
        window.JsView.removeEventListener("MiniAppMessage", callback);
}

/**
 * 获取缓存索引，用于同一个Activity下多个小程序之间的通信，当前小程序启动另外一个小程序时，
 * 可以把这个缓存索引通过url参数带个被启动的小程序，被启动小程序运行时，可以往这个buffer里
 * 写入内容，待当前小程序回到前台后，读取buffer里的内容，来确定被启动小程序的行为。
 * @returns {int} 缓存索引
 * 
 */
 function getBufferIndex(){
    return direct_call("getBufferIndex");
}

/**
 * 读取缓存内容
 * @param {int} index 缓存索引
 * @returns {string} 缓存内容
 * 
 */
function getBuffer(index){
    return direct_call("getBuffer", index);
}

/**
 * 写入缓存内容
 * @param {int} index 缓存索引
 * @param {string} buffer 缓存内容
 * 
 */
function setBuffer(index, buffer){
    direct_call("setBuffer", index, buffer);
}

// 显示声明，可以提高执行速度和利用上编辑器的成员名提示功能
const bridge = {
    startUrlInNewTab,
    backToHomepage,
    getAppVendor,
    getNetSpeedValue,
    getAppInfo,
    getAppName,
    isAppStoreTestMode,
    isInTouchMode,
    getTvMiniAppName,
    getTvMiniAppTitle,
    getTvMiniAppVersion,
    registerStartupImageRemoved,
    unregisterStartupImageRemoved,
    registerMessage,
    unregisterMessage,
    getBufferIndex,
    getBuffer,
    setBuffer,
};

export {
    bridge as jTvMiniAppBridge
};
