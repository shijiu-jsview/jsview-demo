import Forge from "../ForgeDefine";

class DeprecatedRenderer {
  constructor() {
    Forge.sDeprecatedRenderer = this;
    // Create shared texture manager
    this._SharedTextureManager = this.CreateTextureManager();
  }

  SetUserId(user_id) {
    Forge.sRenderBridge.UpdateUserId(user_id);
  }

  GetScreenInfo() {
    return Forge.sRenderBridge.GetScreenInfo();
  }

  StringWithFont() {
    return Forge.sTextUtils.StringWithFont.apply(this, arguments);
  }

  GetTextWidth() {
    return Forge.sTextUtils.GetTextWidth.apply(this, arguments);
  }

  GetTextUtils() {
    return Forge.sTextUtils;
  }

  RectArea(x, y, w, h) {
    return new Forge.RectArea(x, y, w, h);
  }

  TextAttr() {
    return Forge.sTextUtils.TextAttr.apply(this, arguments);
  }

  GarbageCollect() {
    Forge.LogM("GarbageCollect called");
  }

  TriggerFrameDraw() {
    Forge.sRenderBridge.RequestSwap();
  }

  /**
     * 全局共享的TextureManager
     *
     * @public
     * @func GetSharedTextureManager
     * @memberof Forge.DeprecatedRenderer
     * @instance
     * @return {Forge.TextureManager} texture管理对象
     * */
  GetSharedTextureManager() {
    return this._SharedTextureManager;
  }

  /**
     * 创建一个TextureManager<br>
     *     请注意：使用Activity时，TextureManager已经在Activity内部进行构建，请不要额外构建
     *
     * @public
     * @func CreateTextureManager
     * @memberof Forge.DeprecatedRenderer
     * @instance
     * @return {Forge.TextureManager} texture管理对象
     * */
  CreateTextureManager() {
    const texture_manager = new Forge.TextureManager();
    return texture_manager;
  }
}
Forge.DeprecatedRenderer = DeprecatedRenderer;
Forge.sDeprecatedRenderer = null;
