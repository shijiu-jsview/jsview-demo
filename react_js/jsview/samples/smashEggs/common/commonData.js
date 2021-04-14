import {
  jContentShellJBridge
} from './nativeApi';

const ShareData = {
  score: 0,
  coinsCount: 0
};

const uuid = function () {
  if (typeof jContentShellJBridge !== 'undefined') {
    if (typeof jContentShellJBridge.getDeviceUUID === 'function') {
      const a = jContentShellJBridge.getDeviceUUID();
      return a;
    }
  }
  return '1234567890';
};

const getVersion = function () {
  const url = window.location.href;
  // let url = 'http://h5app.qcast.cn/match_man/release/152/homepage/index.html'
  const a = url.indexOf('release');
  const b = url.indexOf('homepage');
  if (a !== -1 && b !== -1) {
    return url.substring(a + 8, b - 1);
  }
  return 100;
};

const formatDate = function (date, fmt) {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length)); }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    }
  }
  return fmt;
};
export {
  formatDate,
  ShareData,
  uuid,
  getVersion
};
