/**
 * Created by ludl on 4/30/20.
 */
import {Forge} from "../jsview-react/index_widget.js"

function createImpactCallback(on_contact, on_dis_contact) {
    return new Forge.sImpactSensorManager.Callback(on_contact, on_dis_contact);
}

function createImpactTracer(ele1, ele2, callback, auto_froze) {
    return Forge.sImpactSensorManager.StartTrace(ele1.jsvMainView, ele2.jsvMainView, callback, auto_froze);
}

const TYPE_MARK = "packedViewList";
// 创建用于设置碰撞即停管理对象的参数
// 结果用于函数 createImpactAutoFroze 和 updateImpactAutoFroze
function _ConvertToViewsList(elements_array) {
    let views_array = [];
    if (elements_array) {
        for (let ele of elements_array) {
            views_array.push(ele.jsvMainView);
        }
    }
    return views_array;
}

// 创建碰撞即停的管理对象
//
// handler: 碰撞即停机制管理对象
// element_auto_froze_pre_impact: 碰撞即停(停在碰撞前一帧)的元素列表
// element_auto_froze_on_impact: 碰撞即停(停在碰撞发生的一帧)的元素列表
//
// 多个碰撞对可以共享同一个碰撞管理对象，并且建议共享同一个对象以提升效率
// 该管理对象中的view的列表可以通过 updateImpactAutoFrozeHandler进行更新，
// 更新后立刻在对所有的共享此管理对象的碰撞对中生效
function createImpactAutoFroze(element_auto_froze_pre_impact, element_auto_froze_on_impact) {
    if (!element_auto_froze_pre_impact && !element_auto_froze_on_impact) {
        // Nothing to set
        return;
    }

    let pre_impact_list = _ConvertToViewsList(element_auto_froze_pre_impact);
    let on_impact_list = _ConvertToViewsList(element_auto_froze_on_impact);

    return new Forge.sImpactSensorManager.AutoFroze(
        (pre_impact_list.length > 0 ? pre_impact_list : null),
        (on_impact_list.length > 0 ? on_impact_list : null));
}

// 更新碰撞即停的管理对象
//
// handler: 碰撞即停机制的管理对象
// element_auto_froze_pre_impact: 同createImpactAutoFroze
// element_auto_froze_on_impact: 同createImpactAutoFroze
function updateImpactAutoFroze(handler, element_auto_froze_pre_impact, element_auto_froze_on_impact) {
    if (handler instanceof Forge.sImpactSensorManager.AutoFroze) {
        console.error("Error: handler type error");
        return;
    }

    let pre_impact_list = _ConvertToViewsList(element_auto_froze_pre_impact);
    let on_impact_list = _ConvertToViewsList(element_auto_froze_on_impact);

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
}