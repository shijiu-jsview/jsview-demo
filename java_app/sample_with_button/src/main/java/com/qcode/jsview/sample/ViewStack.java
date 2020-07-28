package com.qcode.jsview.sample;

import android.app.Activity;

import com.qcode.jsview.JsView;

public class ViewStack {
	private JsView mCurrentView = null;
	private Activity mHostActivity = null;

	public ViewStack(Activity host_activity) {
		mHostActivity = host_activity;
	}

	void activeView(JsView view) {
		mCurrentView = view;
	}

	JsView currentView() {
		return mCurrentView;
	}
}
