package com.qcode.jsview.sample.submodule;

import com.qcode.jsview.JsView;

abstract public class ViewsManagerDefine {
	// closePage: 关闭一个JsView，若无活跃的View则触发关闭Activity/Service主体
	abstract public void closePage(JsView host_view);

	// openWindow: 新开一个Activity中的JsView
	abstract public void openWindow(JsView host_view, String url, String setting);

	// 页面预热接口，预热页面将会将以一个新的FrameLayout(内含JsView)的方式加载一个新的应用
	// 但这个应用在warmLoadView之前，不会创建texture/surface的实际描画资源，也不会加载图片
	// 仅加载所有JS代码，并正常走完所有启动逻辑(包括描画逻辑)，但不会走setTimeout对应的延时逻辑，也不会显示
	// 预热的界面可以极大加速界面切换的时间，例如应用跳转到购物类界面
	// app_url可以传null，若为null仅预热engine js部分
	// warmLoadView时传的app_url，若为null则沿用warmUp时的app_url
	// 若warmUpView时app_url不为null，同时warmLoadView的app_url也不为null，则仅生效#hash部分
	// 未进行load的预热view，通过closeWarmedView来关闭
	abstract public int warmUpView(JsView starter_view, String engine_js_url, String app_url);
	abstract public void warmLoadView(int view_refer_id, String app_url);
	abstract public void closeWarmedView(int view_refer_id);

	// 浮窗系统
	abstract public void popupAbsolutePosition(
			JsView host_view, double left, double top, double width, double height);
	abstract public void popupRelativePosition(
			JsView host_view, String align, double max_width, double max_height, double aspect);
	abstract public void popupGainFocus();
}
