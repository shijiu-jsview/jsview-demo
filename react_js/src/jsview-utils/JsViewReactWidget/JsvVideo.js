/**
 * Created by chunfeng.luo@qcast.cn on 10/13/20.
 */

/*
 * JsvVideo：React高阶组件，二维码显示，
 *      props说明:
 *			usetexture {bool}			是否使用texture即离屏模式，true:使用离屏模式，false:使用普通video
 *			videoref {object} (必须)		video 句柄，对video进行播控
 *		特别说明:
 *			其他属性同video标签
 */
import React from 'react';

class JsvVideo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { usetexture, videoref, ...others } = this.props;
        usetexture = usetexture ? usetexture.toString() : "false";
        //确保jsv_media_usetexture属性先被设置，故前后各写一个该属性，防止react属性顺序变更
        return <video ref={videoref} jsv_media_usetexture={usetexture} {...others} jsv_media_usetexture={usetexture}/>
    }
}
export default JsvVideo