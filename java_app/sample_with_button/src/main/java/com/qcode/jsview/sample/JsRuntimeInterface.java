package com.qcode.jsview.sample;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

public class JsRuntimeInterface {
	private static final String TAG = "JsRuntime";
	private Handler mMainThreadHandler = new Handler(Looper.getMainLooper());
	private Context mContext;
	public JsRuntimeInterface(Context ctx) {
		mContext = ctx;
	}
	@JavascriptInterface
	public String getShowMode() {
		//0:demo 1:activity;
		return BuildConfig.SHOW_MODE;
	}
	@JavascriptInterface
	public String test(String data) {
		Log.i(TAG, "JsRuntime.test data=" + data);

		return "JsRuntime.test return";
	}

	@JavascriptInterface
	public void showToast(String msg) {
		mMainThreadHandler.post(new Runnable() {
			@Override
			public void run() {
				Toast.makeText(mContext, msg, Toast.LENGTH_LONG).show();
			}
		});
	}
}
