import Forge from "../ForgeDefine"
class RectArea {
	/**
	 * 区域描述信息
	 *
	 * @public
	 * @constructor Forge.RectArea
	 * @param {int} x 坐标X
	 * @param {int} y 坐标Y
	 * @param {int} width 区域的宽
	 * @param {int} height 区域的高
	 **/
	constructor(x, y, width, height) {
		this.x = (typeof x === "number" ? x : 0);
		this.y = (typeof y === "number" ? y : 0);
		if (typeof width !== "number" || width < 0) width = 0;
		this.width = width;
		if (typeof height !== "number" || height < 0) height = 0;
		this.height = height;
	}

	/**
	 * 区域信息的内容对比
	 *
	 * @public
	 * @func Equals
	 * @memberof Forge.RectArea
	 * @instance
	 * @return {boolean} 是否相等
	 **/
	Equals(compare_to) {
		if (compare_to === null) return false;
		return (compare_to.x === this.x && compare_to.y === this.y
		&& compare_to.width === this.width && compare_to.height === this.height);
	};

}
Forge.RectArea = RectArea;

class Coordinate {
	/**
	 * 坐标描述信息
	 *
	 * @public
	 * @constructor Forge.Coordinate
	 * @param {int} x 坐标X
	 * @param {int} y 坐标Y
	 **/
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

}
Forge.Coordinate = Coordinate;

class Size {
	constructor(w, h) {
		this.width = w;
		this.height = h;
	}

}
Forge.Size = Size;

class RectUtils {
	/**
	 * 格式化RectArea<br>
	 *     传入的size object如果已经为RectArea格式的话，直接返回<br>
	 *         如果size object如果为{width:xxx, height:xxx}格式的话，则转换成对应的RectArea再返回
	 *
	 * @public
	 * @func FormatRectArea
	 * @memberof Forge.RectUtils
	 * @instance
	 * @param {Object} size_object
	 **/
	FormatRectArea(size_object) {
		var formatted_target_size = null;
		if (size_object instanceof Forge.RectArea) {
			formatted_target_size = size_object;
		} else if (typeof size_object === "object" && size_object !== null) {
			if (isNaN(size_object.width) || isNaN(size_object.height)) {
				throw Error("ERROR: target_size format should be {width:XXXX, height:XXXX}");
			}
			formatted_target_size = new Forge.RectArea(0, 0, size_object.width, size_object.height);
		}

		return formatted_target_size;
	};

}
Forge.RectUtils = RectUtils;
Forge.sRectUitls = new Forge.RectUtils();