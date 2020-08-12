import { createMemoryHistory, createHashHistory } from 'history';

class HistoryProxy {
	constructor(type /* reserved */) {
		this._HistoryRef = null;

		if (!!window.JsView) {
			this._HistoryRef = createMemoryHistory();

			if (type === "hash") {
				if (window.location.href.indexOf("#") < 0) {
					// 未设置hash定位，追加hash根的显示
					window.location.applyUrlInfo(new window.JsView.React.UrlRef(window.location.href + "#/", true));
				} else {
					// TODO: 追加hash解析处理和直接进入hash对应pathname的方法
				}
				this._HistoryRef.listen((location, action) => {
					// 模拟hashHistory行为
					let new_hash = "#" + location.pathname + location.search + location.hash;
					window.location.applyUrlInfo(new window.JsView.React.UrlRef(
						window.location.origin + window.location.pathname + window.location.search + new_hash,
						true
					));
					console.log("History:url change to:", window.location.href);
				});
			}
		} else {
			this._HistoryRef = createHashHistory();
		}
	}

	getReference() {
		return this._HistoryRef;
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
		this._HistoryRef.goBack();
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
	return sGlobalHistory;
}

export {
	initWithType,
	getGlobalHistory,
};

