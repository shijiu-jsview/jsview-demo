/**
 * 数据打点
 */
import {
  fetch
} from "whatwg-fetch";
import { uuid, getVersion } from "./commonData";

const __static = 'http://qc-user-behavior.cn-hangzhou.log.aliyuncs.com/logstores/h5app/track?APIVersion=0.6.0';
const app_id = 'ts2uoJGltxVD';
const id = uuid() || '1234567890';
const pageView = function (page) {
  const url = `${__static}&uuid=${id}&user_id=${localStorage.id}&bi_version=&ci_version=${getVersion()}&event=page_view&reporter=h5app&info=&app_id=${app_id}&app_name=match_man&page_title=${page}&page_vendor=`;
  fetch(url);
};
const pageClick = function (page, item_title) {
  const url = `${__static}&uuid=${id}&user_id=${localStorage.id}&bi_version=&ci_version=${getVersion()}&event=page_click&reporter=h5app&info=&page_title=${page}&page_vendor=&app_id=${app_id}&app_name=match_man&item_title=${item_title}&item_id=&click_type=`;
  fetch(url);
};
const pageQuit = function(page) {
  const url = `${__static}&uuid=${id}&user_id=${localStorage.id}&bi_version=&ci_version=${getVersion()}&event=page_quit&reporter=h5app&info=&page_title=${page}&page_vendor=`;
  fetch(url);
};
const gameStart = function () {
  const url = `${__static}&uuid=${id}&user_id=${localStorage.id}&bi_version=&ci_version=${getVersion()}&event=game_start&reporter=h5app&info=&app_id=${app_id}&app_name=smash_eggs`;
  fetch(url);
};
const gameEnd = function (duration, score, coin, star) {
  const url = `${__static}&uuid=${id}&user_id=${localStorage.id}&bi_version=&ci_version=${getVersion()}&event=game_end&reporter=h5app&info=&app_id=${app_id}&app_name=match_man&duration=${duration}&score=${score}&coin=${coin}&star=${star}`;
  fetch(url);
};
export {
  pageView,
  pageClick,
  pageQuit,
  gameStart,
  gameEnd
};
