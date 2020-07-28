package com.qcode.jsview.sample;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.SystemClock;
import android.util.Log;
import android.view.KeyEvent;

import com.qcode.jsview.JsView;

public class DebugDevOption {
	static final private String TAG = "DebugDevOption";

	static Dialog sDevOptionsDialog = null;
	static long sLastKeyUpTime = 0;

	public static void onKeyEvent(KeyEvent key_event, Context ctx, JsView current_jsview) {
		// 双击menu开启reload执行界面
		if (key_event.getKeyCode() != KeyEvent.KEYCODE_MENU || key_event.getAction() != KeyEvent.ACTION_UP) {
			return;
		}

		long this_time_keyup = SystemClock.elapsedRealtime();
		if (sLastKeyUpTime > 0 && this_time_keyup - sLastKeyUpTime < 500) {
			showDevOptionsDialog(ctx, current_jsview);
			return;
		}
		sLastKeyUpTime = this_time_keyup;
	}

	private static void showDevOptionsDialog(Context ctx, JsView current_jsview) {
		Log.d(TAG, "showDevOptionsDialog...");
		AlertDialog.Builder builder = new AlertDialog.Builder(ctx);
		builder.setItems(
				new String[]{"Reload"},
				(dialog, which) -> {
					if(which == 0) {
						if (current_jsview != null) {
							current_jsview.reload();
						}
					}
					sDevOptionsDialog = null;
				});
		builder.setOnCancelListener(new DialogInterface.OnCancelListener() {
			@Override
			public void onCancel(DialogInterface dialog) {
				sDevOptionsDialog = null;
			}
		});
		sDevOptionsDialog = builder.create();
		sDevOptionsDialog.show();
	}
}
