package com.qcode.jsview.sample.submodule;

import android.app.Activity;

public class JsViewActivitySupports {
	private static final String TAG = "JsViewActivitySupports";

	Activity mHostActivity;
	FavouriteSupport mFavouriteSupport;
	ViewsManager mViewsManager;

	public JsViewActivitySupports(Activity host_activity) {
		mHostActivity = host_activity;
		mFavouriteSupport = new FavouriteSupport(host_activity);
		mViewsManager = new ViewsManager(host_activity);
	}

	public Activity getHostActivity() {
		return mHostActivity;
	}

	public FavouriteSupport getFavouriteSupport() {
		return mFavouriteSupport;
	}

	public ViewsManager getViewsManager() {
		return mViewsManager;
	}
}
