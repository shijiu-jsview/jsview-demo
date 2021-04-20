window.JsvDisableReactWrapper = true; // 设置标识位，有部分高阶组件根据此标识位决定元素的搭建方式

// Forge define
if (typeof window.Forge === 'undefined') { window.Forge = {}; }
const Forge = window.Forge;

// const sForgeReactAppDefine = null;
function loadJsViewProxy(callback, js_sub_path) {
  callback();
}

// 当confirmEntry和Forge.RunApp都被调用完成后，才会进行ForgeReactApp运行
let sActivityManager = null;
let sEntryConfirmed = false;
// let sReactApp = null;

function startApp() {
  if (sActivityManager !== null && sEntryConfirmed) {
    console.log("Forge.RunApp().");
    // sReactApp = new sForgeReactAppDefine(sActivityManager);
  }
}

function confirmEntry() {
  sEntryConfirmed = true;
  startApp();
}

function initEntry() {
  Forge.RunApp = function (activity_manager) {
    sActivityManager = activity_manager;
    startApp();
  };
}

export {
  loadJsViewProxy,
  initEntry,
  confirmEntry
};
