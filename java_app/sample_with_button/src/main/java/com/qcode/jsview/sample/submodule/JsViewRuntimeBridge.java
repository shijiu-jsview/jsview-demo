package com.qcode.jsview.sample.submodule;

import android.app.Activity;
import android.content.ComponentName;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import android.webkit.JavascriptInterface;

import com.qcode.jsview.JsPromise;
import com.qcode.jsview.JsView;
import com.qcode.jsview.sample.utils.MD5Util;
import com.qcode.jsview.sample.utils.Mac;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
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
	private Handler mMainThreadHandler;

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
		mMainThreadHandler = new Handler(Looper.getMainLooper());
	}

	// JS接口: 退出当前页面
	@JavascriptInterface
	public void closePage() {
		Log.d(TAG, "closePage...");

		// 放入主线程完成
		mMainThreadHandler.post(()->{
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
			intent.putExtra("COREVERSIONRANGE", jsview_version);
			intent.putExtra("JSURL", app_url);
			intent.putExtra("ENGINE", engine_url);
			intent.putExtra("STARTIMG", start_img_url);
			intent.putExtra("ISSUB", true);
			mContext.startActivity(intent);
		} catch (Exception e) {
			Log.d(TAG, "error", e);
		}
	}


	private static final String CONTENT = "content://";
	private static final String AUTHORITY = "com.qcode.jsview.sp.SharedDataProvider";
	private static final String CONTENT_URI = CONTENT + AUTHORITY;
	private static final String OPTION_CLEAR = "clear";
	private static final String OPTION_DEL = "del";
	private static final String OPTION_QUERY = "query";
	private static final String OPTION_INSERT = "insert";
	private static final String OPTION_QUERYALL = "queryall";
	//这里的AUTHORITY就是我们在AndroidManifest.xml中配置的authorities
	private static final String BASE_PATH = "sp";// SharedPreference 缩写
	private static final String URI_PATH = CONTENT_URI + "/" + BASE_PATH;

	/**
	 *
	 * @param key	唯一标识
	 * @param value	JSON 字符串
	 */
	@JavascriptInterface
	public void addFavourite(String key, String value, JsPromise promise) {
		mMainThreadHandler.post(()->{
			// TODO: 做个用户确认界面(使用title和icon做用户提示, icon为http的网络图片)
			boolean denied = false;
			Bundle display = getFavouriteTitleIcon(value);

			if (!denied) {
				//获取当前包名
				String packageName =  mContext.getPackageName();
				String action = "qcode.app.action.start_jsviewdemo";//替换为小程序自己的action
				ContentResolver cr = mContext.getContentResolver();
				Uri uri = Uri.parse(URI_PATH + "/favourite/" + OPTION_INSERT + "/" + key+"/"+packageName);
				ContentValues cv = new ContentValues();
				JSONObject key_value = new JSONObject();
				try {
					key_value.put("packageName", packageName);
					key_value.put("action", action);
					key_value.put("params", new JSONObject(value));
				} catch (JSONException e) {
					e.printStackTrace();
				}
				cv.put("value", key_value.toString());
				cr.update(uri, cv, null, null);

				promise.resolve(0);
			} else {
				promise.reject("denied");
			}
		});
	}

	@JavascriptInterface
	public String getFavourite(String key) {
		ContentResolver cr = mContext.getContentResolver();
		Uri uri = Uri.parse(URI_PATH + "/favourite/" + OPTION_QUERY + "/" + key);
		String rtn = cr.getType(uri);
		if (rtn == null) {
			return null;
		}
		return rtn;
	}

	@JavascriptInterface
	public String getFavouriteAll() {
		ContentResolver cr = mContext.getContentResolver();
		Uri uri = Uri.parse(URI_PATH + "/favourite/" + OPTION_QUERYALL);
		Cursor cursor = cr.query(uri, null,null,null,null);
		if (cursor != null) {
			JSONArray favouriteList = new JSONArray();
			for(cursor.moveToFirst();
				cursor.isAfterLast() == false;
				cursor.moveToNext()) {
				String value = cursor.getString(1);
				try {
					favouriteList.put(new JSONObject(value));
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
			return favouriteList.toString();
		}
		return null;
	}

	@JavascriptInterface
	public void removeFavourite(String key, JsPromise promise) {
		mMainThreadHandler.post(()->{
			// TODO: 需要做个用户确认界面
			boolean denied = false;
			ContentResolver cr = mContext.getContentResolver();
			Uri uri = Uri.parse(URI_PATH + "/favourite/" + OPTION_QUERY + "/" + key);
			String rtn = cr.getType(uri);
			if (rtn == null) {
				promise.reject("noFound");
				return;
			}
			Bundle title_icon = getFavouriteTitleIcon(rtn);

			if (!denied) {
				//安全性如何保障,目前只能删除自身域名下的数据
				//只在当前包名下可删除项目
				String packageName = mContext.getPackageName();
				cr = mContext.getContentResolver();
				uri = Uri.parse(URI_PATH + "/favourite/" + OPTION_DEL + "/" + key + "/" + packageName);
				cr.delete(uri, null, null);

				promise.resolve(0);
			} else {
				promise.reject("denied");
			}
		});
	}

	@JavascriptInterface
	public void clearFavourites(JsPromise promise) {
		mMainThreadHandler.post(()-> {
			// TODO: 需要做个用户确认界面
			boolean denied = false;

			if (!denied) {
				//安全性如何保障,目前只能删除自身域名下的数据
				//只在当前包名下可删除项目
				ContentResolver cr = mContext.getContentResolver();
				Uri uri = Uri.parse(URI_PATH + "/favourite/" + OPTION_CLEAR);
				cr.delete(uri, null, null);

				promise.resolve(0);
			} else {
				promise.reject("denied");
			}
		});
	}

	private Bundle getFavouriteTitleIcon(String set_value) {
		Bundle title_icon = new Bundle();

		try {
			JSONObject set = new JSONObject(set_value);

			title_icon.putString("icon", set.getString("icon"));
			title_icon.putString("title", set.getString("title"));
		} catch (JSONException e) {
			Log.e(TAG, "getFavouriteTitleIcon failed");
			title_icon.putString("icon", "");
			title_icon.putString("title", "");
		}

		return title_icon;
	}
}
