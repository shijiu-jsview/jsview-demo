package com.qcode.jsview.sample.submodule;

import com.qcode.jsview.JsView;

// 页面状态记录/共享模块
public abstract class PageStatusListener {
	// 将页面设置成加载完毕状态
	public void notifyPageLoaded() {
		// 需要应用重载此处理，一般获得关闭启动图的时机
	}
}
