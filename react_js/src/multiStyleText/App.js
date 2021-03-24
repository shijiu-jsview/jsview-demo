import React from 'react';
import { FocusBlock } from "../jsview-utils/JsViewReactTools/BlockDefine";
import createStandaloneApp from "../jsview-utils/JsViewReactTools/StandaloneApp";

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
                <div style={{ left: 50, top: 50, width: 550, height: 280, fontSize: "40px", lineHeight: "60px", backgroundColor: "#DDDDDD", textOverflow: 'ellipsis', overflow: 'hidden' }} jsv_text_latex_enable="true">
                    {"常规\\textcolor{#FF0000}{红色文字}常规\\textb{加粗\\\\n\n文字}常规\\texti{Italic}常规\\textdecoration{underline}{下划线}常规\\textdecoration{line-through}{删除线}常规\\textsub{下标Sub}常规\\textsup{上标\\\\n\nSup}\\\\\\{\\}"}
                </div>

                <div style={{ left: 50, top: 350, width: 550, height: 280, fontSize: "40px", lineHeight: "80px", backgroundColor: "#DDDDDD" }} jsv_text_latex_enable="true">
                    {"这是\\textcolor{#FF0000}{一个\\textb{\\textdecoration{underline}{嵌套}}\\texti{Case}Case}常规\\textsup{上\\textb{\\textcolor{#7700FF}{标\\texti{Italic}}}}English\\textsup{Super}English\\textsub{sub}"}
                </div>
                <div style={{ left: 650, top: 50, width: 500, height: 280, fontSize: "35px", lineHeight: "40px", backgroundColor: "#DDDDDD" }} jsv_text_latex_enable="true">
                    {"上标\\textsup{a quick brown fox jumps over the lazy dog}\n上标\\textsup{A QUICK BROWN FOX JUMPS OVER THE LAZY DOG}\n下标\\textsub{a quick brown fox jumps over the lazy dog}\n下标\\textsub{A QUICK BROWN FOX JUMPS OVER THE LAZY DOG}\n"}
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
