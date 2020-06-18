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
            frames: [{"source": {"x":0,"y":132,"w":536,"h":40},"target":{"x":0,"y":132,"w":536,"h":40}}],
            "meta": {
                "size": {"w":740,"h":172},
            },
            viewSize:{"w":536,"h":40},
        },
        en: {
            url:en_img,
            frames: [{"source": {"x":0,"y":132,"w":536,"h":40},"target": {"x":0,"y":132,"w":536,"h":40}}],
            "meta": {
                "size": {"w":740,"h":172},
            },
            viewSize:{"w":536,"h":40},
        }
    },
    audio:{
        src:loading_generic_01,
    }
}
export default PreloadTheme;