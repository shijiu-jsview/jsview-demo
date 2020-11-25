/**
 * Created by ludl on 4/30/20.
 * Source code copy from chench collisionManager.js
 */

/*
 * @Author: ChenChanghua
 * @Date: 2020-04-26 17:13:03
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2020-06-17 15:18:28
 * @Description: file content
 */
import Forge from "../ForgeDefine";
import gjk from './gjk';

class Mat {
  constructor(row, column, eles) {
    this.element = eles;
    this.row = row;
    this.column = column;
  }

  toString() {
    return `[${this.element[0]},${this.element[1]},${this.element[2]},${this.element[3]},${this.element[4]},${this.element[5]},${this.element[6]},${this.element[7]},${this.element[8]},${this.element[9]},${this.element[10]},${this.element[11]},${this.element[12]},${this.element[13]},${this.element[14]},${this.element[15]}]`;
  }

  multiply(m_2) {
    if (this.column !== m_2.row) {
      throw new Error("matrix multiply error");
    }

    const result = [];
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < m_2.column; j++) {
        result[i + j * m_2.column] = 0;
        for (let k = 0; k < this.column; k++) {
          result[i + j * m_2.column] += (this.element[i + k * this.column] * m_2.element[k + j * m_2.column]);
        }
      }
    }
    return new Mat(this.row, m_2.column, result);
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
    const c = Math.cos(angle / 180 * Math.PI);
    const s = Math.sin(angle / 180 * Math.PI);
    const len = Math.sqrt(x * x + y * y + z * z);
    if (len !== 1) {
      const rlen = 1 / len;
      x *= rlen;
      y *= rlen;
      z *= rlen;
    }
    const nc = 1 - c;
    const xy = x * y;
    const yz = y * z;
    const zx = z * x;
    const xs = x * s;
    const ys = y * s;
    const zs = z * s;
    const e = [];
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
    const a = new Array(16).fill(0);
    const y_rad = 2 * Math.PI * (y_angle / 360);
    const x_rad = -2 * Math.PI * (x_angle / 360);
    a[0] = 1 - x_rad * y_rad;
    a[1] = -Math.tan(y_rad);
    a[4] = Math.tan(x_rad);
    a[5] = 1;
    a[10] = 1;
    a[15] = 1;
    return new Mat(4, 4, a);
  }

  static transform2d(a, b, c, d, e, f) {
    return new Mat(4, 4, [a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, e, f, 0, 1]);
  }
}

const is_char = char_code => (char_code >= 65 && char_code <= 90) || (char_code >= 97 && char_code <= 122);
const is_num = char_code => char_code >= 48 && char_code <= 57;
const func_to_mat = (name, params) => {
  switch (name) {
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
      throw new Error(`no support type ${name}`);
  }
};

const parseToMat4 = (transform) => {
  let result = Mat.identity();
  if (!transform) {
    return result;
  }
  let func_name = "";
  let param = "";
  let param_list = [];
  let mode = 0; // 0 parse name; 1 parse params;
  for (let i = 0; i < transform.length; i++) {
    const char_code = transform.charCodeAt(i);
    if (mode === 0) {
      if (is_char(char_code) || is_num(char_code)) {
        func_name += transform[i];
      }
    } else {
      if (is_num(char_code) || char_code === 46 || char_code === 45 || char_code === 101) { // 科学计数
        param += transform[i];
      }
    }

    if (char_code === 40) { // (
      mode = 1;
      param = "";
      param_list = [];
    } else if (char_code === 41) { // )
      param_list.push(parseFloat(param));
      result = result.multiply(func_to_mat(func_name, param_list));
      func_name = "";
      mode = 0;
    } else if (char_code === 44) { // ,
      param_list.push(parseFloat(param));
      param = "";
    }
  }
  return result;
};

const pxToNum = px => {
  if (px.indexOf(" ") >= 0) {
    const list = px.split(" ");
    return list.map(str => parseInt(str.substr(0, str.length - 2), 10));
  }
  return parseInt(px.substr(0, px.length - 2), 10);
};

const getTransform = (ele) => {
  let cur_element = ele;
  const ele_width = pxToNum(cur_element.style.width);
  const ele_height = pxToNum(cur_element.style.height);
  let total_transform = Mat.identity();
  while (cur_element.parentElement) {
    const style = getComputedStyle(cur_element);
    const transform_str = style.transform ? style.transform : style.webkitTransform;
    if (transform_str) {
      const origin_str = style.transformOrigin ? style.transformOrigin : style.webkitTransformOrigin;
      const transform = parseToMat4(transform_str);
      if (origin_str) {
        const list = pxToNum(origin_str);
        const translate1 = Mat.translate(-list[0], -list[1], 0);
        const translate2 = Mat.translate(list[0], list[1], 0);
        const translate3 = Mat.translate(cur_element.offsetLeft, cur_element.offsetTop, 0);
        total_transform = translate3.multiply(translate2.multiply(transform.multiply(translate1.multiply(total_transform))));
      } else {
        total_transform = transform.multiply(total_transform);
      }
    }
    cur_element = cur_element.parentElement;
  }
  const size_matrix = new Mat(4, 4, [
    0, 0, 0, 1,
    ele_width, 0, 0, 1,
    0, ele_height, 0, 1,
    ele_width, ele_height, 0, 1
  ]);
  total_transform = total_transform.multiply(size_matrix);

  const points = total_transform.element;
  const result = [points[0], points[1], points[4], points[5], points[8], points[9], points[12], points[13]];
  return result;
};


class ElementImpactSensor {
  constructor(element1, element2, callback) {
    this._Id = id++;
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
    // need override
  }
}

class DragImpactSensor extends ElementImpactSensor {
  TestCollision() {
    if (this._Recycled) {
      return;
    }
    const ele_transform = getTransform(this._Element2);
    const intersected = gjk.intersect(this._Element1.slice(0, 1), ele_transform);
    const intersected1 = gjk.intersect(this._Element1.slice(1, 2), ele_transform);
    const intersected2 = gjk.intersect(this._Element1.slice(2, 3), ele_transform);
    const intersected3 = gjk.intersect(this._Element1.slice(3, 4), ele_transform);
    // console.log("intersected && intersected1 && intersected2 && intersected3:"+intersected+" , "+intersected1+" , "+intersected2 +" , "+intersected3, this._Element1, ele_transform);
    if (!(intersected && intersected1 && intersected2 && intersected3)) {
      if (!this._Contacted) {
        this._Contacted = true;
        if (this._Callback && this._Callback.OnBeginContact) {
          this._Callback.OnBeginContact({ x: ele_transform[0], y: ele_transform[1] });
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
class ImpactSensor extends ElementImpactSensor {
  TestCollision() {
    if (this._Recycled) {
      return;
    }
    const intersected = gjk.intersect(getTransform(this._Element1), getTransform(this._Element2));
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
class ElementImpactSensorManager {
  constructor() {
    this._SensorMap = {};
    this._SensorCount = 0;
  }

  TestCollision() {
    for (const i in this._SensorMap) {
      if (this._SensorMap[i]._Recycled) {
        delete this._SensorMap[i];
        this._SensorCount--;
      } else {
        this._SensorMap[i].TestCollision();
      }
    }
  }

  HasTrace() {
    return this._SensorCount !== 0;
  }

  AddImpactSensor(sensor) {
    this._SensorMap[id] = sensor;
    this._SensorCount++;

    Forge.sRenderBridge.BeginHtmlFrameLoop();

    return sensor;
  }
}

class ImpactSensorManager {
  StartTrace(layout_view1, layout_view2, callback) {
    const sensor = new ImpactSensor(layout_view1.Element, layout_view2.Element, callback);
    Forge.sElementImpactSensorManager.AddImpactSensor(sensor);
    return sensor;
  }
}
Forge.DragImpactSensor = DragImpactSensor;
Forge.ElementImpactSensor = ElementImpactSensor;
Forge.sElementImpactSensorManager = new ElementImpactSensorManager();
Forge.sImpactSensorManager = new ImpactSensorManager();
Forge.sImpactSensorManager.Callback = class {
  constructor(on_begin_contact, on_end_contact) {
    this.OnBeginContact = on_begin_contact;
    this.OnEndContact = on_end_contact;
  }
};

// 在PC端不存在异步回调的问题，所以并不需要AutoFroze功能
// 再次为了PC端调试不报错，完成所有接口的声明的说明
Forge.sImpactSensorManager.AutoFroze = class {
  constructor(froze_pre_impact_views, // 碰撞后，想要执行动画停止的view的列表，
    froze_on_impact_views // 物体分离后，想要执行动画停止的view的列表
  ) {
    this._PreImpactViews = froze_pre_impact_views;
    this._OnImpactViews = froze_on_impact_views;
  }

  // 列表可更新
  UpdatePreImpactList(froze_pre_impact_views) {
    this._PreImpactViews = froze_pre_impact_views;
  }

  // 列表可更新
  UpdateOnImpactList(froze_on_impact_views) {
    this._OnImpactViews = froze_on_impact_views;
  }
};
