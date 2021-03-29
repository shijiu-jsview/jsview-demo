package com.qcode.jsview.sample;

import android.app.Activity;
import android.os.Process;
import android.util.Log;
import android.widget.Toast;

import com.qcode.jsview.AckEventListener;
import com.qcode.jsview.JsView;
import com.qcode.jsview.sample.submodule.CurActivityInfo;
import com.qcode.jsview.sample.submodule.DownloadCoreProgress;
import com.qcode.jsview.sample.submodule.JsViewActivitySupports;
import com.qcode.jsview.sample.submodule.JsViewRequestSdkProxy;
import com.qcode.jsview.sample.submodule.JsViewRuntimeBridge;
import com.qcode.jsview.sample.submodule.JsViewState;
import com.qcode.jsview.sample.submodule.PageStatusListener;
import com.qcode.jsview.sample.submodule.StartIntentParser;
import com.qcode.jsview.sample.submodule.StartingImage;
import com.qcode.jsview.shared_defined.AckEventDefine;

public class ViewLoader {
	static private final String TAG = "ViewLoader";

	static public JsView loadJsView(
			Activity host_activity,
			JsViewActivitySupports supports,
			StartIntentParser parsed_intent,
			PageStatusListener status_listener) {

		// 若主JS的URL未设置，使用BuildConfig中配置的默认值
		if (parsed_intent.jsUrl.isEmpty()) {
			parsed_intent.jsUrl = BuildConfig.APP_URL;
		}
		// 若JS端API模块未设置，使用BuildConfig中配置的默认值
		if (parsed_intent.engineUrl.isEmpty()) {
			parsed_intent.engineUrl = BuildConfig.JSVIEW_JS_ENGINE_URL;
		}

		/* 展示启动图 */
		int default_res = parsed_intent.isSub ? 0 : R.drawable.startup_icon;
		StartingImage.showStartingImage(
				host_activity,
				parsed_intent,
				default_res,
				R.id.PageLoad,
				R.id.DummySurfaceContainer);

		/* 加载SDK */
		int port = CurActivityInfo.sDevPortBase++;
		Log.d(TAG, "port:" + port + " pid:" + Process.myPid() + " js:" + parsed_intent.jsUrl);
		JsViewRequestSdkProxy.changeCoreUpdateUrl(parsed_intent.coreUpdateUrl);
		JsViewRequestSdkProxy.requestJsViewSdk(
				host_activity.getApplication(),
				parsed_intent.coreVersionRange, // 当无版本指定时，使用APK自带的版本启动
				port,
				// 创建内核升级时的进度跟踪器
				buildCoreDownloadListener(host_activity));

		/* 并创建JsView */
		JsView jsview = new JsView(host_activity);

		/* 加载调试选项 */
		DebugSettings.load(jsview);

		/* 加载Java穿透接口 JsDemoInterface */
		JsDemoInterface demo = new JsDemoInterface(host_activity);
		demo.useJsView(jsview); // 绑定JsView句柄，样例中的调用会使用
		jsview.addJavascriptInterface(demo, "jDemoInterface");


		// 测试样例: 监听 JsContext 的声明周期(reload时会发生JsContext重建)
		jsview.listenerToAckEvent(
				AckEventDefine.CATEGORY_JSC,
				AckEventDefine.TYPE_JS_CONTEXT_LIFECYCLE,
				null,
				event_data -> {
					Log.d(TAG, " reset of act=" + event_data.getString("act")
							+ " id=" + event_data.getInt("contextId")
					);
				}
		);

		/*
		 * Java穿透给JS的JsViewRuntimeBridge
		 * 建议所有容器都含有该接口，并命名为jJsvRuntime，方便形成统一的JS APP调用规范，提高应用的兼容性
		 */
		JsViewState jsview_state = new JsViewState(jsview, parsed_intent);
		JsViewRuntimeBridge.enableBridge(
				host_activity,
				supports.getViewsManager(),
				supports.getFavouriteSupport(),
				jsview_state,
				status_listener);

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

				Toast.makeText(host_activity, "Error:No valid SDK!(errMsg " + info + ")", Toast.LENGTH_LONG).show();
			}
		};
	}
}
