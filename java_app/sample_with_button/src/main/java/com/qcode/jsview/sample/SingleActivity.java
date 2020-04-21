package com.qcode.jsview.sample;

import android.app.Activity;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.Toast;

import com.qcode.jsview.JsView;

import java.util.List;

public class SingleActivity extends Activity {
	private static final String TAG = "SingleActivity";
	private ViewLoader mViewLoader;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.activity_main);

		mViewLoader = new ViewLoader(this);

		mViewLoader.startJsView();
		// 创建"点击开始"按钮
		//StarterButton.setupButton(this, mViewLoader);
	}

	@Override
	public boolean onKeyDown(int keycode, KeyEvent event) {
		boolean consume_back_key = false;

		// 当JsView未使用按键时，通过返回键退出JsView
		if (mViewLoader != null) {
			consume_back_key = mViewLoader.onKeyDownForCloseJsView(event);
		}

		// 退出应用
		if (!consume_back_key && event.getKeyCode() == KeyEvent.KEYCODE_BACK) {
			Toast.makeText(getApplicationContext(), "退出应用", Toast.LENGTH_LONG).show();
			this.finish();
			System.exit(0);
			android.os.Process.killProcess(android.os.Process.myPid());
		}

		// 双击菜单键对JsView进行reload，方便调试
		if (mViewLoader != null) {
			mViewLoader.onKeyDownForDebugReload(event);
		}

		return false;
	}

	@Override
	protected void onStop() {
		super.onStop();
		Log.d(TAG, "onStop");
		System.exit(0);
		android.os.Process.killProcess(android.os.Process.myPid());
	}
}
