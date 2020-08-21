package com.qcode.jsview.sample;

import android.app.Activity;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.webkit.JavascriptInterface;

public class JsDemoInterface {
	private static final String TAG = "JsDemoInterface";
	private Handler mMainThreadHandler = new Handler(Looper.getMainLooper());
	private Context mContext;
	private Activity mHostActivity;
	public JsDemoInterface(Activity activity) {
		mHostActivity = activity;
		mContext = activity;
	}

	@JavascriptInterface
	public String getShowMode() {
		//0:demo 1:activity;
		return BuildConfig.SHOW_MODE;
	}
}
