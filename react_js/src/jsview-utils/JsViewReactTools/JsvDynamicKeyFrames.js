/**
 * Created by donglin.lu@qcast.cn on 11/13/2020.
 */

/*
 * 【模块 export 内容】
 * getKeyFramesGroup: 函数，获取KeyFrame操作类 KeyFrameStyleSheet
 * KeyFrameStyleSheet：面向对象类，KeyFrames CSS rule的操作类，用于添加和删除KeyFrame
 *      功能函数：(参数说明见函数本体)
 *          insertRule(key_frame_string)    动态添加keyFrame
 *          removeRule(name)                动态删除keyFrame
 *          removeMultiRules(names_array)   批量动态删除keyFrame
 *          hasRule(name)                   查询KeyFrame是否存在
 */
class KeyFrameStyleSheet {
  constructor(style_sheet_ref) {
    this._SS = style_sheet_ref;
  }

  /*
     * insertRule 参数说明:
     *      key_frame_string    (String) 要添加的keyFrame声明，
     *                          格式为"@keyframes name {0%: XXX, 100%:XXX}"，同CSS文件中声明
     *                          请使用者保证不要和其他KeyFrame重名
     *  返回值:
     *      无
     */
  insertRule(key_frame_string) {
    if (window.jsvInAndroidWebView) {
      // Convert keyframe => -webkit-keyframe
      // Convert transform => -webkit-transform
      // Convert transform-origin => -webkit-transform-origin
      key_frame_string = key_frame_string.replace(/@keyframes/, "@-webkit-keyframes");
      key_frame_string = key_frame_string.replace(/transform/g, "-webkit-transform");
    }

    const index = this._SS.cssRules.length;
    this._SS.insertRule(key_frame_string, index);
  }

  /*
     * hasRule 参数说明:
     *      name    (String) 要动态删除的keyframe的名字
     *  返回值:
     *      boolean 是否含有指定名称的keyframe
     */
  hasRule(name) {
    const css_rules_ref = this._SS.cssRules;
    for (let i = css_rules_ref.length - 1; i >= 0; i--) {
      if (css_rules_ref[i].name === name) {
        // Found
        return true;
      }
    }

    return false;
  }

  /*
     * removeRule 参数说明:
     *      name    (String) 要动态删除的keyframe的名字
     *  返回值:
     *      无
     */
  removeRule(name) {
    this.removeMultiRules([name]);
  }

  /*
     * removeMultiRules 参数说明:
     *      names_array    (Array) Array<String>，要动态删除的keyframe的名字数组
     *  返回值:
     *      无
     */
  removeMultiRules(names_array) {
    const style_sheet_ref = this._SS;
    const css_rules_ref = this._SS.cssRules;
    // 对CssRules进行删除操作，倒序轮询
    for (let i = css_rules_ref.length - 1; i >= 0; i--) {
      for (const j in names_array) {
        if (css_rules_ref[i].name === names_array[j]) {
          names_array.splice(j, 1);
          style_sheet_ref.deleteRule(i);
          break;
        }
      }
    }
  }
}

/*
 * getKeyFramesGroup 参数说明:
 *      anchor_tag    (String) keyFrame的名称，可以不设置或者为undefined
 *  返回值:
 *      KeyFrameStyleSheet  以anchor_tag为锚点，找到对应的cssRule，以此cssRule创建出的KeyFrame管理句柄
 */
function getKeyFramesGroup(anchor_tag) {
  let style_sheets_ref = null;

  // 获取所有的style
  const ss = document.styleSheets;
  if (!ss || ss.length === 0) {
    console.error("Error: styleSheet empty");
    return null;
  }

  if (anchor_tag) {
    for (let i = 0; i < ss.length; ++i) {
      const item = ss[i];
      if (item.cssRules[0] && item.cssRules[0].name && item.cssRules[0].name === anchor_tag) {
        style_sheets_ref = item;
        break;
      }
    }
    if (style_sheets_ref === null) {
      console.error(`Error: no found tag=${anchor_tag}`);
      return null;
    }
  } else {
    style_sheets_ref = ss[0];
  }

  return new KeyFrameStyleSheet(style_sheets_ref);
}

export {
  getKeyFramesGroup,
};
