package com.qcode.jsview.sample.submodule;

import android.app.Activity;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.Color;
import android.graphics.drawable.ClipDrawable;
import android.graphics.drawable.Drawable;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.TranslateAnimation;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import com.qcode.jsview.sample.R;

public class DownloadCoreProgress {
	final private static String TAG = "DownloadCoreProgress";
	private static String sTextOnLoading = null;
	private static String sTextOnDone = null;
	private static int sContainerResourceId = 0;
	private static boolean sShowing = false; // 是否展示中
	private static ClipDrawable sClipDrawable =  null;
	private static FrameLayout sSeekBarContainer =  null;

	public static void config(String text_on_loading, String text_on_done, int container_res_id) {
		sTextOnLoading = text_on_loading;
		sTextOnDone = text_on_done;
		sContainerResourceId = container_res_id;
	}

	public static void updateProgress(Activity activity, float new_percent /* 0 ~ 1 */) {
		if (!sShowing) {
			// 若进度条未显示，在此启动进度条显示
			if (sTextOnLoading != null && sTextOnDone != null && sContainerResourceId != 0) {
				showProgressInner(activity, sTextOnLoading, sContainerResourceId);
				sShowing = true;

				// 更新进度值
				changeProgress(new_percent);
			} else {
				Log.e(TAG, "Error: Should configure first.");
			}
		} else {
			// 进度条已经显示完毕，则更新即可
			changeProgress(new_percent);
		}
	}

	public static void hideProgress(Activity activity) {
		// 关闭进度条显示
		if (sShowing) {
			hideProgressInner(activity, sTextOnDone);
			sShowing = false;
		}
	}

	// private function
	private static void showProgressInner(Activity activity, String text_on_loading, int container_res_id) {
		FrameLayout progressbar_container = (FrameLayout)activity.findViewById(container_res_id);
		Resources res_getter = activity.getResources();

		//进度条背景
		FrameLayout seekbar_container = new FrameLayout(activity);
		FrameLayout.LayoutParams container_params = new FrameLayout.LayoutParams(
				FrameLayout.LayoutParams.WRAP_CONTENT,
				FrameLayout.LayoutParams.WRAP_CONTENT);

		container_params.setMargins(
				(int)(res_getter.getDimension(R.dimen.x494)),
				(int)(res_getter.getDimension(R.dimen.x517)),
				0, 0);
		progressbar_container.addView(seekbar_container, container_params);

		ImageView seekbar_bg = new ImageView(activity);
		seekbar_bg.setImageResource(R.drawable.seekbar_bg);
		seekbar_container.addView(seekbar_bg, new FrameLayout.LayoutParams(
				(int)(res_getter.getDimension(R.dimen.x292)),
				(int)(res_getter.getDimension(R.dimen.x152))));

		//进度条
		Drawable drawable_bg = res_getter.getDrawable(R.drawable.seekbar);
		ClipDrawable clip_drawable = new ClipDrawable(drawable_bg, Gravity.LEFT, ClipDrawable.HORIZONTAL);
		clip_drawable.setLevel(30);

		ImageView seekbar = new ImageView(activity);
		seekbar.setBackground(clip_drawable);
		FrameLayout.LayoutParams seekbar_params = new FrameLayout.LayoutParams(
				(int)(res_getter.getDimension(R.dimen.x200)),
				(int)(res_getter.getDimension(R.dimen.x60)),
				Gravity.CENTER);
		seekbar_container.addView(seekbar, seekbar_params);

		//添加加载中的文字
		TextView text_view = new TextView(activity);
		text_view.setText(text_on_loading);
		text_view.setTextSize((int)(res_getter.getDimension(R.dimen.x26) / getScaledDensity(activity) + 0.5f));
		text_view.setTextColor(0xFFFFFFFF);
		FrameLayout.LayoutParams text_params = new FrameLayout.LayoutParams(
				FrameLayout.LayoutParams.MATCH_PARENT,
				FrameLayout.LayoutParams.MATCH_PARENT,
				Gravity.CENTER);
		seekbar_container.addView(text_view, text_params);

		// 记录界面关闭时需要的引用
		sClipDrawable = clip_drawable;
		sSeekBarContainer = seekbar_container;
	}

	private static void changeProgress(float new_percent) {
		sClipDrawable.setLevel((int)(10000 * new_percent));
	}

	private static void hideProgressInner(Activity activity, String text_on_done) {
		Resources res_getter = activity.getResources();
		FrameLayout seekbar_container = sSeekBarContainer;

		//平移，进度条向下平移
		Animation translate_anima = new TranslateAnimation(0, 0, 0, 60);
		translate_anima.setDuration(300);
		translate_anima.setStartOffset(500);
		translate_anima.setInterpolator(new AccelerateDecelerateInterpolator());
		translate_anima.setFillAfter(true);

		// 清理进度条
		sClipDrawable = null;
		seekbar_container.removeAllViews();

		//进度条背景
		ImageView seekbar_bg = new ImageView(activity);
		seekbar_bg.setImageResource(R.drawable.seekbar_bg);
		seekbar_container.addView(seekbar_bg, new FrameLayout.LayoutParams(
				(int)(res_getter.getDimension(R.dimen.x292)),
				(int)(res_getter.getDimension(R.dimen.x152))));

		//进度条
		Resources resources = activity.getResources();
		Drawable drawable_bg = resources.getDrawable(R.drawable.seekbar);
		ImageView seekbar = new ImageView(activity);
		seekbar.setImageResource(R.drawable.seekbar);
		seekbar.setBackground(drawable_bg);
		FrameLayout.LayoutParams seekbar_params = new FrameLayout.LayoutParams(
				(int)(res_getter.getDimension(R.dimen.x200)),
				(int)(res_getter.getDimension(R.dimen.x60)),
				Gravity.CENTER);
		seekbar_container.addView(seekbar, seekbar_params);

		//添加文字
		TextView text_view = new TextView(activity);
		text_view.setText(text_on_done);
		text_view.setTextSize((int)(res_getter.getDimension(R.dimen.x26) / getScaledDensity(activity) + 0.5f));
		text_view.setTextColor(0xFFFFFFFF);
		FrameLayout.LayoutParams text_params = new FrameLayout.LayoutParams(
				FrameLayout.LayoutParams.MATCH_PARENT,
				FrameLayout.LayoutParams.MATCH_PARENT,
				Gravity.CENTER);
		seekbar_container.addView(text_view, text_params);
		translate_anima.setAnimationListener(new Animation.AnimationListener() {
			@Override
			public void onAnimationStart(Animation animation) {

			}

			@Override
			public void onAnimationEnd(Animation animation) {
				((FrameLayout)seekbar_container.getParent()).removeView(seekbar_container);
				sSeekBarContainer = null;
			}

			@Override
			public void onAnimationRepeat(Animation animation) {

			}
		});
		seekbar_container.startAnimation(translate_anima);
	}

	private static float getScaledDensity(Context ctx) {
		// init basic screen info
		DisplayMetrics dm = ctx.getResources().getDisplayMetrics();
		return dm.scaledDensity;
	}
}
