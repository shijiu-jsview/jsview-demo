package com.qcode.jsview.sample.submodule;

import android.content.Context;
import android.util.Log;

import com.qcode.jsview.JsPromise;

public class FavouriteSupport {
	private static final String TAG = "FavouriteSupport";

	private Context mContext;

	public FavouriteSupport(Context ctx) {
		mContext = ctx;
	}

	public void addFavourite(String appName, String value, JsPromise promise) {
		// TODO: 使用ContentProvider来进行收藏处理
		Log.d(TAG, "addFavourite with name=" + appName);
	}

	public void updateFavourite(String appName, String value, JsPromise promise) {
		// TODO: 使用ContentProvider来进行收藏处理
		Log.d(TAG, "updateFavourite with name=" + appName);
	}

	public String getFavourite(String appName) {
		// TODO: 使用ContentProvider来进行收藏处理
		Log.d(TAG, "getFavourite with name=" + appName);
		return "{}";
	}

	public String getFavouriteAll() {
		// TODO: 使用ContentProvider来进行收藏处理
		return "[]";
	}
}
