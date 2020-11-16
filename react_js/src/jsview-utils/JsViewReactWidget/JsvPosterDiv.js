/**
 * Created by donglin.lu@qcast.cn on 10/12/20.
 */

/*
 * 【模块 export 内容】
 * JsvPosterDiv：用于海报图展示的控件，为海报添加了三个效果:
 *              1. 海报(JsvPosterDiv的backgroundImage)加载出来前，显示place holder的内容(JsvPosterDiv的子节点)
 *              2. 海报完毕进行显示的时候，有淡出效果
 *              3. 在JsView引擎中，海报加载完毕后，place holder内容自动隐藏以节省描画资源(PC环境不会自动隐藏)
 *      props说明:
 *          style       {Object}    同div的Style，通过top/left/width/height控制坐标和宽高
 *                                  通过backgroundImage来设置海报的url
 */

import React from 'react';

class JsvPosterDiv extends React.Component{
	constructor(props) {
		super(props);
	}

	render() {
		let {children, ...other_props} = this.props; // Remove holders from children

		return(
			<div>
				<div children={children}/>
				<div jsv_enable_fade="true" jsv_poster_on_top="true"
				     {...other_props} />
			</div>
		);
	}
}

export {
	JsvPosterDiv
}