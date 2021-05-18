let feature_supports = null;

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
 * 获取当前集成JsView的APP目前支持的扩展功能列表
 *
 * @returns {string} 功能列表，以逗号隔开，包含:
 *      favourite : 支持加入收藏夹功能
 *      history : 支持浏览后自动进入历史记录功能
 *      textureVideo : 支持将video渲染到texture的方式(JsvVideo高阶控件的usetexture属性控制)
 */
function getExtFeatureSupports() {
    if (!feature_supports) {
        feature_supports = direct_call("getExtFeaturesSupport");
    }
    return feature_supports;
}

/**
 * 获取设备mac地址，优先获取有线mac，无则获取wifi mac
 * @returns {string} mac address
 *
 */
function getMac(){
    return direct_call("getMac");
}

/**
 * 获取设备有线mac地址
 * @returns {string} mac address
 *
 */
function getWireMac(){
    return direct_call("getWireMac");
}

/**
 * 获取设备wifi mac地址
 * @returns {string} mac address
 *
 */
function getWifiMac(){
    return direct_call("getWifiMac");
}

/**
 * 获取设备UUID
 * @returns {string} UUID
 *
 */
function getDeviceUUID(){
    return direct_call("getDeviceUUID");
}

/**
 * 获取设备Android ID
 * @returns {string} Android ID
 *
 */
function getAndroidId(){
    return direct_call("getAndroidId");
}

/**
 * 打开另外一个小程序
 * @param {string} url 小程序url
 * @param {string} startup_image 启动图url
 * @param {string} startup_video 启动视频url
 * @param {int} startup_duration 启动图时长，默认0
 * @param {int} add_history 是否添加历史，0不添加，1添加
 *
 */
function openWindow(url, startup_image, startup_video, startup_duration, add_history){
    let setting = {};
    if(startup_image !== null && startup_image !== "")
        setting.startupImage = startup_image;

    if(startup_video !== null && startup_video !== ""){
        setting.startupVideo = startup_video;
    }

    setting.startupDuration = startup_duration;
    setting.addHistory = (add_history ? 1 : 0); // 兼容true/false传值

    direct_call("openWindow", url, JSON.stringify(setting));
}

/**
 * 关闭当前小程序
 *
 */
function closePage(){
    direct_call("closePage");
}

/**
 * 获取设备UUID
 * @param {string} key 属性名称
 * @returns {string} 属性值
 *
 */
function getSystemProperty(key){
    return direct_call("getSystemProperty", key);
}

/**
 * 获取已安装应用列表
 * @returns {string} 应用列表，JSON结构的数组
 *
 */
function getInstalledApps(){
    return direct_call("getInstalledApps");
}

/**
 * 启动安卓APP
 * @param {string} package_name 包名
 * @param {string} activity Activity方式启动
 * @param {string} action Action方式启动
 * @param {string} uri Uri方式启动
 * @param {Array} flags 数组，用于intent.addFlags
 * @param {Array} param JSON格式数组，用于intent.putExtra
 *
 */
function startNativeApp(package_name, activity, action, uri, flags, param){
    var obj = {};
    if(package_name !== null && package_name !== "")
        obj.packageName = package_name;

    if(activity !== null && activity !== "")
        obj.activity = activity;

    if(action !== null && action !== "")
        obj.action = action;

    if(uri !== null && uri !== "")
        obj.uri = uri;

    if(flags !== null && flags.length > 0)
        obj.flags = flags;

    if(param !== null && param.length > 0)
        obj.param = param;

    direct_call("startNativeApp", JSON.stringify(obj));
}

/**
 * 获取设备信息
 * @returns {string} 终端设备信息，JSON数据结构
 *
 */
function getDeviceInfo() {
    return direct_call("getDeviceInfo");
}

/**
 * 页面加载成功后调用去除启动图
 *
 */
function notifyPageLoadDone() {
    notifyPageLoaded();
}

function notifyPageLoaded() {
    direct_call("notifyPageLoaded");
}

/**
 * 是否支持收藏功能
 * @returns {boolean} true支持，false不支持
 *
 */
function hasFavouriteFunction(){
    let features = getExtFeatureSupports();
    if (features && features.indexOf("favourite") >= 0) {
        return true;
    }
    return false;
}

/**
 * 获取启动内核版本和引擎
 * @returns {Object} 包含
 *      COREVERSIONRANGE: 启动时设定的内核版本范围
 *      ENGINE: 启动时设定的Js引擎的URL
 */
function getStartParams() {
    let json = direct_call("getStartParams");
    if (json) {
        return JSON.parse(json);
    } else {
        return null;
    }
}

/**
 * 添加收藏
 * @param {string} url 收藏的url
 * @param {function} callback  执行接口回调, 处理可能被用户否决
 *
 */
function addFavourite(url, callback) {
    if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.addFavourite === "function") {
        let async_message = window.jJsvRuntimeBridge.addFavourite(url);
        async_message.then((result)=>{
            if (callback) {
                callback(result);
            }
        }).catch((result)=>{
            if (callback) {
                callback(result);
            }
        });
    }
}

/**
 * 更新收藏
 * @param {string} url 收藏的url
 * @param {function} callback  执行接口回调, 处理可能被用户否决
 *
 */
function updateFavourite(url, callback) {
    if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.updateFavourite === "function") {
        let async_message = window.jJsvRuntimeBridge.updateFavourite(url);
        async_message.then((result)=>{
            if (callback) {
                callback(result)
            }
        }).catch((result)=>{
            if (callback) {
                callback(result);
            }
        });
    }
}

/**
 * 删除指定收藏
 * @param {string} app_name app name 唯一标识
 * @param {function} callback  执行接口回调, 处理可能被用户否决
 *
 */
function removeFavourite(app_name, callback) {
    if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.removeFavourite === "function") {
        let async_message = window.jJsvRuntimeBridge.removeFavourite(app_name);
        async_message.then((result)=>{
            if (callback) {
                callback(result)
            }
        }).catch((result)=>{
            if (callback) {
                callback(result);
            }
        });
    }
}

/**
 * 获取指定收藏
 * @param {string} app_name app name 唯一标识
 */
function getFavourite(app_name) {
    if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.getFavourite === "function") {
        return window.jJsvRuntimeBridge.getFavourite(app_name);
    }
    return null;
}

/**
 * 获取所有收藏
 *
 */
function getFavouriteAll() {
    if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.getFavouriteAll === "function") {
        return window.jJsvRuntimeBridge.getFavouriteAll();
    }
    return null;
}

/**
 * 浮窗控制接口，设置从本浮窗界面进行预热的二级浮窗的启动默认尺寸(若不设置则为全屏)
 * @param {string} mode    全屏模式还是需要Resize的模式。取值范围: "full" 或者 "mini"
 *                         设置成 "mini" 模式后，启动后的界面内需要调用popupResizePosition来调整尺寸才能可见
 */
function setPopupInitSize(mode) {
    direct_call("setPopupInitSize", mode);
}

/**
 * 浮窗控制接口，设置浮窗显示区域，以相对定位的方式调整弹出框的位置(弹出框弹出后先以尺寸1x1的方式展现)
 * @param {string} align    横纵对齐方式，有left, right, bottom, top, center可选择
 *                          例如: 右下角"right bottom", 居中"center center"
 * @param {number} max_width    显示区域最大宽度(占屏幕百分比)
 * @param {number} max_height   显示区域最大高度(占屏幕百分比)
 * @param {number} aspect   横纵比设定
 * 显示区域根据 max_width, max_height, aspect 来计算出同时满足3个条件的最大区域
 */
function popupResizePosition(align, max_width, max_height, aspect) {
    direct_call("popupResizePosition", align, max_width, max_height, aspect);
}

/**
 * 浮窗系统认为自己准备好后，调用此接口，获取设备的焦点。若不调用的话，默认浮窗系统捕获的焦点
 */
function popupGainFocus() {
    direct_call("popupGainFocus");
}

/**
 * 页面预热接口，预热页面将会将以一个新的FrameLayout(内含JsView)的方式加载一个新的应用
 * 但这个应用在warmLoadView之前，不会创建texture/surface的实际描画资源，也不会加载图片
 * 仅加载所有JS代码，并正常走完所有启动逻辑(包括描画逻辑)，但不会走setTimeout对应的延时逻辑，也不会显示
 * 预热的界面可以极大加速界面切换的时间，例如应用跳转到购物类界面
 * mode为1表示全预热，app_url不能为空，mode为2表示只预热engine url，如果app_url不为空，engine url来自于app_ur
 * 否则来自于当前使用的engine url，app_url表示小程序的链接。
 * 【特别注意】warmUp起来的view，在warmLoadView调用之前，若启动者JsView关闭的话，此View应该在
 *  View管理模块被清理掉，以防泄露，但在warmLoadView完成后，就不需要进行关联清理，请管理模块务必保证此机制。
 * [参数]
 *      int mode  预热模式，1:全预热，2:半预热
 *      String app_url  要预热的app_url，当半预热时，可以为null
 * [返回值]
 *      int: 为view_refer_id值，预热后的View的ID，用于后续的warmLoadView和closeWarmView使用
 */
function warmUpView(mode, app_url) {
    if(mode !== 1 && mode !== 2) {
        console.error(`not support mode(${mode})`);
        return -1;
    }

    if(mode === 1 && (app_url === null || app_url.length === 0)) {
        console.error(`not support params(${mode} ${app_url})`);
        return -1;
    }

    return direct_call("warmUpView", mode, app_url);
}

/**
 * 将warmUpView后的View展示出来
 * 若warmUpView中app_url不为null，进行了全预热，则本调用的app_url可以为null
 * 当warmUpView中设置了app_url时，仍可以新的app_url调整history hash(#)部分进行子页面切换
 *
 * @param {number} view_refer_id warmUpView调用后返回来的View ID
 * @param {string} app_url      界面的应用地址，支持?(search)和#(hash)字段
 * @param {boolean} add_history 启动的界面是否进访问历史列表
 */
function warmLoadView(view_refer_id, app_url, add_history) {
    direct_call("warmLoadView", view_refer_id, app_url, !!add_history);
}

/**
 * 关闭warmUp后未进行warmLoad的View，释放资源
 * @param {number} view_refer_id warmUpView调用后返回来的View ID
 */
function closeWarmedView(view_refer_id) {
    direct_call("closeWarmedView", view_refer_id);
}

// 显示声明，可以提高执行速度和利用上编辑器的成员名提示功能
const bridge = {
    getMac,
    getWireMac,
    getWifiMac,
    getDeviceUUID,
    getAndroidId,
    openWindow,
    closePage,
    getStartParams,
    getSystemProperty,
    getInstalledApps,
    startNativeApp,
    getDeviceInfo,
    notifyPageLoadDone,
    notifyPageLoaded,
    hasFavouriteFunction,
    addFavourite,
    updateFavourite,
    removeFavourite,
    getFavourite,
    getFavouriteAll,
    setPopupInitSize,
    popupResizePosition,
    popupGainFocus,
    warmUpView,
    warmLoadView,
    closeWarmedView
};

export {
    bridge as jJsvRuntimeBridge
};
