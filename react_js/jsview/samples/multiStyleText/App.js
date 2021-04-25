import React from 'react';
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";

/*
 * 【界面概述】
 * 多种style的文字
 *
 * 语法说明:
 * 1. 支持的转义字段
 *      \textcolor{颜色(十六进制)/rgba(255,255,255,1.0)}{文字}                    设定颜色
 *      \textb{文字}                                      粗体
 *      \texti{文字}                                      斜体
 *      \textdecoration{underline/line-through}{文字}     下划线/删除线
 *      \textsup{文字}                                    上标
 *      \textsub{文字}                                    下标
 * 2. 输入\, {, }是需要在前面添加反斜杠
 * 3. 支持嵌套的语法
 *      \textb{aa\textdecoration{underline}{\texti{bb}}}
 *
 * 注意事项
 * 1. pc和jsview的折行可能不一致
 * 2. 输入'\'应该写成\\\\
 * 3. 输入'{'应该写成\\{
 * 4. 输入'}'应该写成\\}
 */

class MainScene extends FocusBlock {
  onKeyDown(ev) {
    switch (ev.keyCode) {
      case 10000:
      case 27:
        if (this._NavigateHome) {
          this._NavigateHome();
        }
        break;
      default:
        break;
    }
    return true;
  }

  renderContent() {
    return (
      <div style={{ width: 1280, height: 720, backgroundColor: "#FFFFFF" }}>
        <div style={{ left: 50, top: 50, width: 550, height: 550, backgroundColor: "#DDDDDD" }}>
          <div style={{ left: 0, top: 0, width: 550, height: 50, fontSize: "30px", lineHeight: "50px", textOverflow: 'ellipsis', overflow: 'hidden' }} jsv_text_latex_enable="true">
            {"颜色: \\textcolor{#FF0000}{红色文字}"}
          </div>
          <div style={{ left: 0, top: 50, width: 550, height: 50, fontSize: "30px", lineHeight: "50px", textOverflow: 'ellipsis', overflow: 'hidden' }} jsv_text_latex_enable="true">
            {"加粗: \\textb{加粗文字}"}
          </div>
          <div style={{ left: 0, top: 100, width: 550, height: 50, fontSize: "30px", lineHeight: "50px", textOverflow: 'ellipsis', overflow: 'hidden' }} jsv_text_latex_enable="true">
            {"斜体: \\texti{ITALIC italic}"}
          </div>
          <div style={{ left: 0, top: 150, width: 550, height: 50, fontSize: "30px", lineHeight: "50px", textOverflow: 'ellipsis', overflow: 'hidden' }} jsv_text_latex_enable="true">
            {"下划线: \\textdecoration{underline}{下划线}"}
          </div>
          <div style={{ left: 0, top: 200, width: 550, height: 50, fontSize: "30px", lineHeight: "50px", textOverflow: 'ellipsis', overflow: 'hidden' }} jsv_text_latex_enable="true">
            {"删除线: \\textdecoration{line-through}{删除线}"}
          </div>
          <div style={{ left: 0, top: 250, width: 550, height: 50, fontSize: "30px", lineHeight: "50px", textOverflow: 'ellipsis', overflow: 'hidden' }} jsv_text_latex_enable="true">
            {"上标: 普通\\textsup{中文abcdefghijklmnopqrstuvwxyz}"}
          </div>
          <div style={{ left: 0, top: 300, width: 550, height: 50, fontSize: "30px", lineHeight: "50px", textOverflow: 'ellipsis', overflow: 'hidden' }} jsv_text_latex_enable="true">
            {"下标: 普通\\textsub{中文abcdefghijklmnopqrstuvwxyz}"}
          </div>
          <div style={{ left: 0, top: 350, width: 550, height: 50, fontSize: "30px", lineHeight: "50px", textOverflow: 'ellipsis', overflow: 'hidden' }} jsv_text_latex_enable="true">
            {"上标大写: 普通\\textsup{ABCEDEFGHIJKLMNOPQRSTUVWXYZ}"}
          </div>
          <div style={{ left: 0, top: 400, width: 550, height: 50, fontSize: "30px", lineHeight: "50px", textOverflow: 'ellipsis', overflow: 'hidden' }} jsv_text_latex_enable="true">
            {"下标大写: 普通\\textsub{ABCDEFGHIJKLMNOPQRSTUVWXYZ}"}
          </div>
          <div style={{ left: 0, top: 450, width: 550, height: 50, fontSize: "30px", lineHeight: "50px", textOverflow: 'ellipsis', overflow: 'hidden' }} jsv_text_latex_enable="true">
            {"特殊字符: \\\\ \\{ \\}"}
          </div>
        </div>

        <div style={{ left: 650, top: 50, width: 550, height: 550, backgroundColor: "#DDDDDD", fontSize: "30px", lineHeight: "50px", textOverflow: 'ellipsis', overflow: 'hidden' }} jsv_text_latex_enable="true">
          {"综合示例: \n这是\\textcolor{#FF0000}{一个\\textb{\\textdecoration{underline}{嵌套}}\\texti{Case}Case}常规\\textsup{上\\textb{\\textcolor{#7700FF}{标\\texti{Italic}}}}English\\textsup{Super}English\\textsub{sub\\textb{下标加粗}下标换行\\\\n\n换行}\\textb{加粗文字换行\n换行}"}
        </div>
      </div>
    );
  }
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
