import { selectJsViewRuntime, runMain } from './jsview-utils/jsview-react/index_hook';
import AppData from './appConfig/app_config.json'

// 根据当前运行环境，分别启动PC或者设备对应的引擎(不需要的引擎处理将不加载)
selectJsViewRuntime(() => {
  // 环境启动后，动态加载React框架和main
  import("./main.js").then(runMain);
}, "/static/js/", { screenWidth: 1280, displayScale: 1.0 }, AppData.AppName);
// 补充说明：
// /static/js/: (可选配置)填写main.js或者bundle.js相对于index.html的相对位置，用于image/import.then的相对寻址
// {screenWidth:1280, displayScale:1.0}: (可选配置)设置屏幕坐标映射值，前者为屏幕画布定义的宽度，后者为清晰度，
//                                     默认值是画布宽度1280px, 清晰度为1.0

console.log("index.js loaded AppName=" + AppData.AppName);
