package com.qcode.jsview.sample;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.FrameLayout;
import android.widget.Toast;

import com.qcode.jsview.JsView;
import com.qcode.jsview.sample.submodule.JsViewRequestSdkProxy;
import com.qcode.jsview.sample.submodule.PageStatusListener;
import com.qcode.jsview.sample.submodule.StartIntentParser;
import com.qcode.jsview.sample.submodule.StartingImage;
import com.qcode.jsview.sample.utils.TimerInterval;

public class StartupProc {
	private static final String TAG = "StartupProc";

	public interface Listener {
		public void onViewCreated(JsView jsview);
	}

	public static void startWhenConnectReady(
						Activity host_activity,
						Intent starter_intent,
						Listener listener,
						boolean from_on_new_intent) {
		/* 解析启动参数 */
		StartIntentParser parsed_intent = new StartIntentParser(starter_intent);
		// 当OnNewIntent时，若发现已加载的JsView版本与要求的Sdk版本不一致时，重启进程
		if (from_on_new_intent) {
			if (JsViewRequestSdkProxy.needReboot(host_activity, parsed_intent)) {
				Log.d(TAG, "Do reload...");
				host_activity.finish();
				host_activity.startActivity(starter_intent);
				System.exit(0);
				android.os.Process.killProcess(android.os.Process.myPid());
			}
		}

		// 准备SDK, devtools 调试端口为9226
		if (isConnected(host_activity)) {
			addViewToContainer(host_activity, parsed_intent, listener);
		} else {
			Toast.makeText(host_activity, "网络已断开，请连接网络", Toast.LENGTH_LONG).show();
			TimerInterval timer = new TimerInterval();

			timer.start(() -> {
				boolean connect = isConnected(host_activity);
				if (connect) {
					timer.stopTimer();
					addViewToContainer(host_activity, parsed_intent, listener);
				}
			}, 1000);
		}
	}

	static public boolean isConnected(Context ctx) {
		ConnectivityManager connectivityManager = (ConnectivityManager) ctx.getSystemService(Context.CONNECTIVITY_SERVICE);
		NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
		if (networkInfo != null && networkInfo.isAvailable()) {
			Log.i("net", "有网络");
			return true;
		} else {
			Log.i("net", "无网络");
			return false;
		}
	}

	static private void addViewToContainer(Activity host_activity,
	                                       StartIntentParser parsed_intent,
	                                       Listener listener) {
		// 清理前一个JsView
		clearPreJsView(host_activity);

		PageStatusListener page_listener = new PageStatusListener() {
			@Override
			public void notifyPageLoaded() {
				// 当页面加载完毕，解除显示的启动图
				// 此调用来自JS线程，非主线程，所以需要转入主线程进行UI操作
				new Handler(Looper.getMainLooper()).post(() -> {
					StartingImage.hideStartingImage(host_activity, R.id.PageLoad);
				});
			}
		};

		JsView view = ViewLoader.loadJsView(host_activity, parsed_intent, page_listener);

		FrameLayout container = host_activity.findViewById(R.id.JsViewContainer);
		container.addView(view);

		view.requestFocus();

		if (listener != null) {
			listener.onViewCreated(view);
		}
	}

	private static void clearPreJsView(Activity host_activity) {
		// 关闭JsView
		FrameLayout container = (FrameLayout)host_activity.findViewById(R.id.JsViewContainer);
		container.removeAllViews();
	}
}
