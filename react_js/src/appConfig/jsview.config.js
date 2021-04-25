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

        // (必须配置)填写main.js或者bundle.js相对于index.html的相对位置，
        // 用于image/import.then的相对寻址, 默认值是/static/js/: 
        jsSubPath: "/static/js/",
    },

    vendorConfig: {
        // (必须配置)设置屏幕坐标映射值，screenWidth为屏幕画布定义的宽度，displayScale为清晰度，
        // 默认值是画布宽度1280px, 清晰度为1.5，在1920x1080分辨率下让文字不会模糊
        designedMap: {
            screenWidth: 1280,
            displayScale: 1.5
        },

        // (可选配置)按键接受的扩展，例如将静音按键(JAVA键值为164)映射为JS键值20001，
        // PS:注意"164"的引号
        bindKeys: {
            keys: {
                165: 20001
            },
            syncKeys: {
            }
        },
    }
}
