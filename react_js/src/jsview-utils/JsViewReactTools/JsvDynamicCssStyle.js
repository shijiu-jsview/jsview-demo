/**
 * Created by donglin.lu@qcast.cn on 11/13/2020.
 */

/*
 * 【模块 export 内容】
 * CssStyleSheet：面向对象类，CSS rule的操作器，用于添加和删除CssStyle，服务于JsvStyleClass
 *      接口：
 *          insertRule {String} 将传入的Css rule对象插入到CSS列表中，
 *                              请保证不要和其他css rule重名，重名场合以最后一个为准
 *          removeRule {String} 从CSS列表中删除指定名字的css rule
 *          removeMultiRules {String[]} 从CSS列表中删除复数个css rule
 * getCssStyleSheet: 函数，获取 _StyleSheet 实例的函数，可接受一个参数anchor_tag，用来定位CSS rule的群组
 */

class CssStyleSheet {
  constructor(style_sheet_ref) {
    this._SS = style_sheet_ref;
  }

  insertRule(rule_define_string) {
    const index = this._SS.cssRules.length;
    this._SS.insertRule(rule_define_string, index);
  }

  hasRule(name) {
    const css_rules_ref = this._SS.cssRules;
    for (let i = css_rules_ref.length - 1; i >= 0; i--) {
      if (css_rules_ref[i].selectorText === name) {
        // Found
        return true;
      }
    }

    return false;
  }

  removeRule(name) {
    this.removeMultiRules([name]);
  }

  removeMultiRules(names_array) {
    const style_sheet_ref = this._SS;
    const css_rules_ref = this._SS.cssRules;
    // 对CssRules进行删除操作，倒序轮询
    for (let i = css_rules_ref.length - 1; i >= 0; i--) {
      for (const j in names_array) {
        if (css_rules_ref[i].selectorText === names_array[j]) {
          names_array.splice(j, 1);
          style_sheet_ref.deleteRule(i);
          break;
        }
      }
    }
  }
}

function getCssStyleGroup() {
  // 获取所有的style
  const ss = document.styleSheets;
  if (!ss || ss.length === 0) {
    console.error("Error: styleSheet empty");
    return null;
  }

  const style_sheets_ref = ss[0]; // 使用第0个作为动态css rule的加入点

  return new CssStyleSheet(style_sheets_ref);
}

export {
  getCssStyleGroup,
};
