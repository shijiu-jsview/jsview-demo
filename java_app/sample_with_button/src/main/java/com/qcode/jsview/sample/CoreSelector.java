package com.qcode.jsview.sample;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import android.webkit.JavascriptInterface;

import com.qcode.jsview.JsPromise;
import com.qcode.jsview.JsView;

public class CoreSelector {
	static private String TAG = "CoreSelector";

	private SharedPreferences mLocalSave = null;
	private JsApi mJsApi = new JsApi();

	static final private String SELECT_REVISION = "SelectRevision";

	public CoreSelector(Context ctx) {
		mLocalSave = ctx.getSharedPreferences("CoreSelector", ctx.MODE_PRIVATE);
	}

	public int getSelectedRevision() {
		return mLocalSave.getInt(SELECT_REVISION, -1);
	}

	public void saveSelection(int target_revision) {
		mLocalSave.edit().putInt(SELECT_REVISION, target_revision).commit();
	}

	public void registerApi(JsView jsview) {
		jsview.addJavascriptInterface(mJsApi, "jCoreSelector");
	}

	public class JsApi {
		public JsApi() {

		}

		@JavascriptInterface
		public void save(int target_revision, JsPromise promise) {
			new Thread(()->{
				CoreSelector.this.saveSelection(target_revision);

				Log.d(TAG, "Core revision changed to " + target_revision);

				// JsPromise 在resolve后，会回调js中关联的Promise的resolve
				promise.resolve("success");

			}).start();
		}
	}
}
