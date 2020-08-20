import {getGlobalHistory} from './RouterHistoryProxy';
 
let history = getGlobalHistory();

class OpenPageSwitcher{
    openSelf(url) {
        if (window.JsView) {
            let url_info = new window.JsView.React.UrlRef(url, true);
            if (window.location.origin !== url_info.origin || window.location.pathname !== url_info.pathname) {
                let from_url = window.location.href;
                window.jJsvInnerUtils.savePageInfo(from_url, JSON.stringify(history._HistoryRef.entries));
                jJsvRuntimeBridge.openSelf(from_url, url, "");
            } else {
                if (window.location.hash !== url_info.hash) {
                    history.push(url_info.hash);
                }
            }
        }
    }
}

let sOpenPageSwitcher = new OpenPageSwitcher();

export {
    sOpenPageSwitcher as OpenPage
}