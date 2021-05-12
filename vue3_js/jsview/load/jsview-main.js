import JsViewDefConfig from "./jsview.default.config"
import JsViewVendorConfig from "/src/appConfig/jsview.config"
import { loadJsViewEnv } from './loader'

function deepMerge(target, source) {
  const isObject = (obj) => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach(key => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = deepMerge(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
}

function main() {
    // 使用vendor配置值覆盖默认配置。
    let config = JsViewDefConfig;
    deepMerge(config, JsViewVendorConfig);
    console.log("JsView config: " + JSON.stringify(config));

    // 加载jsview运行环境。
    loadJsViewEnv(config, () => {
        // JsView环境加载完毕后，加载vue的main.js文件。
        import('/src/main.js');
    })
}

// webpack运行入口
main();