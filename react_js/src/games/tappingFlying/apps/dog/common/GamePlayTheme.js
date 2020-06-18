/**
 * Created by luocf on 2020/5/11.
 */

import continueBtnImage from "../assets/atlas/en.png"
import closeSpriteImage from "../assets/atlas/ending_btn.png"
import wheelSpriteImage from "../assets/images/ending_frame.png"
import charSpriteImage from "../assets/images/ending_char_complete.png"
import charFailedImage from "../assets/images/ending_char_fail.png"
import barSpriteImage from "../assets/images/ending_char_bar.png"
import gesturetiperHandImage from "../assets/images/gesturetiper_hand.png"
import Game from "../../../gameengine/common/Game"
window.GameSource = window.GameSource?window.GameSource:{};
if (!window.GameSource["ending_btn.json"]) {
    let config_json = require("../assets/atlas/ending_btn.json")
    window.GameSource["ending_btn.json"] = Game.convertToSpriteInfo(config_json);
}

if (!window.GameSource["en.json"]) {
    let config_json = require("../assets/atlas/en.json");
    window.GameSource["en.json"] = Game.convertToSpriteInfo(config_json);
}

var GamePlayTheme = {
    play:{
        ProgressBar:{
            width:455,height:45,top:720-80,left:(1280-455)/2
        }
    },
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
                    viewSize:window.GameSource["ending_btn.json"].frames[0].target,
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
            charFailedSprite:{
                style:{
                    left:(1280-622)/2,top:(720-559)/2-65-50,width:622,height:559,
                    backgroundImage:charFailedImage
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
                    left:(1280-window.GameSource["ending_btn.json"].frames[2].target.w)/2,
                    top:(720-window.GameSource["ending_btn.json"].frames[2].target.h)/2+134+40,
                },
                sprite:{
                    //"btn_close.png"
                    spriteInfo:{frames:[window.GameSource["ending_btn.json"].frames[2]],meta:window.GameSource["ending_btn.json"].meta},
                    viewSize:window.GameSource["ending_btn.json"].frames[2].target,
                    imageUrl:closeSpriteImage,
                }
            },
            continueBtn:{
                style:{
                    left:(1280-window.GameSource["en.json"].frames[2].target.w)/2,top:(720-window.GameSource["en.json"].frames[2].target.h)/2+134+40,
                    width:window.GameSource["en.json"].frames[2].target.w,
                    height:window.GameSource["en.json"].frames[2].target.h,
                },
                sprite:{
                    //"btn_continue.png"
                    spriteInfo:{frames:[window.GameSource["en.json"].frames[2]],meta:window.GameSource["en.json"].meta},
                    viewSize:window.GameSource["en.json"].frames[2].target,
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
                left:13+window.GameSource["ending_btn.json"].frames[0].target.w/2,
                top:-27+window.GameSource["ending_btn.json"].frames[0].target.h/3,
            },
            controlBtn: {
                left: (1280 - window.GameSource["ending_btn.json"].frames[2].target.w) / 2 + window.GameSource["ending_btn.json"].frames[2].target.w / 3,
                top: (720 - window.GameSource["ending_btn.json"].frames[2].target.h) / 2 + 134 + 40 + window.GameSource["ending_btn.json"].frames[2].target.h / 3,
            },

        }

    },
}
export default GamePlayTheme;