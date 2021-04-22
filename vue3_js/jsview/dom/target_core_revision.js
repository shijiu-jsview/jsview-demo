/**
 * Created by ludl on 1/27/21.
 */

const TargetRevision = {
  CoreRevision: 810739,
  JseRevision: "1.0.749",
  JseUrl:
    "http://cdn.release.qcast.cn/forge_js/master/JsViewES6_react_r749.jsv.d058fc22.js",
};

// 不要用export default，update-env脚本不能解析
// export default TargetRevision;
module.exports = TargetRevision;
