export default {
    jsviewConfig: {
        // (必须配置)填写main.js或者bundle.js相对于index.html的相对位置，
        // 用于image/import.then的相对寻址, 默认值是/static/js/: 
        jsSubPath: "/static/js/",
    },

    vendorConfig: {
        // (必须配置)设置屏幕坐标映射值，screenWidth为屏幕画布定义的宽度，displayScale为清晰度，
        // 默认值是画布宽度1280px, 清晰度为1.0
        designedMap: {
            screenWidth: 1280,
            displayScale: 1.0
        },
    }
}
