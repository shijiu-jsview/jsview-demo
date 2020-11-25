/*
 * 【界面概述】
 * 展示文字垂直对齐方式显示控件的用法
 *
 * 【控件介绍】
 * JsvTextBox：文字的垂直对齐方式显示控件
 *                  verticalAlign {string}  垂直对齐方式 (必需) top、middle、bottom
 *                  layoutStyles {array}  布局样式(必需)，数组中可包含样式对象或者JsvStyleClass对象，
 *                                         样式对象内容为{left:0, top:0, width:xxx, height:xxx}，
 *                                         布局样式为数组中所有样式的合并。
 *                  fontStyles {array} 字体样式数组(必需)，由object或JsvTextStyleClass组成
 *                                                          布局样式为数组中所有样式的合并。
 *                                                          数组中只有单个JsvTextStyleClass时，可加速渲染性能
 *                  styleToken {string}  类似于react html元素的key，当style变化时，由使用者改变此Token通知hoc进行style重新识别。
 *                                      Token不变的场景，props变化不会引起render，以提高渲染性能
 *
 * 【技巧说明】
 * Q: 如何实现文字居中对齐方式显示?
 * A: verticalAlign属性设置为middle
 *
 * Q: 如何触发控件重绘?
 * A: 1. 变更styleToken属性，将触发控件重新解析styles并重绘
 *    2. 变更文字内容，将触发控件重绘，但不会重新解析styles
 */

import React from 'react';
import createStandaloneApp from '../demoCommon/StandaloneApp';
import { FocusBlock } from '../demoCommon/BlockDefine';
import JsvTextBox from '../jsview-utils/JsViewReactWidget/JsvTextBox';
import { JsvTextStyleClass, JsvStyleClass } from "../jsview-utils/JsViewReactTools/JsvStyleClass";

const sLayoutSet = new JsvStyleClass({
  width: 400,
  height: 300,
  backgroundColor: 'rgba(255,255,0,0.5)'
});

// 注意：
// 虽然textAlign 和 lineHeight都相同，但verticalAlign不相同的场景
// 如果不能分别分配不同style class实例的话，就达不到文字属性加速的目的
// 以下仅对 sFontSetLeft40 场景进行了拆分，可以看出区别
const sFontSetLeft40Top = new JsvTextStyleClass({
  fontSize: '30px', // 测试 30 和 '30px' 两种写法的兼容性
  textAlign: 'left',
  lineHeight: '40px'
});

const sFontSetLeft40Center = new JsvTextStyleClass({
  fontSize: 30, // 测试 30 和 '30px' 两种写法的兼容性
  textAlign: 'left',
  lineHeight: '40px'
});

const sFontSetLeft40Bottom = new JsvTextStyleClass({
  fontSize: 30,
  textAlign: 'left',
  lineHeight: '40px'
});

const sFontSetLeft80 = new JsvTextStyleClass({
  fontSize: 30,
  textAlign: 'left',
  lineHeight: '80px'
});

const sFontSetCenter40 = new JsvTextStyleClass({
  fontSize: 30,
  textAlign: 'center',
  lineHeight: '40px'
});

const sFontSetCenter80 = new JsvTextStyleClass({
  fontSize: 30,
  textAlign: 'center',
  lineHeight: '80px'
});

const sFontSetRight40 = new JsvTextStyleClass({
  fontSize: 30,
  textAlign: 'right',
  lineHeight: '80px'
});

const sFontSetRight80 = new JsvTextStyleClass({
  fontSize: 30,
  textAlign: 'right',
  lineHeight: '80px'
});

const sStyleToken = "v1.0";


class MainScene extends FocusBlock {
  constructor (props) {
    super(props);
    this._MoveCount = 0;
    this.state = {
      offsetX: 0,
      offsetY: 0
    };
  }

  onKeyDown(ev) {
    // console.log("Get key code=" + ev.keyCode);
    if (ev.keyCode === 37) {
      // 'Left' key down
      this.setState({ offsetX: this.state.offsetX + 30 });
      this._MoveCount++;
    } else if (ev.keyCode === 39) {
      // 'Right' key down
      this.setState({ offsetX: this.state.offsetX - 30 });
      this._MoveCount++;
    } else if (ev.keyCode === 38) {
      // 'Up' key down
      this.setState({ offsetY: this.state.offsetY + 30 });
      this._MoveCount++;
    } else if (ev.keyCode === 40) {
      // 'Down' key down
      this.setState({ offsetY: this.state.offsetY - 30 });
      this._MoveCount++;
    } else if (ev.keyCode === 27 || ev.keyCode === 10000) {
      if (this._NavigateHome) {
        this._NavigateHome();
      }
    }
    return true;
  }


  componentWillUnmount () {

  }

  componentDidMount () {

  }

  _RenderLeftContent() {
    const text =
            `静夜思 --唐李白
床前明月光，疑是地上霜；
举头望明月，低头思故乡。`;
    return (<div style={{ top: 50 }}>
            <div style={{ left: 0, top: -50, width: 400, height: 50, fontSize: 20, textAlign: 'left', lineHeight: '50px', backgroundColor: "#00ff00" }}>
                整体向上对齐、文字居左显示
            </div>
            <JsvTextBox verticalAlign="top"
                        styleToken={sStyleToken}
                        layoutStyles={[sLayoutSet, { left: 0, top: 0 }]}
                        fontStyles={[sFontSetLeft40Top]}>
                {`测试文字变化能引起刷新: [${this._MoveCount}]\n${text}`}
            </JsvTextBox>
            <div
                style={{ left: 410, top: -50, width: 400, height: 50, fontSize: 20, textAlign: 'left', lineHeight: '50px', backgroundColor: "#00ff00" }}>
                整体垂直居中对齐、文字水平居左显示
            </div>
            <JsvTextBox verticalAlign="middle"
                        styleToken={sStyleToken}
                        layoutStyles={[sLayoutSet, { left: 410, top: 0 }]}
                        fontStyles={[sFontSetLeft40Center]}>
                {text}
            </JsvTextBox>
            <div style={{ left: 820, top: -50, width: 400, height: 50, fontSize: 20, textAlign: 'left', lineHeight: '50px', backgroundColor: "#00ff00" }}>
                整体垂直向下对齐、文字水平居左显示
            </div>
            <JsvTextBox verticalAlign="bottom"
                        styleToken={sStyleToken}
                        layoutStyles={[sLayoutSet, { left: 820, top: 0 }]}
                        fontStyles={[sFontSetLeft40Bottom]}>
                {text}
            </JsvTextBox>
            <div style={{ left: 1240, top: -50, width: 500, height: 50, fontSize: 20, textAlign: 'left', lineHeight: '50px', backgroundColor: "#00ff00" }}>
                整体垂直向上对齐、文字水平居左显示、行高80px
            </div>
            <JsvTextBox verticalAlign="top"
                        styleToken={sStyleToken}
                        layoutStyles={[sLayoutSet, { left: 1240, top: 0, width: 500 }]}
                        fontStyles={[sFontSetLeft80]}>
                {text}
            </JsvTextBox>
        </div>);
  }

  _RenderCenterContent() {
    const text =
            `静夜思 --唐李白
床前明月光，疑是地上霜；
举头望明月，低头思故乡。`;
    return (<div style={{ top: 400 }}>
            <div style={{ left: 0, top: -50, width: 400, height: 50, fontSize: 20, textAlign: 'left', lineHeight: '50px', backgroundColor: "#00ff00" }}>
                整体垂直向上对齐、文字水平居中显示
            </div>
            <JsvTextBox verticalAlign="top"
                        styleToken={sStyleToken}
                        layoutStyles={[sLayoutSet, { left: 0, top: 0 }]}
                        fontStyles={[sFontSetCenter40]}>
                {text}
            </JsvTextBox>
            <div style={{ left: 410, top: -50, width: 400, height: 50, fontSize: 20, textAlign: 'left', lineHeight: '50px', backgroundColor: "#00ff00" }}>
                整体垂直居中对齐、文字水平居中显示
            </div>
            <JsvTextBox verticalAlign="middle"
                        styleToken={sStyleToken}
                        layoutStyles={[sLayoutSet, { left: 410, top: 0 }]}
                        fontStyles={[sFontSetCenter40]}>
                {text}
            </JsvTextBox>
            <div style={{ left: 820, top: -50, width: 400, height: 50, fontSize: 20, textAlign: 'left', lineHeight: '50px', backgroundColor: "#00ff00" }}>
                整体垂直向下对齐、文字水平居中显示
            </div>
            <JsvTextBox verticalAlign="bottom"
                        styleToken={sStyleToken}
                        layoutStyles={[sLayoutSet, { left: 820, top: 0 }]}
                        fontStyles={[sFontSetCenter40]}>
                {text}
            </JsvTextBox>

            <div style={{ left: 1240, top: -50, width: 500, height: 50, fontSize: 20, textAlign: 'left', lineHeight: '50px', backgroundColor: "#00ff00" }}>
                整体垂直居中对齐、文字水平居中显示、行高80px
            </div>
            <JsvTextBox verticalAlign="middle"
                        styleToken={sStyleToken}
                        layoutStyles={[sLayoutSet, { left: 1240, top: 0, width: 500 }]}
                        fontStyles={[sFontSetCenter80]}>
                {text}
            </JsvTextBox>
        </div>
    );
  }

  _RenderRightContent() {
    const text =
            `静夜思 --唐李白
床前明月光，疑是地上霜；
举头望明月，低头思故乡。`;
    return (<div style={{ top: 750 }}>
            <div style={{ left: 0, top: -50, width: 400, height: 50, fontSize: 20, textAlign: 'left', lineHeight: '50px', backgroundColor: "#00ff00" }}>
                整体垂直向上对齐、文字水平居右显示
            </div>
            <JsvTextBox verticalAlign="top"
                        styleToken={sStyleToken}
                        layoutStyles={[sLayoutSet, { left: 0, top: 0 }]}
                        fontStyles={[sFontSetRight40]}>
                {text}
            </JsvTextBox>
            <div style={{ left: 410, top: -50, width: 400, height: 50, fontSize: 20, textAlign: 'left', lineHeight: '50px', backgroundColor: "#00ff00" }}>
                整体垂直居中对齐、文字水平居右显示
            </div>
            <JsvTextBox verticalAlign="middle"
                        styleToken={sStyleToken}
                        layoutStyles={[sLayoutSet, { left: 410, top: 0 }]}
                        fontStyles={[sFontSetRight40]}>
                {text}
            </JsvTextBox>
            <div style={{ left: 820, top: -50, width: 400, height: 50, fontSize: 20, textAlign: 'left', lineHeight: '50px', backgroundColor: "#00ff00" }}>
                整体垂直向下对齐、文字水平居右显示
            </div>
            <JsvTextBox verticalAlign="bottom"
                        styleToken={sStyleToken}
                        layoutStyles={[sLayoutSet, { left: 820, top: 0 }]}
                        fontStyles={[sFontSetRight40]}>
                {text}
            </JsvTextBox>

            <div style={{ left: 1240, top: -50, width: 500, height: 50, fontSize: 20, textAlign: 'left', lineHeight: '50px', backgroundColor: "#00ff00" }}>
                整体垂直向下对齐、文字水平居右显示、行高80px
            </div>
            <JsvTextBox verticalAlign="bottom"
                        styleToken={sStyleToken}
                        layoutStyles={[sLayoutSet, { left: 1240, top: 0, width: 500 }]}
                        fontStyles={[sFontSetRight80]}>
                {text}
            </JsvTextBox>
        </div>);
  }

  _RenderOneLineContent() {
    const text = 'abcdefghigk';
    return (<div style={{ top: 750 + 300 + 50 }}>
            <div style={{ left: 0, top: -50, width: 400, height: 50, fontSize: 20, textAlign: 'left', lineHeight: '50px', backgroundColor: "#00ff00" }}>
                整体垂直向上对齐、文字水平居左显示
            </div>
            <JsvTextBox verticalAlign="top"
                        styleToken={sStyleToken}
                        layoutStyles={[{
                          left: 0,
                          top: 0,
                          width: 400,
                          height: 80,
                          backgroundColor: 'rgba(255,255,0,0.5)' }
                        ]}
                        fontStyles={[{
                          backgroundColor: 'rgba(255,255,0,0.5)',
                          fontSize: 30,
                          textAlign: 'left',
                          lineHeight: '80px'
                        }]}>
                {text}
            </JsvTextBox>
            <div style={{ left: 410, top: -50, width: 400, height: 50, fontSize: 20, textAlign: 'left', lineHeight: '50px', backgroundColor: "#00ff00" }}>
                整体垂直居中对齐、文字水平居中显示
            </div>
            <JsvTextBox verticalAlign="middle"
                        styleToken={sStyleToken}
                        layoutStyles={[{
                          left: 410,
                          top: 0,
                          width: 400,
                          height: 80,
                          backgroundColor: 'rgba(255,255,0,0.5)' }
                        ]}
                        fontStyles={[{
                          backgroundColor: 'rgba(255,255,0,0.5)',
                          fontSize: 30,
                          textAlign: 'center',
                          lineHeight: '80px'
                        }]}>
                {text}
            </JsvTextBox>
            <div style={{ left: 820, top: -50, width: 400, height: 50, fontSize: 20, textAlign: 'left', lineHeight: '50px', backgroundColor: "#00ff00" }}>
                整体垂直向下对齐、文字水平居右显示
            </div>
            <JsvTextBox verticalAlign="bottom"
                        styleToken={sStyleToken}
                        layoutStyles={[{
                          left: 820,
                          top: 0,
                          width: 400,
                          height: 80,
                          backgroundColor: 'rgba(255,255,0,0.5)' }
                        ]}
                        fontStyles={[{
                          backgroundColor: 'rgba(255,255,0,0.5)',
                          fontSize: 30,
                          textAlign: 'right',
                          lineHeight: '80px'
                        }]}>
                {text}
            </JsvTextBox>

        </div>);
  }

  renderContent () {
    return (<div key="ContentArea" style={{ top: this.state.offsetY, left: this.state.offsetX }}>
            {this._RenderLeftContent()}
            {this._RenderCenterContent()}
            {this._RenderRightContent()}
            {this._RenderOneLineContent()}
        </div>);
  }
}
const App = createStandaloneApp(MainScene);
export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
