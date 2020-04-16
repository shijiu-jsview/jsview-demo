/**
 * Created by luocf on 2020/3/19.
 */
//import axios from "axios"
import {fetch} from "whatwg-fetch"
import {Authentication, STBAppManager, gddxDomain, report, epgVersionname} from "./CommonDefine"
class CommonApi {
    static ifSupportActivity() {
        return true;
    }

    static getUserId() {
        return 'testUserId222';
    }
    static getUserToken() {
        return 'testUserToken222';
    }

    static gotoStudy() {
        CommonApi.reportLog('203002');
    }

    static reportLog(eventcode, packagename) {
        let userid = this.getUserId();
        let currentSessionId = CommonApi.getQueryString('sessionid') || '';
        console.log("reportLog userid:"+userid+", currentSessionId:"+currentSessionId);
        let log = {
            userid:userid,
            versionname: epgVersionname,
            eventcode: eventcode,
            sessionid:currentSessionId,
            version: '1.0',
            logstamp: 96
        };
        if (packagename) {
            log["packagename"] = packagename;
        }
        report(log);

    }
    static gotoBuy() {
        CommonApi.reportLog("203001");
    }

    static isAlreadyBought() {
        let user_id = this.getUserId();
        let user_token = this.getUserToken();
        return CommonApi.ajax({"action":"subscribe","userId":user_id,"userToken":user_token})
    }

    static isRemindedToday() {
        let remind_day = localStorage.getItem("RemindDay");
        let date = new Date();
        let today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
        if (!remind_day) {
            localStorage.setItem("RemindDay", today);
            return false;
        }

        if (today === remind_day) {
            return true;
        } else {
            localStorage.setItem("RemindDay", today);
            return false;
        }
    }

    static getTemplate() {
        //深圳平台模版2.0
        var typeArr2 = ["defaulthdcctv", "smarthomeszgx"];
        //广信模版3.0
        var typeArr3 = ["cnepgjsp", "CNEPG"];
        if (Authentication && Authentication.CTCGetConfig && typeArr2.indexOf(Authentication.CTCGetConfig("templateName"))  !== -1) {
            return 2;
        } else if (Authentication && Authentication.CTCGetConfig && typeArr3.indexOf(Authentication.CTCGetConfig("templateName"))  !== -1) {
            return 3;
        } else {
            //南传
            return 1;
        }
    }

    static getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
        var r = window.location.search.substr(1).match(reg)
        if (r  !== null) {
            return unescape(r[2])
        }
        return null
    }

    static ajax(postData) {
        return new Promise((resolve, reject) => {
            let post_data = JSON.stringify(postData);
            console.log("ajax postData:" + post_data);
            fetch('http://api.qcast.cn/qcast/utility/hiteggs/go.php', {
                method: 'POST',
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, same-origin, *omit
                headers: {
                    'Content-Type': 'application/json'
                },
                body:post_data
            })
                .then(response =>
                    response.json()
                )
                .then(data => {
                    console.log("ajax data:", data);
                    if (data.code === 0) {
                        resolve(data.data);
                    } else {
                        reject(data.msg);
                    }
                })
                .catch(error => {
                    console.log("ajax error:" + error);
                    reject(error);
                })
        })
    }

    static hitEggs(account) {
        return CommonApi.ajax({action: "hit", account: account});
    }

    static getActivityInfo(account) {
        return CommonApi.ajax({action: "fetch", account: account});
    }

    static postContactInfo(contact, prize_id, account) {
        return CommonApi.ajax({action: "update", account: account, contact: contact, id: prize_id});
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