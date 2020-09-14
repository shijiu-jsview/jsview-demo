import { createMemoryHistory, createHashHistory } from 'history';
import {jJsvRuntimeBridge} from "./JsvRuntimeBridge"

class HistoryProxy {
	constructor(type /* reserved */) {
		this._HistoryRef = null;
		this._ListenCB = new Set();

		if (!!window.JsView) {
            let set = {};
            
			if (type === "hash") {
                let saved_info = null;
                if (typeof window.jJsvInnerUtils !== "undefined" && typeof window.jJsvInnerUtils.getPageInfo !== "undefined") {
                    saved_info = window.jJsvInnerUtils.getPageInfo(window.location.href);
                }
                if (saved_info) {
                    let arr = JSON.parse(saved_info);
                    set["initialEntries"] = arr;
                    set["initialIndex"] = arr.length - 1
                } else {
                    if (window.location.href.indexOf("#") < 0) {
                        // 未设置hash定位，追加hash根的显示
                        window.location.applyUrlInfo(new window.JsView.React.UrlRef(window.location.href + "#/", true));
                    } else {
                        // 从window.location.hash中还原hash entries
                        set["initialEntries"] = [
                            window.location.hash.substring(1),  // 去除#
                        ];
                    }
                }

				this._HistoryRef = createMemoryHistory(set);
				this._HistoryRef.listen((location, action) => {
					// 模拟hashHistory行为
					let new_hash = "#" + location.pathname + location.search + location.hash;
					window.location.applyUrlInfo(new window.JsView.React.UrlRef(
						window.location.origin + window.location.pathname + window.location.search + new_hash,
						true
					));
					console.log("History:url change to:", window.location.href);

					for (let cb of this._ListenCB) {
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
			return ()=>{
				this._ListenCB.delete(listen_callback);
			}
		} else {
			return this._HistoryRef.listen(listen_callback);
		}
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
		if (this._HistoryRef.index == 0 && !!window.JsView) {
			// JsView场景下退出页面
			jJsvRuntimeBridge.closePage();
		} else {
			this._HistoryRef.goBack();
		}
	}

	go(...args) {
		if (!!window.JsView) {
			if (args.length > 0 && args[0] === -1) {
				// 支持go(-1)特定处理
				this._HistoryRef.goBack();
			} else {
				console.error("Error: JsView history NOT support go")
			}
		} else {
			this._HistoryRef.go(...args);
		}
	}
}

let sGlobalHistory = null;

function initWithType(type /* reserved */) {
	if (sGlobalHistory === null) {
		sGlobalHistory = new HistoryProxy(type);
	} else {
		console.error("Error: history should init once");
	}
}

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

