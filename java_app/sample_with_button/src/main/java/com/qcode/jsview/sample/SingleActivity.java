package com.qcode.jsview.sample;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;

import com.qcode.jsview.JsView;
import com.qcode.jsview.sample.submodule.CurActivityInfo;

public class SingleActivity extends Activity {
	private static final String TAG = "SingleActivity";

	// reload调试处理的View对象
	private JsView mDebugDevTargetView = null;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		CurActivityInfo.onActivityCreate();
		setContentView(R.layout.activity_main);

		// 启动主界面
		StartupProc.startWhenConnectReady(this,
								getIntent(),
								jsview -> mDebugDevTargetView = jsview,
								false);
	}

	@Override
	protected void onNewIntent(Intent intent) {
		// 更新主界面，接受新的URL配置
		StartupProc.startWhenConnectReady(this,
								intent,
								jsview -> mDebugDevTargetView = jsview,
								true);

		super.onNewIntent(intent);
		setIntent(intent);
	}

	@Override
	public boolean dispatchKeyEvent(KeyEvent key_event) {
		DebugDevOption.onKeyEvent(key_event, this, mDebugDevTargetView);
		return super.dispatchKeyEvent(key_event);
	}

	@Override
	protected void onStop() {
		super.onStop();
		Log.d(TAG, "onStop");
	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
		CurActivityInfo.onActivityDestroy();
	}
}
