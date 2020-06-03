// JsvDynamicKeyFrames

/*
 * 【模块介绍】
 * KeyFrameStyleSheet：KeyFrames CSS rule的操作类，用于添加和删除KeyFrame
 *      接口：
 *          insertRule {String} 将传入的KeyFrames对象("@Keyframe name {}"形式)插入到CSS列表中，
 *                              请保证不要和其他KeyFrame重名
 *          removeRule {String} 从CSS列表中删除指定名字的keyFrame
 *          removeMultiRules {String[]} 从CSS列表中删除复数个keyFrame
 * getKeyFramesGroup: 获取KeyFrameStyleSheet的函数，可接受一个参数anchor_tag，用来定位CSS rule的群组
 */

class KeyFrameStyleSheet {
	constructor(style_sheet_ref) {
		this._SS = style_sheet_ref;
	}

	insertRule(key_frame_string) {
		let index = this._SS.cssRules.length;
		this._SS.insertRule(key_frame_string, index);
	}

	removeRule(name) {
		removeMultiRules([name]);
	}

	removeMultiRules(names_array) {
		let style_sheet_ref = this._SS;
		let css_rules_ref = this._SS.cssRules;
		// 对CssRules进行删除操作，倒序轮询
		for (let i = css_rules_ref.length - 1; i >= 0; i--) {
			for (let j in names_array) {
				if (css_rules_ref[i].name == names_array[j]) {
					names_array.splice(j, 1);
					style_sheet_ref.deleteRule(i);
					break;
				}
			}
		}
	}
}

function getKeyFramesGroup(anchor_tag) {
	var style_sheets_ref = null;

	// 获取所有的style
	var ss = document.styleSheets;
	if (!ss || ss.length == 0) {
		console.error("Error: styleSheet empty");
		return null;
	}

	if (!!anchor_tag) {
		for (var i = 0; i < ss.length; ++i) {
			const item = ss[i];
			if (item.cssRules[0] && item.cssRules[0].name && item.cssRules[0].name === anchor_tag) {
				style_sheets_ref = item;
				break;
			}
		}
		if (style_sheets_ref == null) {
			console.error("Error: no found tag=" + anchor_tag);
			return null;
		}
	} else {
		style_sheets_ref = ss[0];
	}

	return  new KeyFrameStyleSheet(style_sheets_ref);
}

export {
	getKeyFramesGroup,
}