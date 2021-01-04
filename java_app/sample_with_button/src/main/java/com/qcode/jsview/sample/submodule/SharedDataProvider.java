package com.qcode.jsview.sample.submodule;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.content.Context;
import android.content.UriMatcher;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.content.SharedPreferences;

import java.util.Map;
import java.util.Set;

public class SharedDataProvider extends ContentProvider {
    public static final String CONTENT = "content://";
    public static final String AUTHORITY = "com.qcode.jsview.sp.SharedDataProvider";
    public static final String CONTENT_URI = CONTENT + AUTHORITY;
    public static final String OPTION_CLEAR = "clear";
    public static final String OPTION_DEL = "del";
    public static final String OPTION_QUERY = "query";
    public static final String OPTION_INSERT = "insert";
    public static final String OPTION_QUERYALL = "queryall";
    //这里的AUTHORITY就是我们在AndroidManifest.xml中配置的authorities
    public static final String BASE_PATH = "sp";// SharedPreference 缩写

    private static Object sLock = new Object();
    //匹配成功后的匹配码
    private static final int PREFERENCE_MATCH_CODE = 110;
    private static final int KEY_PREFERENCE_MATCH_CODE = 120;
    private static UriMatcher uriMatcher;
    private Context mContext;
    private SharedPreferences mSharedPreferences = null;
    private String mSharedPreferencesName = null;

    static {
        //匹配不成功返回NO_MATCH(-1)
        uriMatcher = new UriMatcher(UriMatcher.NO_MATCH);

        //添加我们需要匹配的uri
        uriMatcher.addURI(AUTHORITY, BASE_PATH, PREFERENCE_MATCH_CODE);
        // BASE/queryall
        uriMatcher.addURI(AUTHORITY, BASE_PATH + "/*/" + OPTION_QUERYALL, PREFERENCE_MATCH_CODE);
        // BASE/clear
        uriMatcher.addURI(AUTHORITY, BASE_PATH + "/*/" + OPTION_CLEAR, PREFERENCE_MATCH_CODE);
        // BASE/query/key/info
        uriMatcher.addURI(AUTHORITY, BASE_PATH + "/*/" + OPTION_QUERY + "/*", KEY_PREFERENCE_MATCH_CODE);
        // BASE/del/key/info
        uriMatcher.addURI(AUTHORITY, BASE_PATH + "/*/" + OPTION_DEL + "/*", KEY_PREFERENCE_MATCH_CODE);
        // BASE/insert/key/info/packageName
        uriMatcher.addURI(AUTHORITY, BASE_PATH + "/*/" + OPTION_INSERT + "/*/*", KEY_PREFERENCE_MATCH_CODE);
    }

    private SharedPreferences getSharedPreference(String name) {
        if (name != mSharedPreferencesName) {
            mSharedPreferencesName = name;
            mSharedPreferences = mContext.getSharedPreferences(BASE_PATH + "_SharedData_" + name, Context.MODE_PRIVATE);
        }
        return mSharedPreferences;
    }

    @Override
    public boolean onCreate() {
        mContext = getContext();
        return false;
    }

    @Override
    public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs, String sortOrder) {
        synchronized (sLock) {
            int match = uriMatcher.match(uri);
            if (match == PREFERENCE_MATCH_CODE
                && uri.getPathSegments().size() >= 2) {
                String name = uri.getPathSegments().get(1);
                SharedPreferences sp = getSharedPreference(name);
                Map<String, ?> all = sp.getAll();
                if (all != null) {
                    MatrixCursor cursor = new MatrixCursor(new String[]{"key", "value"});
                    Set<String> keySet = all.keySet();
                    for (String key : keySet) {
                        Object[] rows = new Object[2];
                        rows[0] = key;
                        rows[1] = all.get(key);
                        cursor.addRow(rows);
                    }
                    return cursor;
                }
            }
        }
        return null;
    }

    @Override
    public String getType(Uri uri) {
        synchronized (sLock) {
            if (uriMatcher.match(uri) == KEY_PREFERENCE_MATCH_CODE
                && uri.getPathSegments().size() >= 4) {
                String name = uri.getPathSegments().get(1);
                SharedPreferences sp = getSharedPreference(name);
                String key = uri.getPathSegments().get(3);
                return sp.getString(key, null);
            }
        }
        return null;
    }

    @Override
    public Uri insert(Uri uri, ContentValues values) {
        synchronized (sLock) {
            String packageName = mContext.getPackageName();
            if (uriMatcher.match(uri) == KEY_PREFERENCE_MATCH_CODE
                && uri.getPathSegments().size() >= 5
                && packageName.equals(uri.getPathSegments().get(4))) {
                String name = uri.getPathSegments().get(1);
                SharedPreferences sp = getSharedPreference(name);
                String key = uri.getPathSegments().get(3);
                String value = values.getAsString("value");
                sp.edit().putString(key, value).commit();
                notifyChange(uri);
            }
        }
        return null;
    }

    @Override
    public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs) {
        insert(uri, values);
        return 0;
    }

    @Override
    public int delete(Uri uri, String selection, String[] selectionArgs) {
        int delCount = 0;
        synchronized (sLock) {
            int match = uriMatcher.match(uri);
            if (match == PREFERENCE_MATCH_CODE) {
                if (uri.getPathSegments().size() >= 3) {
                    String name = uri.getPathSegments().get(1);
                    SharedPreferences sp = getSharedPreference(name);
                    delCount = sp.getAll().size();
                    sp.edit().clear().commit();
                    notifyChange(uri);
                }
                return delCount;
            } else if (match == KEY_PREFERENCE_MATCH_CODE) {
                if (uri.getPathSegments().size() >= 4) {
                    String name = uri.getPathSegments().get(1);
                    SharedPreferences sp = getSharedPreference(name);
                    String key = uri.getPathSegments().get(3);
                    if (sp.contains(key)) {
                        sp.edit().remove(key).commit();
                        delCount = 1;
                    }
                    notifyChange(uri);
                }
                return delCount;
            }
        }
        return delCount;
    }

    private void notifyChange(Uri uri) {
        getContext().getContentResolver().notifyChange(uri, null);
    }
}
