package com.qcode.jsview.sample.submodule;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.qcode.jsview.JsView;

public class JsViewState {
	static final private String TAG = "JsViewState";

	static private int sIdGen = 1;

	public JsView view;
	public StartIntentBaseParser startIntent;
	public int id;

	// 本View的关联启动者，若启动者关闭，则此View自动关闭
	public JsViewState starterView;

	public JsViewState(JsView view, StartIntentBaseParser intent) {
		this.id = sIdGen++;
		this.view = view;
		this.startIntent = intent;
	}

	Runnable onLoadTimeout = null;
	int onTimerToken = 0; // 防止过期的时间处理生效的计数器
	boolean pageLoaded = false;

	public PageStatusListener buildStatusListener() {
		return new PageStatusListener() {
			@Override
			public void notifyPageLoaded() {
				onLoadTimeout = null;
				pageLoaded = true;
			}
		};
	}

	public void activeLoadTimer(Runnable on_timeout, long time_ms) {
		if (pageLoaded) {
			// 已经加载完成
			return;
		}

		onLoadTimeout = on_timeout;
		onTimerToken++;
		final int token = onTimerToken;
		new Handler(Looper.getMainLooper()).postDelayed(()->{
			if (onLoadTimeout != null && token == onTimerToken) {
				onLoadTimeout.run();
			}
		}, time_ms); // 页面加载超时
	}

	public void clearLoadTimer() {
		onTimerToken++;
		onLoadTimeout = null;
	}
}
