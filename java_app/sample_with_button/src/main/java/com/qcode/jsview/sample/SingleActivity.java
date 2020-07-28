package com.qcode.jsview.sample;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
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
import com.qcode.jsview.sample.submodule.JsViewRequestSdkProxy;
import com.qcode.jsview.sample.submodule.StartIntentParser;

import java.util.List;

public class SingleActivity extends Activity {
	private static final String TAG = "SingleActivity";

	private ViewStack mViewStack = null;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		// 初始化View管理器
		mViewStack = new ViewStack(this);

		// 启动主界面
		StartupProc.startWhenConnectReady(this,
								getIntent(),
								jsview -> mViewStack.activeView(jsview),
								false);
	}

	@Override
	protected void onNewIntent(Intent intent) {
		// 更新主界面，接受新的URL配置
		StartupProc.startWhenConnectReady(this,
								getIntent(),
								jsview -> mViewStack.activeView(jsview),
								true);

		super.onNewIntent(intent);
		setIntent(intent);
	}

	@Override
	public boolean dispatchKeyEvent(KeyEvent key_event) {
		DebugDevOption.onKeyEvent(key_event, this, mViewStack.currentView());
		return super.dispatchKeyEvent(key_event);
	}

	@Override
	protected void onStop() {
		super.onStop();
		Log.d(TAG, "onStop");
	}
}
