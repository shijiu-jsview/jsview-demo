package com.qcode.jsview.sample;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.JavascriptInterface;

public class JsDemoInterface {
	private static final String TAG = "JsDemoInterface";
	private Handler mMainThreadHandler = new Handler(Looper.getMainLooper());
	private Context mContext;
	public JsDemoInterface(Context ctx) {
		mContext = ctx;
	}

	@JavascriptInterface
	public String getShowMode() {
		//0:demo 1:activity;
		return BuildConfig.SHOW_MODE;
	}
}
