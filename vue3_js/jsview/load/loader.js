import initHeaderScriptLoader from "./header_script_loader";
import TargetRevision from "../dom/target_core_revision"

// Forge define
if (typeof window.Forge === 'undefined') { window.Forge = {}; }
const Forge = window.Forge;

function initDesignedMap(input_designed_map) {
  window.Forge.DesignMap = function () {
    let designMap = { width: 1280, displayScale: 1.0 };
    try {
      if (input_designed_map) {
        const new_designed_map = {
          width: input_designed_map.screenWidth,
          displayScale: input_designed_map.displayScale
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
let sForgeReactAppDefine = null;
function selectJsViewRuntime(callback, js_sub_path, input_designed_map, app_name) {
  // 初始Forge的启动入口
  initEntry();

  initDesignedMap(input_designed_map);
  if (window.JsView) {
    if (app_name && window.JsView.notifyAppName) {
      window.JsView.notifyAppName(app_name);
    }
    initHeaderScriptLoader(js_sub_path);
    import("../dom/jsv-dom.js").then((app_define) => {
      sForgeReactAppDefine = app_define.ForgeReactApp;
      window.JsView.ForgeExt = app_define.ForgeExtension;
      window.JsView.React.JsSubPath = js_sub_path;
      callback();
    });
  } else {
    import("../dom/forge_html/apic_decoder/libwebp-0.6.0.min.js").then(() => {
      import("../dom/forge_html/apic_decoder/demux.js").then(() => {
        import("../dom/forge_html/apic_decoder/gifDecoder.js").then(() => {
          import("../dom/forge_html/index.js").then(() => {
            import("../dom/jsv-browser-debug-dom.js").then(() => {
              callback();
            });
          });
        })
      })
    })
  }
}

// 当confirmEntry和Forge.RunApp都被调用完成后，才会进行ForgeReactApp运行
// eslint-disable-next-line no-var
var sActivityManager = null;
// eslint-disable-next-line no-var
var sEntryConfirmed = false;
let sReactApp = null;

function startApp() {
  if (sActivityManager !== null && sEntryConfirmed) {
    console.log("Forge.RunApp().");
    // eslint-disable-next-line new-cap
    sReactApp = new sForgeReactAppDefine(sActivityManager);
    console.log(sReactApp);
  }
}

function confirmEntry() {
  sEntryConfirmed = true;
  if (window.JsView) {
    checkEngineVersion();
  }
  startApp();
}

function initEntry() {
  Forge.RunApp = function (activity_manager) {
    console.log("Call from Forge.Run");
    sActivityManager = activity_manager;
    startApp();
  };
}

function runMain(entry) {
  console.log("main.js loaded...");

  entry.default();

  // 确定并进行Forge模块的启动
  confirmEntry();

  console.log("main.js done...");
}

function checkEngineVersion() {
  // 检查配套引擎的版本
  if (
    window.JsView.CodeRevision !== TargetRevision.CoreRevision /* Native引擎版本(由APK启动参数 CORE 决定) */ ||
    window.Forge.Version !== TargetRevision.JseRevision /* JS引擎版本(由APK启动参数 ENGINEJS 决定) */
  ) {
    console.warn(
      `Warning: JsView Engine version miss matched, some effect will be lost. url should be ${TargetRevision.JseUrl}`
    );
  }
}

export {
  selectJsViewRuntime,
  runMain
};
