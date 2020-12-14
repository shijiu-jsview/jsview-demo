/**
 * Created by donglin.lu@qcast.cn on 11/13/2020.
 */

/*
 * 【模块 export 内容】
 * jJsvRuntimeBridge：接口句柄
 *      功能函数：(参数说明见函数本体)
 *          closePage()     通知Native端关闭当前页面(如果这个页面为当前Activity唯一则关闭Actviity)
 *          notifyPageLoaded() 通知Native端去掉启动图，并停止异常状态的计时
 *          getMac()        获取Native端的MAC(有线地址优先)
 *          getWireMac()    获取Native端的有线MAC
 *          getWifiMac()    获取Native端的无线MAC
 *          getUUID()       获取设备的UUID(各平台Native有各自的算法，未强制统一
 *          getAndroidId()  获取设备的Android ID信息
 *          openBlank()     (实验性接口,未开放)
 *          openSelf()      (实验性接口,未开放)
 */

function build_api(name) {
  return (...args) => {
    if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge[name] === "function") {
      return window.jJsvRuntimeBridge[name](...args);
    }
  };
}

/**
 * 添加收藏
 * @param {string} domain 域名
 * @param {string} alias 别名（唯一的名称）
 * @param {string} appUrl app url 或者 AppId
 * @param {string} subUrl  sub url(添加到app url或者AppId转出来的url后的内容)
 * @param {string} params  其他参数(添加到url的 ? 后的内容)
 * @param {string} coreversionRange  引擎内核版本
 * @param {string} engine  js引擎地址
 * @param {string} title  显示名称(http地址)
 * @param {string} icon  显示图标(http地址)
 * @param {string} startImg  启动图(http地址)
 * @param {function} callback  执行接口回调, 处理可能被用户否决
 *
 */
function addFavourite(domain, alias, appUrl, subUrl, params, coreversionRange, engine, title, icon, startImg, callback) {
  if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.addFavourite === "function") {
    const key = `${domain}_${alias}`;
    const value = JSON.stringify({
      domain,
      alias,
      appUrl,
      subUrl,
      coreversionRange,
      engine,
      params,
      startImg,
      title,
      icon
    });
    let async_message = window.jJsvRuntimeBridge.addFavourite(key, value);
    async_message.then(()=>{
      if (callback) {
        callback(true)
      }
    });
    async_message.catch((reason)=>{
      if (callback) {
        callback(false, reason);
      }
    });
  }
}

/**
 * 删除指定收藏
 * @param {string} domain 域名
 * @param {string} alias 别名
 * @param {function} callback  执行接口回调, 处理可能被用户否决
 */
function removeFavourite(domain, alias, callback) {
  if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.removeFavourite === "function") {
    const key = `${domain}_${alias}`;
    let async_message = window.jJsvRuntimeBridge.removeFavourite(key);
    async_message.then(()=>{
      if (callback) {
        callback(true)
      }
    });
    async_message.catch((reason)=>{
      if (callback) {
        callback(false, reason);
      }
    });
  }
}

/**
 * 获取指定收藏
 * @param {string} domain 域名
 * @param {string} alias 别名
 */
function getFavourite(domain, alias) {
  if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.getFavourite === "function") {
    const key = `${domain}_${alias}`;
    return window.jJsvRuntimeBridge.getFavourite(key);
  }
  return null;
}

/**
 * 获取该域名下所有收藏
 */
function getFavouriteAll() {
  if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.getFavouriteAll === "function") {
    return window.jJsvRuntimeBridge.getFavouriteAll();
  }
  return null;
}

/**
 * 删除该域名下所有收藏
 * @param {function} callback  执行接口回调, 处理可能被用户否决
 */
function clearFavourites(callback) {
  if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.clearFavourites === "function") {
    let async_message = window.jJsvRuntimeBridge.clearFavourites();
    async_message.then(()=>{
      if (callback) {
        callback(true)
      }
    });
    async_message.catch((reason)=>{
      if (callback) {
        callback(false, reason);
      }
    });
  }
}

// 显示声明，可以提高执行速度和利用上编辑器的成员名提示功能
const bridge = {
  openBlank: build_api("openBlank"),
  closePage: build_api("closePage"),
  notifyPageLoaded: build_api("notifyPageLoaded"),
  getMac: build_api("getMac"),
  getWireMac: build_api("getWireMac"),
  getWifiMac: build_api("getWifiMac"),
  getUUID: build_api("getUUID"),
  getAndroidId: build_api("getAndroidId"),
  openSelf: build_api("openSelf"),
  addFavourite,
  removeFavourite,
  getFavourite,
  getFavouriteAll,
  clearFavourites,
};

export {
  bridge as jJsvRuntimeBridge
};
