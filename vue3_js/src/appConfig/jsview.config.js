export default {
    jsviewConfig: {
        // (可选配置)localStorage支持
        // domain可以为任意字符串，各Domain的localStorage互相隔离, 默认值是hostname
        // presetKeys为预置key，可以直接使用localStorage.xxx的形式，避免undefined错误
        localStorage: {
            domain: "default",
            presetKeys: [
                "value1",
                "value3"
            ],
        },

        // (可选配置)填写main.js或者bundle.js相对于index.html的相对位置，
        // 用于image/import.then的相对寻址, vue3默认值是/js/
        jsSubPath: "/js/",
    },

    vendorConfig: {
        // (可选配置)设置屏幕坐标映射值，screenWidth为屏幕画布定义的宽度，displayScale为清晰度，
        // 默认值是画布宽度1280px, 清晰度为1.0
        designedMap: {
            screenWidth: 1280,
            displayScale: 1.0
        },

        // (可选配置)按键接受的扩展，例如将静音按键(JAVA键值为164)映射为JS键值20001，
        // PS:注意"164"的引号
        bindKeys: {
            keys: {
                164: 20001
            },
            syncKeys: {
            }
        },
    }
}
