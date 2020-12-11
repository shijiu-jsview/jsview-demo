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
 * @param {string} alias 别名（唯一的名称）
 * @param {string} appUrl app url 或者AppId
 * @param {string} subUrl  sub url
 * @param {string} params  其他参数
 * @param {string} coreversionRange  引擎内核版本
 * @param {string} engine  js引擎地址
 * @param {string} startImg  启动图
 *
 */
function addFavourite(alias, appUrl, subUrl, params, coreversionRange, engine, startImg) {
  if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.addFavourite === "function") {
    const domain = window.location.hostname;
    const key = `${domain}_${alias}`;
    const value = JSON.stringify({
      domain,
      alias,
      appUrl,
      subUrl,
      coreversionRange,
      engine,
      startImg,
      params,
    });
    window.jJsvRuntimeBridge.addFavourite(key, value);
  }
}

/**
 * 删除指定收藏
 * @param {string} alias 别名
 */
function removeFavourite(alias) {
  if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.removeFavourite === "function") {
    const domain = window.location.hostname;
    const key = `${domain}_${alias}`;
    window.jJsvRuntimeBridge.removeFavourite(key);
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
 */
function clearFavourites() {
  if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.clearFavourites === "function") {
    return window.jJsvRuntimeBridge.clearFavourites();
  }
  return null;
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
