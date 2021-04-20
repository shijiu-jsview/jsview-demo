package com.qcode.jsview.sample.popservice;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import com.qcode.jsview.sample.submodule.JsViewRequestSdkProxy;
import com.qcode.jsview.sample.submodule.StartIntentBaseParser;

import androidx.core.app.NotificationCompat;

public class QuickShowService extends Service {
	private static final String TAG = "QuickShowService";

	private QuickShowViewManager mQuickShowViewManager = null;

	private boolean mForegroundStarted = false;

	private ServiceLifeControl mServiceLifeControl = null;

	@Override
	public void onCreate() {
		Log.d(TAG, "onCreate()'ed");
		super.onCreate();
		mServiceLifeControl = new ServiceLifeControl(this);
		startForegroundService();
	}

	private void startForegroundService() {
		if (mForegroundStarted || Build.VERSION.SDK_INT <= Build.VERSION_CODES.KITKAT) {
			return;
		}

		try{
			Log.d(TAG, "::startForgroundService Build.VERSION.SDK_INT = " + Build.VERSION.SDK_INT);
			Context context = getApplicationContext();
			Intent intent = new Intent(context, QuickShowService.class);
			intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
			PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_CANCEL_CURRENT);
			String id = "1";
			String name = "channel_name_1";
			NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
			Notification notification = null;
			if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
				NotificationChannel mChannel = new NotificationChannel(id, name, NotificationManager.IMPORTANCE_DEFAULT);
				mChannel.setSound(null, null);
				notificationManager.createNotificationChannel(mChannel);
				notification = new Notification.Builder(context)
						.setChannelId(id)
						.setContentTitle("QuickShow")
						.setContentIntent(pendingIntent)
						.setAutoCancel(false)// 设置这个标志当用户单击面板就可以让通知将自动取消
						.setOngoing(true)// true，设置他为一个正在进行的通知。他们通常是用来表示一个后台任务,用户积极参与(如播放音乐)或以某种方式正在等待,因此占用设备(如一个文件下载,同步操作,主动网络连接)
						.setSmallIcon(android.R.drawable.sym_def_app_icon).build();
			} else if(Build.VERSION.SDK_INT > Build.VERSION_CODES.KITKAT) {
				NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(context)
						.setContentTitle("QuickShow")
						.setContentIntent(pendingIntent)
						.setPriority(Notification.PRIORITY_DEFAULT)// 设置该通知优先级
						.setAutoCancel(false)// 设置这个标志当用户单击面板就可以让通知将自动取消
						.setOngoing(true)// true，设置他为一个正在进行的通知。他们通常是用来表示一个后台任务,用户积极参与(如播放音乐)或以某种方式正在等待,因此占用设备(如一个文件下载,同步操作,主动网络连接)
						.setSmallIcon(android.R.drawable.sym_def_app_icon);
				notification = notificationBuilder.build();
			}
			startForeground(1, notification);
		}catch (Exception e){
			Log.e(TAG,"::onStartCommand startForeground error. " + e);
		}

		mForegroundStarted = true;
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		Log.i(TAG, "onStartCommand start id " + startId + ": " + intent);

		StartIntentBaseParser start_intent = new StartIntentBaseParser(intent);
//		DebugStartIntent.changeStartIntent(start_intent);

		if (mQuickShowViewManager == null) {
			mQuickShowViewManager = new QuickShowViewManager(
					this,
					start_intent.coreUpdateUrl,
					start_intent.coreVersionRange,
					mServiceLifeControl);
		} else {
			// 当Core版本不一致时需要重启，因为Core是一个JNI内核，无法重复加载
			if (JsViewRequestSdkProxy.needReboot(this, start_intent)) {
				// 需要重启
				mServiceLifeControl.rebootService(intent);
				return START_NOT_STICKY;
			}
		}

		mQuickShowViewManager.loadJsView(start_intent);

		Log.i(TAG, "onStartCommand success");

		return START_NOT_STICKY;
	}

	@Override
	public IBinder onBind(Intent intent) {
		Log.d(TAG, "onBind()'ed");

		return null;
	}

	@Override
	public void onRebind(Intent intent) {
		Log.d(TAG, "onRebind()'ed");
		super.onRebind(intent);
	}

	@Override
	public boolean onUnbind(Intent intent) {
		Log.d(TAG, "onUnbind()'ed");
		super.onUnbind(intent);
		return true;	// return true, for enable rebind message
	}

	@Override
	public void onDestroy() {
		Log.d(TAG, "onDestroy()'ed");
		try{
			stopForeground(true);
		}catch(Exception e){
			Log.e(TAG,"stopForeground error. " + e);
		}
		super.onDestroy();
		System.exit(0);
	}
}
