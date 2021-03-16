package com.qcode.jsview.sample.submodule;

import com.qcode.jsview.sample.subactivities.SubActivity;

// 当前进程活跃的JsView Activity的统计器，若当前进程没有活跃的Activity时，会进行进程退出处理
public class CurActivityInfo {
	private static final int TOTAL_ACTIVITY_NUM = 5;
	private static int sActivityIndex = 0;
	public static int sDevPortBase = 9226;
	public static int sActivityCount = 0;
	public static void setActivityIndex(int count) {
		sActivityIndex = count;
		if (sActivityIndex != 0) {
			sDevPortBase = 9240 + (sActivityIndex - 1) * 10;
		}
	}

	public static String getCurActivityName() {
		return SubActivity.class.getName() + sActivityIndex;
	}

	public static String getNextActivityName() {
		return SubActivity.class.getName() + (sActivityIndex + 1 > TOTAL_ACTIVITY_NUM ? 1 : sActivityIndex + 1);
	}

	public static String getActivityNameForStartFromService() {
		return SubActivity.class.getName() + Math.floor((double)TOTAL_ACTIVITY_NUM / 2);
	}

	public static void onActivityCreate() {
		sActivityCount++;
	}

	public static void onActivityDestroy() {
		sActivityCount--;
		if (sActivityCount <= 0) {
			// 检测到没有活跃的JsView实例，JsView进程退出
			System.exit(0);
			android.os.Process.killProcess(android.os.Process.myPid());
		}
	}
}
