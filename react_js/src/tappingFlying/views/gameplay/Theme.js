/**
 * Created by luocf on 2020/5/11.
 */
import continueBtnImage from "../../assets/atlas/en.png"
import closeSpriteImage from "../../assets/atlas/ending_btn.png"
import wheelSpriteImage from "../../assets/images/ending_frame.png"
import charSpriteImage from "../../assets/images/ending_char_complete.png"
import barSpriteImage from "../../assets/images/ending_char_bar.png"
import gesturetiperHandImage from "../../assets/images/gesturetiper_hand.png"
window.GameSource = window.GameSource?window.GameSource:{};
if (!window.GameSource["ending_btn.json"]) {
    window.GameSource["ending_btn.json"] = require("../../assets/atlas/ending_btn.json")
}

if (!window.GameSource["en.json"]) {
    window.GameSource["en.json"] = require("../../assets/atlas/en.json")
}

var Theme = {
    gameover:{
        bg:{
            style:{
                left:0,top:0,width:1280,height:720,
                backgroundColor:"rgba(0,0,0,0.9)",
            }
        },
        content:{
            style:{
                left:0,top:40,
            },
            closeSprite:{
                style:{
                    left:13,top:-27,
                },
                sprite:{
                    //"btn_close.png"
                    spriteInfo:{frames:[window.GameSource["ending_btn.json"].frames[0]],meta:window.GameSource["ending_btn.json"].meta},
                    viewSize:window.GameSource["ending_btn.json"].frames[0].spriteSourceSize,
                    imageUrl:closeSpriteImage,
                }
            },
            wheelSprite:{
                style:{
                    left:(1280-464)/2,top:(720-446)/2-65,width:464,height:446,
                    backgroundImage:wheelSpriteImage
                }
            },
            charSprite:{
                style:{
                    left:(1280-622)/2,top:(720-559)/2-65-50,width:622,height:559,
                    backgroundImage:charSpriteImage
                }
            },
            barSprite:{
                style:{
                    left:(1280-750)/2,top:(720-176)/2+134,width:750,height:176,
                    backgroundImage:barSpriteImage
                }
            },
            replayBtn:{
                style:{
                    left:(1280-window.GameSource["ending_btn.json"].frames[2].spriteSourceSize.w)/2-200,
                    top:(720-window.GameSource["ending_btn.json"].frames[2].spriteSourceSize.h)/2+134+40,
                },
                sprite:{
                    //"btn_close.png"
                    spriteInfo:{frames:[window.GameSource["ending_btn.json"].frames[2]],meta:window.GameSource["ending_btn.json"].meta},
                    viewSize:window.GameSource["ending_btn.json"].frames[2].spriteSourceSize,
                    imageUrl:closeSpriteImage,
                }
            },
            continueBtn:{
                style:{
                    left:(1280-window.GameSource["en.json"].frames[2].sourceSize.w)/2+60,top:(720-window.GameSource["en.json"].frames[2].sourceSize.h)/2+134+40,
                    width:window.GameSource["en.json"].frames[2].sourceSize.w,
                    height:window.GameSource["en.json"].frames[2].sourceSize.h,
                },
                sprite:{
                    //"btn_continue.png"
                    spriteInfo:{frames:[window.GameSource["en.json"].frames[2]],meta:window.GameSource["en.json"].meta},
                    viewSize:window.GameSource["en.json"].frames[2].spriteSourceSize,
                    imageUrl:continueBtnImage,
                }
            }
        },
        gesturetiperHandImage:{
            style:{
                width:135,height:159,
                backgroundImage:gesturetiperHandImage,
            },
            closeSprite:{
                left:13+window.GameSource["ending_btn.json"].frames[0].spriteSourceSize.w/2,
                top:-27+window.GameSource["ending_btn.json"].frames[0].spriteSourceSize.h/3,
            },
            replayBtn: {
                left: (1280 - window.GameSource["ending_btn.json"].frames[2].spriteSourceSize.w) / 2 - 200 + window.GameSource["ending_btn.json"].frames[2].spriteSourceSize.w / 3,
                top: (720 - window.GameSource["ending_btn.json"].frames[2].spriteSourceSize.h) / 2 + 134 + 40 + window.GameSource["ending_btn.json"].frames[2].spriteSourceSize.h / 3,
            },
            continueBtn:{
                left:(1280-window.GameSource["en.json"].frames[2].sourceSize.w)/2+60+window.GameSource["en.json"].frames[2].spriteSourceSize.w/2,
                top:(720-window.GameSource["en.json"].frames[2].sourceSize.h)/2+134+40+window.GameSource["en.json"].frames[2].spriteSourceSize.h/2,
            }
        }

    },
}
export default Theme;