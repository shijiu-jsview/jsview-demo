package com.qcode.jsview.sample.submodule;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import android.webkit.JavascriptInterface;

import com.qcode.jsview.JsView;
import com.qcode.jsview.sample.utils.MD5Util;
import com.qcode.jsview.sample.utils.Mac;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Stack;

import static com.qcode.jsview.sample.submodule.JsViewVersionUtils.needResetCore;

public class JsViewRuntimeBridge {
	private static final String TAG = "JsViewRuntimeBridge";
	private class UrlInfo{
		String engineUrl;
		String appUrl;
	}
	private Context mContext = null;
	private JsView mHostJsView = null;
	private PageStatusListener mPageStatusListener = null;

	private Stack<UrlInfo> mUrlStack = new Stack<>();

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

	// JS接口: 退出当前页面
	@JavascriptInterface
	public void closePage() {
		Log.d(TAG, "closePage...");

		// 放入主线程完成
		new Handler(Looper.getMainLooper()).post(()->{
			if (!mUrlStack.empty()) {
				UrlInfo url = mUrlStack.pop();
				mHostJsView.loadUrl2(url.engineUrl, url.appUrl);
			} else {
				Activity host_activity = (Activity) mContext;
				host_activity.finish();
			}
		});
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

	@JavascriptInterface
	public void openSelf(String from_url, String to_url, String engine_url) {
		if (engine_url == null || engine_url.trim().isEmpty()) {
			engine_url = mHostJsView.getEngineUrl();
		}
		UrlInfo url_info = new UrlInfo();
		url_info.appUrl = from_url;
		url_info.engineUrl = mHostJsView.getEngineUrl();
		mUrlStack.push(url_info);

		Log.d(TAG, "openSelf " + from_url + " " + to_url + " " + engine_url);
		mHostJsView.loadUrl2(engine_url, to_url);
	}

	// JS接口: 在新Activity中开启新JsView页面
	// 若内核相同则在本进程开启activity，若内核不同则开启新进程
	// =============================
	// 若不需要此功能，可不用合并如下文件:
	// subactivities/*
	@JavascriptInterface
	public void openBlank(String engine_url, String app_url, String start_img_url, String jsview_version) {
		try {
			String class_name = CurActivityInfo.getCurActivityName();
			if (jsview_version != null && !jsview_version.isEmpty() && needResetCore(mContext, jsview_version)) {
				class_name = CurActivityInfo.getNextActivityName();
			}
			Intent intent = new Intent();
			if (engine_url == null || engine_url.trim().isEmpty()) {
				engine_url = mHostJsView.getEngineUrl();
			}
			Log.d(TAG, "start sub tab " + engine_url + " " + app_url + " " + start_img_url + "  " + jsview_version + " " + class_name);
			ComponentName component_name = new ComponentName(mContext.getPackageName(), class_name);
			intent.setComponent(component_name);
			intent.setFlags(Intent.FLAG_ACTIVITY_MULTIPLE_TASK);
			if (jsview_version == null || jsview_version.isEmpty()) {
				jsview_version = JsViewVersionUtils.getCoreVersion();
			}
			intent.putExtra("CORE", jsview_version);
			intent.putExtra("JSURL", app_url);
			intent.putExtra("ENGINEJS", engine_url);
			intent.putExtra("STARTIMG", start_img_url);
			intent.putExtra("ISSUB", true);
			mContext.startActivity(intent);
		} catch (Exception e) {
			Log.d(TAG, "error", e);
		}
	}
}
