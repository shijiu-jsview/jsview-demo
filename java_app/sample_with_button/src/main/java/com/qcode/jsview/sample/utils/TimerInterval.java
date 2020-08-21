package com.qcode.jsview.sample.utils;

import android.os.Handler;
import android.util.Log;

public class TimerInterval {
	final private String TAG = "TimerInterval";
	private boolean mCancelFlag = false;

	public void start(Runnable callback, int timeout) {
		if (callback == null || timeout <= 0) {
			Log.e(TAG, "Error: parameter format error");
			return;
		}

		Handler callback_handler = new Handler();
		mCancelFlag = false;

		new Thread(()->{
			while(true) {
				try {
					Thread.sleep(timeout);
				} catch (InterruptedException e) {
					Log.e(TAG, "Error:", e);
				}

				if (mCancelFlag) {
					break;
				}

				callback_handler.post(callback);
			}
		}).start();
	}

	public void stopTimer() {
		mCancelFlag = true;
	}
}
