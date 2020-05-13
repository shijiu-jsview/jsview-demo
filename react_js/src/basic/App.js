/*
 * 【界面概述】
 * div元素style中设置值对应的样例
 *
 * 【控件介绍】
 * 无
 *
 * 【技巧说明】
 * Q: 如何将div布局到指定坐标中？
 * A: 设置div style中的top和left，坐标值是相对于父div的左上角的坐标值
 *
 * Q: 如何在界面上描画图片？
 * A: 参照div/DivBackground.js，div的style中，
 *    描绘纯色时，通过backgroundColor来设置，例如
 *    <div style={{width:200, height:200, backgroundColor: 'rgba(255, 255, 0, 1)'}}>
 *    描绘图片时，通过backgroundImage来设置，例如
 *    <div style={{width:200, height:200, backgroundColor:`url(${iconImgPath})`}}>
 *    注意，不设置width和height的情况是默认尺寸为0px * 0px，不会展示图片
 *
 * Q: 如何对图片进行剪切，只展示图片的局部内容？
 * A: 参照div/DivClip.js，使用style中的overflow:"hidden"属性进行裁剪，或者使用style中clipPath属性进行裁剪
 *
 * Q: 如何将展示图片的四个角变成圆角？
 * A: 参照img/ImgRadius.js，通过设置style中的borderRadius属性完成圆角改变
 *
 * Q: 文字如何描绘？
 * A: 在div标签的内容中可填写需要描绘的文字，文字的字体字号等属性，通过div标签中的style来控制，参照text文件夹中的各个js。
 *    文字内容中的折行可以使用'\n'来完成
 *
 * Q: 如何让div产生动画效果？
 * A: 动画需要通过以下两种方式实现，具体见anim文件夹各个js:
 *    方式1：声明keyframe结构，通过div的style中的animation来引用keyFrame，启动动画
 *    方式2：设置div style中的transition属性，然后调整div的left/top/width/height之后，会按照transition规则进行动画。
 *    注意点1：keyFrame可以声明在css文件中，也可以通过document.styleSheet来动态加载，可以参考转盘demo(turntableDemo)
 *    在JsView系统中，css文件中只能声明keyFrame内容，不能声明其他内容
 *    注意点2：transition目前只支持left/top/width/height属性的跟踪，其他属性目前不支持
 */

import React from 'react';
import './App.css';
import Title from './Title.js';
import DivGroup1 from './div/DivGroup1.js';
import DivGroup2 from './div/DivGroup2.js';
import TextGroup from './text/TextGroup.js';
import AnimGroup from './anim/AnimGroup.js';
import AVGroup from './av/AVGroup.js';
import {Router, FdivRoot, Fdiv, HORIZONTAL, EdgeDirection, VERTICAL, SlideStyle } from "../jsview-utils/jsview-react/index_widget.js"
import {TitleFont} from './CommonFontStyle'
import {globalHistory} from '../demoCommon/RouterHistory';
import {FocusBlock} from "../demoCommon/BlockDefine"

class App extends FocusBlock {
    constructor(props) {
        super(props);
        console.log("App.constructor().");

        this._FdivRouter = new Router();

        this.state = {
            offsetX:0,
            offsetY:0
        };
    }

    onKeyDown(ev) {
        //console.log("Get key code=" + ev.keyCode);
        if (ev.keyCode === 37) {
            // 'Left' key down
            this.setState({offsetX: this.state.offsetX + 30})
        } else if (ev.keyCode === 39) {
            // 'Right' key down
            this.setState({offsetX: this.state.offsetX - 30})
        } else if (ev.keyCode === 38) {
            // 'Up' key down
            this.setState({offsetY: this.state.offsetY + 30})
        } else if (ev.keyCode === 40) {
            // 'Down' key down
            this.setState({offsetY: this.state.offsetY - 30})
        } else if (ev.keyCode == 27 || ev.keyCode === 10000) {
            globalHistory.goBack();
            this.changeFocus("/main");
        }
        return true;
    }

    componentDidMount() {
        console.log("App.componentDidMount(). time=" + Date.now());
        // this._FdivRouter.focus("main");
    }

    renderContent() {
        console.log("App.render(). time=" + Date.now());

        const rootStyle = {
            width: 1250, height: 670,
        };
        const itemWidth = 240;
        const itemHeight = 160;
        const marginLeft = 20;

        return (
            <div>
                <div style={{ ...rootStyle,
                    top: 10, left: 10,
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                }}>
                    <div key="ContentArea" style={{top:this.state.offsetY, left:this.state.offsetX}}>
                        <div style={{top:20, left:marginLeft}}>
                            <Title style={{ ...rootStyle }}
                                    contentTop='20px' contentLeft= {marginLeft + 'px'}
                                    itemWidth = {itemWidth} itemHeight = {itemHeight}/>
                            <div style={{top: 20}}>
                                <DivGroup1 style={{ ...rootStyle}}
                                        itemWidth = {itemWidth} itemHeight = {itemHeight}/>
                                <DivGroup2 style={{ ...rootStyle, left:itemWidth}}
                                        itemWidth = {itemWidth} itemHeight = {itemHeight}/>
                                <TextGroup style={{ ...rootStyle, left:itemWidth * 2}}
                                        itemWidth = {itemWidth} itemHeight = {itemHeight}/>
                                <AnimGroup style={{ ...rootStyle, left:itemWidth * 3}}
                                        itemWidth = {itemWidth} itemHeight = {itemHeight}/>
                                {/*<AVGroup style={{ ...rootStyle, left:itemWidth * 4}}*/}
                                        {/*itemWidth = {itemWidth} itemHeight = {itemHeight}/>*/}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{...TitleFont, color: 'rgba(255, 0, 0, 1)',
                    top:650, left:900,
                    width:280, height:20}}>
                    》》按上下左右键可调整视图位置《《
                </div>
            </div>
        );
    }
}

export default App;
