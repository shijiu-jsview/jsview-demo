import {JsvStyleClass, JsvTextStyleClass} from "../jsview-utils/JsViewReactTools/JsvStyleClass"
import posterHolder from './images/holder_logo.png'
import couponLeft from "./images/coupon_left.png"
import couponRight from "./images/coupon_right.png"
import couponMid from "./images/coupon_mid.png"
import borderLeft from './images/line_left.png'
import borderMid from './images/line_mid.png'
import borderRight from './images/line_right.png'

let CssStyle = {};

// 带圆角的白色背景
CssStyle.FrameBackground = new JsvStyleClass({
	width:320,
	height:506,
	borderRadius: `10px 10px 10px 10px`,
	backgroundColor: '#F7F7F4'
});

// 海报默认背景图，上边缘为圆角
CssStyle.PosterHolder = new JsvStyleClass({
	width:320,
	height:320,
	borderRadius: `10px 10px 0px 0px`,
	backgroundColor:'#CFCAC6'
});

// 海报未显示时的展示内容
CssStyle.PosterHolderText = new JsvStyleClass({
	width:160,
	height:34,
	left:80,
	top:143,
	backgroundImage:`url(${posterHolder})`
});

// 海报位置，上边缘为圆角
CssStyle.Poster = new JsvStyleClass({
	width:320,
	height:320,
	borderRadius: `10px 10px 0px 0px`,
});

CssStyle.TitleFont = new JsvTextStyleClass({
	fontSize:`32px`,
	color:'#73665C',
	lineHeight:`44px`,
	overflow: "hidden",
	whiteSpace: 'nowrap',
	textOverflow: "ellipsis",
});

CssStyle.TitleLayout = new JsvTextStyleClass({
	top: 332,
	left: 20,
	width: 290,
	height: 44
});

// 优惠券展示外框(由左中右3部分拼接成)
CssStyle.SavePrizeFrameLeft = new JsvStyleClass({
	width:8,height:36,backgroundImage:`url(${couponLeft})`
});

CssStyle.SavePrizeFrameMid = new JsvStyleClass({
	height:36,
	backgroundImage:`url(${couponMid})`,
	left:8
});

CssStyle.SavePrizeFrameRight = new JsvStyleClass({
	width:8,height:36,backgroundImage:`url(${couponRight})`,
});

// 优惠券文字显示，使用 JsvTextStyleClass 能极大加速同样式的文字描画
CssStyle.SavePrizeText = new JsvTextStyleClass({
	height:36,
	color:'#FFFFFF',
	fontSize:`24px`,
	textAlign:'center',
	lineHeight:`36px`
});

// 销售额区域
CssStyle.SoldFrameLeft = new JsvStyleClass({
	width:10,
	height:36,
	backgroundImage:`url(${borderLeft})`
});

CssStyle.SoldFrameMid = new JsvStyleClass({
	height:36,
	left:10,
	backgroundImage:`url(${borderMid})`
});

CssStyle.SoldFrameRight = new JsvStyleClass({
	width:10,
	height:36,
	backgroundImage:`url(${borderRight})`
});

CssStyle.SoldText = new JsvTextStyleClass({
	height:36,
	color:'#FF7A00',
	fontSize:`24px`,
	textAlign:'center',
	lineHeight:`36px`
});

// "券后"字样，再次为了展示class合并功能，把属性进行分开
CssStyle.PrizeTitleLayout = new JsvStyleClass({
	width:52,
	height:36,
	top:444,
	left:20,
});

CssStyle.PrizeTitleFont = new JsvTextStyleClass({
	color:'#DE2825',
	textAlign:'center',
	fontSize:`26px`,
	lineHeight:`36px`
});

// 价格字样
CssStyle.PrizeText = new JsvTextStyleClass({
	top:434,
	left:80,
	width: (320-82),
	height: 56,
	lineHeight: `56px`,
	fontSize: `42px`,
	color: '#DE2825'
});

export default CssStyle;