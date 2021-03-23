package com.qcode.jsview.sample.submodule;

import android.content.Intent;
import android.util.Log;

public class StartIntentBaseParser {
	private static final String TAG = "StartIntentBaseParser";

	public String jsUrl = "";
	public String engineUrl = "";
	public String coreVersionRange = "";

	public StartIntentBaseParser(Intent intent) {
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
	}

	public boolean isSamePage(StartIntentBaseParser other_intent_parser) {
		return (other_intent_parser.jsUrl.equals(jsUrl)
				&& other_intent_parser.engineUrl.equals(engineUrl));
	}
}
