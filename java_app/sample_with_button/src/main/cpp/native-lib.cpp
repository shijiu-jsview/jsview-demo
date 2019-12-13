#include <jni.h>
#include <string>

extern "C" JNIEXPORT jstring

JNICALL
Java_com_qcode_jsview_demo_mainpage_NativeLibraryHolder_stringFromJNI(
        JNIEnv *env,
        jobject /* this */) {
    std::string ret = "success";
    return env->NewStringUTF(ret.c_str());
}
