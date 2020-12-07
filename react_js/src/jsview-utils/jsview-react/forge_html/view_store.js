/**
 * Created by luocf on 2020/3/26.
 */
import Forge from "../ForgeDefine";

class ViewStore {
  constructor() {
    this._InnerViews = {};
    this._ViewToken = 0;
  }

  add(view_info) {
    const view_token = ++this._ViewToken;
    this._InnerViews[`${view_token}`] = view_info;
    return view_token;
  }

  remove(view_token) {
    if (this._InnerViews[view_token]) {
      delete this._InnerViews[view_token];
    }
  }

  get(view_token) {
    return this._InnerViews[view_token];
  }

  clear() {
    this._InnerViews = {};
    this._ViewToken = 0;
  }
}
Forge.ViewStore = ViewStore;
Forge.sViewStore = new ViewStore();
class ViewInfo {
  constructor(view, layout_params) {
    this.view = view;
    this.layout_params = layout_params;
  }
}
Forge.ViewInfo = ViewInfo;
