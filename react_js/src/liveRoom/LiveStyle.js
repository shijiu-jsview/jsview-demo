import headerImg from './img/ljq.jpeg'
import hotFireImg from './img/hot_fire.png'
import hotArrowImg from './img/hot_arrow.png'
import msgImg from './img/notify.png'
import vipImg from './img/vip.png'
import rankImg from './img/rank.png'
import roseImg from './img/rose.png'
import giftImg from './img/gift.png'
import arrowImg from './img/up.png'
import notifyImg from './img/notify.jpeg'

class LiveStyle {
    static get() {
        return {
            "basicLayer":{
                header_style: {
                    left:17,
                    top: 12, 
                    width: 63, 
                    height: 63,
                    borderRadius: 31.5,
                    backgroundImage: headerImg
                },
                name_bg_style: {
                    left: 57,
                    top: 19,
                    width: 244,
                    height: 44,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: 22
                },
                name_text_style: {
                    left: 0,
                    top: 0,
                    width: 244,
                    height: 44,
                    fontSize: 22, 
                    lineHeight: "44px",
                    color:"#FFFFFF",
                    textAlign:"center",
                    verticalAlign:"middle",
                    fontFamily: "Source Han Sans CN"
                },
                hot_bg_style: {
                    left: 316,
                    top: 19,
                    width: 170,
                    height: 44,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    borderRadius: 22
                },
                hot_fire_style: {
                    left:19,
                    top: 5, 
                    width: 30, 
                    height: 34,
                    backgroundImage: hotFireImg
                },
                hot_text_style: {
                    left: 0,
                    top: 0,
                    width: 170,
                    height: 44,
                    fontSize: 20, 
                    lineHeight: "44px",
                    color:"#FFFFFF",
                    textAlign:"center",
                    verticalAlign:"middle",
                },
                hot_arrow_style: {
                    left:136,
                    top: 14, 
                    width: 12, 
                    height: 16,
                    backgroundImage: hotArrowImg
                },
                notify_bg_style: {
                    left: 901,
                    top: 19,
                    width: 370,
                    height: 40,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    borderRadius: 20
                },
                notify_logo_style: {
                    left:55,
                    top: 9, 
                    width: 19, 
                    height: 19,
                    backgroundImage: msgImg
                },
                notify_text_style: {
                    left: 0,
                    top: 0,
                    width: 370,
                    height: 40,
                    fontSize: 16, 
                    lineHeight: "40px",
                    color:"#FFFFFF",
                    textAlign:"center",
                    verticalAlign:"middle",
                },
                fans_bg_style: {
                    left: 901,
                    top: 381,
                    width: 354,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "rgba(0,171,250,0.7)"
                },
                fans_text_style: {
                    width: 354,
                    height: 40,                    
                    fontSize: 18, 
                    lineHeight: "40px",
                    color:"#FFFFFF",
                },
                fans_name_style: {
                    width: 354,
                    height: 40,                    
                    fontSize: 18, 
                    lineHeight: "40px",
                    color:"#FFCC33",
                },
                golden_text_style: {
                    left: 994,
                    top: 657,
                    width:175,
                    height:30,
                    lineHeight: 27,
                    fontSize: 18,
                    color: "#FFCC33",
                    textAlign:"center",
                    verticalAlign:"middle",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    borderRadius: 20
                },
                golden_gift_style: {
                    left:1147,
                    top: 605, 
                    width: 125, 
                    height: 122,
                    backgroundImage: giftImg
                }

            },
            "messageLayer": {
                bg_style: {
                    left: 11,
                    top: 374, 
                    width: 385, 
                    height:285, 
                    overflow:"hidden"
                },
                item_bg_style: {
                    left:0,
                    width: 385,
                    height: 40,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    borderRadius: 20
                },
                item_vip_style: {
                    left:8,
                    top:5,
                    width: 29,
                    height: 29,
                    backgroundImage: vipImg
                },
                item_rank_style: {
                    left:37,
                    top:7,
                    width: 75,
                    height: 24,
                    backgroundImage: rankImg
                },
                item_header_style: {
                    left:99,
                    top: 3, 
                    width: 33.9, 
                    height: 33.9,
                    borderRadius: 17,
                    backgroundImage: headerImg
                },
                item_text_style: {
                    top: 10,
                    width: 354,
                    height: 40,                    
                    fontSize: 16, 
                    lineHeight: "18px",
                    color:"#FFFFFF",
                },
                item_name_style: {
                    left: 135,
                    top: 10,
                    width: 90,
                    height: 18,                    
                    fontSize: 16, 
                    lineHeight: "18px",
                    color:"#39DCFF",
                },
                item_rose_style: {
                    left:260,
                    top:0,
                    width: 44,
                    height: 44,
                    backgroundImage: roseImg
                },     
            },
            "inputLayer":{
                input_bg_style: {
                    left: 11,
                    top: 671, 
                    width: 300, 
                    height:34, 
                    backgroundColor: "rgba(0,0,0,0.45)",
                    borderRadius: "17 0 0 17"
                },
                up_bg_style: {
                    left: 15,
                    top: 9, 
                    width: 15, 
                    height:12, 
                    backgroundImage: arrowImg,
                },
                input_text_style: {
                    left: 0,
                    top: 0,
                    width: 300,
                    height: 34,
                    fontSize: 18, 
                    lineHeight: "34px",
                    color:"#ADADAD",
                    textAlign:"center",
                    verticalAlign:"middle",
                },
                sender_bg_style: {
                    left: 311,
                    top: 671, 
                    width: 84, 
                    height:34, 
                    fontSize: 18, 
                    lineHeight: "34px",
                    color:"#FFFFFF",
                    textAlign:"center",
                    verticalAlign:"middle",
                    backgroundColor: "rgba(0,0,0,0.45)",
                    borderRadius: "0 17 17 0"
                },
            },
            "giftLayer": {
                bg_style: {
                    left: 0,
                    top: 557, 
                    width: 1280, 
                    height:163, 
                    backgroundColor: "rgba(0,0,0,0.8)",
                },
                gift_bg_style: {
                    left:16,
                    top: 14, 
                    width: 98, 
                    height:98, 
                },
                gift_text_style: {
                    left: 40,
                    top: 119, 
                    width: 51, 
                    height:16, 
                    fontSize: 16, 
                    lineHeight: "18px",
                    color:"#FFFFFF",
                    textAlign:"center",
                    verticalAlign:"middle",
                },
                ani_bg_style: {
                    left:591,
                    top: 321, 
                    width: 98, 
                    height:98, 
                }
            },
                   
        }
    }
}
export default LiveStyle;