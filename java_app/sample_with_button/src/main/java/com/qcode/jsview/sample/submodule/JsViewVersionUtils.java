package com.qcode.jsview.sample.submodule;

import android.content.Context;
import android.util.Log;

import com.qcode.jsview.JsView;

import java.util.List;


// 接口使用说明
// 1. 当进行 JsView.configEngineVersion(...) 之前，调用接口 parseVersion() 将版本范围转为本地能运行的可靠版本。
//    可靠版本寻找规则：
//    A. 若本地有版本范围指定的最低版本,则以最低版本为准
//    B. 若本地无最低版本，则选择本地有的范围内的最高版本为准
//    C. 本地若没有符合版本范围内的版本，则以最低版本为准，触发requestSdk的版本下载行为(JSC引擎不升级情况下为1.5M)
// 2. JsView.requestSdk(...)之后，需调用接口recordCoreVersion()，记录当前运行的内核版本
// 3. 当收到OnNewIntent时，调用needReboot()接口确认新的内核版本和当前运行中的版本是否匹配
public class JsViewVersionUtils {
	private static final String TAG = "JsViewVersionUtils";

	private static String sLoadedVersion = "";

	// Version Range格式
	// XXXX+
	// XXXX-XXXX
	// XXXX
	public static String parseVersion(Context ctx, String version_range) {
		int version_min = 0;
		int version_max = 9999;
		int target_version = JsView.INVALID_CORE_REVISION;

		try {
			if (version_range != null && !version_range.isEmpty()) {
				if (version_range.endsWith("+")) {
					// 发现格式 XXXX+
					version_min = Integer.parseInt(version_range.substring(0, version_range.length() - 1).trim());
					version_max = version_min / 10000 * 10000 /* 求出JSC版本 */ + 9999;
				} else if (version_range.indexOf("-") > 0) {
					// 发现格式 XXXX-XXXX
					String[] values = version_range.split("-");
					if (values.length == 2) {
						version_min = Integer.parseInt(values[0].trim());
						version_max = Integer.parseInt(values[1].trim());
					}
				} else {
					// 特定版本的格式
					int version_int = Integer.parseInt(version_range);
					if (version_int > 0) {
						version_min = Integer.parseInt(version_range);
						version_max = version_min;
					}
				}
			} else {
				Log.w(TAG, "Warning: invalid range=" + version_range);
			}

			// 设置默认版本为版本范围的最小版本，避免高版本的引擎引入新的问题导致运行不了
			if (version_min > 0) {
				target_version = version_min;
			}

			// 获取当前本地资源寻找合适的版本
			List<String> versions_list = JsView.listValidRevisions(ctx);

			// 版本号规则为 AABBBB 模式
			// AA为JSC版本号，BBBB为同JSC下子版本号
			// 版本比较时，是同JSC下进行版本匹配
			// 版本查找时以version_min的JSC的版本号为准
			// PS: BBBB的版本范围基本够10年左右的子版本提交量使用
			int jsc_version = version_min / 10000;
			int sub_version_min = version_min % 10000;
			int sub_version_max = version_max % 10000;

			if (versions_list != null) {
				for (String version : versions_list) {
					int version_value = Integer.parseInt(version);
					int item_jsc_ver = version_value / 10000;
					int item_ver = version_value % 10000;

					if (item_jsc_ver != jsc_version) {
						// 版本比较时，是同JSC下进行版本匹配
						continue;
					}

					if (item_ver >= sub_version_min && item_ver <= sub_version_max) {
						// 符合条件后，选取刚好等于最低版本
						// 若无和最低版本匹配版本，则选本地的最高版本来保证最好的兼容性
						if (version_value == version_min) {
							// 最小版本为最合适版本
							target_version = version_value;
							break;
						} else if (version_value > target_version) {
							// 最小版本以外的版本，选取最新版本
							target_version = version_value;
						}
					}
				}
			}
		} catch (Exception e) {
			Log.e(TAG, "Error: parseVersion, str=" + version_range + ",", e);
		}

		Log.d(TAG, "parseVersion(): askRange=" + version_range + " targetVersion=" + target_version);

		return "" + target_version;
	}

	public static void recordCoreVersion(String core_version) {
		sLoadedVersion = core_version;
	}

	public static boolean needReboot(Context ctx, String version_range) {
		String core_version = parseVersion(ctx, version_range);
		if (core_version.equals(sLoadedVersion))
			return false;
		return true;
	}

	public static String getCoreVersion() {
		return sLoadedVersion;
	}

	public static boolean needResetCore(Context ctx, String version_range) {
		return needReboot(ctx, version_range);
	}
}
