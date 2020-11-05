import React from 'react';
import { SimpleWidget, VERTICAL } from "../jsview-utils/jsview-react/index_widget.js"
import Commodity from "./Commodity"
import { FocusBlock } from "../demoCommon/BlockDefine"
import createStandaloneApp from "../demoCommon/StandaloneApp"

class MainScene extends FocusBlock {
	constructor(props) {
		super(props);

		this._data = [];

		// 添加300个模拟数据
		for (var i = 0; i < 183; i++) {
			this._data.push({
				name: "商品：骆驼奶粉蛋白质粉，限时抢购，立刻发货，序号:" + i,
				prize: "" + (Math.floor(Math.random() * 200) + 200), /* 测试数据要保证比最高优惠券(300左右)要高 */
				savePrize: "" + (i),
				soldTotal: "" + (Math.floor(Math.random() * 50000)),
				pictUrl: "http://img.alicdn.com/bao/uploaded/i3/2207313464483/O1CN01Ab4vWz1izGAyRL1Yf_!!0-item_pic.jpg",
			});
		}
	}

	_Measures = (item)=>{
		return SimpleWidget.getMeasureObj(227, 351, true, false)
	};

	_OnItemFocus = (data_item)=>{
		if (data_item._Commodity) {
			data_item._Commodity.becomeFocus();
		}
	};

	_OnItemBlur = (data_item)=>{
		if (data_item._Commodity) {
			data_item._Commodity.becomeBlur();
		}
	};

	_RenderItem = (data_item)=>{
		return (
			<Commodity scale={1.0} isFocus={false} data={data_item} ref={(ref)=>{ data_item._Commodity = ref;}} />
		);
	};

	onKeyDown(ev) {
		if (ev.keyCode === 10000 || ev.keyCode === 27) {
			if (this._NavigateHome) {
				this._NavigateHome();
			}
		}
		return true;
	}

	onFocus() {
		console.log("On App focused");
		this.changeFocus(this.props.branchName + "/widget1")
	}

	renderContent() {
		return (
			<div style={{width: 1280, height: 720, backgroundColor: "#00000F"}}>
				<div style={{
					textAlign: "center",
					fontSize: "30px",
					lineHeight: "50px",
					color: "#ffffff",
					left: 100,
					top: 20,
					width: (1280-200),
					height: 50,
					backgroundColor: "rgba(27,38,151,0.8)"
				}}>{`使用ClassName写法可提升渲染性能`}</div>
				<div style={{top: 100, left: 70}}>
					<SimpleWidget
						width={1253}
						height={700}
						padding={{left: 26, top: 36, right: 26, bottom: 36}}
						direction={VERTICAL}
						data={this._data}
						renderItem={this._RenderItem}
						measures={this._Measures}
						branchName={this.props.branchName + "/widget1"}
						onItemFocus={this._OnItemFocus}
						onItemBlur={this._OnItemBlur}
					/>
				</div>
			</div>
		)
	}
}

let App = createStandaloneApp(MainScene);

export {
	App, // 独立运行时的入口
	MainScene as SubApp, // 作为导航页的子入口时
};

