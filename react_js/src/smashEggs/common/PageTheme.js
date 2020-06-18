/**
 * Created by luocf on 2020/3/19.
 */
import BackgroundUrl from "../images/background_1280.jpg"
import BlueEggUrl from "../images/blue_egg.png"
import BrokenBlueEggBack from "../images/blue_egg_back.png"
import BrokenBlueEggFore from "../images/blue_egg_fore.png"
import RedEggUrl from "../images/red_egg.png"
import BrokenRedEggBack from "../images/red_egg_back.png"
import BrokenRedEggFore from "../images/red_egg_fore.png"
import YellowEggUrl from "../images/yellow_egg.png"
import BrokenYellowEggBack from "../images/yellow_egg_back.png"
import BrokenYellowEggFore from "../images/yellow_egg_fore.png"
import Crack from "../images/crack.png"
/*
import HalfEggsUrl from "../images/egg_2.png"
*/
import HammerUrl from "../images/hammer.png"
import HammerFocusUrl from "../images/hammer_focus.png"

import BtnFocusUrl from "../images/btn_focus_bg.png"
import SubPageBgUrl from "../images/subpage_bg.png"
import TipsIconBgUrl from "../images/activity_tips_icon.png"
import ResultLineUrl from "../images/prize_result_line.png"

class PageTheme {
    static get() {
        return {
            "MainPage": {
                "bgStyle": {
                    left: 0, top: 0, width: 1920, height: 1080,
                    backgroundImage: BackgroundUrl
                },
                "SmashEggsPage": {
                    style: {
                        left: 0, top: 0, width: 1920, height: 1080,
                    },
                    smashNumStyle: {
                        left: 530, top: 853, width: 863, height: 60,
                        lineHeight: 60, fontSize: 30, color: "#ffffff",
                        verticalAlign: "middle", textAlign: "center",
                    },
                    widget: {
                        left: 571, top: 443-20,
                        width: (191 + 105) * 3, height: 252 + 93+20,
                        hammer: {
                            style: {
                                left: 134, top: 0, width: 192, height: 147,
                                backgroundImage: HammerUrl
                            },
                            focusStyle: {
                                left: 134, top: 0, width: 159, height: 152,
                                backgroundImage: HammerFocusUrl
                            }
                        },
                        egg: {
                            style: {
                                left: 0, top: 93, width: 191, height: 252,
                            },
                            crack: {
                                size: {width: 191, height: 252},
                                url: Crack
                            }
                            /*halfStyle: {
                                left: 0, top: 93, width: 191, height: 252,
                                backgroundImage: HalfEggsUrl
                            }*/
                        },
                        data: [
                            {
                                "blocks": {
                                    "w": 191 + 105,
                                    "h": 252 + 93
                                },
                                "focusable": true,
                                "hasSub": false,
                                "id": 0,
                                "eggUrl": BlueEggUrl,
                                "brokenBack": BrokenBlueEggBack,
                                "brokenFore": BrokenBlueEggFore
                            },
                            {
                                "blocks": {
                                    "w": 191 + 105,
                                    "h": 252 + 93
                                },
                                "focusable": true,
                                "hasSub": false,
                                "id": 1,
                                "eggUrl": YellowEggUrl,
                                "brokenBack": BrokenYellowEggBack,
                                "brokenFore": BrokenYellowEggFore
                            },
                            {
                                "blocks": {
                                    "w": 191 + 105,
                                    "h": 252 + 93
                                },
                                "focusable": true,
                                "hasSub": false,
                                "id": 2,
                                "eggUrl": RedEggUrl,
                                "brokenBack": BrokenRedEggBack,
                                "brokenFore": BrokenRedEggFore
                            },
                        ]
                    },
                },
                "btn": {
                    "common": {
                        normalStyle: {
                            top: 348, width: 258, height: 84,
                            fontSize: 36, color: "#ffffff", lineHeight: 84,
                            textAlign: "center",
                            verticalAlign: "middle",
                        },
                        focusStyle: {
                            top: 337, width: 305, height: 108,
                            fontSize: 42, color: "#ff0000", lineHeight: 106,
                            textAlign: "center",
                            verticalAlign: "middle",
                        },
                        normalBgStyle: {
                            top: 348, width: 258, height: 84,
                            backgroundColor: "rgba(255,255,255,0.1)",
                            borderRadius: 42,
                        },

                        focusBgStyle: {
                            top: 337, width: 305, height: 108,
                            backgroundImage: BtnFocusUrl,
                        }
                    },

                    "myrecord": {
                        style: {left: 1640, top: 36},
                        focusStyle: {left: 1600, top: 30},
                        text: "我的中奖纪录",
                    },
                    "getdiscount": {
                        style: {left: 646},
                        focusStyle: {left: 646 - (361 - 258) / 2},
                        text: "领取优惠",
                    },
                    "enterstudying": {
                        style: {left: 1019},
                        focusStyle: {left: 1019 - (361 - 258) / 2},
                        centerStyle: {left: (1920 - 258) / 2},
                        centerFocusStyle: {left: (1920 - 361) / 2},
                        text: "进入学习"
                    },
                },
                "NoPrizePage":{
                    bgStyle:{
                        left:0,top:0,width:1920,height:1080,
                        backgroundImage:SubPageBgUrl,
                    },
                    title:{
                        style:{
                            left:852,top:166-10,width:216,height:74,
                            fontSize: 54, color: "#ffffff", lineHeight: 74,
                            textAlign: "center",
                            verticalAlign: "middle",
                        },
                        text:"抽奖结果"
                    },
                    tips:{
                        style:{
                            left:691,top:429-10,width:540,height:56,
                            fontSize: 36, color: "#ffffff", lineHeight: 56,
                            textAlign: "center",
                            verticalAlign: "middle",
                        },
                        text:"很遗憾，本次您与奖品擦肩而过～"
                    },
                    btn:{
                        style:{
                            left:789,top:869,width:343,height:92,
                            fontSize: 40, color: "#047E8D", lineHeight: 92,
                            textAlign: "center",
                            verticalAlign: "middle",
                            backgroundColor:"#ffffff"
                        },
                        text:"返回"
                    }
                },
                "GetPrizePage":{
                    bgStyle:{
                        left:0,top:0,width:1920,height:1080,
                        backgroundImage:SubPageBgUrl,
                    },
                    title:{
                        style:{
                            left:0,top:166-10,width:1920,height:74,
                            fontSize: 54, color: "#ffffff", lineHeight: 74,
                            textAlign: "center",
                            verticalAlign: "middle",
                        },
                        text:"恭喜您，获得"
                    },
                    tipsInfo:{
                        style:{
                            left:651,top:366-10,width:616,height:50,
                            fontSize: 30, color: "#F54F59", lineHeight: 50,
                            textAlign: "left",
                            verticalAlign: "middle",
                        },
                    },
                    tips1:{
                        style:{
                            left:574,top:673-6,width:772,height:36,
                            fontSize: 24, color: "rgba(255,255,255,0.8)", lineHeight: 36,
                            textAlign: "left",
                            verticalAlign: "middle",
                        },
                        text:"*请正确输入11位的手机号码，7个工作日内会有专人联系您，发放奖品。"
                    },
                    tips2:{
                        style:{
                            left:574,top:712-6,width:772,height:36,
                            fontSize: 24, color: "rgba(255,255,255,0.8)", lineHeight: 36,
                            textAlign: "left",
                            verticalAlign: "middle",
                        },
                        text:"*2小时内不提交手机号直接退出，则视为放弃领取。"
                    },
                    InputPanel:{
                        input:{
                            style:{
                                left:651,top:292-10,width:616,height:54,
                                overflow:"hidden",
                                backgroundColor:"rgba(255,255,255,0.15)"
                            },
                            hint:{
                                style:{
                                    left:676-651,top:0,width:500,height:54,
                                    fontSize: 30, color: "rgba(255,255,255,0.3)", lineHeight: 54,
                                    textAlign: "left",
                                    verticalAlign: "middle",
                                },
                                text:"请输入您的手机号码"
                            },

                            textStyle:{
                                left:676-651,top:0,width:500,height:54,
                                fontSize: 30, color: "#ffffff", lineHeight: 54,
                                textAlign: "left",
                                verticalAlign: "middle",
                                whiteSpace : 'nowrap',
                                textOverflow: 'ellipsis',
                            },
                        },
                        phone_format_tips:{
                            style:{
                                left:651,top:366-10,width:450,height:50,
                                fontSize: 30, color: "#F54F59", lineHeight: 50,
                                textAlign: "left",
                                verticalAlign: "middle",
                            },
                            text:"手机号输入格式错误，请重新输入"
                        },
                        widget:{
                            style:{
                                left:651,top:414,width:(136+24)*4,height:(54+24)*3,
                            },
                            gap:{width:24,height:24},
                            item:{
                                style:{
                                    top:0,width:136,height:54,
                                    fontSize: 30, color: "#FFFFFF", lineHeight: 54,
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                    backgroundColor:"rgba(255,255,255,0.15)"
                                },
                                focusStyle:{
                                    top:0,width:136,height:54,
                                    fontSize: 30, color: "#FFFFFF", lineHeight: 54,
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                    backgroundColor:"rgba(255,255,255,0.50)"
                                },
                            },
                            data:[
                                {
                                    blocks:{w:136+24,h:54+24},
                                    "focusable": true,
                                    "hasSub": false,
                                    "id": 1,
                                },
                                {
                                    blocks:{w:136+24,h:54+24},
                                    "focusable": true,
                                    "hasSub": false,
                                    "id": 2,
                                },
                                {
                                    blocks:{w:136+24,h:54+24},
                                    "focusable": true,
                                    "hasSub": false,
                                    "id": 3,
                                },

                                {
                                    blocks:{w:136+24,h:54+24},
                                    "focusable": true,
                                    "hasSub": false,
                                    "id": 4,
                                },
                                {
                                    blocks:{w:136+24,h:54+24},
                                    "focusable": true,
                                    "hasSub": false,
                                    "id": 5,
                                },
                                {
                                    blocks:{w:136+24,h:54+24},
                                    "focusable": true,
                                    "hasSub": false,
                                    "id": 6,
                                },

                                {
                                    blocks:{w:136+24,h:54+24},
                                    "focusable": true,
                                    "hasSub": false,
                                    "id": 7,
                                },
                                {
                                    blocks:{w:136+24,h:54+24},
                                    "focusable": true,
                                    "hasSub": false,
                                    "id": 8,
                                },
                                {
                                    blocks:{w:136+24,h:54+24},
                                    "focusable": true,
                                    "hasSub": false,
                                    "id": 9,
                                },
                                {
                                    blocks:{w:136+24,h:54+24},
                                    "focusable": true,
                                    "hasSub": false,
                                    "id": 0,
                                },
                                {
                                    blocks:{w:136+24,h:54+24},
                                    "focusable": true,
                                    "hasSub": false,
                                    "id": "清空",
                                },
                                {
                                    blocks:{w:136+24,h:54+24},
                                    "focusable": true,
                                    "hasSub": false,
                                    "id": "删除",
                                },
                            ]
                        }
                    },

                    btn1: {
                        focusStyle:{
                            backgroundColor: "#ffffff",color: "#047E8D"
                        },
                        style: {
                            left: 613, top: 869, width: 343, height: 92,
                            fontSize: 40, color: "#ffffff", lineHeight: 92,
                            textAlign: "center",
                            verticalAlign: "middle",
                            backgroundColor: "rgba(255,255,255,0.2)"
                        },
                        text:"确认提交"
                    },
                    btn2: {
                        focusStyle:{
                            backgroundColor: "#ffffff",color: "#047E8D"
                        },
                        style: {
                            left: 1005, top: 869, width: 343, height: 92,
                            fontSize: 40, color: "#ffffff", lineHeight: 92,
                            textAlign: "center",
                            verticalAlign: "middle",
                            backgroundColor: "rgba(255,255,255,0.2)",
                        },
                        text:"返回"
                    }
                },
                "GetPrizeFinishPage":{
                    bgStyle:{
                        left:0,top:0,width:1920,height:1080,
                        backgroundImage:SubPageBgUrl,
                    },
                    title:{
                        style:{
                            left:852,top:166-10,width:216,height:74,
                            fontSize: 54, color: "#ffffff", lineHeight: 74,
                            textAlign: "center",
                            verticalAlign: "middle",
                        },
                        text:"礼品发放"
                    },
                    tips:{
                        style:{
                            left:691,top:429-10,width:540,height:56,
                            fontSize: 36, color: "#ffffff", lineHeight: 56,
                            textAlign: "center",
                            verticalAlign: "middle",
                        },
                        text:"填写成功，请耐心等待礼品发放！"
                    },
                    btn:{
                        style:{
                            left:789,top:869,width:343,height:92,
                            fontSize: 40, color: "#047E8D", lineHeight: 92,
                            textAlign: "center",
                            verticalAlign: "middle",
                            backgroundColor:"#ffffff"
                        },
                        text:"返回"
                    }
                },
                "MyPrizeRecordPage":{
                    bgStyle:{
                        left:0,top:0,width:1920,height:1080,
                        backgroundImage:SubPageBgUrl,
                    },
                    title:{
                        style:{
                            left:798,top:166-10,width:324,height:74,
                            fontSize: 54, color: "#ffffff", lineHeight: 74,
                            textAlign: "center",
                            verticalAlign: "middle",
                        },
                        text:"我的中奖记录"
                    },
                    tips:{
                        style:{
                            left:725,top:429-10,width:540,height:56,
                            fontSize: 36, color: "#ffffff", lineHeight: 56,
                            textAlign: "center",
                            verticalAlign: "middle",
                        },
                        text:"很遗憾，您暂无中奖记录呢～"
                    },
                    records:{
                        head:{
                            account:{
                                style:{
                                    left:509,top:292-10,width:186,height:56,
                                    fontSize: 36, color: "rgba(255,255,255,0.8)", lineHeight: 56,
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                },
                                text:"用户账号"
                            },
                            prize:{
                                style:{
                                    left:835,top:292-10,width:186,height:56,
                                    fontSize: 36, color: "rgba(255,255,255,0.8)", lineHeight: 56,
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                },
                                text:"奖品"
                            },
                            phone:{
                                style:{
                                    left:1243,top:292-10,width:186,height:56,
                                    fontSize: 36, color: "rgba(255,255,255,0.8)", lineHeight: 56,
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                },
                                text:"手机号码"
                            }
                        },
                        line:{
                            style:{
                                left:(1920-1024)/2,top:353,width:1024,height:3,
                                backgroundImage:ResultLineUrl,
                            }
                        },
                        content:{
                            container:{
                                width:(186+140)*3,height:80*3,
                                style:{
                                    left:509-70,top:379,width:(186+140)*3,height:80*3,
                                }
                            },

                            item:{
                                width:(186+140)*3,height:80,
                                account:{
                                    style:{
                                        left:0,top:0,width:186+140,height:80,
                                        fontSize: 30, color: "rgba(255,255,255,0.8)", lineHeight: 80,
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                    },
                                },
                                prize:{
                                    style:{
                                        left:186+140+10,top:0,width:186+140+70,height:80,
                                        fontSize: 30, color: "rgba(255,255,255,0.8)", lineHeight: 80,
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                    },
                                },
                                phone:{
                                    style:{
                                        left:(186+140)*2+70,top:0,width:186+140,height:80,
                                        fontSize: 30, color: "rgba(255,255,255,0.8)", lineHeight: 80,
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                    },
                                },

                            }
                        }
                    },
                    btn:{
                        style:{
                            left:789,top:869,width:343,height:92,
                            fontSize: 40, color: "#047E8D", lineHeight: 92,
                            textAlign: "center",
                            verticalAlign: "middle",
                            backgroundColor:"#ffffff"
                        },
                        text:"返回"
                    }
                }
            },
            "TipsPage": {
                bgStyle: {
                    left: 0, top: 0, width: 1920, height: 1080,
                    backgroundImage: SubPageBgUrl,
                },

                tips: {
                    style: {
                        left: 0, top: (1080-100)/2, width: 1920, height: 100,
                        fontSize: 36, color: "#ffffff", lineHeight: 100,
                        textAlign: "center",
                        verticalAlign: "middle",
                    },
                    text: "很抱歉，您所使用机顶盒暂不支持参于此活动！"
                },
            }
        }
    }
}

export default PageTheme;