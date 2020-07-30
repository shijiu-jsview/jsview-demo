import {
  jContentShellJBridge
} from "./nativeApi"

let ShareData = {
  score: 0,
  coinsCount: 0
}

const uuid = function () {
  if (typeof jContentShellJBridge != 'undefined') {
    if (typeof jContentShellJBridge.getDeviceUUID == 'function') {
      let a = jContentShellJBridge.getDeviceUUID()
      return a
    }
  }
  return "1234567890";
}

const getVersion = function () {
  let url = window.location.href
  // let url = 'http://h5app.qcast.cn/match_man/release/152/homepage/index.html'
  let a = url.indexOf('release')
  let b = url.indexOf('homepage')
  if (a != -1 && b != -1) {
    return url.substring(a + 8, b - 1)
  } else {
    return 100
  }
}

export {
  ShareData,
  uuid,
  getVersion
}