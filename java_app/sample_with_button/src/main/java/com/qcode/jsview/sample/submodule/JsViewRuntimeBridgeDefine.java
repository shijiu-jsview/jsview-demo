package com.qcode.jsview.sample.submodule;

import com.qcode.jsview.JsPromise;

abstract public class JsViewRuntimeBridgeDefine {
	// JS接口: 获取MAC信息(优先有线)
	abstract public String getMac();

	// JS接口: 获取有线MAC信息
	abstract public String getWireMac();

	// JS接口: 获取无线MAC信息
	abstract public String getWifiMac();

	// JS接口: 获取UUID，UUID需要每个平台自行定义，没有统一标准，默认使用品牌名 + MAC地址进行md5计算
	abstract public String getDeviceUUID();

	// JS接口: 获取Android ID
	abstract public String getAndroidId();

	// JS接口: 退出当前页面
	abstract public void closePage();

	// JS接口: 从JS发出界面加载完成的通知，可以触发隐藏启动图的动作
	abstract public void notifyPageLoaded();

	// JS接口: 开启新的JsView界面，与当前JsView同内核则共享一个进程否则单开进程
	// [参数]
	// url: 启动新界面的URL
	// setting: 页面启动的配置信息, JSON字符串:
	//      startup_image: 启动图
	//      engine_url: JS引擎的URL
	//      core_version_range: 内核指定范围
	abstract public void openWindow(String url, String setting);

	// JS接口: 获取JsView页面的启动时信息
	// [返回值]
	// 返回JSON字符串: 包括
	//      engineJsUrl: 启动时JS引擎URL
	//      startImage: 启动图URL
	//      coreVersionRange: 启动时内核版本范围指定
	abstract public String getStartParams();

	// JS接口: 获取当前集成JsView的APP目前支持的扩展功能列表
	// [返回值] 功能列表，以逗号隔开，包含 favourite
	abstract public String getExtFeaturesSupport();

	// JS接口:
	// TODO: 需要补充文档
	abstract public void addFavourite(String appName, String value, JsPromise promise);

	// JS接口:
	// TODO: 需要补充文档
	abstract public void updateFavourite(String appName, String value, JsPromise promise);

	// JS接口:
	// TODO: 需要补充文档
	abstract public String getFavourite(String appName);

	// JS接口:
	// TODO: 需要补充文档
	abstract public String getFavouriteAll();

	// JS接口:
	// TODO: 需要补充文档
	abstract public String getDeviceInfo();

	// JS接口:
	// TODO: 需要补充文档
	abstract public String getSystemProperty(String key);

	// JS接口: 启动本地应用
	// [参数]
	//      start_params_json: JSON字符串 包含
	// TODO: 需要补充文档
	abstract public void startNativeApp(String start_params_json);

	// JS接口: 获取当前Android系统安装的所有应用的简要信息
	// [返回值]
	// JSONArray格式: 包含
	//      packageName
	//      versionName
	//      versionCode
	abstract public String getInstalledApps();
}
