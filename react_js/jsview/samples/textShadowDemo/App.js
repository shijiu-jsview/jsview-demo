
import React from "react";
import { SimpleWidget, VERTICAL } from "../../utils/JsViewEngineWidget/index_widget";
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import JsvTextBox from "../../utils/JsViewReactWidget/JsvTextBox";
import {JsvTextStyleClass} from "../../utils/JsViewReactTools/JsvStyleClass";

const font_style = new JsvTextStyleClass({
	fontSize: 35,
	textAlign: "center",
	lineHeight: "40px",
});

class MainScene extends FocusBlock {
	constructor(props) {
		super(props);

		this._EmptyData = [{
			id: 0,
			title: "偏移x,y为0(文字发光)",
			textShadow: "0 0 3 #00FF00",
		},{
			id: 1,
			title: "blur为0(不显示阴影)",
			textShadow: "2 2 0 #00FF00",
		},{
			id: 2,
			title: "rgba格式颜色(半透明红)",
			textShadow: "4 4 3 rgba(255,0,0,0.5)",
		},{
			id: 3,
			title: "#格式颜色(蓝色)",
			textShadow: "4 4 0.5 #0000EF",
		}];
	}

	onKeyDown(ev) {
		if (ev.keyCode === 10000 || ev.keyCode === 27) {
			if (this._NavigateHome) {
				this._NavigateHome();
			}
		}
		return true;
	}

	_measures = (item)=>{
		return SimpleWidget.getMeasureObj(320, 120, true, false);
	};

	_renderItem = (item, on_edge, query, view_obj)=>{
		return (
			<>
				<div
					style={{
						width: 320,
						height: 50,
						fontSize: 25,
						textAlign: "center",
						lineHeight: "50px",
						backgroundColor: item.id % 2 == 0 ? "#00ff00" : "#0000ff",
					}}
				>
					{item.title}
				</div>
				<JsvTextBox
					verticalAlign="middle"
					styleToken={"Fixed"}
					stylesList={[
						{ top:50, width:320, height:70,
							textShadow:item.textShadow,
							backgroundColor: (item.id % 2 == 0 ? "#ffffee" : "#ffff10"),},
						font_style]}
				>
					文字阴影
				</JsvTextBox>
			</>
		)
	};

	// renderContent函数是FocusBlock子类的描画函数，作用同 React.Component的render函数
	// 返回主渲染内容
	renderContent() {
		return (
			<SimpleWidget
				width={1280}
				height={720}
				padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
				direction={VERTICAL}
				data={this._EmptyData}
				renderItem={this._renderItem}
				measures={this._measures}
				branchName={`${this.props.branchName}/widget1`}
			/>
		);
	}
}

// 创建APP，带有视图焦点控制，启动后，焦点交由本界面
const App = createStandaloneApp(MainScene);

export {
	App, // 独立运行时的入口
	MainScene as SubApp, // 作为导航页的子入口时
};