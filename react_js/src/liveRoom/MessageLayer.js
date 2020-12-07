import React from 'react';
import LiveStyle from './LiveStyle';
import { FocusBlock } from "../demoCommon/BlockDefine";
import roseImg from './img/rose.png';
import eventProxy from './eventProxy';


const TextDiv = ({ style, img, text, top, inx, callback }) => {
  return (
    text === null ?
        <div key={inx} style={{ ...style.item_bg_style, top, transition: "top 1.5s linear" }} onTransitionEnd={callback}>
            <div style={style.item_vip_style}/>
            <div style={style.item_rank_style}/>
            <div style={style.item_header_style}/>
            <div style={{ ...style.item_name_style, left: 135 }}>飞翔吧牛蛙:</div>
            <div style={{ ...style.item_text_style, left: 230 }}>送出</div>
            <div style={{ ...style.item_rose_style, backgroundImage: img || roseImg }}/>
            <div style={{ ...style.item_name_style, left: 305, color: "#FFCC33" }}>X1</div>
        </div>
      :
        <div key={inx} style={{ ...style.item_bg_style, top, transition: "top 1.5s linear" }} onTransitionEnd={callback}>
            <div style={style.item_vip_style}/>
            <div style={style.item_rank_style}/>
            <div style={style.item_header_style}/>
            <div style={{ ...style.item_name_style, left: 135 }}>飞翔吧牛蛙:</div>
            <div style={{ ...style.item_text_style, left: 230 }}>{text}</div>
        </div>
  );
};

class MessageLayer extends FocusBlock {
  constructor(props) {
    super(props);
    this._style = LiveStyle.get().messageLayer;
    this._ScrollTimer = null;
    this.state = {
      textList: [
        {
          text: "我发送了第1条数据",
          key: 0,
          img: null
        }
      ],
      textPoolList: [],
      textCount: 0,
      animationEnd: true,
      animationCnt: 0
    };
    this._UpdatePage();
  }

  componentDidMount() {
    console.log("MessageLayer componentDidMount in");
    eventProxy.on('OnMessage', (item) => {
      console.log(item);
      this._AddTextList(item);
    });
  }

  componentWillUnmount() {
    console.log("MessageLayer componentWillUnmount in");
    eventProxy.off('OnMessage');
  }

    _onAnmationEnd = () => {
      let cnt = this.state.animationCnt;
      cnt++;
      this.setState({ animationCnt: cnt });
      this.setState({ animationEnd: true });
      if (!this._ScrollTimer) {
        this._copyRenderList();
      }
    }

    _copyRenderList = () => {
      const oldPoolList = this.state.textPoolList;
      const oldList = this.state.textList;
      if (oldPoolList.length > 0) {
        oldList.unshift(oldPoolList.pop());
        this.setState({ textPoolList: oldPoolList });
        this.setState({ textList: oldList.slice(0, 8) });
      }
    }

    _AddTextList = (item = null, init = false) => {
      let counter = this.state.textCount;
      counter++;
      this.setState({ textCount: counter });
      const oldPoolList = this.state.textPoolList;
      const newObj = {
        text: item && item.text ? item.text : null,
        key: counter,
        img: item && item.img ? item.img : null
      };
      if (init) newObj.text = counter % 2 === 0 ? `我发送了第${counter}条留言` : null;
      oldPoolList.unshift(newObj);
      this.setState({ textPoolList: oldPoolList });
      if (this.state.animationEnd) {
        this.setState({ animationEnd: false });
        this._copyRenderList();
      }
    }

    _ClearTimer() {
      if (this._ScrollTimer) {
        clearTimeout(this._ScrollTimer);
        this._ScrollTimer = null;
      }
    }

    _UpdatePage() {
      this._ScrollTimer = setTimeout(() => {
        this._AddTextList(null, true);
        this._UpdatePage();
      }, 500);

      if (this.state.textCount === 30) {
        this._ClearTimer();
      }
    }

    renderContent() {
      return (
            <span>
                <div style={ this._style.bg_style }>
                    {
                        this.state.textList.map((e, inx) => {
                          return <TextDiv key={e.key} style={this._style} img={e.img} text={e.text} top={(6 - inx) * 47} inx={e.key} callback={(parseInt(e.key / 7) * 7) === e.key ? this._onAnmationEnd : null}/>;
                        })
                    }
                </div>
            </span>
      );
    }
}

export default MessageLayer;
