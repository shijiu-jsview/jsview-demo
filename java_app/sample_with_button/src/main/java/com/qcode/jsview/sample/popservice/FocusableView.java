package com.qcode.jsview.sample.popservice;

import android.content.Context;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.widget.FrameLayout;

public class FocusableView extends FrameLayout {
	private static final String TAG = "FocusableView";
	View mTargetView = null;

	public FocusableView(Context ctx, View target_view) {
		super(ctx);
		mTargetView = target_view;
	}

	@Override
	public boolean dispatchKeyEvent(KeyEvent event) {
		int key_code = event.getKeyCode();
		int action = event.getAction();
		Log.d(TAG, "on key event " + key_code);

		return mTargetView.dispatchKeyEvent(event);
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		return true;
	}

	@Override
	public boolean onKeyUp(int keyCode, KeyEvent event) {
		return true;
	}
}
