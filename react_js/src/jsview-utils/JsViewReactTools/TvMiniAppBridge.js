
/**
 * 在新的activity打开另外一个小程序
 * @param {string} url 小程序url
 * @param {string} startupImage 启动图url
 * @param {string} engineUrl 引擎url
 * @param {string} coreVersionRange 内核版本范围
 * @param {string} appConfigUrl 小程序启动配置url
 *
 */
function startUrlInNewTab(url, startupImage, engineUrl, coreVersionRange, appConfigUrl){
    let setting = {};
    if(startupImage != null && startupImage != "")
        setting.startup_image = startupImage;

    if(engineUrl != null && engineUrl != "")
        setting.engine_url = engineUrl;

    if(coreVersionRange != null && coreVersionRange != "")
        setting.core_version_range = coreVersionRange;

    if(appConfigUrl != null && appConfigUrl != "")
        setting.app_config_url = appConfigUrl;

    if(typeof window.jJsvRuntimeBridge != "undefined" && typeof window.jJsvRuntimeBridge.startUrlInNewTab != "undefined"){
        window.jJsvRuntimeBridge.startUrlInNewTab(url, JSON.stringify(setting));
    }else if(typeof window.jContentShellJBridge != "undefined" && typeof window.jContentShellJBridge.startUrlInNewTab != "undefined"){
        window.jContentShellJBridge.startUrlInNewTab(url, JSON.stringify(setting));
    }
}

/**
 * 退出小程序，同closePage
 *
 */
function backToHomepage(){
    if(typeof window.jJsvRuntimeBridge != "undefined" && typeof window.jJsvRuntimeBridge.backToHomepage != "undefined"){
        window.jJsvRuntimeBridge.backToHomepage();
    }else if(typeof window.jContentShellJBridge != "undefined" && typeof window.jContentShellJBridge.backToHomepage != "undefined"){
        window.jContentShellJBridge.backToHomepage();
    }
}

/**
 * 获取小程序之家渠道号
 * @returns {string} 渠道号
 *
 */
function getAppVendor () {
    let vendor = "100";
    if(window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.getAppInfo === "function"){
        let json_str = window.jJsvRuntimeBridge.getAppInfo();
        let json_obj = JSON.parse(json_str);
        vendor = json_obj.Vendor;
    }else  if(window.jContentShellJBridge && typeof window.jContentShellJBridge.getAppInfo === "function"){
        let json_str = window.jContentShellJBridge.getAppInfo();
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
    if(window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.getNetSpeedValue === "function"){
        return window.jJsvRuntimeBridge.getNetSpeedValue();
    }else if(window.jContentShellJBridge && typeof window.jContentShellJBridge.getNetSpeedValue === "function"){
        return window.jContentShellJBridge.getNetSpeedValue();
    }

    return null;
}

/**
 * 获取小程序之家apk信息
 * @returns {string} APK信息，JSON数据结构
 *
 */
function getAppInfo() {
    if(window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.getAppInfo === "function"){
        return window.jJsvRuntimeBridge.getAppInfo();
    }else if(window.jContentShellJBridge && typeof window.jContentShellJBridge.getAppInfo === "function"){
        return window.jContentShellJBridge.getAppInfo();
    }

    return null;
}

/**
 * 获取小程序之家apk名称
 * @returns {string} APK名称
 *
 */
function getAppName() {
    if(window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.getAppName === "function"){
        return window.jJsvRuntimeBridge.getAppName();
    }else if(window.jContentShellJBridge && typeof window.jContentShellJBridge.getAppName === "function"){
        return window.jContentShellJBridge.getAppName();
    }

    return null;
}

/**
 * 是否测试模式
 * @returns {int} 1:测试模式，0:非测试模式
 *
 */
function isAppStoreTestMode(){
    if(typeof window.jJsvRuntimeBridge != "undefined" && typeof window.jJsvRuntimeBridge.isAppStoreTestMode != "undefined"){
        return window.jJsvRuntimeBridge.isAppStoreTestMode();
    }else if(typeof window.jContentShellJBridge != "undefined" && typeof window.jContentShellJBridge.isAppStoreTestMode != "undefined"){
        return window.jContentShellJBridge.isAppStoreTestMode();
    }

    return 0;
}

/**
 * 是否触屏模式
 * @returns {int} 1:触屏模式，0:非触屏模式
 *
 */
function isInTouchMode(){
    if(typeof window.jJsvRuntimeBridge != "undefined" && typeof window.jJsvRuntimeBridge.isInTouchMode != "undefined"){
        return window.jJsvRuntimeBridge.isInTouchMode();
    }else if(typeof window.jContentShellJBridge != "undefined" && typeof window.jContentShellJBridge.isInTouchMode != "undefined"){
        return window.jContentShellJBridge.isInTouchMode();
    }

    return 0;
}

/**
 * 获取当前小程序AppName，类似于apk包名，唯一标识
 * @returns {string} 小程序App Name
 *
 */
function getTvMiniAppName() {
    if(window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.getTvMiniAppName === "function"){
        return window.jJsvRuntimeBridge.getTvMiniAppName();
    }

    return null;
}

/**
 * 获取当前小程序名称
 * @returns {string} 小程序名称
 *
 */
function getTvMiniAppTitle() {
    if(window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.getTvMiniAppTitle === "function"){
        return window.jJsvRuntimeBridge.getTvMiniAppTitle();
    }

    return null;
}

/**
 * 获取当前小程序版本号
 * @returns {string} 小程序版本号
 *
 */
function getTvMiniAppVersion() {
    if(window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.getTvMiniAppVersion === "function"){
        return window.jJsvRuntimeBridge.getTvMiniAppVersion();
    }

    return null;
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
};

export {
    bridge as jTvMiniAppBridge
};
