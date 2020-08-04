import {
    fetch
} from "whatwg-fetch"
import hex_md5 from "../common/MD5"
import {uuid, getVersion} from "./commonData"
const CryptoJS = require("crypto-js");

const Encrypt = function (word, aseKey) {
    let key = CryptoJS.enc.Utf8.parse(aseKey)
    let data2 = CryptoJS.AES.encrypt(JSON.stringify(word), key, {
        iv: CryptoJS.enc.Utf8.parse(aseKey.substr(0, 16)),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return data2.toString()
}

const Decrypt = function (word, aseKey) {
    let key = CryptoJS.enc.Utf8.parse(aseKey);
    let decrypt = CryptoJS.AES.decrypt(word, key, {
        iv: CryptoJS.enc.Utf8.parse(aseKey.substr(0, 16)),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    let decryptedStr = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
    return decryptedStr;
}

class CommonApi {
    static ajax(func, method, score = null, ticket = null) {
        return new Promise((resolve, reject) => {
            let app_id = 'MyZvQCxBnEgp'
            let mch_id = 'tYOUCC'
            let account_id = uuid() || '1234567890' // uuid 默认1234567890
            let key = 'QCtseuYyuDID'
            let stable = '%*$4r6h(K))2d*qcast*7j55f21!*&4MY^$'
            let timestamp = new Date().getTime()
            let md5 = hex_md5(key + stable + timestamp)
            let aseKey = '$3r6h(K)2d7j21!^'
            let data;
            console.log('app_version:', getVersion());
          if(ticket) {
            data = {
              app_id: app_id,
              app_ver: getVersion(),
              mch_id: mch_id,
              timestamp: timestamp,
              sign: md5,
              account_id: account_id,
              app_type: 'lottery',
              func: func,
              ticket: ticket
            }
          } else {
            data = {
                app_id: app_id,
                app_ver: getVersion(),
                mch_id: mch_id,
                timestamp: timestamp,
                sign: md5,
                account_id: account_id,
                app_type: 'lottery',
                func: func
            }
          }
            let data2 = Encrypt(data, aseKey)
            let data3 = encodeURIComponent(data2)
            let url = `http://t.qcast.cn/qcast/entertainment/entrance.php?data=${data3}`.replace(/\s*/g, "")
            // console.log(func,url)
            fetch(url, {
                method: method || 'GET',
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            }).then(response =>
                response.text()
            ).then(data => {
                let res = Decrypt(data, aseKey)
                console.log("ajax data:", func, res);
                if (res.code === 0) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            }).catch(error => {
                console.log("ajax error:" + error);
                reject(error);
            })
        })
    }

    static getTimes() {
        //TODO 获取砸单次数接口
        let times = CommonApi.ajax('times', "GET")
        return times
    }

    static getInfo() {
        //TODO 获取活动信息接口
        let info = CommonApi.ajax('info', "GET")
        return info
    }

    static ifSupportActivity() {
        return true;
    }

    static reportLog(eventcode, packagename) {
        //TODO 上报log
    }

    static hitEggs() {
        return CommonApi.ajax('luck', "GET")
    }

    static getPrizes() {
        return CommonApi.ajax('prizes', "GET")
    }

  static getTicket(prize_id) {
    let ticket = CommonApi.ajax('ticket', 'GET', null, prize_id)
    return ticket
  }

  static Clone(src_obj) {
        let target_obj = new Object();
        for (let o in src_obj) {
            target_obj[o] = src_obj[o];
        }
        return target_obj;
    }
}

export default CommonApi