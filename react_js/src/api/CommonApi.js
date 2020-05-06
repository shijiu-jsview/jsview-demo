/**
 * Created by luocf on 2020/4/21.
 */
var TurntableRotate = "";
var NineSquaredTranslateName = "translate_to";
class CommonApi {
    static getShowMode() {
        if (typeof window.jRuntime != "undefined" && typeof window.jRuntime.getShowMode != "undefined") {
            return window.jRuntime.getShowMode();
        }
        return "0";//0:demo, 1:activity
    }
    static saveTurntableRotate(rotate) {
        TurntableRotate = rotate;
    }
    static getTurntableRotate() {
        return TurntableRotate;
    }

    static saveNineSquaredTranslateName(translate_name) {
        NineSquaredTranslateName = translate_name;
    }
    static getNineSquaredTranslateName() {
        return NineSquaredTranslateName;
    }

    static cubicbezier(x1,y1,x2,y2) {
        return new UnitBezier(x1,y1,x2,y2);
    }
}

function UnitBezier(p1x,p1y,p2x,p2y) {
    this.cx = 3.0 * p1x;
    this.bx = 3.0 * (p2x - p1x) - this.cx;
    this.ax = 1.0 - this.cx -this.bx;
    this.cy = 3.0 * p1y;
    this.by = 3.0 * (p2y - p1y) - this.cy;
    this.ay = 1.0 - this.cy - this.by;
    this.px1 = p1x;
    this.py1 = p1y;
    this.px2 = p2x;
    this.py2 = p2y;
}

UnitBezier.prototype = {
    getCurveX : function(t) { //贝赛尔曲线t时刻的坐标点的X坐标
        return ((this.ax * t + this.bx) * t + this.cx) * t;
    },
    getCurveY : function(t) {  //贝赛尔曲线t时刻的坐标点的y坐标
        return ((this.ay * t + this.by) * t + this.cy) * t
    },
    solve:function(t){
        //console.log("t:"+t+", y:"+(this.getCurveY(this.getCurveX(t))));
        return this.getCurveY(this.getCurveX(t));
    }
}

export default CommonApi;