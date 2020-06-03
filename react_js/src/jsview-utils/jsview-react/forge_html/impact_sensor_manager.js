/**
 * Created by ludl on 4/30/20.
 * Source code copy from chench collisionManager.js
 */

/*
 * @Author: ChenChanghua
 * @Date: 2020-04-26 17:13:03
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2020-06-03 15:25:27
 * @Description: file content
 */
import Forge from "../ForgeDefine"
import gjk from './gjk';

class Mat{
	constructor(row, column, eles) {
		this.element = eles;
		this.row = row;
		this.column = column;
    }
    
    toString() {
        return "[" + this.element[0] + "," + this.element[1] + "," + this.element[2] + "," + this.element[3] + "," + this.element[4] + "," + this.element[5] + "," + this.element[6] + "," + this.element[7] + "," + this.element[8] + "," + this.element[9] + "," + this.element[10] + "," + this.element[11] + "," + this.element[12] + "," + this.element[13] + "," + this.element[14] + "," + this.element[15] + "]"
    }

	static multiply(m_1, m_2) {
		if (m_1.column !== m_2.row) {
			throw("matrix multiply error");
		}

		let result = [];
		for (let i = 0; i < m_1.row; i++) {
			for (let j = 0; j < m_2.column; j++) {
				result[i + j * m_2.column] = 0;
				for(let k = 0; k < m_1.column; k++) {
					result[i + j * m_2.column] += (m_1.element[i + k * m_1.column] * m_2.element[k + j * m_2.column]);
				}
			}
		}
		return new Mat(m_1.row, m_2.column, result);
	}

	static identity() {
		return new Mat(4, 4, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	}

	static translate(x, y, z) {
		return new Mat(4, 4, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
	}

	static scale(x, y, z) {
		return new Mat(4, 4, [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]);
	}

	static rotate(x, y, z, angle) {
		let c = Math.cos(angle / 180 * Math.PI);
		let s = Math.sin(angle / 180 * Math.PI);
		let len = Math.sqrt(x * x + y * y + z * z);
		if (len != 1) {
			let rlen = 1 / len;
			x *= rlen;
			y *= rlen;
			z *= rlen;
		}
		let nc = 1 - c;
		let xy = x * y;
		let yz = y * z;
		let zx = z * x;
		let xs = x * s;
		let ys = y * s;
		let zs = z * s;
		let e = [];
		e[0] = x * x * nc + c;
		e[1] = xy * nc + zs;
		e[2] = zx * nc - ys;
		e[3] = 0;

		e[4] = xy * nc - zs;
		e[5] = y * y * nc + c;
		e[6] = yz * nc + xs;
		e[7] = 0;

		e[8] = zx * nc + ys;
		e[9] = yz * nc - xs;
		e[10] = z * z * nc + c;
		e[11] = 0;

		e[12] = 0;
		e[13] = 0;
		e[14] = 0;
		e[15] = 1.0;

		return new Mat(4, 4, e);
	}

	static skew(x_angle, y_angle) {
		let a = new Array(16).fill(0);
		let y_rad = 2 * Math.PI * (y_angle / 360);
		let x_rad = -2 * Math.PI * (x_angle / 360);
		a[0] = 1 - x_rad * y_rad;
		a[1] = -Math.tan(y_rad);
		a[4] = Math.tan(x_rad);
		a[5] = 1;
		a[10] = 1;
		a[15] = 1;
		return new Mat(4, 4, a)
	}

	static transform2d(a, b, c, d, e, f) {
		return new Mat(4, 4, [a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, e, f, 0, 1]);
	}
}

let is_char = char_code => (65 <= char_code && char_code <= 90) || (97 <= char_code && char_code <= 122);
let is_num = char_code => 48 <= char_code && char_code <= 57;
let func_to_mat = (name, params) => {
	switch(name) {
		case "translate3d":
			return Mat.translate(params[0], params[1], params[2]);
		case "scale3d":
			return Mat.scale(params[0], params[1], params[2]);
		case "rotate3d":
			return Mat.rotate(params[0], params[1], params[2], params[3]);
		case "skew":
			return Mat.skew(params[0], params[1]);
		case "matrix":
			return Mat.transform2d(params[0], params[1], params[2], params[3], params[4], params[5]);
		case "matrix3d":
			return new Mat(4, 4, params);
		default:
			throw("no support type " + name);
	}
}

let parseToMat4 = (transform) => {
	let result = Mat.identity();
	if (!transform) { return result; }
	let func_name = "";
	let param = "";
	let param_list = [];
	let mode = 0; // 0 parse name; 1 parse params;
	for (let i = 0; i < transform.length; i++) {
		let char_code = transform.charCodeAt(i);
		if (mode == 0) {
			if (is_char(char_code) || is_num(char_code)) {
				func_name += transform[i]
			}
		} else {
			if (is_num(char_code) || char_code == 46 || char_code == 45 || char_code == 101) { //科学计数
				param += transform[i];
			}
		}

		if (char_code == 40) { // (
			mode = 1;
			param = "";
			param_list = [];
		} else if (char_code == 41) { // )
			param_list.push(parseFloat(param));
			result = Mat.multiply(result, func_to_mat(func_name, param_list));
			func_name = "";
			mode = 0;
		} else if (char_code == 44) { // ,
			param_list.push(parseFloat(param));
			param = "";
		}
	}
	return result;
}

let parseTransformOrigin = t_o => {
	let result = []
	if (!t_o) return result;
	let param = "";
	for (let i = 0; i < t_o.length; i++) {
		let char_code = t_o.charCodeAt(i);
		if (is_num(char_code) || char_code == 46 || char_code == 45) {
			param += t_o[i];
		}

		if (char_code == 32 || i == t_o.length - 1) {
			result.push(parseFloat(param));
			param = "";
		}
	}
	return result;
}

let getPolygonPoint = ele => {
	let style = getComputedStyle(ele);
    let transform_str = style.transform ? style.transform : style.webkitTransform;
    let origin_str = style.transformOrigin ? style.transformOrigin : style.webkitTransformOrigin;
    let origin = parseTransformOrigin(origin_str);
	let transform_mat4 = parseToMat4(transform_str);
	// TODO: 使用parent_bounding，临时解决对比div不在同一个父节点时出现的计算偏差问题
    let parent_bounding = ele.parentElement?ele.parentElement.getBoundingClientRect():{left:0,top:0};
    // console.log("parent_bounding " + parent_bounding.left + " " + parent_bounding.top);
    // console.log("origin " + origin[0] + " " + origin[1]);
    // console.log("style " + style.left + " " + style.top + " " + style.width + " " + style.height)
	let x = parseFloat(style.left.substr(0, style.left.length - 2)) + parent_bounding.left;
	let y = parseFloat(style.top.substr(0, style.top.length - 2)) + parent_bounding.top;
	let width = parseFloat(style.width.substr(0, style.width.length - 2));
    let height = parseFloat(style.height.substr(0, style.height.length - 2));
    // console.log("p " + x + " " + y + " " + width + " " + height)
	let points = [
		x, y, 0, 1,
		x + width, y, 0, 1,
		x, y + height, 0, 1,
		x + width, y + height, 0, 1
	]

	let translate_mat1 = Mat.translate(-x - origin[0], -y - origin[1], 0);
	let translate_mat2 = Mat.translate(x + origin[0], y + origin[1], 0);
	let m = Mat.multiply(translate_mat2, Mat.multiply(transform_mat4, translate_mat1));
	let cur_points = Mat.multiply(m, new Mat(4, 4, points));
	let result = [
		cur_points.element[0], cur_points.element[1],
		cur_points.element[4], cur_points.element[5],
		cur_points.element[8], cur_points.element[9],
		cur_points.element[12], cur_points.element[13]
	];
	// console.log("mat4 " + transform_str + " " + transform_mat4.toString())
	// console.log("getPolygonPoint " + result[0] + "," + result[1] + "," +  result[2] + "," +  result[3] + "," +  result[4] + "," +  result[5] + "," +  result[6] + "," +  result[7])
	return result
}

class ImpactSensor{
	constructor(id, element1, element2, callback) {
		this._Id = id;
		this._Element1 = element1;
		this._Element2 = element2;
		this._Callback = callback;
		this._Contacted = false;
		this._Recycled = false;
	}

	Recycle() {
		this._Recycled = true;
		this._Callback = null;
		this._Element1 = null;
		this._Element2 = null;
	}

	TestCollision() {
        if (this._Recycled) { return; }
		var intersected = gjk.intersect(getPolygonPoint(this._Element1), getPolygonPoint(this._Element2));
		if (intersected) {
			if (!this._Contacted) {
				this._Contacted = true;
				if (this._Callback && this._Callback.OnBeginContact) {
					this._Callback.OnBeginContact();
				}
			}
		} else {
			if (this._Contacted) {
				if (this._Callback && this._Callback.OnEndContact) {
					this._Callback.OnEndContact();
				}
				this._Contacted = false;
			}
		}
	}
}

let id = 0;
class ImpactSensorManager {
	constructor() {
		this._SensorMap = {};
		this._SensorCount = 0;
	}

	TestCollision() {
		for (let i in this._SensorMap) {
			if (this._SensorMap[i]._Recycled) {
				delete this._SensorMap[i];
				this._SensorCount--;
			} else {
				this._SensorMap[i].TestCollision();
			}
		}
	}

	HasTrace() {
		return this._SensorCount != 0;
	}

	StartTrace(layout_view1, layout_view2, callback) {
		let sensor = new ImpactSensor(id++, layout_view1.Element, layout_view2.Element, callback);
		this._SensorMap[id] = sensor;
		this._SensorCount++;

		Forge.sRenderBridge.BeginHtmlFrameLoop();

		return sensor;
	}
}

Forge.sImpactSensorManager = new ImpactSensorManager();
Forge.sImpactSensorManager.Callback = class {
	constructor(on_begin_contact, on_end_contact) {
		this.OnBeginContact = on_begin_contact;
		this.OnEndContact = on_end_contact;
	}
}

