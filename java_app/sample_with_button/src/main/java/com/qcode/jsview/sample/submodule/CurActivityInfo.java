package com.qcode.jsview.sample.submodule;

import com.qcode.jsview.sample.subactivities.SubActivity;

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

	public static void onActivityCreate() {
		sActivityCount++;
	}

	public static void onActivityDestroy() {
		sActivityCount--;
		if (sActivityCount <= 0) {
			System.exit(0);
			android.os.Process.killProcess(android.os.Process.myPid());
		}
	}
}
