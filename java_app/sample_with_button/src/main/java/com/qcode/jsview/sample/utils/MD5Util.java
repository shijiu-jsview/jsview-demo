package com.qcode.jsview.sample.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Comparator;
import java.util.Iterator;
import java.util.Map;
import java.util.TreeMap;

public class MD5Util
{
	private static final String TAG = "MD5Util";
	private static final char[] HEX_DIGITS = { 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102 };
    protected static char hexDigits[] = {
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
        'a', 'b', 'c', 'd', 'e', 'f'
    };

	public static String encodeByMD5(String paramString)
	{
	  	if (paramString == null) {
			return null;
	  	}
	  	try
	  	{
			MessageDigest localMessageDigest = MessageDigest.getInstance("MD5");
			localMessageDigest.update(paramString.getBytes());
			String str = getFormattedText(localMessageDigest.digest());
			return str;
	  	}
	  	catch (Exception localException)
	  	{
			throw new RuntimeException(localException);
	  	}
	}

	public static String mapDesc(Map<String, String> paramMap)
	{
	    String str1 = "";
	    String str2 = "";
	    TreeMap<String, String> localTreeMap = new TreeMap<String, String>(new Comparator<String>()
	    {
			@Override
			public int compare(String arg0, String arg1) {
				// TODO Auto-generated method stub
				return arg1.compareTo(arg0);
			}
	    });	    
	    localTreeMap.putAll(paramMap);
	    Iterator localIterator = localTreeMap.keySet().iterator();
	    for (;;)
	    {
	      if (!localIterator.hasNext()) {
	        return str2;
	      }
	      String str3 = (String)localIterator.next();
	      str1 = str1 + str3;
	      String str4 = (String)localTreeMap.get(str3);
	      str2 = str2 + str4;
	    }
	}
	
	private static String getFormattedText(byte[] paramArrayOfByte)
	{
	  	int i = paramArrayOfByte.length;
	  	StringBuilder localStringBuilder = new StringBuilder(i * 2);
	  	for (int j = 0;; j++)
	  	{
			if (j >= i) {
		  		return localStringBuilder.toString();
			}
			localStringBuilder.append(HEX_DIGITS[(0xF & paramArrayOfByte[j] >> 4)]);
			localStringBuilder.append(HEX_DIGITS[(0xF & paramArrayOfByte[j])]);
	  	}
	}

    private static void appendHexPair(byte byte0, StringBuffer stringbuffer)
    {
        char c = hexDigits[(byte0 & 0xf0) >> 4];
        char c1 = hexDigits[byte0 & 0xf];
        stringbuffer.append(c);
        stringbuffer.append(c1);
    }

    private static String bufferToHex(byte abyte0[])
    {
        return bufferToHex(abyte0, 0, abyte0.length);
    }

    private static String bufferToHex(byte abyte0[], int i, int j)
    {
        StringBuffer stringbuffer = new StringBuffer(j * 2);
        int k = i;
        do
        {
            if (k >= i + j)
            {
                return stringbuffer.toString();
            }
            appendHexPair(abyte0[k], stringbuffer);
            k++;
        } while (true);
    }

    public static String getMD5String(String s)
    {
        return getMD5String(s.getBytes());
    }

    public static String getMD5String(byte abyte0[])
    {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(abyte0);
			return bufferToHex(md.digest());
		} catch (NoSuchAlgorithmException e) {
			return "0";
		}
    }
}

