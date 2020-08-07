/*
 * @Author: ChenChanghua
 * @Date: 2020-04-14 14:28:14
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2020-08-07 16:58:16
 * @Description: file content
 */
import { createMemoryHistory } from 'history';

let set = {};
let search = window.location.search;
if (search) {
    let i = search.indexOf("target");
    if (i >= 0) {
        let index1 = search.indexOf("=", i);
        let index2 = search.indexOf("&", i);
        index2 = index2 < 0 ? search.length : index2;
        let target = search.substring(index1 + 1, index2);
        set["initialEntries"] = [target];
    }
}
const globalHistory = createMemoryHistory(set);
export {
    globalHistory
};