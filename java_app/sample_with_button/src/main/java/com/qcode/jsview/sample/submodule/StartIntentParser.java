package com.qcode.jsview.sample.submodule;

import android.content.Intent;
import android.util.Log;

import java.io.File;

public class StartIntentParser extends StartIntentBaseParser {
	private static final String TAG = "StartIntentParser";

	public String startImageUrl = "";

	// isSub: 内部参数，在JsViewRuntimeBridge.openBlank时设定，用来控制不显示默认启动图
	public boolean isSub = false;

	public StartIntentParser(Intent intent) {
		super(intent);

		// 可选：启动图的连接地址
		if (intent.hasExtra("STARTIMG")) {
			String start_img_url = intent.getStringExtra("STARTIMG");
			Log.d(TAG, "STARTIMG:" + start_img_url);
			if (start_img_url != null) {
				startImageUrl = start_img_url;
			}
		}

		if (intent.hasExtra("ISSUB")) {
			isSub = intent.getBooleanExtra("ISSUB", false);
			Log.d(TAG, "ISSUB:" + isSub);
		}

		// 调试处理，调试时手动变化URL
		loadDebugChange();
	}

	private void loadDebugChange() {
		// 在此可以配置一些调试用的参数来覆盖am start设置过来的参数，例如URL和engineUrl设定
//		jsUrl = "http://192.168.2.179:3000/static/js/bundle.js";
//		engineUrl = "http://cdn.release.51vtv.cn/forge_js/master/JsViewES6_react_r716.jsv.e3750856.js";
	}
}
