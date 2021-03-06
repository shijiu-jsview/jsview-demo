package com.qcode.jsview.sample.submodule;

import android.app.Activity;
import android.view.SurfaceView;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.bumptech.glide.Glide;

public class StartingImage {
	private static final String TAG = "StartingImage";
	private static boolean sImageShowing = false;

	// 记录防止启动图闪烁的Surface是否已经加入
	private static boolean sDummySurfaceAdded = false;

	static public void showStartingImage(Activity activity,
	                                     StartIntentParser intent,
	                                     int default_res_id,
	                                     int container_res_id,
	                                     int noblink_res_id) {
		preventScreenBlink(activity, noblink_res_id);
		FrameLayout page_load = (FrameLayout) activity.findViewById(container_res_id);

		if (intent.startImageUrl != null && !intent.startImageUrl.isEmpty()) {
			// 创建启动图并添加到容器中
			ImageView image_view = new ImageView(activity);
			image_view.setScaleType(ImageView.ScaleType.FIT_XY);
			page_load.addView(image_view, new FrameLayout.LayoutParams(
					ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

			// 展示启动图
			Glide.with(activity.getApplicationContext())
					.load(intent.startImageUrl)
					.into(image_view);
		} else if (default_res_id != 0){
			// 使用默认启动图
			ImageView image_view = new ImageView(activity);
			image_view.setScaleType(ImageView.ScaleType.FIT_XY);
			page_load.addView(image_view, new FrameLayout.LayoutParams(
					ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

			// 展示启动图
			image_view.setImageResource(default_res_id);
		}
	}

	static public void hideStartingImage(Activity activity, int container_res_id) {
		FrameLayout page_load = (FrameLayout) activity.findViewById(container_res_id);
		page_load.removeAllViews();
	}

	static private void preventScreenBlink(Activity activity, int noblink_res_id) {
		// 小技巧，加入一个小SurfaceView以防止Android 4.4系统首次引入SurfaceView时会导致启动图闪动问题
		if (!sDummySurfaceAdded) {
			// To avoid screen flashing in start-up
			SurfaceView sv = new SurfaceView(activity);
			((FrameLayout)activity.findViewById(noblink_res_id))
					.addView(sv, new LinearLayout.LayoutParams(0, 0));
			sDummySurfaceAdded = true;
		}
	}
}
