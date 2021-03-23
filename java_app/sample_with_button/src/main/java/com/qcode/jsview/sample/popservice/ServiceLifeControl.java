package com.qcode.jsview.sample.popservice;

import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.Process;
import android.util.Log;

public class ServiceLifeControl {
	private static final String TAG = "ServiceLifeControl";
	Service mHandler = null;

	public ServiceLifeControl(Service handler) {
		mHandler = handler;
	}

	public void stopService() {
		mHandler.stopSelf();
		Process.killProcess(Process.myPid());
	}

	public void rebootService(Intent new_intent) {
		Log.d(TAG, "will reboot service...");

		// Stop service
		mHandler.stopSelf();

		// Send new intent to trigger next service start
		new_intent.setAction("qcode.service.quick_show");
		new_intent.setPackage(mHandler.getPackageName());
		if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
			mHandler.startService(new_intent);
		} else {
			// 需要调研Android O上的新API startForegroundService
			mHandler.startForegroundService(new_intent);
		}

		// 进程退出，防止部分平台生命周期处理不完整导致进行始终占用资源
		Process.killProcess(Process.myPid());
	}
}
