import React from 'react'
import JsvMarquee from "../jsview-utils/JsViewReactWidget/JsvMarquee"
import couponLeft from "./images/coupon_left.png"
import couponRight from "./images/coupon_right.png"
import couponMid from "./images/coupon_mid.png"
import borderLeft from './images/line_left.png'
import borderMid from './images/line_mid.png'
import borderRight from './images/line_right.png'
import posterHolder from './images/holder_logo.png'
import './App.css'

let data={
    "category_id": 201294501,
    "click_url": "//s.click.taobao.com/t?e=m%3D2%26s%3DfZo%2FF7%2BKnA1w4vFB6t2Z2ueEDrYVVa64Dne87AjQPk9yINtkUhsv0Jgs97d5Y%2BXDngqExHzB0EIqEL4N12nzBXBUg1tKFNQ8yu%2BYVH%2BwQ8LdoSjVQRMJvTSetc%2FoNqO7UyNpxLfgKr0jWpzpm6nEC67dPKJQo6Fi3RDi7vDGNfRcfm37xb4PJWojUxvil99qmalwsp3NoAG%2FzhHmwRLNf3EqY%2Bakgpmw&scm=1007.15348.115058.0_27451&pvid=cdeb884b-063d-4f03-9c63-e328f0d506b6&app_pvid=59590_11.11.44.240_63709_1597905096653&ptl=floorId:27451;originalFloorId:27451;pvid:cdeb884b-063d-4f03-9c63-e328f0d506b6;app_pvid:59590_11.11.44.240_63709_1597905096653&union_lens=lensId%3AMAPI%401597905096%40cdeb884b-063d-4f03-9c63-e328f0d506b6_622366236227%401",
    "commission_rate": "10.51",
    "coupon_amount": 190,
    "coupon_click_url": "//uland.taobao.com/coupon/edetail?e=r59IVL9zWAwNfLV8niU3R5TgU2jJNKOfNNtsjZw%2F%2FoJfrSiqKbzSM9dTlyv9f8iSZmofnNzQCSXDmY2Qsstp3OmFKyIN1bVX65OH1WfUm95Uf2TiFOebe3v7SwS3xXcexzaLnaBo3j%2FAvEbxn8hQQ22Q2xA6Zra7hUhOndx1wB2NVYe4mWFLKbjlqWs2dZ%2BIiu%2BNGE4XfTTluAYBRglsbQ%3D%3D&&app_pvid=59590_11.11.44.240_63709_1597905096653&ptl=floorId:27451;app_pvid:59590_11.11.44.240_63709_1597905096653;tpp_pvid:cdeb884b-063d-4f03-9c63-e328f0d506b6&union_lens=lensId%3AMAPI%401597905096%40cdeb884b-063d-4f03-9c63-e328f0d506b6_622366236227%401",
    "coupon_end_time": "1598111999000",
    "coupon_remain_count": 94000,
    "coupon_share_url": "//uland.taobao.com/coupon/edetail?e=r59IVL9zWAwNfLV8niU3R5TgU2jJNKOfNNtsjZw%2F%2FoJfrSiqKbzSM9dTlyv9f8iSZmofnNzQCSXDmY2Qsstp3OmFKyIN1bVX65OH1WfUm95Uf2TiFOebe3v7SwS3xXcexzaLnaBo3j%2FAvEbxn8hQQ22Q2xA6Zra7hUhOndx1wB2NVYe4mWFLKbjlqWs2dZ%2BIiu%2BNGE4XfTTluAYBRglsbQ%3D%3D&&app_pvid=59590_11.11.44.240_63709_1597905096653&ptl=floorId:27451;app_pvid:59590_11.11.44.240_63709_1597905096653;tpp_pvid:cdeb884b-063d-4f03-9c63-e328f0d506b6&union_lens=lensId%3AMAPI%401597905096%40cdeb884b-063d-4f03-9c63-e328f0d506b6_622366236227%401",
    "coupon_start_fee": "209.0",
    "coupon_start_time": "1597852800000",
    "coupon_total_count": 100000,
    "item_description": "",
    "item_id": 622366236227,
    "jhs_price_usp_list": "",
    "level_one_category_id": 50026316,
    "level_one_category_name": "咖啡/麦片/冲饮",
    "nick": "万福川旗舰店",
    "pict_url": "http://img.alicdn.com/bao/uploaded/i3/2207313464483/O1CN01Ab4vWz1izGAyRL1Yf_!!0-item_pic.jpg",
    // "pict_url": "https://testaccount.kkapp.com/api/files/3XuVc5fGvW",
    "reserve_price": "500",
    "seller_id": 2207313464483,
    "shop_title": "万福川旗舰店",
    "short_title": "新疆骆驼奶粉蛋白质男女儿童营养粉",
    "small_images": {
        "string": ["//img.alicdn.com/i4/2207313464483/O1CN012eyYoJ1izGAxjoRho_!!2207313464483.jpg", "//img.alicdn.com/i4/2207313464483/O1CN01LIIJa51izG96sZ93h_!!2207313464483.jpg", "//img.alicdn.com/i1/2207313464483/O1CN01JIRuN01izGAjgtdku_!!2207313464483.jpg", "//img.alicdn.com/i4/2207313464483/O1CN017mQtBl1izGAdzUv7c_!!2207313464483.jpg"]
    },
    "sub_title": "",
    "title": "新疆骆驼奶粉蛋白质男女营养粉儿童学生成人冲饮中老年通用早晚餐",
    "user_type": 1,
    "volume": 3656,
    "white_image": "https://img.alicdn.com/bao/uploaded/O1CN01lbIdM81izGArrWvxf_!!2-item_pic.png",
    "zk_final_price": "209.9"
}

class Controller {
    constructor() {
        this._View = null;
    }

    _registerView(view) {
        this._View = view;
    }

    _unregisterView() {
        this._View = null;
    }

    focus() {
        if (this._View) {
            this._View.focus()
        }
    }

    blur() {
        if (this._View) {
            this._View.blur()
        }
    }
}

class Commodity extends React.Component{
    constructor(props){
        console.log('Commodity constructor')
        super(props)
        if (this.props.controller) {
            this.props.controller._registerView(this);
        }
        this.state = {
            focused: false,
            transform: null,
        }
    }

    focus() {
        this.setState({
            focused: true,
            transform: "scale3d(1.4, 1.4, 1)",
        })
    }

    blur() {
        this.setState({
            focused: false,
            transform: null,
        })
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
    render(){
        //  券额可能是0
        console.log('commodity render')

        let couponAmount=data.coupon_amount+""
        let couponWidth=data.coupon_amount==0?0:16+57+14*couponAmount.length
        let volume
        if(data.volume>=10000){
            // console.log('volume:'+)
            volume=parseInt(data.volume/10000)+"万"
        }else{
            volume=data.volume+""
        }
        let volumeWidth=20+70+15*volume.length
        let radius=8
        let draw_item = (
            <div>
                <div debug_name__="frame" style={{
                    width:320,
                    height:506,
                    borderRadius: `${radius}px ${radius}px ${radius}px ${radius}px`,
                    backgroundColor: '#F7F7F4',
                    transform: this.state.transform,
                    transition: "transform 1s"
                }}>
                    <div debug_name__="frame_bottom"
                        style={{
                            width:320,
                            height:320,
                            borderRadius: `${radius}px ${radius}px 0px 0px`,
                            backgroundColor:'#CFCAC6'
                        }}
                    >
                        <div debug_name__="poster_holder" style={{
                            width:160,
                            height:34,
                            left:80,
                            top:143,
                            backgroundImage:`url(${posterHolder})`
                        }}/>
                    </div>
                    <div
                        debug_name__="poster"
                        style={{
                            width:320,
                            height:320,
                            borderRadius: `${radius}px ${radius}px 0px 0px`,
                            backgroundImage:`url(${data.pict_url})`
                        }}
                    />
                    <TextView
                        width={300}
                        height={44}
                        left={20}
                        top={332}
                        text={data.title}
                        isFocus={this.state.focused}
                        fontStyle={{
                            fontSize:`${32}px`,
                            color:'#000000',
                            lineHeight:`${44}px`
                        }}
                    />
                    {/* 券额 */}
                    {couponWidth!=0?(
                        <div
                            debug_name__="panel"
                            style={{
                                width:couponWidth,
                                height:36,
                                left:20,
                                top:384
                            }}>
                            <div debug_name__="round0"
                                style={{width:8,height:36,backgroundImage:`url(${couponLeft})`}}/>
                            <div debug_name__="round1"
                                style={{width:couponWidth-16,height:36,backgroundImage:`url(${couponMid})`,left:8}}/>
                            <div debug_name__="round2"
                                style={{width:8,height:36,backgroundImage:`url(${couponRight})`,left:couponWidth-8}}/>
                            <div debug_name__="roundText"
                                style={{
                                    width:couponWidth,
                                    height:36,
                                    color:'#FFFFFF',
                                    fontSize:`${24}px`,
                                    textAlign:'center',
                                    lineHeight:`${36}px`
                                }}
                            >
                                {couponAmount+"元券"}
                            </div>

                        </div>
                    ):(null)}

                    <div style={{
                        width:volumeWidth,
                        height:36,
                        top:384,
                        left:couponWidth==0?20:40+couponWidth
                    }}>
                        <div style={{width:10,height:36,backgroundImage:`url(${borderLeft})`}}/>
                        <div style={{width:volumeWidth-20,height:36,left:10,backgroundImage:`url(${borderMid})`}}/>
                        <div style={{width:10,height:36,left:volumeWidth-10,backgroundImage:`url(${borderRight})`}}/>
                        <div style={{
                            width:volumeWidth,
                            height:36,
                            color:'#FF7A00',
                            fontSize:`${24}px`,
                            textAlign:'center',
                            lineHeight:`${36}px`
                        }}>
                            {"已售"+volume+"件"}
                        </div>
                    </div>

                    <div
                        style={{
                            width:100,
                            height:36,
                            top:444,
                            left:20,
                            color:'#DE2825',
                            textAlign:'center',
                            fontSize:`${26}px`,
                            lineHeight:`${36}px`
                        }}
                    >
                        {couponWidth==0?'优惠价':'券后'}
                    </div>
                    <div
                        className="commonTop"
                        debug_name__="prize"
                        class_name_2="abc"
                        class_name_3="cde"
                        style={{
                            width:(320-82),
                            height:56,
                            //left:82,
                            //top:430,
                            lineHeight:`${56}px`,
                            fontSize:`${42}px`,
                            color:'#DE2825'
                        }}
                    >
                        {'¥' + this.props.name}
                    </div>
                </div>
            </div>
        );

        return draw_item;
    }

    componentWillUnmount() {
        if (this.props.controller) {
            this.props.controller._unregisterView();
        }
    }
}

class TextView extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        if(this.props.isFocus){
            return(
                <JsvMarquee
                    width={this.props.width}
                    height={this.props.height}
                    left={this.props.left}
                    top={this.props.top}
                    fontStyle={this.props.fontStyle}
                    text={this.props.text}
                />
            )
        }else{
            let style=this.props.fontStyle
            style.width=this.props.width
            style.height=this.props.height
            style.left=this.props.left
            style.top=this.props.top
            style.whiteSpace='nowrap'
            style.textOverflow="ellipsis"
            style.overflow="hidden"
            return(
                <div style={style} debug_name__="title">
                    {this.props.text}
                </div>
            )
            
        }
        
    }
}

export {
    Commodity,
    Controller
} ;