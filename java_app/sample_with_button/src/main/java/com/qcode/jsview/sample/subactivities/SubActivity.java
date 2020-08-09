package com.qcode.jsview.sample.subactivities;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;

import com.qcode.jsview.JsView;
import com.qcode.jsview.sample.DebugDevOption;
import com.qcode.jsview.sample.R;
import com.qcode.jsview.sample.StartupProc;
import com.qcode.jsview.sample.submodule.CurActivityInfo;

abstract public class SubActivity extends Activity {
	private static final String TAG = "SubActivity";

	// reload调试处理的View对象
	private JsView mDebugDevTargetView = null;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		Log.d(TAG + activityIndex(), "onCreate");
		super.onCreate(savedInstanceState);
		CurActivityInfo.setActivityIndex(activityIndex());
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
		Log.d(TAG + activityIndex(), "onNewIntent");
		// 更新主界面，接受新的URL配置
		StartupProc.startWhenConnectReady(this,
				getIntent(),
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
		Log.d(TAG + activityIndex(), "onStop");
	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
		CurActivityInfo.onActivityDestroy();
		Log.d(TAG + activityIndex(), "onDestroy " + CurActivityInfo.sActivityCount);
	}

	abstract int activityIndex();
}
