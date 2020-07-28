package com.qcode.jsview.sample.submodule;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import android.webkit.JavascriptInterface;

import com.qcode.jsview.JsView;
import com.qcode.jsview.sample.utils.MD5Util;
import com.qcode.jsview.sample.utils.Mac;

public class JsViewRuntimeBridge {
	private static final String TAG = "JsViewRuntimeBridge";

	private Context mContext = null;
	private JsView mHostJsView = null;
	private PageStatusListener mPageStatusListener = null;

	// 启用Java->JS功能接口，在JS端的调用接口为 jJsvRuntimeBridge.XXXXX()
	public static void enableBridge(Activity host_activity, JsView host_jsview, PageStatusListener page_listener) {
		if (host_jsview != null) {
			JsViewRuntimeBridge bridge = new JsViewRuntimeBridge(host_activity, host_jsview, page_listener);

			// 提供给Js端的调用名为 'jJsvRuntimeBridge'
			host_jsview.addJavascriptInterface(bridge, "jJsvRuntimeBridge");
		} else {
			Log.e(TAG, "Error: invalid jsview");
		}
	}

	private JsViewRuntimeBridge(Activity host_activity, JsView host_jsview, PageStatusListener page_listener) {
		mContext = host_activity;
		mHostJsView = host_jsview;
		mPageStatusListener = page_listener;
	}

	// JS接口: 关闭当前应用并推出进程
	@JavascriptInterface
	public void shutdownApp() {
		// 放入主线程完成
		new Handler(Looper.getMainLooper()).post(()->{
			Activity host_activity = (Activity)mContext;
			host_activity.finish();

			// 清理进程，保证干净退出
			System.exit(0);
			android.os.Process.killProcess(android.os.Process.myPid());
		});
	}

	// JS接口: 退出当前JsView
	@JavascriptInterface
	public void closeJsView() {
		Log.d(TAG, "closeJsView...");
	}

	// JS接口: 从JS发出界面加载完成的通知，可以触发隐藏启动图的动作
	@JavascriptInterface
	public void notifyPageLoaded() {
		Log.d(TAG, "notifyPageLoaded...");
		if (mPageStatusListener != null) {
			mPageStatusListener.notifyPageLoaded();
		}
	}

	// JS接口: 获取MAC信息，先获取有线MAC(因为有线MAC模块比较稳定)，若无则返回有线MAC
	@JavascriptInterface
	public String getMac() {
		String mac = Mac.getWireMac(mContext);
		return mac == null || mac.isEmpty() ? Mac.getWifiMac(mContext) : mac;
	}

	// JS接口: 获取有线MAC信息
	@JavascriptInterface
	public String getWireMac() {
		return Mac.getWireMac(mContext);
	}

	// JS接口: 获取无线MAC信息
	@JavascriptInterface
	public String getWifiMac() {
		return Mac.getWifiMac(mContext);
	}

	// JS接口: 获取UUID，UUID需要每个平台自行定义，没有统一标准，默认使用品牌名 + MAC地址进行md5计算
	@JavascriptInterface
	public String getUUID() {
		String brankString = Build.BRAND;
		String macString = getMac();
		return MD5Util.encodeByMD5(brankString+macString);
	}

	// JS接口: 获取Android ID
	@JavascriptInterface
	public String getAndroidId() {
		String android_id = Settings.System.getString(mContext.getContentResolver(), Settings.Secure.ANDROID_ID);
		return android_id;
	}
}
