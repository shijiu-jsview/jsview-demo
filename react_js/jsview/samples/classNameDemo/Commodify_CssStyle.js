import { JsvStyleClass, JsvTextStyleClass } from "../../utils/JsViewReactTools/JsvStyleClass";
import posterHolder from './images/holder_logo.png';
import couponLeft from "./images/coupon_left.png";
import couponRight from "./images/coupon_right.png";
import couponMid from "./images/coupon_mid.png";
import borderLeft from './images/line_left.png';
import borderMid from './images/line_mid.png';
import borderRight from './images/line_right.png';

const CssStyle = {};

// 带圆角的白色背景
CssStyle.FrameBackground = new JsvStyleClass({
  width: 213,
  height: 337,
  borderRadius: `10px 10px 10px 10px`,
  backgroundColor: '#F7F7F4'
});

// 海报默认背景图，上边缘为圆角
CssStyle.PosterHolder = new JsvStyleClass({
  width: 213,
  height: 213,
  borderRadius: `10px 10px 0px 0px`,
  backgroundColor: '#CFCAC6'
});

// 海报未显示时的展示内容
CssStyle.PosterHolderText = new JsvStyleClass({
  width: 107,
  height: 23,
  left: 53,
  top: 95,
  backgroundImage: `url(${posterHolder})`
});

// 海报位置，上边缘为圆角
CssStyle.Poster = new JsvStyleClass({
  width: 213,
  height: 213,
  borderRadius: `7px 7px 0px 0px`,
});

CssStyle.TitleFont = new JsvTextStyleClass({
  fontSize: `21px`,
  color: '#73665C',
  lineHeight: `29px`,
  overflow: "hidden",
  whiteSpace: 'nowrap',
  textOverflow: "ellipsis",
  textAlign: "center",
});

CssStyle.TitleLayout = new JsvTextStyleClass({
  top: 221,
  left: 13,
  width: 193,
  height: 29
});

// 优惠券展示外框(由左中右3部分拼接成)
CssStyle.SavePrizeFrameLeft = new JsvStyleClass({
  width: 5, height: 24, backgroundImage: `url(${couponLeft})`
});

CssStyle.SavePrizeFrameMid = new JsvStyleClass({
  height: 24,
  backgroundImage: `url(${couponMid})`,
  left: 5
});

CssStyle.SavePrizeFrameRight = new JsvStyleClass({
  width: 5, height: 24, backgroundImage: `url(${couponRight})`,
});

// 优惠券文字显示，使用 JsvTextStyleClass 能极大加速同样式的文字描画
CssStyle.SavePrizeText = new JsvTextStyleClass({
  height: 24,
  color: '#FFFFFF',
  fontSize: `16px`,
  textAlign: 'center',
  lineHeight: `24px`
});

// 销售额区域
CssStyle.SoldFrameLeft = new JsvStyleClass({
  width: 7,
  height: 25,
  backgroundImage: `url(${borderLeft})`
});

CssStyle.SoldFrameMid = new JsvStyleClass({
  height: 25,
  left: 7,
  backgroundImage: `url(${borderMid})`
});

CssStyle.SoldFrameRight = new JsvStyleClass({
  width: 7,
  height: 25,
  backgroundImage: `url(${borderRight})`
});

CssStyle.SoldText = new JsvTextStyleClass({
  height: 25,
  color: '#FF7A00',
  fontSize: `20px`,
  textAlign: 'center',
  lineHeight: `25px`
});

// "券后"字样，再次为了展示class合并功能，把属性进行分开
CssStyle.PrizeTitleLayout = new JsvStyleClass({
  width: 35,
  height: 24,
  top: 296,
  left: 13,
});

CssStyle.PrizeTitleFont = new JsvTextStyleClass({
  color: '#DE2825',
  textAlign: 'center',
  fontSize: `17px`,
  lineHeight: `24px`
});

// 价格字样
CssStyle.PrizeText = new JsvTextStyleClass({
  top: 289,
  left: 53,
  width: (213 - 55),
  height: 37,
  lineHeight: `37px`,
  fontSize: `28px`,
  color: '#DE2825'
});

export default CssStyle;
