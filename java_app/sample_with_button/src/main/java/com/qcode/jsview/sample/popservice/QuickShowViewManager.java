package com.qcode.jsview.sample.popservice;

import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.PixelFormat;
import android.graphics.Point;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.Display;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.FrameLayout;

import com.qcode.jsview.JsView;
import com.qcode.jsview.sample.submodule.CurActivityInfo;
import com.qcode.jsview.sample.submodule.FavouriteSupport;
import com.qcode.jsview.sample.submodule.JsViewRequestSdkProxy;
import com.qcode.jsview.sample.submodule.JsViewRuntimeBridge;
import com.qcode.jsview.sample.submodule.JsViewState;
import com.qcode.jsview.sample.submodule.JsViewVersionUtils;
import com.qcode.jsview.sample.submodule.StartIntentBaseParser;
import com.qcode.jsview.sample.submodule.ViewsManagerDefine;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Set;

public class QuickShowViewManager extends ViewsManagerDefine {
	private static final String TAG = "QuickShowViewManager";

	private WindowManager mWindowManager;
	private int mGlobalWindowWidth;
	private int mGlobalWindowHeight;
	private FrameLayout mJsViewContainer = null;
	private FocusableView mFocusableView = null;
	private StartIntentBaseParser mStartIntentParser = null;

	private Context mContext = null;
	private Handler mMainThreadHandler = null;
	private HashMap<Integer, JsViewState> mActiveViewsMap = new HashMap<>();
	private ServiceLifeControl mServiceLifeControl = null;
	private boolean mPopupFocusable = false;

	FavouriteSupport mFavouriteSupport = null;

	public QuickShowViewManager(Context ctx, String core_update_url, String core_range, ServiceLifeControl life_control) {
		mContext = ctx;
		mServiceLifeControl = life_control;
		mMainThreadHandler = new Handler(Looper.getMainLooper());

		// 加载JsView内核
		JsViewRequestSdkProxy.changeCoreUpdateUrl(core_update_url);
		JsViewRequestSdkProxy.requestJsViewSdk(
				((Service)ctx).getApplication(),
				core_range,
				9336,
				null);

		mFavouriteSupport = new FavouriteSupport(ctx);
		mWindowManager = (WindowManager) ctx.getSystemService(Context.WINDOW_SERVICE);
		buildViewContainer(ctx);
	}

	public void loadJsView(StartIntentBaseParser start_intent_parser) {
		mStartIntentParser = start_intent_parser;

		// 清理所有已经展示的View
		clearActiveViews();

		// 启动启动页view
		JsViewState view_wrapper = addNewView(null, null);
		JsView jsview = view_wrapper.view;
		jsview.setVisibility(View.INVISIBLE); // 首个view有re-size后再显示，以解决闪屏问题

		// 启动超时计时器
		view_wrapper.activeLoadTimer(()->{
			Log.e(TAG, "FATAL: Corner page loading timeout");
			mServiceLifeControl.stopService();
		}, 8000); // 启动前都不可见，所以可以设置长一点的计时器

		jsview.loadUrl2(
			start_intent_parser.engineUrl,
			start_intent_parser.jsUrl
		);

		jsview.requestFocus();
	}

	@Override
	public int warmUpView(JsView starter_view, String engine_js_url, String app_url) {
		// 预先分配wrapper获得id
		JsViewState wrapper = new JsViewState(null, mStartIntentParser);

		mMainThreadHandler.post(()->{
			JsViewState view_wrapper = addNewView(starter_view, wrapper);
			if (view_wrapper != null) {
				view_wrapper.view.warmUp(engine_js_url, app_url);
			}
		});

		return wrapper.id;
	}

	@Override
	public void warmLoadView(int view_refer_id, String app_url, boolean add_history) {
		mMainThreadHandler.post(()->{
			JsViewState view_wrapper = mActiveViewsMap.get(view_refer_id);
			if (view_wrapper != null) {
				// 启动页面超时计时器，以免页面加载不出导致系统焦点一直被浮窗系统占用
				view_wrapper.activeLoadTimer(()->{
					Log.e(TAG, "FATAL: warmLoadView timeout!");
					mServiceLifeControl.stopService();
				}, 5000);

				Log.d(TAG, "Warm load view id=" + view_refer_id);
				view_wrapper.view.warmLoad(app_url);

				// 解除owner关系，独立存在(不随owner一起消失)
				view_wrapper.starterView = null;
			} else {
				Log.e(TAG, "warmLoadView: no valid id");
			}
		});
	}

	@Override
	public void closeWarmedView(int view_refer_id) {
		mMainThreadHandler.post(()->{
			JsViewState view_wrapper = mActiveViewsMap.get(view_refer_id);
			if (view_wrapper != null) {
				closeViewInner(view_wrapper.view);
			} else {
				Log.e(TAG, "closeWarmedView: no valid id");
			}
		});
	}

	@Override
	public void closePage(JsView host_view) {
		mMainThreadHandler.post(()->{
			closeViewInner(host_view);
		});
	}

	@Override
	public void popupGainFocus() {
		Log.d(TAG, "popupGainFocus");
		mMainThreadHandler.post(()->{
			if (!mPopupFocusable) {
				buildFocusableView(mContext);
//				// 使整个浮窗统能获取焦点
//				WindowManager.LayoutParams params = (WindowManager.LayoutParams)mJsViewContainer.getLayoutParams();
//				int origin_params_flags = params.flags;
//				params.flags &= (~(WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE));
//				Log.d("TestDebug", "popupGainFocus origin flags="
//						+ origin_params_flags + " new_flags=" + params.flags);
//				mJsViewContainer.setFocusable(true);
				mPopupFocusable = true;
			}
		});
	}

	@Override
	public void openWindow(JsView host_view, String url, String setting) {
		mMainThreadHandler.post(()->{
			if (url == null || url.isEmpty())
				return ;

			Log.d(TAG, "Open window url=" + url + " settings=" + setting);

			Uri uri = Uri.parse(url);
			Set<String> query_name_array = uri.getQueryParameterNames();

			// 为了在url中去除内置的参数，创建url_tmp来存储筛选掉的内容
			String url_tmp;
			if(uri.getPort() > 0) {
				url_tmp = uri.getScheme() + "://" + uri.getHost() + ":" + uri.getPort() + uri.getPath();
			}else{
				url_tmp = uri.getScheme() + "://" + uri.getHost() + uri.getPath();
			}

			String engine_url = null;
			String core_version_range = null;
			String startup_image = null;

			boolean first_query_value = true;

			for (String name : query_name_array) {
				if (name.equals("engineUrl")) {
					// engine js URL
					try {
						engine_url = URLDecoder.decode(uri.getQueryParameter(name), "utf-8");
					} catch (UnsupportedEncodingException e) {
						Log.e(TAG, "warning:", e);
						engine_url = null;
					}
				} else if (name.equals("coreVersionRange")) {
					// 内核Core的范围设定
					core_version_range = uri.getQueryParameter(name);
				} else if (name.equals("startImg")) {
					// 启动图
					try {
						startup_image = URLDecoder.decode(uri.getQueryParameter(name), "utf-8");
					} catch (UnsupportedEncodingException e) {
						Log.e(TAG, "warning:", e);
						startup_image = null;
					}
				} else if (name.equals("startDuration")) {
					// TODO: 启动图的启动时长

				} else if (name.equals("updateUrl")) {
					// TODO: 获取新的Core的获取URL

				} else if (name.equals("startVideo")) {
					// TODO: 启动Video
				} else {
					// 其他参数，放回到URL中
					if (first_query_value) {
						url_tmp += "?" + name + "=" + uri.getQueryParameter(name);
						first_query_value = false;
					} else {
						url_tmp += "&" + name + "=" + uri.getQueryParameter(name);
					}
				}
			}

			// 回补URL中的hash字段
			String fragment_tmp = uri.getFragment();
			if (fragment_tmp != null && !fragment_tmp.isEmpty()) {
				url_tmp += "#" + fragment_tmp;
			}

			// Parse settings
			try {
				JSONObject set_json = new JSONObject(setting);
				if (set_json.has("startupImage")) {
					startup_image = set_json.getString("startupImage");
				}
			} catch (JSONException e) {
				Log.e(TAG, "JSON error:", e);
			}

			openBlank(host_view, engine_url, url_tmp, startup_image, core_version_range);
		});
	}

	@Override
	public void setPopupInitSize(JsView host_view, String mode) {
		if (!mode.equals("full") && !mode.equals("mini")) {
			Log.e(TAG, "Error: setPopupInitSize not support mode=" + mode);
			return;
		}

		mMainThreadHandler.post(()->{
			for (JsViewState wrapper : mActiveViewsMap.values()) {
				if (wrapper.view == host_view) {
					// found view
					wrapper.popupSizeMode = mode;
					Log.d(TAG, "setPopupInitSize to mode=" + mode);
					break;
				}
			}
		});
	}

	// 重置界面的显示区域，以相对定位的方式调整弹出框的位置(弹出框弹出后先以尺寸1x1的方式展现)
	// align: 横纵对齐方式，有left, right, bottom, top, center可选择，
	//        例如: 右下角"right bottom", 居中"center center"
	// max_width: 显示区域最大宽度(占屏幕百分比)
	// max_height: 显示区域最大高度(占屏幕百分比)
	// aspect: 横纵比设定
	// 显示区域根据 max_width, max_height, aspect 来计算出同时满足3个条件的最大区域
	@Override
	public void popupResizePosition(
			JsView host_view, String align, double max_width, double max_height, double aspect) {
		if (align == null || max_width == 0 || max_height == 0 || aspect == 0) {
			Log.e(TAG, "Error: mistake input:"
					+ " align=" + align
					+ " max_width=" + max_width
					+ " max_height=" + max_height
					+ " aspect=" + aspect
			);
			return;
		}

		mMainThreadHandler.post(()->{
			int window_width = mGlobalWindowWidth;
			int window_height = mGlobalWindowHeight;

			// 计算出同时满足max_width, max_height, aspect的最大区域
			int target_width = (int)(Math.floor(max_width * window_width));
			int target_height = (int)(Math.floor(max_height * window_height));
			if (((double)target_width / target_height) > aspect) {
				// 宽超标，以高度为准
				target_width = (int)(target_height * aspect);
			} else {
				// 以宽度为准
				target_height = (int)(target_width / aspect);
			}

			// 解析定位
			int target_top;
			int target_left;
			// 横向定位解析
			if (align.contains("left")) {
				// 左对齐
				target_left = 0;
			} else if (align.contains("right")) {
				// 右对齐
				target_left = window_width - target_width;
			} else {
				// 居中对齐
				target_left = (window_width - target_width) / 2;
			}

			// 纵向定位解析
			if (align.contains("top")) {
				// 上对齐
				target_top = 0;
			} else if (align.contains("bottom")) {
				// 下对齐
				target_top = window_height - target_height;
			} else {
				// 居中对齐
				target_top = (window_height - target_height) / 2;
			}

			FrameLayout.LayoutParams layout_params = (FrameLayout.LayoutParams)host_view.getLayoutParams();
			layout_params.setMargins(
					target_left,
					target_top,
					0, 0);

			layout_params.width = target_width;
			layout_params.height = target_height;

			Log.d(TAG, "popupRelativePosition "
					+ " window width=" + window_width
					+ " window height=" + window_height
					+ " left=" + target_left
					+ " top=" + target_top
					+ " width=" + target_width
					+ " height=" + target_height);

			host_view.setLayoutParams(layout_params);
			host_view.setVisibility(View.VISIBLE);
		});
	}

	// private function
	private void buildViewContainer(Context ctx) {
		int perm = ctx.checkCallingOrSelfPermission("android.permission.SYSTEM_ALERT_WINDOW");
		if (perm == PackageManager.PERMISSION_GRANTED) {
			WindowManager.LayoutParams layout_params = new WindowManager.LayoutParams();
			if (Build.VERSION.SDK_INT >= 26) {//8.0新特性
				layout_params.type = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
			} else {
				layout_params.type = WindowManager.LayoutParams.TYPE_PHONE;
			}
			layout_params.format = PixelFormat.RGBA_8888;
			layout_params.gravity = Gravity.LEFT | Gravity.TOP;

			// 设置JsViewContainer为全屏范围
			initWindowSizeInfo(ctx);
			layout_params.width = mGlobalWindowWidth;
			layout_params.height = mGlobalWindowHeight;

			mJsViewContainer = new FrameLayout(ctx);

			int flags = WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED;
			flags |= WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;

			layout_params.flags = flags;

			mWindowManager.addView(mJsViewContainer, layout_params);
			mJsViewContainer.setVisibility(View.VISIBLE);
		} else {
			Log.d(TAG, "SYSTEM_ALERT_WINDOW permission not allowed.");
		}
	}

	private void buildFocusableView(Context ctx) {
		int perm = ctx.checkCallingOrSelfPermission("android.permission.SYSTEM_ALERT_WINDOW");
		if (perm == PackageManager.PERMISSION_GRANTED) {
			WindowManager.LayoutParams layout_params = new WindowManager.LayoutParams();
			if (Build.VERSION.SDK_INT >= 26) {//8.0新特性
				layout_params.type = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
			} else {
				layout_params.type = WindowManager.LayoutParams.TYPE_PHONE;
			}
			layout_params.format = PixelFormat.RGBA_8888;
			layout_params.gravity = Gravity.LEFT | Gravity.TOP;

			// 设置JsViewContainer为全屏范围
			initWindowSizeInfo(ctx);
			layout_params.width = 1;
			layout_params.height = 1;

			mFocusableView = new FocusableView(ctx, mJsViewContainer);

			mWindowManager.addView(mFocusableView, layout_params);
			mFocusableView.setVisibility(View.VISIBLE);
		} else {
			Log.d(TAG, "SYSTEM_ALERT_WINDOW permission not allowed.");
		}
	}

	private void initWindowSizeInfo(Context ctx) {
		WindowManager manager = (WindowManager) ctx.getSystemService(Context.WINDOW_SERVICE);
		Display display = manager.getDefaultDisplay();
		Point outSize = new Point();
		display.getRealSize(outSize);
		mGlobalWindowWidth = outSize.x;
		mGlobalWindowHeight = outSize.y;
		Log.d(TAG, "window info " + mGlobalWindowWidth + " " + mGlobalWindowHeight);
	}

	private JsViewState addNewView(JsView starter_view, JsViewState specific_wrapper) {
		JsView jsview = new JsView(mContext);

		JsViewState view_wrapper;
		if (specific_wrapper != null) {
			view_wrapper = specific_wrapper;
			view_wrapper.view = jsview;
		} else {
			view_wrapper = new JsViewState(jsview, mStartIntentParser);
		}

		// Service上的需要texture模式
		jsview.setCanvasViewMode("texture");

		JsViewRuntimeBridge.enableBridge(
				mContext,
				this,
				mFavouriteSupport,
				view_wrapper,
				view_wrapper.buildStatusListener());

		boolean view_expired = false;
		JsViewState owner_wrapper = null;
		if (starter_view != null) {
			// link to owner
			for (JsViewState test_wrapper : mActiveViewsMap.values()) {
				if (test_wrapper.view == starter_view) {
					view_wrapper.starterView = test_wrapper;
					owner_wrapper = test_wrapper;
					break;
				}
			}

			if (owner_wrapper == null) {
				// 启动者已经清理掉(过期)，当前view也需要无效处理
				view_expired = true;
				Log.d(TAG, "View expired");
			}
		}

		if (!view_expired) {
			if (owner_wrapper != null && owner_wrapper.popupSizeMode.equals("full")) {
				// 使用全屏模式展示浮窗
				mJsViewContainer.addView(jsview,
						FrameLayout.LayoutParams.MATCH_PARENT,
						FrameLayout.LayoutParams.MATCH_PARENT);
			} else {
				// 在loadUrl之前加入到ViewContainer中，应用根据自己需要调用RuntimeBridge.setPopPosition来调整位置
				mJsViewContainer.addView(jsview, 1, 1);
			}

			// 注意: 默认不给焦点,首个View自己申请焦点，或则JS通过gainFocus自我获取焦点

			mActiveViewsMap.put(view_wrapper.id, view_wrapper);
		} else {
			view_wrapper = null;
		}

		return view_wrapper;
	}

	private void closeViewInner(JsView target_view) {
		for (JsViewState test_wrapper : mActiveViewsMap.values()) {
			if (test_wrapper.view == target_view) {
				// Found view
				test_wrapper.clearLoadTimer();
				mActiveViewsMap.remove(test_wrapper.id);
				mJsViewContainer.removeView(test_wrapper.view);
				Log.d(TAG, "Closing JsView");
				break;
			}
		}

		// Close child view following owner
		for (JsViewState test_wrapper : mActiveViewsMap.values()) {
			if (test_wrapper.starterView != null
					&& !mActiveViewsMap.containsKey(test_wrapper.starterView.id)) {
				test_wrapper.clearLoadTimer();
				mActiveViewsMap.remove(test_wrapper.id);
				mJsViewContainer.removeView(test_wrapper.view);
				Log.d(TAG, "Closing sub JsView");
			}
		}

		if (mActiveViewsMap.size() == 0) {
			Log.d(TAG, "No valid view, shutdown QuickShow service");
			mServiceLifeControl.stopService();
		}
	}

	private void clearActiveViews() {
		Log.d(TAG, "do clearActiveViews");
		for (JsViewState test_wrapper : mActiveViewsMap.values()) {
			test_wrapper.clearLoadTimer();
		}
		mJsViewContainer.removeAllViews();
		mActiveViewsMap.clear();
	}

	private void openBlank(JsView host_view, String engine_url, String app_url, String start_img_url, String jsview_version) {
		// 新开Activity来展示新开的JsView
		// TODO: 在同一个Activity内通过内部管理生成多个JsView
		try {
			// 此处获得从service启动对应的className，不同于Activity内部启动新JsView
			String class_name = CurActivityInfo.getActivityNameForStartFromService();
			Intent intent = new Intent();
			if (engine_url == null || engine_url.trim().isEmpty()) {
				engine_url = host_view.getEngineUrl();
			}
			Log.d(TAG, "start sub tab " + engine_url + " " + app_url + " " + start_img_url + "  " + jsview_version + " " + class_name);
			ComponentName component_name = new ComponentName(mContext.getPackageName(), class_name);
			intent.setComponent(component_name);
			intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			if (jsview_version == null || jsview_version.isEmpty()) {
				jsview_version = JsViewVersionUtils.getCoreVersion();
			}
			intent.putExtra("COREVERSIONRANGE", jsview_version);
			intent.putExtra("URL", app_url);
			intent.putExtra("ENGINE", engine_url);
			intent.putExtra("STARTIMG", start_img_url);
			intent.putExtra("ISSUB", true);
			mContext.startActivity(intent);
		} catch (Exception e) {
			Log.d(TAG, "error", e);
		}
	}
}
