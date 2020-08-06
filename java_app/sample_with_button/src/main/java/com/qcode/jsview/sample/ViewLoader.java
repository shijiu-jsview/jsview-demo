package com.qcode.jsview.sample;

import android.app.Activity;
import android.content.Context;
import android.util.Log;

import com.qcode.jsview.JsView;
import com.qcode.jsview.sample.submodule.DownloadCoreProgress;
import com.qcode.jsview.sample.submodule.JsViewRequestSdkProxy;
import com.qcode.jsview.sample.submodule.JsViewRuntimeBridge;
import com.qcode.jsview.sample.submodule.PageStatusListener;
import com.qcode.jsview.sample.submodule.StartIntentParser;
import com.qcode.jsview.sample.submodule.StartingImage;

public class ViewLoader {
	static private final String TAG = "ViewLoader";

	static public JsView loadJsView(
			Activity host_activity,
			StartIntentParser parsed_intent,
			PageStatusListener status_listener) {
		Context ctx = host_activity;

		// 若主JS的URL未设置，使用BuildConfig中配置的默认值
		if (parsed_intent.jsUrl.isEmpty()) {
			parsed_intent.jsUrl = BuildConfig.APP_URL;
		}
		// 若JS端API模块未设置，使用BuildConfig中配置的默认值
		if (parsed_intent.engineUrl.isEmpty()) {
			parsed_intent.engineUrl = BuildConfig.JSVIEW_JS_ENGINE_URL;
		}

		/* 展示启动图 */
		StartingImage.showStartingImage(
				host_activity,
				parsed_intent,
				R.drawable.startup_icon,
				R.id.PageLoad,
				R.id.DummySurfaceContainer);

		/* 加载SDK */
		JsViewRequestSdkProxy.requestJsViewSdk(
				host_activity.getApplication(),
				parsed_intent.coreVersionRange, // 当无版本指定时，使用APK自带的版本启动
				9226,
				// 创建内核升级时的进度跟踪器
				buildCoreDownloadListener(host_activity));

		/* 并创建JsView */
		JsView jsview = new JsView(host_activity);

		/* 加载调试选项 */
		DebugSettings.load(jsview);

		/* 加载Java穿透接口 JsDemoInterface */
		jsview.addJavascriptInterface(new JsDemoInterface(ctx), "jDemoInterface");

		/*
		 * Java穿透给JS的JsViewRuntimeBridge
		 * 建议所有容器都含有该接口，并命名为jJsvRuntime，方便形成统一的JS APP调用规范，提高应用的兼容性
		 */
		JsViewRuntimeBridge.enableBridge(host_activity, jsview, status_listener);

		if (!parsed_intent.engineUrl.isEmpty()) {
			// 使用接口JS和APP JS都可配置的接口
			jsview.loadUrl2(parsed_intent.engineUrl, parsed_intent.jsUrl);
		} else {
			// 针对引擎JS和APP JS打包在一起的场景(非react js)，使用APP JS的路径来启动
			jsview.loadUrl(parsed_intent.jsUrl);
		}

		return jsview;
	}

	// 创建引擎内核下载时的消息监听
	static private JsView.JsViewReadyCallback buildCoreDownloadListener(Activity host_activity) {
		DownloadCoreProgress.config("更新内核", "更新完毕", R.id.PageLoad);

		return new JsView.JsViewReadyCallback() {
			@Override
			public void onVersionReady(int jsview_version) {
				// 内核加载成功，此时若显示了内核升级进度条，则应该此时关闭
				DownloadCoreProgress.hideProgress(host_activity);
			}

			@Override
			public void onDownloadProgress(
					int max_steps, // 步骤总数
					int current_step, // 当前的步骤
					int download_total, // 若该步骤有下载动作，为下载的总字节数，否则为0
					int downloaded,    // 若该步骤有下载，为当前的下载字节数，否则为0
					String info) {  // 该步骤的描述
				// 当有下载动作时，开始有回调
				// 建议遇到current_step == 0时，开始展示内核升级的进度条

				float progress = 0.0f;

				// 进度为以current step为大进度，下载进度为小进度整体构成总进度
				progress = ((float)current_step + (download_total != 0 ? (float)downloaded / download_total : 0)) / (max_steps + 1);

				DownloadCoreProgress.updateProgress(host_activity, progress);
			}

			@Override
			public void onVersionFailed(String info /* 错误信息 */) {
				// 内核加载失败，此时若显示了内核升级进度条，则应该此时关闭
				DownloadCoreProgress.hideProgress(host_activity);
			}
		};
	}
}
