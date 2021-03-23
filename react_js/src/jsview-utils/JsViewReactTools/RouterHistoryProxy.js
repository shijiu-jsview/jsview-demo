/**
 * Created by donglin.lu@qcast.cn on 11/13/2020.
 */

/*
 * 【模块 export 内容】
 * initWithType: 函数(参数见函数声明处)，在getGlobalHistory前调用，设置HistoryProxy的类型，目前只支持 hash(默认)
 * getGlobalHistory: 函数(参数见函数声明处)，创建 HistoryProxy，HistoryProxy.getReference()对象可以对接react-router使用
 * HistoryProxy:
 *      功能函数：(参数说明见函数本体)
 *
 * jJsvRuntimeBridge：接口句柄
 *      功能函数：
 *          getReference()              获得传给react-router使用的对象
 *          listen(listen_callback)     同浏览器history.listen，注册history发生变化时的回调
 *          push(...args)               同浏览器history.push，URL跳转到新的一层
 *          replace(...args)            同浏览器history.replace，URL跳转，但是history层数不变
 *          goBack()                    同浏览器history.goBack，URL跳转，history退一层
 *                                      【特别说明】在JsView场合，最后一层history进行goBack时会触发Activity退出
 *          go(...args)                 同浏览器history.go，跳转到history指定层
 *      支持的属性:
 *          index           同浏览器的index, 当前history深度, 仅支持get方法
 *          length          同浏览器的length, 当前history的长度，仅支持get方法
 *          location        同浏览器的location, 当前地址信息，仅支持get方法
 */

import { createMemoryHistory, createHashHistory } from 'history';
import { jJsvRuntimeBridge } from "./JsvRuntimeBridge";

class HistoryProxy {
  constructor(type /* reserved */) {
    this._HistoryRef = null;
    this._ListenCB = new Set();

    // 解决react-router中，直接保存接口后，直接调用会崩溃的问题
    this.listen = this.listen.bind(this);
    this.push = this.push.bind(this);
    this.replace = this.replace.bind(this);
    this.goBack = this.goBack.bind(this);
    this.go = this.go.bind(this);

    if (window.JsView) {
      const set = {};

      if (type === "hash") {
        let saved_info = null;
        if (typeof window.jJsvInnerUtils !== "undefined" && typeof window.jJsvInnerUtils.getPageInfo !== "undefined") {
          saved_info = window.jJsvInnerUtils.getPageInfo(window.location.href);
        }
        if (saved_info) {
          const arr = JSON.parse(saved_info);
          set.initialEntries = arr;
          set.initialIndex = arr.length - 1;
        } else {
          if (window.JsView.takeNativeHashChange) {
            // 抓取history hash在启动过程中的变更
            let new_init_history_hash = window.JsView.takeNativeHashChange(this._NativeHashListener);
            if (new_init_history_hash != null) {
              // 将新hash融入window.location中
              console.log("History: found init hash change to:", new_init_history_hash);
              window.location.applyUrlInfo(new window.JsView.React.UrlRef(
                  window.location.origin + window.location.pathname + window.location.search + new_init_history_hash,
                  true
              ));
            }
          }

          if (window.location.href.indexOf("#") < 0) {
            // 未设置hash定位，追加hash根的显示
            window.location.applyUrlInfo(new window.JsView.React.UrlRef(`${window.location.href}#/`, true));
          } else {
            // 从window.location.hash中还原hash entries
            set.initialEntries = [
              window.location.hash.substring(1), // 去除#
            ];
          }
        }

        this._HistoryRef = createMemoryHistory(set);
        this._HistoryRef.listen((location, action) => {
          // 模拟hashHistory行为
          const new_hash = `#${location.pathname}${location.search}${location.hash}`;
          window.location.applyUrlInfo(new window.JsView.React.UrlRef(
            window.location.origin + window.location.pathname + window.location.search + new_hash,
            true
          ));
          console.log("History:url change to:", window.location.href);

          for (const cb of this._ListenCB) {
            cb(location, action);
          }
        });
      }
    } else {
      this._HistoryRef = createHashHistory();
    }
  }

  getReference() {
    return this._HistoryRef;
  }

  listen(listen_callback) {
    if (!!window.JsView && typeof listen_callback === "function") {
      this._ListenCB.add(listen_callback);

      // unlisten
      return () => {
        this._ListenCB.delete(listen_callback);
      };
    }
    return this._HistoryRef.listen(listen_callback);
  }

  get index() {
    return this._HistoryRef.index;
  }

  get length() {
    return this._HistoryRef.length;
  }

  get location() {
    return this._HistoryRef.location;
  }

  push(...args) {
    this._HistoryRef.push(...args);
  }

  replace(...args) {
    this._HistoryRef.replace(...args);
  }

  goBack() {
    if (this._HistoryRef.index === 0 && !!window.JsView) {
      // JsView场景下退出页面
      jJsvRuntimeBridge.closePage();
    } else {
      this._HistoryRef.goBack();
    }
  }

  go(...args) {
    this._HistoryRef.go(...args);
  }

  _NativeHashListener = (new_hash)=>{
    this.push(new_hash.substring(1)); // 去除#
  }
}

let sGlobalHistory = null;

/*
 * initWithType 参数说明:
 *      type    (String)    History的类型，目前不用设定，仅支持"hash"一种
 */
function initWithType(type /* reserved */) {
  if (sGlobalHistory === null) {
    sGlobalHistory = new HistoryProxy(type);
  } else {
    console.error("Error: history should init once");
  }
}

/*
 * getGlobalHistory 参数说明:
 *
 * 返回值
 *      HistoryProxy    可用于react-router的history对象
 */
function getGlobalHistory() {
  if (sGlobalHistory === null) {
    initWithType("hash"); // 默认使用hash的location.href解析和locatoin.herf的更新模式
  }

  window.sLudlHistory = sGlobalHistory;

  return sGlobalHistory;
}

export {
  initWithType,
  getGlobalHistory,
};
