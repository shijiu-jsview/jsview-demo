/**
 * Created by donglin.lu@qcast.cn on 4/30/2020.
 */

/*
 * 【模块 export 内容】
 * createImpactTracer: 函数，创建碰撞跟踪对象
 * createImpactCallback: 函数，创建碰撞发生后的回调函数
 * createImpactAutoFroze: 函数，注册碰撞发生后，控制动画立刻停止的管理对象
 * updateImpactAutoFroze: 函数，更新 createImpactAutoFroze 创建的碰撞即停管理对象中管理的运动元素列表
 */

import { Forge } from "../JsViewEngineWidget/index_widget";

/*
 * createImpactCallback 参数说明:
 *      on_contact      (function[]) 接受碰撞事件的回调
 *      on_dis_contact  (function[]) 接受物体分离事件的回调
 *  返回值:
 *      Object  句柄，用于传输给 createImpactTracer
 */
function createImpactCallback(on_contact, on_dis_contact) {
  return new Forge.sImpactSensorManager.Callback(on_contact, on_dis_contact);
}

/*
 * createImpactTracer 参数说明:
 *      ele1        (Element)   html element句柄，1号碰撞体
 *      ele2        (Element)   html element句柄，2号碰撞体
 *      callback    (Object)   由 createImpactCallback 创建的回调构造体句柄
 *      auto_froze  (Object)   由 createImpactAutoFroze 创建的碰撞即停构造体句柄
 *  返回值:
 *      Object  句柄，提供 Recycle() 函数用于停止碰撞检测，需要再componentWillUnmount进行调用(清理)
 */
function createImpactTracer(ele1, ele2, callback, auto_froze) {
  return Forge.sImpactSensorManager.StartTrace(ele1.jsvMainView, ele2.jsvMainView, callback, auto_froze);
}

// 创建用于设置碰撞即停管理对象的参数
// 结果用于函数 createImpactAutoFroze 和 updateImpactAutoFroze
function _ConvertToViewsList(elements_array) {
  const views_array = [];
  if (elements_array) {
    for (const ele of elements_array) {
      views_array.push(ele.jsvMainView);
    }
  }
  return views_array;
}

/*
 * createImpactAutoFroze 参数说明:
 *      element_auto_froze_pre_impact   (Array<Element>)    关联运动元素的列表,这些元素碰撞前一帧停止运动
 *      element_auto_froze_on_impact    (Array<Element>)    关联运动元素的列表,这些元素碰撞当前帧停止运动
 *  返回值:
 *      Object  句柄，用于传输给 createImpactTracer，也用于 updateImpactAutoFroze 调整关联元素
 *
 *  【注意点】
 *        多个碰撞对可以共享同一个碰撞管理对象，并且建议共享同一个对象以提升效率
 *        该管理对象中的view的列表可以通过 updateImpactAutoFrozeHandler进行更新，
 *        更新后立刻在对所有的共享此管理对象的碰撞对中生效
 */
function createImpactAutoFroze(element_auto_froze_pre_impact, element_auto_froze_on_impact) {
  if (!element_auto_froze_pre_impact && !element_auto_froze_on_impact) {
    // Nothing to set
    return;
  }

  const pre_impact_list = _ConvertToViewsList(element_auto_froze_pre_impact);
  const on_impact_list = _ConvertToViewsList(element_auto_froze_on_impact);

  return new Forge.sImpactSensorManager.AutoFroze(
    (pre_impact_list.length > 0 ? pre_impact_list : null),
    (on_impact_list.length > 0 ? on_impact_list : null));
}

/*
 * updateImpactAutoFroze 参数说明:
 *      handler                         (Object)            由 createImpactAutoFroze 创建的句柄
 *      element_auto_froze_pre_impact   (Array<Element>)    关联运动元素的列表,这些元素碰撞前一帧停止运动
 *      element_auto_froze_on_impact    (Array<Element>)    关联运动元素的列表,这些元素碰撞当前帧停止运动
 *  返回值:
 *      无
 */
function updateImpactAutoFroze(handler, element_auto_froze_pre_impact, element_auto_froze_on_impact) {
  if (handler instanceof Forge.sImpactSensorManager.AutoFroze) {
    console.error("Error: handler type error");
    return;
  }

  const pre_impact_list = _ConvertToViewsList(element_auto_froze_pre_impact);
  const on_impact_list = _ConvertToViewsList(element_auto_froze_on_impact);

  // 更新碰撞即停列表
  handler.UpdatePreImpactList((pre_impact_list.length > 0 ? pre_impact_list : null));

  // 更新接触接触即停列表
  handler.UpdateOnImpactList((on_impact_list.length ? on_impact_list : null));
}

export {
  createImpactCallback,
  createImpactTracer,
  createImpactAutoFroze,
  updateImpactAutoFroze,
};
