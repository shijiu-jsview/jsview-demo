/**
 * Created by chunfeng.luo@qcast.cn on 10/13/2020.
 */

/*
 * 【模块 export 内容】
 * JsvScrollNum：React高阶组件，二维码显示，
 *      props说明:
 *            value   {number}  初始值
 *            interval  {number}  滚动时长（单位：ms）， 默认值为5000
 *            itemWidth {number}  滚动条每个数字宽度，默认值为40
 *            height {number}   滚动条高度，默认值为100
 *            separatorType {JsvScrollNum.SEPARATOR} 分隔符类型，JsvScrollNum.SEPARATOR.NONE(默认）,JsvScrollNum.SEPARATOR.THOUSAND
 *            separator {string}  分隔符
 *            textStyle {object}  文字样式
 *              {
 *                color {string}文字颜色，默认值为'rgba(255,255,255,1.0)'
 *                backgroundColor{string} 背景颜色，默认值为'rgba(0,0,0,0)',
 *                fontSize{number}文字大小，默认值为40,
 *                textAlign{string} 文字居中样式，默认为'center',
 *                lineHeight{number} 行高，默认为'100px'
 *              }
 *功能函数：(参数说明见函数本体)
 *start(number)
 *功能：初始化滚动数字
 *scrollTo(number)
 *功能：滚动到目标数字
 */

import React from 'react';
import PropTypes from 'prop-types';

class ScrollPanel extends React.Component {
  constructor(props) {
    super(props);
    this.index = props.index;
    this._TestKey = Math.random();
    // console.log('ScrollPanel index:' + this.index + ', _TestKey:' + this._TestKey + ', startNum:' + props.startNum)
    this.direction = props.direction || null;
    this.interval = props.interval || 0;
    this.width = props.width || 0;
    this.height = props.height || 0;
    this.startNum = props.startNum || 0;
    this.endNum = props.startNum || 0;
    const moveTop = -this.props.height * (this.startNum);
    const transformProperty = `translate3d(0,${moveTop}px,0)`;
    this.state = {
      innerDivTransform: transformProperty,
      innerDivTransition: null,
      innerDivTop: 0,
      numVisible: 'visible',
      scrollNumVisible: 'visible',
      lastNum: this.startNum,
    };
  }

    _renderInner = () => {
      return (<div key="scroller-inner-pane"
                     style={{
                       width: this.width,
                       height: this.height,
                       transform: "translate3d(0,0,0)",
                       ...this.props.textStyle,
                     }}>
            <div key="lastNum"
                 style={{
                   top: 0,
                   left: 0,
                   width: this.width,
                   height: this.height,
                   visibility: this.state.numVisible,
                   ...this.props.textStyle,
                   lineHeight: `${this.height}px`,
                 }}>
                {this.state.lastNum}
            </div>
            <div key="scroller-num"
                 style={{
                   ...this.props.textStyle,
                   width: this.props.textStyle.fontSize * 0.6, // 显示多行
                   height: this.height * 20,
                   lineHeight: `${this.height}px`,
                   visibility: this.state.scrollNumVisible,
                   left: (this.width - this.props.textStyle.fontSize * 0.6) / 2,
                   top: this.state.innerDivTop,
                   wordBreak: 'normal',
                   wordWrap: 'break-word',
                   overflow: 'hidden',
                   transition: this.state.innerDivTransition,
                   transform: this.state.innerDivTransform,
                   transformOrigin: 'center center',
                 }} onTransitionEnd={this._onTransitionEnd}>
                {'01234567890123456789'}
            </div>
        </div>);
    }

    render() {
      return (
            <div key="fragment">
                <div key="scroller" style={{
                  overflow: 'hidden',
                  width: this.width,
                  height: this.height,
                }}>
                    {this._renderInner()}
                </div>
            </div>
      );
    }

    scrollTo = (endNumber) => {
      const endNum = parseInt(endNumber, 10);
      if (this.endNum === endNum) {
        return;// nothing todo
      }
      this.startNum = this.endNum;
      this.endNum = endNum;

      let offset = this.endNum;
      if (this.endNum - this.startNum < 0) {
        offset = 10 + this.endNum;
      }

      const moveTop = -this.props.height * offset;
      // console.log('scrollTo panel index:' + this.index + ', startNum:' + this.startNum + ', endNum:' + this.endNum + ', offset:' + offset + ', moveTop:' + moveTop)
      const transformProperty = `translate3d(0,${moveTop}px,0)`;
      const durationProperty = `${this.props.interval / 1000}s`;
      this.setState({
        scrollNumVisible: 'visible',
        numVisible: 'hidden',
        innerDivTransform: transformProperty,
        innerDivTransition: `transform ${durationProperty} linear`,
        lastNum: this.endNum,
      });
    }

    _onTransitionEnd = (event) => {
      event.stopPropagation();
      // console.log('_onTransitionEnd, this.endNum:' + this.endNum + ', index:' + this.index + ', _TestKey:' + this._TestKey)
      const moveTop = -this.props.height * (this.endNum);
      const transformProperty = `translate3d(0,${moveTop}px,0)`;
      const durationProperty = '0s';
      this.setState({
        scrollNumVisible: 'hidden',
        numVisible: 'visible',
        innerDivTransform: transformProperty,
        innerDivTransition: `transform ${durationProperty} linear`,
        lastNum: this.endNum,
      });
    }

    componentWillUnmount() {
      // console.log('ScrollPanel componentWillUnmount TestKey:' + this._TestKey)
    }

    componentDidMount() {
      // console.log('ScrollPanel componentDidMount TestKey:' + this._TestKey)
    }
}

class JsvScrollNum extends React.Component {
  constructor(props) {
    super(props);
    this.oldCountArray = [];
    this.newCountArray = [];
    this.scrollPanelArray = [];
    this.propsInner = { ...props };
    this.beginNum = this.props.value;
    this.endNum = this.beginNum;
    const table = this.init(this.beginNum, this.endNum);
    this._RefreshTimer = null;
    this.state = {
      table,
    };
  }

  render() {
    return (
            <div key={`scrollPane${this.beginNum}_${this.endNum}`}>
                <div key={`divFragment${this.beginNum}_${this.endNum}`}>
                    <div key={`scrollerRenderTable${this.beginNum}_${this.endNum}`}>
                        {this._renderTable()}
                    </div>
                </div>
            </div>
    );
  }

    _renderTable = () => {
      if (!this.state.table || this.state.table.length === 0) {
        return null;
      }
      return this.state.table;
    }

    createScrollPanel = (props, index) => {
      return <ScrollPanel key={`scroller_panel_${index}`} index={index}
                            startNum={this.oldCountArray[this.oldCountArray.length - 1 - index]} {...props}
                            ref={this._initScrollPanel}/>;
    }

    init = (begin, end) => {
      this.oldCountArray = [];
      this.newCountArray = [];
      this.scrollPanelArray = [];
      this.beginNum = begin;
      this.endNum = end;
      begin += '';
      end += '';
      const beginLength = begin.length;
      const endLength = end.length;
      for (let i = 0; i < beginLength; ++i) {
        this.oldCountArray.push(begin.charAt(i));
      }
      for (let i = 0; i < endLength; ++i) {
        this.newCountArray.push(end.charAt(i));
      }
      // Do necessary padding
      const diff = Math.abs(beginLength - endLength);
      let itemCount = Math.max(beginLength, endLength);
      if (beginLength > endLength) {
        itemCount = Math.min(beginLength, endLength);
        this.oldCountArray = this.oldCountArray.slice(diff, beginLength);
      } else if (beginLength < endLength) {
        for (let i = 1; i <= diff; ++i) {
          this.oldCountArray.unshift('0');
        }
      }

      // Start building UI
      const table = [];
      this.propsInner.width = this.props.itemWidth; // Set the width property
      this.innerInit(table, itemCount);
      return table;
    }

    _initScrollPanel = (ref) => {
      if (ref) {
        this.scrollPanelArray.push(ref);
      }
    }

    innerInit = (table, maxLength) => {
      let separatorCount = 0;
      if (this.props.separatorType !== JsvScrollNum.SEPARATOR.NONE) {
        separatorCount = parseInt((maxLength - 1) / this.props.separatorType, 10);
      }
      const tr = [];
      let left = (maxLength - 1) * this.propsInner.width;
      if (separatorCount !== 0) {
        left += separatorCount * this.propsInner.width;
      }

      for (let i = 0; i < maxLength; ++i) {
        console.log(`innerInit i:${i}, left:${left}`);
        // Update props
        let td = <div key={`scroller_td_${i}`}
                          style={{ left }}>{this.createScrollPanel(this.propsInner, i)}</div>;
        tr.push(td);
        if (this.props.separatorType !== JsvScrollNum.SEPARATOR.NONE &&
                ((i + 1) < maxLength) &&
                (i + 1) % this.props.separatorType === 0) {
          left -= this.propsInner.width;
          td = <div key={`scroller-separator-pane${i}`}
                    style={{
                      left,
                      top: 0,
                      width: this.propsInner.width,
                      height: (this.props.height),
                      ...this.props.textStyle,
                      lineHeight: `${this.props.height}px`
                    }}>
            {this.props.separator}
          </div>;
          tr.push(td);
        }
        left -= this.propsInner.width;
      }
      table.push(tr);
    }

    start = (number) => {
      const table = this.init(number, number);
      this.setState({
        table,
      });
    }

    scrollTo = (number) => {
      const count = (`${number}`).trim().replace(/,:/g, '');
      if (count.length !== this.newCountArray.length) {
        const table = this.init(this.endNum, count);
        this.setState({
          table,
        }, () => {
          this._RefreshTimer = setTimeout(() => {
            this.refresh();
          }, 1);
        });
      } else {
        this.beginNum = this.endNum;
        this.oldCountArray = this.newCountArray;
        this.endNum = count;
        this.newCountArray = [];
        for (let i = 0; i < count.length; ++i) {
          this.newCountArray.push(count.charAt(i));
        }
        this.refresh();
      }
    }

    refresh = () => {
      for (let i = this.oldCountArray.length - 1; i >= 0; i--) {
        if (this.scrollPanelArray[i]) {
          // scroll panel的顺序，与其控制的数字顺序相反，便于数据增加时，旧scroll panel不变
          this.scrollPanelArray[i].scrollTo(this.newCountArray[this.oldCountArray.length - 1 - i]);
        }
      }
    }

    _ClearTimer() {
      if (this._RefreshTimer) {
        clearTimeout(this._RefreshTimer);
        this._RefreshTimer = null;
      }
    }

    componentDidMount() {
      // console.log('JsvScrollNum componentDidMount')
    }

    componentWillUnmount() {
      // console.log('JsvScrollNum componentWillUnmount')
      this._ClearTimer();
    }
}
JsvScrollNum.SEPARATOR = {
  NONE: 0,
  THOUSAND: 3
};

JsvScrollNum.propTypes = {
  value: PropTypes.number, // 初始值
  interval: PropTypes.number, // 滚动时长,单位：ms
  itemWidth: PropTypes.number, // 滚动条文字宽度
  height: PropTypes.number, // 滚动条高度
  separatorType: PropTypes.number, // 分隔符类型
  separator: PropTypes.string, // 分隔符
  textStyle: PropTypes.object // 文字样式
};

JsvScrollNum.defaultProps = {
  value: 0,
  interval: 5000,
  itemWidth: 40,
  height: 100,
  separator: '',
  separatorType: JsvScrollNum.SEPARATOR.NONE,
  textStyle: {
    color: 'rgba(255,255,255,1.0)',
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 40,
    textAlign: 'center',
    verticalAlign: 'middle',
    lineHeight: '100px'
  }
};

export default JsvScrollNum;
