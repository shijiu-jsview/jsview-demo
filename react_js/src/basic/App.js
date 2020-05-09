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
