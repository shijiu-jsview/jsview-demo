package com.qcode.jsview.sample.submodule;

import android.content.Intent;
import android.util.Log;

public class StartIntentParser {
	private static final String TAG = "StartIntentParser";

	public String jsUrl = "";
	public String engineUrl = "";
	public String startImageUrl = "";
	public String coreVersionRange = "";

	// isSub: 内部参数，在JsViewRuntimeBridge.openBlank时设定，用来控制不显示默认启动图
	public boolean isSub = false;

	public StartIntentParser(Intent intent) {
		// 可选：JsView 内核版本指定范围，若不指定，则会使用当前AAR携带的版本
		if (intent.hasExtra("COREVERSIONRANGE")) {
			String core_version_range = intent.getStringExtra("COREVERSIONRANGE");
			Log.d(TAG, "COREVERSIONRANGE:" + core_version_range);
			if (core_version_range != null) {
				coreVersionRange = core_version_range;
			}
		}

		// 可选：主JS的URL地址，若不指定，则使用gradle.properties中填写的 CustomConfig_AppUrl 的值
		if (intent.hasExtra("JSURL")) {
			String js_url = intent.getStringExtra("JSURL");
			Log.d(TAG, "JSURL:" + js_url);
			if (js_url != null) {
				jsUrl = js_url;
			}
		}

		// 可选：引擎JS接口层的地址，没有则使用gradle.properties中填写的 CustomConfig_EngineUrl 的值
		if (intent.hasExtra("ENGINE")) {
			String engine_url = intent.getStringExtra("ENGINE");
			Log.d(TAG, "ENGINE:" + engine_url);
			if (engine_url != null) {
				engineUrl = engine_url;
			}
		}

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

	public boolean isSamePage(StartIntentParser other_intent_parser) {
		return (other_intent_parser.jsUrl.equals(jsUrl)
				&& other_intent_parser.engineUrl.equals(engineUrl));
	}

	private void loadDebugChange() {
		// 在此可以配置一些调试用的参数来覆盖am start设置过来的参数，例如URL和engineUrl设定
//		jsUrl = "http://192.168.2.179:3000/static/js/bundle.js";
//		engineUrl = "http://cdn.release.51vtv.cn/forge_js/master/JsViewES6_react_r716.jsv.e3750856.js";
	}
}
