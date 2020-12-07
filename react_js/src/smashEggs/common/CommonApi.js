import {
  fetch
} from "whatwg-fetch";
import hex_md5 from "./MD5";
import { uuid, getVersion } from "./commonData";

const CryptoJS = require("crypto-js");

const Encrypt = function (word, aseKey) {
  const key = CryptoJS.enc.Utf8.parse(aseKey);
  const data2 = CryptoJS.AES.encrypt(JSON.stringify(word), key, {
    iv: CryptoJS.enc.Utf8.parse(aseKey.substr(0, 16)),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return data2.toString();
};

const Decrypt = function (word, aseKey) {
  const key = CryptoJS.enc.Utf8.parse(aseKey);
  const decrypt = CryptoJS.AES.decrypt(word, key, {
    iv: CryptoJS.enc.Utf8.parse(aseKey.substr(0, 16)),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  const decryptedStr = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
  return decryptedStr;
};

class CommonApi {
  static ajax(func, method, score = null, ticket = null) {
    return new Promise((resolve, reject) => {
      const app_id = 'MyZvQCxBnEgp';
      const mch_id = 'tYOUCC';
      const account_id = uuid() || '1234567890'; // uuid 默认1234567890
      const key = 'QCtseuYyuDID';
      const stable = '%*$4r6h(K))2d*qcast*7j55f21!*&4MY^$';
      const timestamp = new Date().getTime();
      const md5 = hex_md5(key + stable + timestamp);
      const aseKey = '$3r6h(K)2d7j21!^';
      let data;
      console.log('app_version:', getVersion());
      if (ticket) {
        data = {
          app_id,
          app_ver: getVersion(),
          mch_id,
          timestamp,
          sign: md5,
          account_id,
          app_type: 'lottery',
          func,
          ticket
        };
      } else {
        data = {
          app_id,
          app_ver: getVersion(),
          mch_id,
          timestamp,
          sign: md5,
          account_id,
          app_type: 'lottery',
          func
        };
      }
      const data2 = Encrypt(data, aseKey);
      const data3 = encodeURIComponent(data2);
      const url = `http://t.qcast.cn/qcast/entertainment/entrance.php?data=${data3}`.replace(/\s*/g, "");
      // console.log(func,url)
      fetch(url, {
        method: method || 'GET',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      }).then(response => response.text()
      ).then(data => {
        const res = Decrypt(data, aseKey);
        console.log("ajax data:", func, res);
        if (res.code === 0) {
          resolve(res.data);
        } else {
          reject(res);
        }
      }).catch(error => {
        console.log(`ajax error:${error}`);
        reject(error);
      });
    });
  }

  static getTimes() {
    // TODO 获取砸单次数接口
    const times = CommonApi.ajax('times', "GET");
    return times;
  }

  static getInfo() {
    // TODO 获取活动信息接口
    const info = CommonApi.ajax('info', "GET");
    return info;
  }

  static ifSupportActivity() {
    return true;
  }

  static reportLog(eventcode, packagename) {
    // TODO 上报log
  }

  static hitEggs() {
    return CommonApi.ajax('luck', "GET");
  }

  static getPrizes() {
    return CommonApi.ajax('prizes', "GET");
  }

  static getTicket(prize_id) {
    const ticket = CommonApi.ajax('ticket', 'GET', null, prize_id);
    return ticket;
  }

  static Clone(src_obj) {
    const target_obj = { ...src_obj };
    return target_obj;
  }
}

export default CommonApi;
