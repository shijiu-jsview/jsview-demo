package com.qcode.jsview.sample.submodule;

import android.content.Context;
import android.util.Log;

import com.qcode.jsview.JsView;

import java.lang.reflect.Method;

abstract public class JsViewRequestSdkProxy {
	public static final String TAG = "JsViewRequestSdkProxy";

	// 内核是否加载完成的标识
	private static boolean sSdkLoaded = false;

	// 内核调试模式是否启动的标识
	private static boolean sEnableEngineCodeDebug = true;

	// core_version_range格式(内核指定的格式)
	// XXXX+
	// XXXX-XXXX
	// XXXX
	static public void requestJsViewSdk(Context ctx, String core_version_range, int debug_port,
	                                    JsView.JsViewReadyCallback ready_callback) {
		if (!sSdkLoaded) {
			if (tryInnerLoader(ctx, core_version_range, debug_port)) {
				// 调试版本内核加载完成，进入内核调试模式
				sEnableEngineCodeDebug = true;
			} else {
				// 使用AAR进行内核加载

				// 根据内核指定，结合本地已缓存的内核版本，选择合适的内核版本
				String core_version = JsViewVersionUtils.parseVersion(ctx, core_version_range);

				// 指定内核版本
				JsView.configEngineVersion(core_version, null);

				// 开始加载内核
				JsView.requestSdk(ctx, debug_port, ready_callback);

				// 记录当前加载的内核版本，为needReboot()调用时作为判断依据
				JsViewVersionUtils.recordCoreVersion(core_version);
			}

			sSdkLoaded = true;
		}
	}

	public static boolean needReboot(Context ctx, StartIntentParser intent) {
		if (sEnableEngineCodeDebug) {
			// 调试版内核，不需要重启
			return false;
		}

		// 当已加载的内核版本和新要求的内核版本一致时，不需要重启进程
		return JsViewVersionUtils.needReboot(ctx, intent.coreVersionRange);
	}

	private static boolean tryInnerLoader(Context ctx, String core_version_range, int debug_port) {
		// 请忽略以下代码 :-)
		// 这只是为了便利JsView内核开发人员调试的小模块...

		try {
			ClassLoader class_loader = ctx.getClassLoader();
			Class<?> class_ref = class_loader.loadClass("com.qcode.jsview_inner_command.JsViewInnerLoader");

			Method method = class_ref.getDeclaredMethod("loadSdk", Context.class, String.class, int.class);
			boolean load_success = (boolean)(method.invoke(null, ctx, core_version_range, debug_port));

			return load_success;
		} catch (Exception e) {
			return false;
		}
	}
}
