package com.qcode.jsview.sample.submodule;

import android.app.Activity;
import android.content.ComponentName;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
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

import java.lang.reflect.Method;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.Stack;

import static com.qcode.jsview.sample.submodule.JsViewVersionUtils.needResetCore;

public class JsViewRuntimeBridge extends JsViewRuntimeBridgeDefine {
	private static final String TAG = "JsViewRuntimeBridge";
	private Context mContext = null;
	private ViewsManagerDefine mViewsManager = null;
	private FavouriteSupport mFavouriteSupport = null;
	private JsViewState mHostJsViewState = null;
	private PageStatusListener mPageStatusListener = null;
	private Handler mMainThreadHandler;

	// 启用Java->JS功能接口，在JS端的调用接口为 jJsvRuntimeBridge.XXXXX()
	public static void enableBridge(
			Context host_context,
			ViewsManagerDefine views_manager,
			FavouriteSupport favourite_support,
			JsViewState host_jsview,
			PageStatusListener page_listener) {
		if (host_jsview != null) {
			JsViewRuntimeBridge bridge = new JsViewRuntimeBridge(
					host_context,
					views_manager,
					favourite_support,
					host_jsview,
					page_listener);

			// 提供给Js端的调用名为 'jJsvRuntimeBridge'
			host_jsview.view.addJavascriptInterface(bridge, "jJsvRuntimeBridge");
		} else {
			Log.e(TAG, "Error: invalid jsview");
		}
	}

	private JsViewRuntimeBridge(
			Context host_context,
			ViewsManagerDefine views_manager,
			FavouriteSupport favourite_support,
			JsViewState host_jsview,
			PageStatusListener page_listener) {
		mContext = host_context;
		mViewsManager = views_manager;
		mFavouriteSupport = favourite_support;
		mHostJsViewState = host_jsview;
		mPageStatusListener = page_listener;
		mMainThreadHandler = new Handler(Looper.getMainLooper());
	}

	// JS接口: 退出当前页面
	@Override
	@JavascriptInterface
	public void closePage() {
		Log.d(TAG, "closePage...");
		mViewsManager.closePage(mHostJsViewState.view);
	}

	// JS接口: 从JS发出界面加载完成的通知，可以触发隐藏启动图的动作
	@Override
	@JavascriptInterface
	public void notifyPageLoaded() {
		Log.d(TAG, "notifyPageLoaded...");
		if (mPageStatusListener != null) {
			mPageStatusListener.notifyPageLoaded();
		}
	}

	@Override
	@JavascriptInterface
	public void openWindow(String url, String setting) {
		mViewsManager.openWindow(mHostJsViewState.view, url, setting);
	}

	@Override
	@JavascriptInterface
	public String getStartParams() {
		try {
			JSONObject start_params_json = new JSONObject();
			start_params_json.put("engineJsUrl", mHostJsViewState.startIntent.coreVersionRange);
			start_params_json.put("coreVersionRange", mHostJsViewState.startIntent.coreVersionRange);
			return start_params_json.toString();
		} catch (JSONException e) {
			Log.e(TAG, "JSON error:", e);
			return null;
		}
	}

	@Override
	@JavascriptInterface
	public String getExtFeaturesSupport() {
		StringBuilder s_builder = new StringBuilder();

		// 收藏功能
		if (mFavouriteSupport != null) {
			s_builder.append("favourite");
			s_builder.append(",");
		}

		// 删除最后一个逗号
		s_builder.delete(s_builder.length() - 1, s_builder.length());

		return s_builder.toString();
	}

	@Override
	public void addFavourite(String url, JsPromise promise) {

	}

	@Override
	public void updateFavourite(String url, JsPromise promise) {

	}

	@Override
	@JavascriptInterface
	public String getFavourite(String appName) {
		return mFavouriteSupport.getFavourite(appName);
	}

	@Override
	@JavascriptInterface
	public String getFavouriteAll() {
		return mFavouriteSupport.getFavouriteAll();
	}

	@Override
	@JavascriptInterface
	public String getDeviceInfo() {
		try {
			JSONObject version_json_obj = new JSONObject();
			version_json_obj.put("MODEL", Build.MODEL);
			version_json_obj.put("SDK_INT", Build.VERSION.SDK_INT);
			version_json_obj.put("VERSION", Build.VERSION.RELEASE);
			version_json_obj.put("BOARD", Build.BOARD);
			version_json_obj.put("BRAND", Build.BRAND);
			version_json_obj.put("DEVICE", Build.DEVICE);
			version_json_obj.put("DISPLAY", Build.DISPLAY);
			version_json_obj.put("MANUFACTURER", Build.MANUFACTURER);
			version_json_obj.put("PRODUCT", Build.PRODUCT);

			return version_json_obj.toString();
		} catch (JSONException e) {
			Log.e(TAG, "getDeviceInfo JSON error");
			return "{}";
		}
	}

	@Override
	@JavascriptInterface
	public String getSystemProperty(String key) {
		String retStr = "";

		try {
			Class<?> c = Class.forName("android.os.SystemProperties");
			Method get = c.getMethod("get", String.class);
			retStr = (String)get.invoke(c, key);
			return retStr;
		} catch (Exception var7) {
			Log.d("SystemInfo", "getSystemProperty(): err= " + var7.getMessage());
			return retStr;
		} finally {
			;
		}
	}

	@Override
	@JavascriptInterface
	public void startNativeApp(String start_params_json) {
		Intent intent = null;
		String activity_str = null;
		String package_str = null;
		String action_str = null;
		String uri_str = null;

		JSONObject obj = null;
		try {
			obj = new JSONObject(start_params_json);

			if(obj.has("activity") &&  obj.getString("activity") != null && !obj.getString("activity").isEmpty()){
				activity_str = obj.getString("activity");
			}

			if(obj.has("action") &&  obj.getString("action") != null && !obj.getString("action").isEmpty()){
				action_str = obj.getString("action");
			}

			if(obj.has("packageName") &&  obj.getString("packageName") != null && !obj.getString("packageName").isEmpty()){
				package_str = obj.getString("packageName");
			}

			if(obj.has("uri") &&  obj.getString("uri") != null && !obj.getString("uri").isEmpty()){
				uri_str = obj.getString("uri");
			}

			if(activity_str != null){
				intent = new Intent();
				intent.setComponent(new ComponentName(package_str, activity_str));
			}else if(action_str != null){
				intent = new Intent(action_str);

				if(package_str != null){
					intent.setPackage(package_str);
				}
			}else if(uri_str != null){
				intent = new Intent();
				intent.setData(Uri.parse(uri_str));
				if(package_str != null){
					intent.setPackage(package_str);
				}
			}else if(package_str != null){
				String packetName = obj.getString("packageName");
				PackageManager pm = mContext.getPackageManager();
				intent = pm.getLaunchIntentForPackage(packetName);
			}

			if(intent == null)
				return;

			intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

			if(obj.has("flags")){
				JSONArray flags = obj.getJSONArray("flags");
				for(int i=0; i < flags.length(); i++){
					intent.addFlags(flags.getInt(i));
				}
			}

			if(obj.has("param")){
				JSONArray params = obj.getJSONArray("param");
				for(int i=0; i<params.length(); i++){
					JSONObject param = params.getJSONObject(i);

					Iterator<String> keys = param.keys();

					while(keys.hasNext()) {
						String key = keys.next();
						Object value=param.get(key);
						if(value instanceof String){
							intent.putExtra(key, (String) value);
						}else if (value instanceof Number){
							intent.putExtra(key,((Number)value).intValue());
						}else if (value instanceof Boolean){
							intent.putExtra(key,((Boolean)value).booleanValue());
						}
					}
				}
			}
		} catch (JSONException e) {
			Log.e(TAG, "JSON error:", e);
			return;
		}

		mContext.startActivity(intent);
	}

	@Override
	@JavascriptInterface
	public String getInstalledApps() {
		try {
			PackageManager pm = mContext.getPackageManager();
			// Return a List of all packages that are installed on the device.
			List<PackageInfo> packages = pm.getInstalledPackages(0);
			JSONArray array = new JSONArray();
			for (PackageInfo packageInfo : packages) {
				JSONObject obj = new JSONObject();
				obj.put("packageName", packageInfo.packageName);
				obj.put("versionName", packageInfo.versionName);
				obj.put("versionCode", packageInfo.versionCode);
				array.put(obj);
			}
			return array.toString();
		} catch (JSONException e) {
			Log.e(TAG, "JSON error:", e);
			return "{}";
		}
	}

	// JS接口: 获取MAC信息，先获取有线MAC(因为有线MAC模块比较稳定)，若无则返回有线MAC
	@Override
	@JavascriptInterface
	public String getMac() {
		String mac = Mac.getWireMac(mContext);
		return mac == null || mac.isEmpty() ? Mac.getWifiMac(mContext) : mac;
	}

	// JS接口: 获取有线MAC信息
	@Override
	@JavascriptInterface
	public String getWireMac() {
		return Mac.getWireMac(mContext);
	}

	// JS接口: 获取无线MAC信息
	@Override
	@JavascriptInterface
	public String getWifiMac() {
		return Mac.getWifiMac(mContext);
	}

	// JS接口: 获取UUID，UUID需要每个平台自行定义，没有统一标准，默认使用品牌名 + MAC地址进行md5计算
	@Override
	@JavascriptInterface
	public String getDeviceUUID() {
		String brankString = Build.BRAND;
		String macString = getMac();
		return MD5Util.encodeByMD5(brankString+macString);
	}

	// JS接口: 获取Android ID
	@Override
	@JavascriptInterface
	public String getAndroidId() {
		String android_id = Settings.System.getString(mContext.getContentResolver(), Settings.Secure.ANDROID_ID);
		return android_id;
	}
	
	// 页面预热接口，预热页面将会将以一个新的FrameLayout(内含JsView)的方式加载一个新的应用
	// 但这个应用在warmLoadView之前，不会创建texture/surface的实际描画资源，也不会加载图片
	// 仅加载所有JS代码，并正常走完所有启动逻辑(包括描画逻辑)，但不会走setTimeout对应的延时逻辑，也不会显示
	// 预热的界面可以极大加速界面切换的时间，例如应用跳转到购物类界面
	// app_url可以传null，若为null仅预热engine js部分
	@JavascriptInterface
	public int warmUpView(String engine_js_url, String app_url) {
		if (mViewsManager != null) {
			return mViewsManager.warmUpView(mHostJsViewState.view, engine_js_url, app_url);
		} else {
			Log.e(TAG, "Not support warm up JsView");
			return -1;
		}
	}

	// 若warmUpView中app_url不为null，进行了全预热，则本调用的app_url可以为null
	// 当warmUpView中app_url不为null时，仍可以使用history变化调整显示内容，
	// 例如:"http//origin/app/url#/newHistoryHash?newKey=newValue"
	@Override
	@JavascriptInterface
	public void warmLoadView(int view_refer_id, String app_url, boolean add_history) {
		if (mViewsManager != null) {
			mViewsManager.warmLoadView(view_refer_id, app_url, add_history);
		} else {
			Log.e(TAG, "Not support warm load JsView");
		}
	}

	// 关闭预热好的View，例如warm过但不再需要显示的View
	@Override
	@JavascriptInterface
	public void closeWarmedView(int view_refer_id) {
		if (mViewsManager != null) {
			mViewsManager.closeWarmedView(view_refer_id);
		} else {
			Log.e(TAG, "Not support close warmed JsView");
		}
	}

	@Override
	@JavascriptInterface
	public void setPopupInitSize(String mode) {
		mViewsManager.setPopupInitSize(mHostJsViewState.view, mode);
	}

	@Override
	@JavascriptInterface
	public void popupResizePosition(String align, double max_width, double max_height, double aspect) {
		mViewsManager.popupResizePosition(
				mHostJsViewState.view, align, max_width, max_height, aspect);
	}

	@Override
	@JavascriptInterface
	public void popupGainFocus() {
		mViewsManager.popupGainFocus();
	}
}
