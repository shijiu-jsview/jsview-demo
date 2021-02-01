/*
 * 【界面概述】
 *    绘制 拼图
 * 【控件介绍】
 * JsvMaskClipDiv：React高阶组件，进行蒙版遮罩处理
 *      props说明:
 *          stylesList {array}    布局样式(必需)，数组中可包含样式对象或者JsvStyleClass，或者JsvTextStyleClass对象，
 *                                  样式对象内容为{left:0, top:0, width:xxx, height:xxx}，
 *                                  布局样式为数组中所有样式的合并。
 *          styleRevision {string}  类似于react html元素的key，当style变化时，由使用者改变此Token通知hoc进行style重新识别。
 *                                  Token不变的场景，props变化不会引起render，以提高渲染性能。
 *                                  若未设置，则默认对比stylesList的引用是否变化，每个新的{}视为改变
 *          maskSrc   {string/URL} 蒙版图片，可为URL字符串，或者通过import进来的图片引用
 *          viewSrc   {string/URL} 被遮罩的图片，可为URL字符串，或者通过import进来的图片引用
 *          maskTop   {double}     蒙版相对于被遮罩图片的左上角Y定位，单位为百分比(Y坐标 / 被遮罩图片的高)
 *          maskLeft  {double}     蒙版相对于被遮罩图片的左上角X定位，单位为百分比(X坐标 / 被遮罩图片的宽)
 *          maskWidth {double}     蒙版相对于被遮罩图片宽度的百分比(蒙版的宽度 / 被遮罩图片的宽)
 *          maskHeight{double}     蒙版相对于被遮罩图片高度的百分比(蒙版的高度 / 被遮罩图片的宽)
 */


import React from 'react';
import { FocusBlock } from "../demoCommon/BlockDefine";
import createStandaloneApp from "../demoCommon/StandaloneApp";

import JsvMaskClipDiv from "../jsview-utils/JsViewReactWidget/JsvMaskClipDiv";
import mask1_pic from "./images/mask-025/res/1.png";
import mask2_pic from "./images/mask-025/res/2.png";
import mask3_pic from "./images/mask-025/res/3.png";
import mask4_pic from "./images/mask-025/res/4.png";
import bg_pic from "./images/php.jpg";

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
        <div style={{ width: 1280, height: 720, backgroundColor: "#FFFF00" }}>
        <div style={{
          textAlign: "center",
          fontSize: "30px",
          lineHeight: "50px",
          color: "#ffffff",
          left: 10,
          top: 100,
          width: 654 / 2,
          height: 50,
          backgroundColor: "rgba(27,38,151,0.8)"
        }}>{`原始图片`}</div>
          <div style={{ left: 10, top: (720 - 654 / 2) / 2, width: 654 / 2, height: 654 / 2, backgroundImage: `url(${bg_pic})` }}></div>
          <div style={{ left: 654 / 2 + 150 }}>
          <JsvMaskClipDiv
              stylesList={[{ top: 120, left: 10, width: 196, height: 256 }]}
              viewSrc={bg_pic}
              maskSrc={mask1_pic}
              maskLeft={0 / 654}
              maskTop={0 / 654}
              maskWidth={327 / 654}
              maskHeight={427 / 654}
          />
           <JsvMaskClipDiv
              stylesList={[{ top: 120, left: 10 + 196, width: 256, height: 196 }]}
              viewSrc={bg_pic}
              maskSrc={mask2_pic}
              maskLeft={227 / 654}
              maskTop={0 / 654}
              maskWidth={427 / 654}
              maskHeight={327 / 654}
          />
           <JsvMaskClipDiv
              stylesList={[{ top: 120 + 256 + 10, left: 10, width: 256, height: 196 }]}
              viewSrc={bg_pic}
              maskSrc={mask3_pic}
              maskLeft={0 / 654}
              maskTop={327 / 654}
              maskWidth={427 / 654}
              maskHeight={327 / 690}
          />
          <JsvMaskClipDiv
              stylesList={[{ top: 120 + 196 + 10, left: 10 + 256, width: 196, height: 256 }]}
              viewSrc={bg_pic}
              maskSrc={mask4_pic}
              maskLeft={327 / 654}
              maskTop={227 / 690}
              maskWidth={327 / 654}
              maskHeight={427 / 654}
          />
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
