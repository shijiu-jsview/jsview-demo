package com.qcode.jsview.sample;

import android.app.Activity;
import android.os.SystemClock;
import android.view.KeyEvent;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.Toast;

import com.qcode.jsview.JsView;

public class ViewLoader {
	static private final String TAG = "ViewLoader";

	private Activity mActivity;
	private JsView mJsView;
	private long mLastKeyUpTime = 0;

	private static final String sJsViewEngineUrl = BuildConfig.JSVIEW_JS_ENGINE_URL;
	private static final String sAppUrl = BuildConfig.APP_URL;

	public ViewLoader(Activity activity) {
		mActivity = activity;

		// 提前准备SDK, devtools 调试端口为9226
		JsView.requestSdk(activity, 9226);
	}

	public void onKeyDownForDebugReload(KeyEvent event) {
		if (mJsView != null) {
			// 双击菜单键进行view的reload操作
			if (event.getKeyCode() != KeyEvent.KEYCODE_MENU || event.getAction() != KeyEvent.ACTION_DOWN) {
				return;
			}

			long this_time_keyup = SystemClock.elapsedRealtime();
			if (mLastKeyUpTime > 0 && this_time_keyup - mLastKeyUpTime < 500) {
				Toast.makeText(mActivity, "页面重新加载...", Toast.LENGTH_LONG).show();
				mJsView.reload();
				mJsView.requestFocus();
				return;
			}
			mLastKeyUpTime = this_time_keyup;
		}
	}

	public boolean onKeyDownForCloseJsView(KeyEvent event) {
		/* TODO 删除按钮后该代码注释掉
		if (mJsView != null && event.getKeyCode() == KeyEvent.KEYCODE_BACK) {
			if (event.getAction() == KeyEvent.ACTION_DOWN) {
				clearPreJsView();
			}
			return true;
		}*/

		return false;
	}

	public void startJsView() {
		clearPreJsView();

		// 创建JsView并加入到屏幕上
		FrameLayout view = (FrameLayout)mActivity.findViewById(R.id.JsViewContainer);
		mJsView = new JsView(mActivity);
		mJsView.setBackgroundColor(0xFF0F0F0F);
		view.addView(mJsView, new FrameLayout.LayoutParams(
				ViewGroup.LayoutParams.MATCH_PARENT,
				ViewGroup.LayoutParams.MATCH_PARENT));

		// 加入Runtime接口
		JsRuntimeInterface js_interface = new JsRuntimeInterface(mActivity);
		mJsView.addJavascriptInterface(js_interface, "jRuntime"); // 在JS中以，jRuntime.XXXX()，进行调用其中接口

		// JsView加载URL
		mJsView.loadUrl2(
				sJsViewEngineUrl,
				// TODO: 此处改为react运行的主JS对应的地址，一版为 http://PC-IP:3000 下 /static/js/bundle.js
				sAppUrl);
		mJsView.requestFocus();
	}

	private void clearPreJsView() {
		// 关闭JsView
		FrameLayout container = (FrameLayout)mActivity.findViewById(R.id.JsViewContainer);
		container.removeAllViews();
		mJsView = null;
	}
}
