import Forge from "../ForgeDefine";

class RenderTextureDelegateManager {
  constructor() {
    this._IdTokenGenerator = 66;
    Forge.sRenderTextureDelegateManager = this;
    this._CheckExpiredTime = 0;
  }

  CreateTextureStatus() {
    const texture = new Forge.RenderTextureDelegate(this, 0);
    texture.DoRef();
    return texture;
  }

  CreateTexture() {
    const texture = new Forge.RenderTextureDelegate(this, this._IdTokenGenerator++);
    texture.DoRef();
    return texture;
  }

  RecycleTexture(texture) {
  }

  CreateResourceInfo(tm_id, func_name) {
    const resource_info = {
      Id: 0,
      Nam: func_name,
      Set: null, // 内容由各自Resource创建方式自定义填充
      TmId: tm_id, // TextureManager ID，
      NdLd: 0, // need loaded 0:false, 1:true
    };

    return resource_info;
  }

  AppendFontStatusIfNeed(settings, string_with_font) {
    const settings_font_status = {};
    settings_font_status.Fo = string_with_font.font;
    settings_font_status.Si = string_with_font.size;
    settings_font_status.It = string_with_font.italic;
    settings_font_status.Bo = string_with_font.bold;
    settings_font_status.Al = string_with_font.alignment;
    settings_font_status.Ve = string_with_font.vertical_align;
    settings_font_status.Vaa = string_with_font.vertical_area_align;
    settings_font_status.Tx = string_with_font.textColour;
    settings_font_status.Ba = string_with_font.backgroundColour;
    settings_font_status.En = string_with_font.enableBlend;
    settings_font_status.Sh = string_with_font.shadow;
    if (string_with_font.stroke_width) {
      settings_font_status.Stk = string_with_font.stroke_width;
    } else {
      settings_font_status.Stk = -1;
    }
    settings.FO = JSON.stringify(settings_font_status);
  }
}
Forge.RenderTextureDelegateManager = RenderTextureDelegateManager;
Forge.sRenderTextureDelegateManager = new Forge.RenderTextureDelegateManager();

class RenderTextureDelegate {
  constructor(manager, assigned_id_token) {
    this.IdToken = assigned_id_token;
    this._Manager = manager;
    this._Reference = 0;
    this._SyncingResourceInfo = null;

    this._OnloadCallbacks = {};
    this._OnloadCallbacksSize = 0;
    this._OnloadCallbackIdGenerator = 1;

    // 以下属性只针对有网络请求的Texture有效（例如通过URL获取图片资源的情况）
    this.Unloaded = true;
    this.LoadTime = 0;
    this.RequireTime = 0;
    this.ForceExpire = false;
    this.NeedCheckExpired = false;

    const enable_trace = Forge.ForgeDebug.GetTextureTracer();
    if (enable_trace) {
      const error_for_stack = new Error();
      this.Stack = error_for_stack.stack;
    }
  }

  DoRef() {
    this._Reference++;
  }

  UndoRef() {
    this._Reference--;
    if (this._Reference === 0) {
      // Recycle callbacks
      if (this._OnloadCallbacksSize > 0) {
        this._OnloadCallbacks = {};
      }
      this._Manager.RecycleTexture(this);
    }
  }

  SetResourceInfo(resource_info) {
    resource_info.Id = this.IdToken;
    this._SyncingResourceInfo = resource_info;
  }

  GetResourceInfo() {
    return this._SyncingResourceInfo;
  }

  ReadSyncInfo() {
    const info = this._SyncingResourceInfo;
    this._SyncingResourceInfo = null;
    return info;
  }

  RegisterOnloadCallback(callback) {
    const id_token = this._OnloadCallbackIdGenerator++;
    this._OnloadCallbacks[`${id_token}`] = callback;
    this._OnloadCallbacksSize++;
    if (this._SyncingResourceInfo !== null) {
      this._SyncingResourceInfo.NdLd = 1;
    }
    return id_token;
  }

  UnregisterOnloadCallback(callback_id) {
    delete this._OnloadCallbacks[`${callback_id}`];
    this._OnloadCallbacksSize--;
  }

  InvokeOnloadCallbacks() {
    if (this._OnloadCallbacksSize > 0) {
      for (const a in this._OnloadCallbacks) {
        if (this._OnloadCallbacks.hasOwnProperty(a)) {
          this._OnloadCallbacks[a]();
        }
      }
    }
  }

  IsLoaded() {
    return (this.LoadTime !== 0 && !this.Unloaded);
  }
}
Forge.RenderTextureDelegate = RenderTextureDelegate;
