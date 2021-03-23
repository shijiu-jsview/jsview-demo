package com.qcode.jsview.sample.submodule;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.qcode.jsview.JsView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Set;
import java.util.Stack;

import static com.qcode.jsview.sample.submodule.JsViewVersionUtils.needResetCore;

public class ViewsManager extends ViewsManagerDefine {
	final static String TAG = "ViewsManager";

	Handler mMainThreadHandler = null;
	Context mContext = null;

	private class UrlInfo{
		String engineUrl;
		String appUrl;
	}

	private Stack<UrlInfo> mUrlStack = new Stack<>();

	public ViewsManager(Context ctx) {
		mContext = ctx;
		mMainThreadHandler = new Handler(Looper.getMainLooper());
	}

	@Override
	public void closePage(JsView host_view) {
		// 放入主线程完成
		mMainThreadHandler.post(()->{
			if (!mUrlStack.empty()) {
				UrlInfo url = mUrlStack.pop();
				host_view.loadUrl2(url.engineUrl, url.appUrl);
			} else {
				Activity host_activity = (Activity) mContext;
				host_activity.finish();
			}
		});
	}

	@Override
	public void openWindow(JsView host_view, String url, String setting) {
		mMainThreadHandler.post(()->{
			if (url == null || url.isEmpty())
				return ;

			Log.d(TAG, "Open window url=" + url + " settings=" + setting);

			Uri uri = Uri.parse(url);
			Set<String> query_name_array = uri.getQueryParameterNames();

			// 为了在url中去除内置的参数，创建url_tmp来存储筛选掉的内容
			String url_tmp;
			if(uri.getPort() > 0) {
				url_tmp = uri.getScheme() + "://" + uri.getHost() + ":" + uri.getPort() + uri.getPath();
			}else{
				url_tmp = uri.getScheme() + "://" + uri.getHost() + uri.getPath();
			}

			String engine_url = null;
			String core_version_range = null;
			String startup_image = null;

			boolean first_query_value = true;

			for (String name : query_name_array) {
				if (name.equals("engineUrl")) {
					// engine js URL
					try {
						engine_url = URLDecoder.decode(uri.getQueryParameter(name), "utf-8");
					} catch (UnsupportedEncodingException e) {
						Log.e(TAG, "warning:", e);
						engine_url = null;
					}
				} else if (name.equals("coreVersionRange")) {
					// 内核Core的范围设定
					core_version_range = uri.getQueryParameter(name);
				} else if (name.equals("startImg")) {
					// 启动图
					try {
						startup_image = URLDecoder.decode(uri.getQueryParameter(name), "utf-8");
					} catch (UnsupportedEncodingException e) {
						Log.e(TAG, "warning:", e);
						startup_image = null;
					}
				} else if (name.equals("startDuration")) {
					// TODO: 启动图的启动时长

				} else if (name.equals("updateUrl")) {
					// TODO: 获取新的Core的获取URL

				} else if (name.equals("startVideo")) {
					// TODO: 启动Video
				} else {
					// 其他参数，放回到URL中
					if (first_query_value) {
						url_tmp += "?" + name + "=" + uri.getQueryParameter(name);
						first_query_value = false;
					} else {
						url_tmp += "&" + name + "=" + uri.getQueryParameter(name);
					}
				}
			}

			openBlank(host_view, engine_url, url_tmp, startup_image, core_version_range);
		});
	}

	@Override
	public int warmUpView(JsView starter_view, String engine_js_url, String app_url) {
		// TODO: Activity view暂时不支持预热
		return 0;
	}

	@Override
	public void warmLoadView(int view_refer_id, String app_url) {
		// TODO: Activity view暂时不支持预热
	}

	@Override
	public void closeWarmedView(int view_refer_id) {
		// TODO: Activity view暂时不支持预热
	}

	@Override
	public void popupAbsolutePosition(
			JsView host_view, double left, double top, double width, double height) {
		Log.w(TAG, "popupAbsolutePosition: No in popup view manager");
	}

	@Override
	public void popupRelativePosition(
			JsView host_view, String align, double max_width, double max_height, double aspect) {
		Log.w(TAG, "popupRelativePosition: No in popup view manager");
	}

	@Override
	public void popupGainFocus() {
		Log.w(TAG, "popupGainFocus No in popup view manager");
	}

	@Deprecated
	public void openSelf(JsView host_view, String from_url, String to_url, String engine_url) {
		if (engine_url == null || engine_url.trim().isEmpty()) {
			engine_url = host_view.getEngineUrl();
		}

		String final_engine_url = engine_url;
		mMainThreadHandler.post(()->{
			UrlInfo url_info = new UrlInfo();
			url_info.appUrl = from_url;
			url_info.engineUrl = host_view.getEngineUrl();
			mUrlStack.push(url_info);

			Log.d(TAG, "openSelf " + from_url + " " + to_url + " " + final_engine_url);
			host_view.loadUrl2(final_engine_url, to_url);
		});
	}

	// private function
	private void openBlank(JsView host_view, String engine_url, String app_url, String start_img_url, String jsview_version) {
		// 新开Activity来展示新开的JsView
		// TODO: 在同一个Activity内通过内部管理生成多个JsView
		try {
			String class_name = CurActivityInfo.getCurActivityName();
			if (jsview_version != null && !jsview_version.isEmpty() && needResetCore(mContext, jsview_version)) {
				class_name = CurActivityInfo.getNextActivityName();
			}
			Intent intent = new Intent();
			if (engine_url == null || engine_url.trim().isEmpty()) {
				engine_url = host_view.getEngineUrl();
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
}
