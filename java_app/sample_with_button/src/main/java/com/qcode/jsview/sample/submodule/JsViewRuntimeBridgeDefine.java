package com.qcode.jsview.sample.submodule;

import android.webkit.JavascriptInterface;

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
	//      coreVersionRange: 启动时内核版本范围指定
	abstract public String getStartParams();

	// JS接口: 获取当前集成JsView的APP目前支持的扩展功能列表
	// [返回值] 功能列表，以逗号隔开，包含:
	// favourite : 支持加入收藏夹功能
	// history : 支持浏览后自动进入历史记录功能
	// textureVideo : 支持将video渲染到texture的方式(JsvVideo高阶控件的usetexture属性控制)
	abstract public String getExtFeaturesSupport();

	// JS接口:
	// TODO: 需要补充文档
	abstract public void addFavourite(String url, JsPromise promise);

	// JS接口:
	// TODO: 需要补充文档
	abstract public void updateFavourite(String url, JsPromise promise);

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

	/*
	 * 预热接口
	 */
	// 页面预热接口，预热页面将会将以一个新的FrameLayout(内含JsView)的方式加载一个新的应用
	// 但这个应用在warmLoadView之前，不会创建texture/surface的实际描画资源，也不会加载图片
	// 仅加载所有JS代码，并正常走完所有启动逻辑(包括描画逻辑)，但不会走setTimeout对应的延时逻辑，也不会显示
	// 预热的界面可以极大加速界面切换的时间，例如应用跳转到购物类界面
	// mode为1表示全预热，app_url不能为空，mode为2表示只预热engine url，如果app_url不为空，engine url来自于app_url，
	// 否则来自于当前使用的engine url，app_url表示小程序的链接。
	//
	// 【特别注意】warmUp起来的view，在warmLoadView调用之前，若启动者JsView关闭的话，此View应该在
	//  View管理模块被清理掉，以防泄露，但在warmLoadView完成后，就不需要进行关联清理，请管理模块务必保证此机制。
	// [参数]
	//      int mode  预热模式，1:全预热，2:半预热
	//      String app_url  要预热的app_url，当半预热时，可以为null
	// [返回值]
	//      int: 为view_refer_id值，预热后的View的ID，用于后续的warmLoadView和closeWarmView使用
	abstract public int warmUpView(int mode, String app_url);

	// 若warmUpView中app_url不为null，进行了全预热，则本调用的app_url可以为null
	// 当warmUpView中设置了app_url时，仍可以新的app_url调整history hash(#)部分进行子页面切换
	abstract public void warmLoadView(int view_refer_id, String app_url, boolean add_history);

	// 关闭预热好的View，例如warm过但不再需要显示的View
	abstract public void closeWarmedView(int view_refer_id);

	/*
	 * 弹窗界面专用接口
	 */
	// 切换从本JsView启动的下一个弹窗界面(warmUp)的初始尺寸，仅影响本JsView，未设置时，默认为全屏显示
	// mode的内容为 "full" 或 "mini"
	abstract public void setPopupInitSize(String mode);

	// 重置界面的显示区域，以相对定位的方式调整弹出框的位置(弹出框弹出后先以尺寸1x1的方式展现)
	// 显示区域根据 max_width, max_height, aspect 来计算出同时满足3个条件的最大区域
	// [参数]
	//      align: 横纵对齐方式，有left, right, bottom, top, center可选择，
	//              例如: 右下角"right bottom", 居中"center center"
	//      max_width: 显示区域最大宽度(占屏幕百分比)
	//      max_height: 显示区域最大高度(占屏幕百分比)
	//      aspect: 横纵比设定
	abstract public void popupResizePosition(
			String align, double max_width, double max_height, double aspect);

	// 浮窗系统认为自己准备好后，调用此接口，获取设备的焦点。若不调用的话，默认浮窗系统捕获的焦点
	abstract public void popupGainFocus();
}
