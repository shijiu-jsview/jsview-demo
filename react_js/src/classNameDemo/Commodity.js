import React from 'react';
import JsvMarquee2 from "../jsview-utils/JsViewReactWidget/JsvMarquee2";
import CssStyle from './Commodify_CssStyle';

class Commodity extends React.Component {
  constructor(props) {
    console.log('Commodity constructor');
    super(props);

    this._CommodityInfo = props.data;

    this.state = {
      isFocus: false,
    };
  }

  becomeFocus() {
    this.setState({ isFocus: true });
  }

  becomeBlur() {
    this.setState({ isFocus: false });
  }

  /**
     * title：标题
     * pict_url：海报图
     * sale_price：活动价
     * zk_final_price：折扣价  券后价？
     * volume：30天销量
     * coupon_amount：卷额
     * coupon_info：满xxx减xxx
     * reserve_price: 一口价，原价？
     */
  render() {
    // 焦点的放大效果
    let focus_transform = null;
    if (this.state.isFocus) {
      focus_transform = "scale3d(1.2, 1.2, 1)";
    }

    // 处理优惠券展示长度
    const save_prize_width = 10 * this._CommodityInfo.savePrize.length + 26; /* "元券"长度 */

    // 处理销售量长度
    let sold_total_width = 44 + 22;
    let sold_total_text = null;
    if (this._CommodityInfo.soldTotal >= 10000) {
      sold_total_text = `${parseInt(this._CommodityInfo.soldTotal / 10000)}`;
      sold_total_width += sold_total_text.length * 12 + 22;
      sold_total_text += "万";
    } else {
      sold_total_text = this._CommodityInfo.soldTotal;
      sold_total_width += this._CommodityInfo.soldTotal.length * 12;
    }

    const draw_item = (
            <div key="frame" className={CssStyle.FrameBackground.getName()}
                 style={{
                   transform: focus_transform,
                   transition: "transform 0.2s linear",
                 }}>
                <div key="holder" className={CssStyle.PosterHolder.getName()}>
                    <div key="holderText" className={CssStyle.PosterHolderText.getName()}/>
                </div>
                <div key="poster" className={CssStyle.Poster.getName()}
                     style={{
                       backgroundImage: `url(${this._CommodityInfo.pictUrl})`
                     }}
                />
                <TitleView
                    text={this._CommodityInfo.name}
                    isFocus={this.state.isFocus}
                />
                {/* 券额 */}
                <div key="prizeBar"
                    style={{
                      height: 24,
                      left: 13,
                      top: 256,
                      width: save_prize_width,
                    }}>
                    <div key="prizeBgLeft" className={CssStyle.SavePrizeFrameLeft.getName()}/>
                    <div key="prizeBgMid" className={CssStyle.SavePrizeFrameMid.getName()}
                         style={{ width: save_prize_width - 11 }}/>
                    <div key="prizeBgRight" className={CssStyle.SavePrizeFrameRight.getName()}
                         style={{ left: save_prize_width - 6 }}/>
                    <div key="prizeText" className={CssStyle.SavePrizeText.getName()}
                         style={{
                           width: save_prize_width,
                         }}>
                        {`${this._CommodityInfo.savePrize}元券`}
                    </div>
                </div>

                <div key="soldBar" style={{
                  top: 256,
                  left: 27 + save_prize_width
                }}>
                    <div key="soldBarLeft" className={CssStyle.SoldFrameLeft.getName()}/>
                    <div key="soldBarMid" className={CssStyle.SoldFrameMid.getName()}
                         style={{ width: sold_total_width - 13 }}/>
                    <div key="soldBarRight" className={CssStyle.SoldFrameRight.getName()}
                         style={{ left: sold_total_width - 7 }}/>
                    <div key="soldBarText" className={CssStyle.SoldText.getName()} style={{
                      width: sold_total_width,
                    }}>
                        {`已售${sold_total_text}件`}
                    </div>
                </div>

                <div key="prizeTitleText" className={`${CssStyle.PrizeTitleLayout.getName()} ${CssStyle.PrizeTitleFont.getName()}`}>
                    {'券后'}
                </div>
                <div key="prizeText" className={CssStyle.PrizeText.getName()}>
                    {`¥${this._CommodityInfo.prize - this._CommodityInfo.savePrize}`}
                </div>
            </div>
    );

    return draw_item;
  }
}

class TitleView extends React.Component {
  render() {
    if (this.props.isFocus) {
      return (
                <JsvMarquee2
                    layoutStyles={[CssStyle.TitleLayout]}
                    fontStyles={[CssStyle.TitleFont]}
                    styleToken={"fixed"}
                    text={this.props.text}
                />
      );
    }
    return (
                <div className={
                    `${CssStyle.TitleLayout.getName()} ${CssStyle.TitleFont.getName()}`
                }>
                    {this.props.text}
                </div>
    );
  }
}

export default Commodity;
