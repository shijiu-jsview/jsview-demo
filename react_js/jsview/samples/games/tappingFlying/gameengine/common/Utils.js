/**
 * Created by luocf on 2020/5/12.
 */
import { fetch } from "whatwg-fetch";
import Game from "./Game";

class Utils {
  static clone(json_source) {
    return JSON.parse(JSON.stringify(json_source));
  }

  static requestConfig(url) {
    console.log(`ajaxGet url:${url}`);
    return new Promise((resolve, reject) => {
      const game_local_data = localStorage.getItem(`${Game.appname}_${Game.difficult}_Data`);
      if (game_local_data) {
        try {
          const data = JSON.parse(game_local_data);
          resolve(data);
        } catch (e) {
          reject(e);
        }
      } else {
        fetch(url)
          .then(response => {
            return response.json();
          })
          .then(data => {
            console.log("ajax data:", data);
            if (data) {
              localStorage.setItem(`${Game.appname}_${Game.difficult}_Data`, JSON.stringify(data));
              resolve(data);
            }
          })
          .catch(error => {
            console.log(`ajax error:${error}`);
            reject(error);
          });
      }
    });
  }

  static getTemplate() {
    let template = Game.Config.common.template;
    const style = Game.Config.common.style;
    template = `${Game.path}/template/${template}/js/${style.toLowerCase()}.js`;
    return template;
  }

  static getAssetsFileName(value) {
    const urlParmsArr = value.split('/');
    return urlParmsArr[urlParmsArr.length - 1];
  }

  static getGameAssetsUrl(item) {
    if (item.value.indexOf("/") > -1) {
      return ".";
    }
    if (Game.env !== "production") {
      if (item.type === "images") {
        let path = `${Game.path}/template/${Game.Config.common.template}/theme/`;
        if (item.lang) {
          path += `${Game.Config.common.language}/`;
        }
        return path;
      }
      let path = `${Game.path}/template/${Game.Config.common.template}/${item.type}/`;
      if (item.lang) {
        path += `${Game.Config.common.language}/`;
      }
      return path;
    }
    return `./assets/${item.type}/`;
  }

  static getCommonTheme(item) {
    if (Game.env === "production") {
      return `./assets/${item.type}/`;
    }
    if (item.path) {
      return `${Game.path + item.path + item.type}/`;
    }
    let path = `${Game.path}/common/theme/${Game.Config.common.theme}/${item.type}/`;
    if (item.lang) {
      path += `${Game.Config.common.language}/`;
    }
    return path;
    // return Game.env === "production" ? "./" : `${Game.path}/common/theme/${Game.Config.common.theme}`;
  }

  static getCommonThemeJs() {
    return Game.env === "production" ? "./" : `${Game.path}/common/js`;
  }

  static dataFromatAsstes(config) {
    const resoure = {};
    const stagesList = config.stages;
    stagesList.forEach((stage, stageIndex) => {
      const assets = stage;
      if (assets) {
        Object.keys(assets).forEach(key => {
          const item = assets[key];
          if (Array.isArray(item)) {
            if (item[0].assets) {
              item.forEach((rounds, index) => {
                const roundAssets = rounds.assets;
                Object.keys(roundAssets).forEach((val) => {
                  const detail = roundAssets[val];
                  if (typeof detail === 'object' && !Array.isArray(detail)) {
                    resoure[`stage-${stageIndex}_rounds-${index}_${val}`] = detail;
                    detail.key = Utils.getAssetsFileName(detail.value);
                  } else if (Array.isArray(detail)) {
                    detail.forEach((a, roundIndex) => {
                      resoure[`stage-${stageIndex}_rounds-${index}_${val}${roundIndex}`] = a;
                      a.key = Utils.getAssetsFileName(a.value);
                    });
                  }
                });
              });
            } else if (item[0].value) {
              item.forEach((val, index) => {
                resoure[`stage-${stageIndex}_${key}${index}`] = val;
                val.key = Utils.getAssetsFileName(val.value);
              });
            }
          } else if (typeof item === 'object') {
            resoure[`stage-${stageIndex}_${key}`] = item;
            item.key = Utils.getAssetsFileName(item.value);
          }
        });
      }
    });
    return resoure;
  }

  static isUndefined(value) {
    return typeof value === "undefined";
  }

  static getRandomValue() {
    const offestValue = 170;
    return Math.random() * offestValue;
  }
}

export default Utils;
/**
 * 基于字符串分析的链接参数取值或赋值(只能分析search，或者只能分析hash)
 * @param {string} url 需要处理的链接或hash
 * @param {object} obj 不传递认为是取值，传递对象认为是赋值
 * @param {number} paramPosition 参数处理位置（0=search,1=hash），默认智能判断，search部分优先
 */
const params = (url = '', obj, paramPosition) => {
  const [searchPart = '', hashPart = ''] = url.split('#');
  // eslint-disable-next-line no-nested-ternary
  const position = (paramPosition === undefined) ? ((searchPart || !hashPart) ? 0 : 1) : paramPosition;
  const setPart = position === 0 ? searchPart : hashPart;
  const [base = '', search = ''] = setPart.split('?');
  const originParams = {};
  const combine = (prefix, value) => (value ? `${prefix}${value}` : '');
  const getSearch = (data = {}) => {
    const result = [];
    Object.keys(data).forEach((key) => {
      const val = data[key];
      if (val !== null && val !== undefined) {
        result.push([key, encodeURIComponent(val)].join('='));
      }
    });
    return combine('?', result.join('&'));
  };
  search
    .split('&')
    .filter((x) => x)
    .forEach((keyvalue) => {
      const [key = '', value = ''] = keyvalue.split('=');
      originParams[key] = decodeURIComponent(value);
    });
  if (obj) {
    // 赋值
    Object.assign(originParams, obj);
    switch (position) {
      case 0:
        // 参数在search部分,拼接方式为base+getSearch+hashPart
        return `${base}${getSearch(originParams)}${combine('#', hashPart)}`;
      case 1:
        // 参数在hash部分,拼接方式为searchPart+ base+getSearch
        return searchPart + combine('#', base + getSearch(originParams));
      default:
        break;
    }
  } else {
    // 取值
    return originParams;
  }
};
export function getSearchQuery(url) {
  return params(url, undefined, 0);
}
export function setSearchQuery(url, param = {}) {
  return params(url, param, 0);
}
export function getHashQuery(url) {
  return params(url, undefined, 1);
}
export function setHashQuery(url, param) {
  return params(url, param, 1);
}
