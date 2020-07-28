package com.qcode.jsview.sample.utils;

import android.annotation.SuppressLint;
import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.util.Log;

import java.io.FileInputStream;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

public class Mac {
	private static final String TAG = "Mac";

	public static String getWireMac(Context ctx) {
		return getMacAddress();
	}

	public static String getWifiMac(Context ctx) {
		String mac = getWifiMacDefault(ctx);
		if (mac == null || mac.isEmpty()) {
			mac = getWifiMacAddressFromLocalFile();
		}
		if (mac == null || mac.isEmpty()) {
			mac = getMacFromHardware();
		}
		return mac;
	}

	private static String getMacAddressFromLocalFile() {
		String mac = "";
		try {
			String path = "sys/class/net/eth0/address";
			FileInputStream fis_name = new FileInputStream(path);
			byte[] buffer_name = new byte[8192];
			int byteCount_name = fis_name.read(buffer_name);
			if (byteCount_name > 0) {
				mac = new String(buffer_name, 0, byteCount_name, "utf-8");
				if(mac.contains(":"))
					mac = mac.replaceAll(":","");
			}
			if (mac == null || mac.isEmpty()) {
				return "";
			}
		} catch (Exception io) {
			Log.e(TAG, "Error:", io);
		}
		return mac.trim().toLowerCase();
	}

	private static String getMacAddress() {
		String mac_s= "";

		mac_s = getMacAddressFromLocalFile();

		if(mac_s != null && !mac_s.isEmpty())
			return mac_s;

		try {
			byte[] mac;
			NetworkInterface ne= NetworkInterface.getByInetAddress(InetAddress.getByName(getLocalIpAddress()));
			mac = ne.getHardwareAddress();
			mac_s = byte2hex(mac);
		} catch (Exception e) {
			Log.e(TAG, "Error:", e);
		}
		if(mac_s.contains(":"))
			mac_s = mac_s.replaceAll(":","");

		return mac_s.toLowerCase();
	}

	private static String getWifiMacAddressFromLocalFile() {
		String mac = "";
		try {
			String path = "/sys/class/net/wlan0/address";
			FileInputStream fis_name = new FileInputStream(path);
			byte[] buffer_name = new byte[1024];
			int byteCount_name = fis_name.read(buffer_name);
			if (byteCount_name > 0) {
				mac = new String(buffer_name, 0, byteCount_name, "utf-8");
				if(mac.contains(":"))
					mac = mac.replaceAll(":","");
			}
			if (mac == null || mac.isEmpty()) {
				return "";
			}
		} catch (Exception io) {
			Log.e(TAG, "Error:", io);
			return "";
		}
		return mac.trim().toLowerCase();
	}

	private static String getMacFromHardware() {
		try {
			List<NetworkInterface> all = Collections.list(NetworkInterface.getNetworkInterfaces());
			for (NetworkInterface nif : all) {
				if (!nif.getName().equalsIgnoreCase("wlan0")) continue;

				byte[] macBytes = nif.getHardwareAddress();
				if (macBytes == null) {
					return "";
				}

				StringBuilder res1 = new StringBuilder();
				for (byte b : macBytes) {
					res1.append(String.format("%02X:", b));
				}

				if (res1.length() > 0) {
					res1.deleteCharAt(res1.length() - 1);
				}
				String mac = res1.toString();
				if(mac.contains(":"))
					mac = mac.replaceAll(":","");
				return mac.trim().toLowerCase();
			}
		} catch (Exception e) {
			Log.e(TAG, "getMacFromHardware error", e);
		}
		return "";
	}

	@SuppressLint("MissingPermission")
	private static String getWifiMacDefault(Context context) {
		String mac = "";
		if (context == null) {
			return mac;
		}

		WifiManager wifi = (WifiManager) context.getApplicationContext()
				.getSystemService(Context.WIFI_SERVICE);
		if (wifi == null) {
			return mac;
		}
		WifiInfo info = null;
		try {
			info = wifi.getConnectionInfo();
		} catch (Exception e) {
			Log.e(TAG, "getWifiMacDefault error", e);
		}
		if (info == null) {
			return mac;
		}
		mac = info.getMacAddress();
		if (mac != null && !mac.isEmpty()) {
			if(mac.contains(":"))
				mac = mac.replaceAll(":","");
			mac = mac.trim().toLowerCase();
		}
		return mac;
	}

	private static String getLocalIpAddress() {
		try {
			for (Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces(); en.hasMoreElements();) {
				NetworkInterface intf = en.nextElement();
				for (Enumeration<InetAddress> enumIpAddr = intf.getInetAddresses(); enumIpAddr.hasMoreElements();) {
					InetAddress inetAddress = enumIpAddr.nextElement();
					if (!inetAddress.isLoopbackAddress()) {
						return inetAddress.getHostAddress().toString();
					}
				}
			}
		} catch (SocketException ex) {
			Log.e(TAG, "WifiPreference IpAddress" + ex.toString());
		}

		return null;
	}

	private static String byte2hex(byte[] b) {
		if (b == null) return "";
		StringBuffer hs = new StringBuffer(b.length);
		String stmp = "";
		int len = b.length;
		for (int n = 0; n < len; n++) {
			stmp = Integer.toHexString(b[n] & 0xFF);
			if (stmp.length() == 1)
				hs = hs.append("0").append(stmp);
			else {
				hs = hs.append(stmp);
			}
		}
		return String.valueOf(hs);
	}
}