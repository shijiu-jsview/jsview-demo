import React from 'react';
import PageTheme from '../../common/PageTheme';
import {
  VERTICAL,
  SimpleWidget,
  SlideStyle,
  EdgeDirection
} from '../../../jsview-utils/jsview-react/index_widget';
import { formatDate } from '../../common/commonData';

import ConstantVar from '../../common/ConstantVar';
import { Button } from '../../common/CommonWidget';
import { FocusBlock } from '../../../jsview-utils/JsViewReactTools/BlockDefine';
import CommonApi from '../../common/CommonApi';
import Reward from './Reward';

class MyPrizeRecordPage extends FocusBlock {
  constructor (props) {
    super(props);
    this._PageTheme = PageTheme.get().MainPage.MyPrizeRecordPage;
    this._GoTo = this.props.goTo;
    this.state = {
      visible: 'hidden',
      focusId: 0,
      prizeInfo: null,
      renderCount: 0,
      focusName: null,
      prizeRecord: null,
    };
  }

  onFocus () {
    const prize_record = this._FilterData(this.props.data);
    let focusName = null;
    // 设置焦点
    if (prize_record.length === 0) {
      focusName = `${this.props.branchName}/go`;
    } else {
      // TODO 判断是否为领奖时间，领奖时间时，则焦点为list widget
      focusName = `${this.props.branchName}/PrizeListWidget`;
    }
    this.changeFocus(focusName);
    this.setState({
      visible: 'visible',
      prizeRecord: prize_record,
      focusName,
      renderCount: ++this.state.renderCount
    });
    console.log('MyPrizeRecordPage _onFocus ');
  }

  onBlur () {
    this.setState({ visible: 'hidden' });
    console.log('MyPrizeRecordPage _onBlur ');
  }

  onKeyDown (ev) {
    const use_key = true;
    switch (ev.keyCode) {
      case ConstantVar.KeyCode.Left:
        break;
      case ConstantVar.KeyCode.Right:
        break;
      case ConstantVar.KeyCode.Down:
        if (this.state.focusName === `${this.props.branchName}/PrizeListWidget`) {
          const focusName = `${this.props.branchName}/go`;
          this.changeFocus(focusName);
          this.setState({ focusName });
        }
        break;
      case ConstantVar.KeyCode.Up:
        if (this.state.focusName === `${this.props.branchName}/go`) {
          const focusName = `${this.props.branchName}/PrizeListWidget`;
          this.changeFocus(focusName);
          this.setState({ focusName });
        }
        break;
      case ConstantVar.KeyCode.Ok:
      case ConstantVar.KeyCode.Back:
      case ConstantVar.KeyCode.Back2:
        if (this._GoTo) {
          this._GoTo(ConstantVar.BranchName.SmashEggsPage);
        }
        break;
      default:
        break;
    }
    return use_key;
  }

  _FilterData (data) {
    const prize_record = [];
    const theme = this._PageTheme.records;
    if (data && this.props.info) {
      let count = 0;
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        for (let j = 0; j < this.props.info.prize_info.length; j++) {
          const prize_info = this.props.info.prize_info[j];
          if (prize_info.prize_id === item.prize_id) {
            prize_record.push({
              blocks: { w: theme.content.item.width, h: theme.content.item.height },
              focusable: true,
              index: count++,
              redeem: item.redeem,
              account: this.props.account,
              name: prize_info.name,
              ticket: item.ticket,
              prizeId: prize_info.prize_id,
              image: prize_info.image,
            });
            break;
          }
        }
      }
    }
    return prize_record;
  }

  _onEdge = (edge_info) => {
    if (edge_info.direction === EdgeDirection.bottom) {
      this.onKeyDown({ keyCode: ConstantVar.KeyCode.Down });
    }
  }

  _RenderItem = (item) => {
    const level_list = ['一等奖', '二等奖', '三等奖', '四等奖', '五等奖', '六等奖', '七等奖', '八等奖', '九等奖', '十等奖'];
    const theme = this._PageTheme.records;
    // TODO 领奖时间，显示领取按钮
    return (<div key={`row:${item.index}`}>
      <div key={`item-0${item.index}`}
           style={theme.content.item.level.style}>{level_list[item.prizeId - 1]}</div>
      <div key={`item-1${item.index}`}
           style={theme.content.item.prize.style}>{item.name}</div>
      <div key={`item-2${item.index}`}
           style={theme.content.item.btnGet.style}>{item.redeem === 1 ? '已领取' : '领取'}</div>
    </div>);
  }

  _RenderFocus = (item) => {
    const level_list = ['一等奖', '二等奖', '三等奖', '四等奖', '五等奖', '六等奖', '七等奖', '八等奖', '九等奖', '十等奖'];
    const theme = this._PageTheme.records;
    return (<div key={`row:${item.index}`}
                 style={{
                   width: theme.content.item.width,
                   height: theme.content.item.height,
                   backgroundColor: theme.content.item.focusBg
                 }}>
      <div key={`item-0${item.index}`}
           style={theme.content.item.level.focusStyle}>{level_list[item.prizeId - 1]}</div>
      <div key={`item-1${item.index}`}
           style={theme.content.item.prize.focusStyle}>{item.name}</div>
      <div key={`item-2${item.index}`}
           style={theme.content.item.btnGet.focusStyle}>{item.redeem === 1 ? '已领取' : '领取'}</div>
    </div>);
  }

  _Measures = (item) => {
    return SimpleWidget.getMeasureObj(item.blocks.w, item.blocks.h, item.focusable, item.hasSub);
  }

  _onClick = (item) => {
    if (!this.props.info || !this.props.info.prize_info) {
      return;
    }
    const time = formatDate(new Date(), 'yyyy年MM月dd日 ');
    const promise2 = CommonApi.getTicket(this.state.prizeRecord[item.index].ticket);
    promise2.then(data => {
      this.setState({
        prizeInfo: {
          account: this.state.prizeRecord[item.index].account,
          key: data.ticket,
          time,
          redeem: this.state.prizeRecord[item.index].redeem,
          reward: this.state.prizeRecord[item.index].name,
          rewardImgae: this.state.prizeRecord[item.index].image
        }
      });
      this.changeFocus(`${this.props.branchName}/reward`);
    }).catch(e => {
      console.log(`error:${e}`);
    });
  }

  _ResurnFromReward = () => {
    this.changeFocus(`${this.props.branchName}/PrizeListWidget`);
  }

  renderContent () {
    console.log('this.props.data:',);
    if (!this.state.prizeRecord) {
      return null;
    }
    return (
      <div key={`record_${this.state.renderCount}`} style={{ visibility: this.state.visible }}>
        <div style={this._PageTheme.bgStyle}/>
        <div style={this._PageTheme.title.style}>{this._PageTheme.title.text}</div>
        <div
          style={{ ...this._PageTheme.tips.style, ...{ visibility: this.state.prizeRecord.length > 0 ? 'hidden' : 'inherit' } }}>{this._PageTheme.tips.text}</div>
        {this.state.prizeRecord.length > 0 ? <div>
          <div key="headLevel"
               style={this._PageTheme.records.head.level.style}>{this._PageTheme.records.head.level.text}</div>
          <div key="headPrize"
               style={this._PageTheme.records.head.prize.style}>{this._PageTheme.records.head.prize.text}</div>
          <div key="Line" style={this._PageTheme.records.line.style}>{this._PageTheme.records.line.text}</div>
          <div key="Container" style={this._PageTheme.records.content.container.style}>
            <SimpleWidget
              width={ this._PageTheme.records.content.container.width }
              height={ this._PageTheme.records.content.container.height }
              direction={ VERTICAL }
              data={this.state.prizeRecord}
              slideStyle={ SlideStyle.seamless }
              onClick={this._onClick}
              onEdge={ this._onEdge}
              renderItem={ this._RenderItem }
              renderFocus={ this._RenderFocus }
              measures={ this._Measures }
              branchName={`${this.props.branchName}/PrizeListWidget`}
            />
          </div>
        </div> : null}
        <Button branchName={`${this.props.branchName}/go`} theme={this._PageTheme.btn}
                text={this._PageTheme.btn.text} isFocus={this.state.focusName === (`${this.props.branchName}/go`)}/>
        <Reward branchName={`${this.props.branchName}/reward`} info={this.state.prizeInfo}
                back={this._ResurnFromReward}/>
      </div>
    );
  }

  componentDidMount () {

  }
}
export default MyPrizeRecordPage;
