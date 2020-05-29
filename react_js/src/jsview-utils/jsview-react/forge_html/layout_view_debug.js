import Forge from "../ForgeDefine"
class LayoutViewDebugClass {

    SetTextureTracer (to_enable) {

    };
    GetTextureTracer () {
        return null;
    }
}
Forge.LayoutViewDebugClass = LayoutViewDebugClass;
window["ForgeDebug"] = Forge.ForgeDebug = new Forge.LayoutViewDebugClass(); // export global variable
