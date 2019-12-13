package com.qcode.jsview.sample;

import android.app.Activity;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.AttributeSet;
import android.util.Log;
import android.util.Xml;
import android.view.KeyEvent;
import android.view.ViewGroup;
import android.widget.Button;

import org.xmlpull.v1.XmlPullParser;

import java.util.concurrent.atomic.AtomicBoolean;

public class StarterButton {
	static private final String TAG = "StarterButton";

	static void setupButton(Activity activity, ViewLoader view_loader) {
		XmlPullParser parser = activity.getResources().getXml(R.xml.buttonset);
		AttributeSet attributes = Xml.asAttributeSet(parser);
		Button b = new MyButton(activity, attributes, view_loader);
		b.setText("****=============****\n****==按OK键启动==****\n****=============****");
		ViewGroup b_view = activity.findViewById(R.id.StarterButtonView);
		b_view.addView(b);
	}


	public static class MyButton extends Button{
		private AtomicBoolean mClicked = new AtomicBoolean(false);
		private Handler mMainHandler;
		private ViewLoader mViewLoader;
		public MyButton(Context context, AttributeSet set, ViewLoader view_loader) {
			super(context,set);
			mMainHandler = new Handler(Looper.getMainLooper());
			mViewLoader = view_loader;
		}

		@Override
		public boolean onKeyDown(int keyCode, KeyEvent event) {
			super.onKeyDown(keyCode,event);
			Log.d(TAG, "on key down " + System.currentTimeMillis());
			if (!mClicked.get() && keyCode == KeyEvent.KEYCODE_ENTER || keyCode == KeyEvent.KEYCODE_DPAD_CENTER) {
				mClicked.set(true);
				// 防止按键黏连，按下后锁定按键2秒
				mMainHandler.postDelayed(() -> mClicked.set(false), 2000);
				mViewLoader.startJsView();
				return true;
			}
			return false;
		}
	}
}
