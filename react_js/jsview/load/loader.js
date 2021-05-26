import initHeaderScriptLoader from "./header_script_loader";
import TargetRevision from "../dom/target_core_revision";
import AppData from "../../src/appConfig/app_config.json";

// Forge define
if (typeof window.Forge === "undefined") {
  window.Forge = {};
}
const Forge = window.Forge;

function initDesignedMap(input_designed_map) {
  window.Forge.DesignMap = function () {
    let designMap = { width: 1280, displayScale: 1.0 };
    try {
      if (input_designed_map) {
        const new_designed_map = {
          width: input_designed_map.screenWidth,
          displayScale: input_designed_map.displayScale,
        };
        designMap = new_designed_map;
      }
    } catch (e) {
      console.error("load designed map failed");
    }

    // 设置播放器的屏幕坐标尺寸
    if (window.JsView && window.JsView.setVideoDesignMapWidth) {
      window.JsView.setVideoDesignMapWidth(designMap.width);
    } else {
      // 借助Audio标签设置基类BaseMedia的屏幕尺寸配置，绕开react的unref语法检测
      if (Audio.setDesignMapWidth) {
        Audio.setDesignMapWidth(designMap.width);
      }
    }

    return designMap;
  };
}

// eslint-disable-next-line no-unused-vars
let sJsViewForgeAppDefine = null;
async function selectJsViewRuntime(js_sub_path, input_designed_map, app_name) {
  // 初始Forge的启动入口
  initEntry();

  initDesignedMap(input_designed_map);
  if (window.JsView) {
    if (app_name && window.JsView.notifyAppName) {
      window.JsView.notifyAppName(app_name);
    }
    initHeaderScriptLoader(js_sub_path);
    const app_define = await import("../dom/jsv-dom.js");
    sJsViewForgeAppDefine = app_define.JsViewForgeApp;
    window.JsView.ForgeExt = app_define.ForgeExtension;
    window.JsView.Dom.JsSubPath = js_sub_path;
  } else {
    await import("../dom/jsv-browser-debug-dom.js");
  }
}

// 当confirmEntry和Forge.RunApp都被调用完成后，才会进行JsViewForgeApp运行
// eslint-disable-next-line no-var
let sActivityManager = null;
// eslint-disable-next-line no-var
let sEntryConfirmed = false;
let sJsViewApp = null;

function startForgeApp() {
  if (sActivityManager !== null && sEntryConfirmed) {
    console.log("Forge.RunApp().");
    // eslint-disable-next-line new-cap
    sJsViewApp = new sJsViewForgeAppDefine(sActivityManager);
    console.log(sJsViewApp);
  }
}

function confirmEntry() {
  sEntryConfirmed = true;
  if (window.JsView) {
    checkEngineVersion();
  }
  startForgeApp();
}

function initEntry() {
  Forge.RunApp = function (activity_manager) {
    console.log("Call from Forge.Run");
    sActivityManager = activity_manager;
    startForgeApp();
  };
}

async function runMain() {
  console.log("main.js loaded...");

  // 确定并进行Forge模块的启动
  confirmEntry();

  console.log("main.js done...");
}

function checkEngineVersion() {
  // 检查配套引擎的版本
  if (
    window.JsView.CodeRevision !==
      TargetRevision.CoreRevision /* Native引擎版本(由APK启动参数 CORE 决定) */ ||
    window.Forge.Version !==
      TargetRevision.JseRevision /* JS引擎版本(由APK启动参数 ENGINEJS 决定) */
  ) {
    console.warn(
      `Warning: JsView Engine version miss matched, some effect will be lost. url should be ${TargetRevision.JseUrl}`
    );
  }
}

function getHostName() {
  const full_url = window.location.href;
  let idx = full_url.indexOf("://");
  // const protocol = (idx > 0 ? full_url.substring(0, idx + 1) : "");
  const host_path = idx > 1 ? full_url.substring(idx + 3) : "";

  idx = host_path.indexOf("/");
  const host = idx > 0 ? host_path.substring(0, idx) : "";

  return host;
}

async function startApp(config, onLoaded) {
  console.log("StartApp...");
  if (window.JsView) {
    // 运行在JsView引擎中

    // (可选配置)按键接受的扩展，例如将静音按键(JAVA键值为164)映射为JS键值20001，PS:注意"164"的引号
    window.JsView.addKeysMap(config.jsviewConfig.bindKeys);

    // (可选配置)localStorage支持
    let storageDomain = config.jsviewConfig.localStorage.domain;
    if (storageDomain == "default") {
      storageDomain = getHostName();
    }
    window.JsView.setStorageDomain(storageDomain); // Domain可以为任意字符串，各Domain的localStorage互相隔离
    window.JsView.enableStorageNames(
      ...config.jsviewConfig.localStorage.presetKeys
    );

    // JsView Dom相关配置
    window.JsView.Dom.Render = function () {
      onLoaded();
    };
  } else {
    await onLoaded();
  }
}

async function loadJsViewEnv(config, onLoaded) {
  // 参数说明：
  // /static/js/: (可选配置)填写main.js或者bundle.js相对于index.html的相对位置，用于image/import.then的相对寻址
  // {screenWidth:1280, displayScale:1.0}: (可选配置)设置屏幕坐标映射值，前者为屏幕画布定义的宽度，后者为清晰度，
  //                                     默认值是画布宽度1280px, 清晰度为1.0
  await selectJsViewRuntime(
    config.jsviewConfig.jsSubPath,
    config.jsviewConfig.designedMap,
    AppData.AppName
  );

  await startApp(config, onLoaded);

  if (!window.JsView) {
    await import("../utils/JsViewReactWidget/BrowserDebugWidget/WidgetLoader");
  }

  // 环境启动后，动态加载React框架和main
  runMain();

  console.log("index.js loaded AppName=" + AppData.AppName);
}

export { loadJsViewEnv };
