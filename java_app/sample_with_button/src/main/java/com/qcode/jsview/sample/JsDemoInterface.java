package com.qcode.jsview.sample;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.JavascriptInterface;

import com.qcode.jsview.AckEventListener;
import com.qcode.jsview.JsView;
import com.qcode.jsview.shared_defined.AckEventDefine;

import java.util.HashMap;

public class JsDemoInterface {
	private static final String TAG = "JsDemoInterface";
	private Handler mMainThreadHandler = new Handler(Looper.getMainLooper());
	private Context mContext;
	private Activity mHostActivity;
	private JsView mJsView = null;

	// 测试样例: JS层面的NativeSharedView的坐标变化监听处理
	private HashMap<String, AckEventListener> mAckListenerMap = new HashMap<>();

	public JsDemoInterface(Activity activity) {
		mHostActivity = activity;
		mContext = activity;
	}

	public void useJsView(JsView view) {
		mJsView = view;
	}

	@JavascriptInterface
	public void listenerToSharedView(String track_id) {
		if (!mAckListenerMap.containsKey(track_id)) {
			// 通过ListenerToAckEvent接口注册监听回调
			// 若注册晚于事件发出的时间点，首次注册会立刻收到最后一条消息
			// 通过TimeStamp信息得到这条消息的发生时刻，以决定是否过期
			mAckListenerMap.put(track_id, mJsView.listenerToAckEvent(
				AckEventDefine.CATEGORY_VIEW,
				AckEventDefine.TYPE_SHARED_VIEW_LAYOUT,
				track_id,
				event_data -> {
					Log.d(TAG, "track_id=" + track_id
							+ " timeStamp=" + event_data.getLong("timeStamp")
							+ " x=" + event_data.getInt("x")
							+ " y=" + event_data.getInt("y")
							+ " width=" + event_data.getInt("width")
							+ " height=" + event_data.getInt("height")
							+ " designedMapWidth=" + event_data.getInt("dw")
					);
				}
			));
		}
	}

	@JavascriptInterface
	public void removeListenerToSharedView(String track_id) {
		// 通过 recycle 接口，对释放监听者
		if (mAckListenerMap.containsKey(track_id)) {
			AckEventListener listener = mAckListenerMap.remove(track_id);
			listener.recycle();
		}
	}

	@JavascriptInterface
	public String getShowMode() {
		//0:demo 1:activity;
		return BuildConfig.SHOW_MODE;
	}
}
