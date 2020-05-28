package com.qcode.jsview.sample;

import android.util.Log;

import com.qcode.jsview.JsView;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

abstract public class DebugSettings {
	static final String TAG = "DebugSettings";

	static void load(JsView jsview) {
		Properties prop = new Properties();

		try {
			File f = new File("/data/local/tmp/JsViewDebugSettings.cfg");
			if (f.exists()) {
				InputStream in = new FileInputStream(f);
				prop.load(in);
				in.close();
			} else {
				Log.d(TAG, "No settings file: /data/local/JsViewDebugSettings.cfg");
				return;
			}
		} catch (Exception e) {
			Log.e(TAG, "Error:", e);
			return;
		}

		// Enable FPS
		int enable_fps = Integer.parseInt(prop.getProperty("displayFps", "0"));
		if (enable_fps != 0) {
			jsview.enableFpsDisplay(true);
		}

		// Other...
	}
}
