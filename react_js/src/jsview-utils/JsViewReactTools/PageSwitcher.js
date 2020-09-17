import {getGlobalHistory} from './RouterHistoryProxy';
import {jJsvRuntimeBridge} from './JsvRuntimeBridge'

let history = getGlobalHistory();
class PageSwitcher {
	/**
	 * 原标签形式打开二级页面
	 * @func openSelf
	 * @memberof PageSwitcher
	 * @param {string} jsview_url 应用代码的url
	 * @param {string} engine_url forge引擎的url, 缺省表示使用当前的forge引擎
	 * @param {string} html_url html的url
	 **/
	static openSelf(jsview_url, engin_url, html_url) {
		if (window.JsView) {
			let url_info = new window.JsView.React.UrlRef(jsview_url, true);
			if (window.location.origin !== url_info.origin || window.location.pathname !== url_info.pathname) {
				//url主体不同
				let from_url = window.location.href;
				window.jJsvInnerUtils.savePageInfo(from_url, JSON.stringify(history._HistoryRef.entries));
				jJsvRuntimeBridge.openSelf(from_url, jsview_url, engin_url ? engin_url : "");
			} else {
				//查看hash是否相同
				if (window.location.hash !== url_info.hash) {
					history.push(url_info.hash);
				}
			}
		} else {
			console.log("open self in html.", html_url)
			if (html_url && jsview_url !== window.location.href) {
				window.location.href = html_url;
			}
		}
	}

	/**
	 * 新标签形式打开二级页面
	 * @func openBlank
	 * @memberof PageSwitcher
	 * @param {string} engine_url forge引擎的url
	 * @param {string} app_url 应用代码的url
	 * @param {string} start_img_url 启动图的url
	 * @param {string} jsview_version jsview的版本
	 **/
	static openBlank(engine_url, app_url, start_img_url, jsview_version) {
		if (window.JsView) {
			jJsvRuntimeBridge.openSelf(engine_url, app_url, start_img_url, jsview_version);
		} else {
			window.open(app_url);
		}
	}

	/**
	 * 关闭页面
	 * @func closePage
	 * @memberof PageSwitcher
	 **/
	static closePage() {
		jJsvRuntimeBridge.closePage();
	}
}

export {
	PageSwitcher
}