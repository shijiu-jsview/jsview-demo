/**
 * Created by ludl on 3/30/20.
 */

function alterUrl(origin_url, js_sub_path) {
  console.log(`++++++++ origin_url=${origin_url} js_sub_path = ${js_sub_path}`);
  if (origin_url.startsWith('./') || origin_url.startsWith('/')) {
    const main_js_path = window.JsView.getAppUrl();
    let idx = main_js_path.indexOf('?');
    const host_path = (idx > 0 ? main_js_path.substring(0, idx) : main_js_path);
    idx = host_path.lastIndexOf(js_sub_path);
    const path_header = host_path.substring(0, idx);

    let ret;
    if (origin_url.startsWith('./')) {
      ret = path_header + origin_url.substring(1);
    } else {
      // start with '/'
      // remove protocal
      let host_parser = main_js_path;
      idx = host_parser.indexOf('://');
      const protocol = (idx > 0 ? host_parser.substring(0, idx) : "");
      host_parser = (idx > 1 ? host_parser.substring(idx + 3) : "");

      // Get host
      idx = host_parser.indexOf('/');
      const host = (idx > 0 ? host_parser.substring(0, idx) : "");

      ret = `${protocol}://${host}${origin_url}`;
    }

    return ret;
  }
  return origin_url;
}

class LoadingScriptElement {
  constructor(js_sub_path) {
    console.log(`++++++++ js_sub_path=${js_sub_path}`);
    this.src = null;
    this.onerror = null;
    this.onload = null;
    this.charset = null;
    this.timeout = 120;
    this._JsSubPath = js_sub_path;
  }

  setAttribute(name, value) {
    console.log(`ScriptElement.setAttribute() name=${name}, value=`, value);
    this[name] = value;
  }

  jsvActiveScript() {
    if (this.src !== null) {
      const url_href = alterUrl(this.src, this._JsSubPath);
      console.log(`load script with url=${url_href}`);
      const _this = this;
      window.JsView.runJsWithUrl(url_href, false, (is_success, err_code) => {
        _this.onLoadResult(is_success, err_code);
      });
    }
  }

  onLoadResult(is_success, err_code) {
    console.log(`[Head]onLoadResult ${is_success} ${err_code}`);
    if (is_success) {
      if (this.onload) {
        this.onload();
      }
    } else {
      if (this.onerror) {
        this.onerror({ type: `[Head]jsvErr_${err_code}`, target: this });
      }
    }
  }
}

class LoadingHeader {
  constructor() {
    console.log("Document header construct");
  }

  appendChild(node) {
    if (node instanceof LoadingScriptElement) {
      console.log("Found append script in head.");
      node.jsvActiveScript();
    }
  }
}

class LoadingDocument {
  constructor(js_sub_path) {
    this.head = new LoadingHeader();
    this._JsSubPath = js_sub_path;
  }

  createElement(name) {
    console.log(`HeaderDocument.createElement() name=${name}`);
    switch (name) {
      case "script":
        return new LoadingScriptElement(this._JsSubPath);
      default:
        console.warn(`HeaderDocument.createElement() name=${name}`);
        return null;
    }
  }
}

function initHeaderScriptLoader(js_sub_path) {
  window.document = new LoadingDocument(js_sub_path);
}

export default initHeaderScriptLoader;
