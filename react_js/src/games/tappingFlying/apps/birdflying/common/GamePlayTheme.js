/**
 * Created by luocf on 2020/5/11.
 */
import replayBtnImage from "../assets/images/success_btn_replay.png"
import continueBtnImage from "../assets/images/btn_check.png"
import closeSpriteImage from "../assets/images/system_btn_exit.png"
import charFailedSpriteImage from "../assets/images/ending_char_fail.png"
import charSpriteImage from "../assets/images/ending_char_complete.png"
import gesturetiperHandImage from "../assets/images/gesturetiper_hand.png"
import endingCheckCompleteImage from "../assets/images/ending_check_complete.png"
var GamePlayTheme = {
    play:{
        ProgressBar:{
            width:200,height:28,top:720-80,left:(1280-200)/2
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
                    left:13,top:-27, width:80,height:80,
                    backgroundImage:closeSpriteImage
                },
            },
            barSprite:null,
            starSprite:{
                style:{
                    left:(1280-100)/2,top:(720-100)/2+70,width:100,height:100,
                    backgroundImage:endingCheckCompleteImage
                }
            },
            wheelSprite:null,
            charFailedSprite:{
                style:{
                    left:(1280-720)/2,top:(720-582)/2-65-50,width:720,height:582,
                    backgroundImage:charFailedSpriteImage
                }
            },
            charSprite:{
                style:{
                    left:(1280-720)/2,top:(720-582)/2-65-50,width:720,height:582,
                    backgroundImage:charSpriteImage
                }
            },
            replayBtn:{
                style:{
                    left:(1280-128)/2,
                    top:(720-128)/2+134+80,
                    width:128,height:128,
                    backgroundImage:replayBtnImage,
                },
            },
            continueBtn:{
                style:{
                    left:(1280-128)/2,
                    top:(720-128)/2+134+80,
                    width:128, height:128,
                    backgroundImage:continueBtnImage,
                },
            }
        },
        gesturetiperHandImage:{
            style:{
                width:135,height:159,
                backgroundImage:gesturetiperHandImage,
            },
            closeSprite:{
                left:13+80/2 - 30,
                top:-27+80/3 ,
            },
            controlBtn:{
                left:(1280-128)/2+50,
                top:(720-128)/2+134+40+128/2+20,
            }
        }

    },
}
export default GamePlayTheme;