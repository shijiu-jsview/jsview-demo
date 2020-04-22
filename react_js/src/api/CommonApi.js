/**
 * Created by luocf on 2020/4/21.
 */
var TurntableRotate = "";
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
}
export default CommonApi;