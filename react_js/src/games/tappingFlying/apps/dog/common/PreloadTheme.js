/**
 * Created by luocf on 2020/5/11.
 */
import bg from "../assets/images/loading_bg.jpg"
import mickey from "../assets/images/loading_mickey.png"
import process_total from "../assets/images/loading_total.png"
import process from "../assets/images/loading_progress.png"
import loading_generic_01 from "../assets/audio/loading_generic_01.mp3"
import en_img from "../assets/atlas/en.png";
import cn_img from "../assets/atlas/cn.png";
console.log("loading_generic_01:"+loading_generic_01);
var PreloadTheme = {
    bg:{
        style:{
            left:0,top:0,width:1280,height:720,
            backgroundImage:bg,
        }
    },
    mickey:{
        style:{
            left:(1280-156)/2,top:(720-140)/2-68,width:156,height:140,
            backgroundImage:mickey,
            animation:"swing-mickey 1s infinite"
        }
    },
    loading:{
        duration:2,
        total:{
            style:{
                left:(1280-714)/2,top:(720-46)/2+90,width:714,height:46,
                backgroundImage:process_total,
            }
        },
        process:{
            mask:{
                left:(1280-714)/2,top:(720-46)/2+90,
                width:100,
                height:46,
                overflow:"hidden",
            },
            style:{
                left:0,top:0,width:714,height:46,
                backgroundImage:process,
            }
        }
    },
    tipsinfo:{
        style:{left:(1280-536)/2, top:500, width:536,height:40},
        cn: {
            url:cn_img,
            frames: [{"frame": {"x":0,"y":132,"w":536,"h":40}}],
            "meta": {
                "app": "http://www.codeandweb.com/texturepacker",
                "version": "1.0",
                "image": "cn.png",
                "format": "RGBA8888",
                "size": {"w":740,"h":172},
                "scale": "1",
                "smartupdate": "$TexturePacker:SmartUpdate:eddd62013ac83f6ace926d619832ca28:bce0e310bdc7e0b8347e67d98e7d8dd6:68f9254be94abd84a5b5b78615a57405$"
            }
        },
        en: {
            url:en_img,
            frames: [{"frame": {"x":0,"y":132,"w":536,"h":40}}],
            "meta": {
                "app": "http://www.codeandweb.com/texturepacker",
                "version": "1.0",
                "image": "en.png",
                "format": "RGBA8888",
                "size": {"w":740,"h":172},
                "scale": "1",
                "smartupdate": "$TexturePacker:SmartUpdate:c67fabf2eedc5eb75043d1914808385f:8db211df560ac6b9394594ac4e3e2669:77ed6edc9cdea428c8c272827c6d3d32$"
            }
        }
    },
    audio:{
        src:loading_generic_01,
    }
}
export default PreloadTheme;