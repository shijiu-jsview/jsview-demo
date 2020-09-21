import Forge from "../ForgeDefine"
window["gRootView"] = null; // For record root view
Forge.sRootView = null;

/**
 * @file layout_view.js
 * @namespace Forge
 */
class TextureSetting {
    constructor(texture, mask, texture_before_image_load, has_alpha) {
        this.Texture = texture;
        this._IsTextureExternal = false;
        if (mask instanceof Forge.ImageTexture) {
            //重新设置请求时间
            if (mask && mask.RenderTexture && mask.RenderTexture.NeedCheckExpired) {
                mask.RenderTexture.RequireTime = 0;
            }
            this.MaskSetting = new Forge.ViewTextureMask(mask);
        } else {
            this.MaskSetting = mask;
        }
        //重新设置请求时间
        if (texture && texture.RenderTexture && texture.RenderTexture.NeedCheckExpired) {
            texture.RenderTexture.RequireTime = 0;
        }

        this._IsMaskTextureExternal = false;
        this.TextureBeforeImageLoad = texture_before_image_load;
        this._IsPreloadImageTextureExternal = false;
        if (typeof has_alpha === "undefined") has_alpha = true;
        this.HasAlpha = has_alpha;
    }

    /**
     * 标识这个Texture集合是否为外部Texture<br>
     *     默认为内部Texture，内部Texture将在所附着的LayoutView从RootView移除时被强制释放<br>
     *         文字的Texture应该用内部Texture，图形Texture一般用外部Texture
     *
     * @public
     * @func SetExternal
     * @memberof Forge.TextureSetting
     * @instance
     * @param {boolean} is_texture_external            主要Texture是否为外部Texture
     * @param {boolean} is_mask_external               遮罩Texture是否为外部Texture
     * @param {boolean} is_reload_image_external       次要Texture是否为外部Texture
     **/
    SetExternal(is_texture_external, is_mask_external, is_reload_image_external) {
        this._IsTextureExternal = is_texture_external;
        this._IsMaskTextureExternal = is_mask_external;
        this._IsPreloadImageTextureExternal = is_reload_image_external;
    };

    ReleaseInternalTexture(renderer, container_view) {
        //if (layout_view_for_debug) {
        //	if (!_IsTextureExternal)
        //		LogM("ReleaseInternalTexture(): id=" + layout_view_for_debug.Id);
        //}

        if (!this._IsTextureExternal && this.Texture) {
            this.Texture.UnloadTex();
            this.Texture = null;
        }
        if (!this._IsMaskTextureExternal && this.MaskSetting /*&& this.MaskSetting instanceof Forge.ImageTexture*/) {
            this.MaskSetting.UnLoad();
            this.MaskSetting = null;
        }
        if (!this._IsPreloadImageTextureExternal && this.TextureBeforeImageLoad) {
            this.TextureBeforeImageLoad.UnloadTex();
            this.TextureBeforeImageLoad = null;
        }
    };

    DebugPrint() {
        return " _IsTextureExternal=" + this._IsTextureExternal;
    };

}
Forge.TextureSetting = TextureSetting;
window["TextureSetting"] = Forge.TextureSetting; // export class;

class ExternalTextureSetting extends Forge.TextureSetting {
    constructor(texture, mask_texture, texture_before_image_load, has_alpha) {
        super(texture, mask_texture, texture_before_image_load, has_alpha);
        this.SetExternal(true, true, true);
    }

}
Forge.ExternalTextureSetting = ExternalTextureSetting;
window["ExternalTextureSetting"] = Forge.ExternalTextureSetting; // export class;

class PackedLayout {
    constructor(layout_view_base) {
        var data_from = layout_view_base.RectInfo;
        this.RectInfo = {
            coordX: data_from.coordX,
            coordY: data_from.coordY,
            width: data_from.width,
            height: data_from.height
        };

        this.LayoutParams = JSON.parse(JSON.stringify(layout_view_base.LayoutParams));
    }

    ApplyToView(target_view) {
        var data_from = this.RectInfo;
        target_view.RectInfo = {
            coordX: data_from.coordX,
            coordY: data_from.coordY,
            width: data_from.width,
            height: data_from.height
        };

        target_view.LayoutParams = JSON.parse(JSON.stringify(this.LayoutParams));
    }

}
Forge.PackedLayout = PackedLayout;

class ViewMask {
    constructor() {
        this._MaskType = "COMMON";
    };

    Type() {
        return this._MaskType;
    };

    UnLoad() {
        //need to be overrided
    }

}
Forge.ViewMask = ViewMask;

class ViewTextureMask extends Forge.ViewMask {
    constructor(image_texture) {
        super();
        this._MaskType = "TEXTURE";
        this.ImageTexture = image_texture;
    }

    UnLoad() {
        this.ImageTexture.UnloadTex();
    };
}
Forge.ViewTextureMask = ViewTextureMask;
class ViewRoundCornerMask extends Forge.ViewMask {
    constructor(top_left, top_right, bottom_left, bottom_right) {
        super();

        this._MaskType = "CORNER";

        this._TopLeft = top_left;
        this._TopRight = (!isNaN(top_right)) ? top_right : top_left;
        this._BottomLeft = (!isNaN(bottom_left)) ? bottom_left : top_left;
        this._BottomRight = (!isNaN(bottom_right)) ? bottom_right : top_left;

        this._CornersWidth = [0.0, 0.0, 0.0, 0.0];
        this._CornersDisable = [
            (this._TopLeft === 0 ? 1.0 : 0.0),
            (this._TopRight === 0 ? 1.0 : 0.0),
            (this._BottomLeft === 0 ? 1.0 : 0.0),
            (this._BottomRight === 0 ? 1.0 : 0.0)];
    }

    UnLoad() {
        //nothing to do
    };

}
Forge.ViewRoundCornerMask = ViewRoundCornerMask;
var count = 0;
class LayoutViewBase {
    constructor(texture_setting, element_name) {
        this.TextureSetting = texture_setting;
        if (texture_setting) {
            console.error("LayoutViewBase constructor texture_setting not undefined!");
        }
        this.Visibility = "VISIBLE";
        this.LayoutParams = null; // TODO: 为了节省内存，将改成按需求生成
        this.ParentView = null;
        this.ChildViews = []; // TODO: 为了节省内存，将改成按需求生成
        // Z-index
        this.zIndex = 0;
        this._Perspective = 0;
        this._PerspectiveAnchor = [0.5, 0.5];
        this._BackfaceVisibility = 1;
        this._DebugCount = ++count;
        this.childZIndexCount = 0; // 计数器，统计子界面中有多少个设置了index的界面，用于优化AddView时的z-index调整处理
        this._IsChildOfRootView = false;
        this._DetachFromSystemCallback = null;
        this.Element = null;
        this.InnerChildElement = null; // 例如video element
        if (element_name === "root") {
            this.Element = window.originDocument.getElementById(element_name);
        } else if (element_name === "svg" || element_name === "path") {
            this.Element = document.createElementNS("http://www.w3.org/2000/svg", element_name);
        } else {
            this.Element = window.originDocument.createElement(element_name);
            this.Element.style.position = "absolute";
        }

        this.TransitionStore = {}; // div的所有transition信息，多个Transition动画会同时作用？

        this.TransformAnimationObj = null;
        this._TextureAnimationObj = null;

        this._ObjectFitTestCache = null;
    }

    Init(texture_setting) {
        this.ResetTexture(texture_setting);
    }

    AddView(child_view, layout_params, packed_layout) {
        if (layout_params !== null) {
            if (!(layout_params instanceof Forge.LayoutParamsBase))
                child_view.LayoutParams = new Forge.LayoutParams(layout_params);
            else
                child_view.LayoutParams = layout_params.Clone();
        } else {
            if (child_view.LayoutParams === null) {
                child_view.LayoutParams = new Forge.LayoutParams({x: 0, y: 0});
            }
        }

        if (child_view.LayoutParams !== null) {
            if (child_view.LayoutParams.MarginLeft) {
                child_view.Element.style.left = child_view.LayoutParams.MarginLeft + "px";
            }
            if (child_view.LayoutParams.MarginTop) {
                child_view.Element.style.top = child_view.LayoutParams.MarginTop + "px";
            }
            if (child_view.LayoutParams.Width) {
                child_view.Element.style.width = child_view.LayoutParams.Width + "px";
            }

            if (child_view.LayoutParams.Height) {
                child_view.Element.style.height = child_view.LayoutParams.Height + "px";
            } else {
                child_view.Element.style.height = "";
            }
        }

        child_view.ParentView = this;
        this.ChildViews.push(child_view);

        if (this._IsChildOfRootView) {
            child_view._OnAttachToSystem();
        }
    }

    SetZIndex(z_index) {
        this.Element.style.zIndex = z_index;
        this.zIndex = z_index;
    }

    /**
	 * Perspective距离<br>
	 *
	 * hide public
	 * @func SetPerspective
	 * @memberof Forge.LayoutViewBase
	 * @instance
	 * @param {int} distance 观察点距离view的值, 最大为2^16 - 1
	 **/
    SetPerspective(distance, origin) {
        this.Element.style.perspective = distance + "px";
        this.Element.style.webkitPerspective = distance + "px";
        this.Element.style.perspectiveOrigin = origin;
        this.Element.style.webkitPerspectiveOrigin = origin;
        this._Perspective = distance;
        this._PerspectiveOrigin = origin
    }

    /**
	 * 背面是否可见<br>
	 *
	 * hide public
	 * @func SetBackfaceVisibility
	 * @memberof Forge.LayoutViewBase
	 * @instance
     * @param {boolean} visible 可见性
	 **/
    SetBackfaceVisibility(visible) {
        console.log("set back face", visible);
        this.Element.style.backfaceVisibility = visible ? "visible" : "hidden";
        this.Element.style.webkitBackfaceVisibility = visible ? "visible" : "hidden";
        console.log("back face style " + this.Element.style.backfaceVisibility);
        this._BackfaceVisibility = visible ? 1 : 0;
    }

    SetTransformStyle(transform_style) {
        this.Element.style.transformStyle = transform_style;
        this.Element.style.webkitTransformStyle = transform_style;
        this._TransformStyle = transform_style;
    }

    EnableDivTouch(ele, setting) {
        if (ele.reactEventHandlers && ele.reactEventHandlers.onClick) {
            this.Element.onclick = (ev) => {
                ele.reactEventHandlers.onClick();
                if (ev.preventDefault) {
                    ev.preventDefault()
                }
            }
            this.Element.style.pointerEvents = "auto"
        }
    }

    RemoveView(child_view_to_remove) {
        for (var i = 0; i < this.ChildViews.length; i++) {
            if (this.ChildViews[i] === child_view_to_remove) {
                if (child_view_to_remove.IsChildOfRootView()) {
                    child_view_to_remove._OnDetachFromSystem();
                }
                this.ChildViews.splice(i, 1);
                child_view_to_remove.ParentView = null;
                break;
            }
        }
    }

    _OnDetachFromSystem() {
        this._IsChildOfRootView = false;
        if (this._DetachFromSystemCallback) {
            this._DetachFromSystemCallback();
        } else {
            this.OnDettachFromSystem();
        }
        for (var i = 0; i < this.ChildViews.length; i++) {
            let child_view = this.ChildViews[i];
            child_view._OnDetachFromSystem();
        }
        this.ParentView.Element.removeChild(this.Element);

        this._releaseViewResources();
    }
 
    RegisterDetachCallback(callback) {
        this._DetachFromSystemCallback = callback;
    }

    UnregisterDetachCallback() {
        this._DetachFromSystemCallback = null;
    }

    /**
	 * 按需重载的回调函数
	 *
	 * @public
	 * @func OnDettachFromSystem
	 * @memberof Forge.LayoutViewBase
	 * @instance
	 **/
	OnDettachFromSystem() {
		// Override if needed
	};

    _releaseViewResources() {
        // Stop animation
        this.StopAnimation();
        this.StopTextureAnimation();
    };

    ClearViews() {
        let child_count = this.ChildViews.length;
        if (child_count === 0)
            return;
        for (var i = 0; i < child_count; i++) {
            let child_view = this.ChildViews[i];
            if (child_view && child_view.IsChildOfRootView())
                child_view._OnDetachFromSystem();
        }

        this.ChildViews = [];
    }

    _ResetTextStyle(resource_info) {
        this.Element.textContent = resource_info.Set.ST;
        this.Element.style.overflow = "hidden";
        if (resource_info.Set.AT) {
            let attr_json = JSON.parse(resource_info.Set.AT);
            this.Element.style.textOverflow = attr_json.TO;
			this.Element.style.wordBreak = "normal";
            if (attr_json.WW == "none") {
                this.Element.style.whiteSpace = "nowrap";
            } else if (attr_json.WW) {
				this.Element.style.wordWrap = attr_json.WW.replace("_", "-");
			}
        }
        if (resource_info.Set.RA) {
            let react_json = JSON.parse(resource_info.Set.RA);
            this.Element.style.width = react_json.W + "px";
            this.Element.style.height = react_json.H + "px";
        }
        if (resource_info.Set.LH) {
            this.Element.style.lineHeight = resource_info.Set.LH + "px";
        }

        if (resource_info.Set.FO) {
            let font_json = JSON.parse(resource_info.Set.FO);
            if (font_json.Tx) {
                this.Element.style.color = font_json.Tx;
            }
            if (font_json.Fo) {
                this.Element.style.fontFamily = font_json.Fo;
            }
            if (font_json.Si) {
                this.Element.style.fontSize = font_json.Si + "px";
            }
            if (font_json.Ba) {
                this.Element.style.backgroundColor = font_json.Ba;
            }
            if (font_json.It) {
                this.Element.style.fontStyle = "italic";
            }
            if (font_json.Bo) {
                this.Element.style.fontWeight = "bold";
            } else {
                this.Element.style.fontWeight = "normal";
            }
            if (font_json.Al) {
                this.Element.style.textAlign = font_json.Al;
            }
            if (font_json.Vaa) {
                this.Element.style.verticalAlign = font_json.Vaa;
            }
        }
    }

    _SetBorderRadius(mask_setting) {
        let target_element = (this.InnerChildElement ? this.InnerChildElement : this.Element);
        target_element.style.borderRadius = mask_setting._TopLeft + "px " +
            mask_setting._TopRight + "px " +
            mask_setting._BottomRight + "px " +
            mask_setting._BottomLeft + "px";
    }

    /**
     * 设置新的Texture集合
     *
     * @public
     * @func ResetTexture
     * @memberof Forge.LayoutViewBase
     * @instance
     * @param {Forge.TextureSetting} texture_setting    新的Texture集合
     **/
    ResetTexture(texture_setting) {
        this.TextureSetting = texture_setting;
        if (texture_setting) {
            if (texture_setting.Texture.Source) {
                if (this.Element.tagName === "IMG") {
                    // 图片元素，设置url到src中
                    this.Element.src = texture_setting.Texture.Source;
                } else {
                    this.Element.style.backgroundImage = 'url(' + texture_setting.Texture.Source + ')';
                    this.Element.style.backgroundSize = "100% 100%";
                }
            } else if (texture_setting.Texture.RenderTexture && texture_setting.Texture.RenderTexture._SyncingResourceInfo) {
                let render_texture = texture_setting.Texture.RenderTexture;
                let resource_info = render_texture._SyncingResourceInfo;
                if (resource_info.Nam === "T") {
                    this._ResetTextStyle(resource_info);
                } else if (resource_info.Nam === "CT") {
                    this.Element.style.backgroundColor = resource_info.Set.Clr;
                } else if (resource_info.Nam === "VPLY") {
                    let video_el = resource_info.Set.Hdl;

                    // 在Forge html状态，video的显示尺寸由父元素决定
                    video_el.style.width = "100%";
                    video_el.style.height = "100%";
                    video_el.style.objectFit = "fill";

                    this.Element.appendChild(video_el);
                    this.InnerChildElement = video_el;
                }
            }

            if (texture_setting.MaskSetting) {
                if (texture_setting.MaskSetting._MaskType === "CORNER") {
                    this._SetBorderRadius(texture_setting.MaskSetting);
                }
            }
        }
    }

    SetVisibility(new_visibility) {
        if (typeof new_visibility === "string") {
            this.Element.style.visibility = new_visibility.toLocaleLowerCase();
        } else {
            this.Element.style.visibility = "inherit";
        }
    }

    _OnAttachToSystem() {
        if (this.Element.id === "svg" || this.Element.id === "path") {
            console.log("_OnAttachToSystem appendChild");
        }
        this.ParentView.Element.appendChild(this.Element);

        this._IsChildOfRootView = true;
        var child_view_list = this.ChildViews;
        var child_view;
        for (var i = 0; i < child_view_list.length; i++) {
            child_view = child_view_list[i];
            child_view._OnAttachToSystem();
        }
    }

    IsChildOfRootView() {
        return this._IsChildOfRootView;
    }

    StartAnimation(anim, anim_for_self, delay) {
        if (typeof this.TransformAnimationObj != "undefined" && this.TransformAnimationObj) {
            this.TransformAnimationObj.Cancel(anim);
            this.TransformAnimationObj = null;

            if (!window.jsvInAndroidWebView) {
                this.Element.style.animation = null;
            } else {
                this.Element.style.webkitAnimation = null;
            }
        }
        this.TransformAnimationObj = anim;
        if (!isNaN(delay) && delay > 0) {
            anim.EnableDelay(delay);
        }
        anim.Start(this);
    }

    ApplyStyleTransition(new_map) {
        this.TransitionStore = {...this.TransitionStore, ...new_map};
        let transitions = "";
        for(let transition_name in this.TransitionStore) {
            if (transitions) {
                transitions += ",";
            }
            transitions += this.TransitionStore[transition_name];
        }
        if (!window.jsvInAndroidWebView) {
            this.Element.style.transition = transitions;
        } else {
            this.Element.style.webkitTransition = transitions;
        }
    }

    /**
     * 停止这个LayoutView的动画变换，并重置曾经进行动画变换的矩阵
     *
     * @public
     * @func StopAnimation
     * @memberof Forge.LayoutViewBase
     * @instance
     **/
    StopAnimation() {
        if (typeof this.TransformAnimationObj != "undefined" && this.TransformAnimationObj) {
            this.TransformAnimationObj.Cancel();
            this.TransformAnimationObj = null;

            // 状态将在Animation触发的DetachAnimation中恢复，不需要在此手动恢复
        }
    };

    /**
     * 对这个LayoutView开始进行Texture动画变换(相对于view自身)
     *
     * @public
     * @func StartTextureAnimation
     * @memberof Forge.LayoutViewBase
     * @instance
     * @param {Forge.AnimationBase} anim   动画设置，例如通过new Forge.TranslateAnimation()创建
     **/
    StartTextureAnimation(anim) {
        if (typeof this._TextureAnimationObj != "undefined" && this._TextureAnimationObj) {
            this._TextureAnimationObj.Cancel(anim);
            this._TextureAnimationObj = null;
        }
        this._TextureAnimationObj = anim;
        anim.AsTextureAnimation();
        anim.Start(this);
        this._RequestLayout();
    };

    /**
     * 停止这个LayoutView中的Texture的动画变换，并重置曾经进行动画变换的矩阵
     *
     * @public
     * @func StopAnimation
     * @memberof Forge.LayoutViewBase
     * @instance
     **/
    StopTextureAnimation() {
        if (typeof this._TextureAnimationObj != "undefined" && this._TextureAnimationObj) {
            this._TextureAnimationObj.Cancel();
            this._TextureAnimationObj = null;
        }
    };


    /**
     * 停止该LayoutView和其所有子LayoutView的动画，并重置曾经进行动画变换的矩阵
     *
     * @public
     * @func StopAllAnimations
     * @memberof Forge.LayoutViewBase
     * @instance
     **/
    StopAllAnimations() {
        this.StopAnimation();
        this.StopTextureAnimation();
        for (var i = 0; i < this.ChildViews.length; i++) {
            this.ChildViews[i].StopAllAnimations();
        }
    };

    /**
     * 获得正在进行动的动画的句柄
     *
     * @public
     * @func GetAnimation
     * @memberof Forge.LayoutViewBase
     * @instance
     * @return {Forge.AnimationBase}
     **/
    GetAnimation() {
        return this.TransformAnimationObj;
    };

    /**
     * 移除动画设置。<br>
     *     架构内部函数，应只能被Forge.AnimationBase调用
     *
     * @func DetachAnimation
     * @memberof Forge.LayoutViewBase
     * @instance
     * @param {Forge.AnimationBase} anim 要移除的动画
     **/
    DetachAnimation(anim) {
        if (this.TransformAnimationObj == anim) {
            this.TransformAnimationObj = null;

            if (!window.jsvInAndroidWebView) {
                this.Element.style.animation = null;
                this.Element.style.transition = null;
            } else {
                this.Element.style.webkitAnimation = null;
                this.Element.style.webkitTransition = null;
            }
        }
    };

    ResetCssTransform(transform_string, transform_origin_string) {
        if (transform_string !== this._CssTransform || transform_origin_string != this._CssTransformOrigin) {
            console.log("ResetCssTransform transform_string:", transform_string);
            if (!window.jsvInAndroidWebView) {
                this.Element.style.transform = transform_string;
                this.Element.style.transformOrigin = transform_origin_string;
            } else {
                this.Element.style.webkitTransform = transform_string;
                this.Element.style.webkitTransformOrigin = transform_origin_string;
            }

            this._CssTransform = transform_string;
	        this._CssTransformOrigin = transform_origin_string;
        }
    }

    ResetTextureCssTransform(transform_string, transform_origin_string) {
        this.ResetCssTransform(transform_string, transform_origin_string);
    }

    /****************************************
     * View getter
     */
    SetId(id) {
        this.Id = id;
    };

    ResetLayoutParams(new_params) {
        if (new_params !== null) {
            if (!(new_params instanceof Forge.LayoutParamsBase))
                this.LayoutParams = new Forge.LayoutParams(new_params);
            else
                this.LayoutParams = new_params.Clone();
            this.Element.style.left = this.LayoutParams.MarginLeft + "px";
            this.Element.style.top = this.LayoutParams.MarginTop + "px";
            if (this.LayoutParams.Width) {
                this.Element.style.width = this.LayoutParams.Width + "px";
            }
            if (this.LayoutParams.Height) {
                this.Element.style.height = this.LayoutParams.Height + "px";
            }
        } else {
            Forge.ThrowError("ResetLayoutParams(): new params is null");
        }
    }

    /**
     * 获得关联的Forge.Renderer
     *
     * hide public
     * @func GetRenderer
     * @memberof Forge.LayoutViewBase
     * @instance
     * @return {Forge.Renderer}
     **/
    GetRenderer() {
        return Forge.LayoutViewBase.sRenderer;
    }

    /**
     * 获得当前布局配置的拷贝
     *
     * @public
     * @func GetLayoutParams
     * @memberof Forge.LayoutViewBase
     * @instance
     * @return {Forge.LayoutParams}
     **/
    GetLayoutParams() {
        if (!this.LayoutParams)
            return new Forge.LayoutParams();
        return this.LayoutParams.Clone();
    }

    /**
     * 启用自适应高度
     *
     * @public
     * @func EnableAutoHeight
     * @memberof Forge.LayoutViewBase
     * @instance
     **/
    EnableAutoHeight() {
        this._AutoHeight = true;
    }

    // 功能: 标识本LayoutView要根据自身Texture加载完成后，根据Texture的尺寸重新Resize
    // 当enable后，无论尺寸设成多少，同步给Native的界面尺寸都会固定为(1,1)，
    // 以保证View会被渲染，从而防止Texture由于不在界面上不会加载的处理生效，同时小尺寸不会被注意
    WaitTextureToResize(enable) {
        // js模式下为控制显示和隐藏
        this.Element.style.visibility = (enable ? "hidden" : "visible");
    }

    // 根据object fit，调整texture在view中的显示位置
    // 当view的宽/高，单项为0时，可以进行内容的自适应扩展
    ApplyObjectFit(frame_width, frame_height, texture_width, texture_height, object_fit, object_fit_define) {
        if (this._ObjectFitTestCache === null) {
            // 创建检测结果的缓存，用于加快检测速度
            this._ObjectFitTestCache = {
                frameWidth: NaN,
                frameHeight: NaN,
                textureWidth: NaN,
                textureHeight: NaN,
                objectFit: null,
                clipLayout: null
            };
        }

        let test_cache = this._ObjectFitTestCache;

        if (test_cache.frameWidth === frame_width
            && test_cache.objectFit === object_fit
            && test_cache.frameHeight === frame_height
            && test_cache.textureWidth === texture_width
            && test_cache.textureHeight === texture_height) {
            return test_cache.clipLayout;
        }

        let clip_layout = { x:0, y:0, width:frame_width, height:frame_height, overflow: false };

        // Flush cache, 放在判断处理调整viewSize之前进行cache
        test_cache.frameWidth = frame_width;
        test_cache.frameHeight = frame_height;
        test_cache.textureWidth = texture_width;
        test_cache.textureHeight = texture_height;
        test_cache.objectFit = object_fit;
        test_cache.clipLayout = clip_layout;

        let expect_size = { width:0, height:0 };

        let frame_ratio = frame_width / frame_height;
        let texture_ratio = texture_width / texture_height;

        if(!texture_ratio) {
            console.error("Error:Texture size is 0!")
            return clip_layout;
        }

        if(frame_width === 0 || frame_height === 0) {
            if(frame_width === 0 && frame_height === 0) {
                // frame没有size的场合
                return clip_layout;
            }

            // 调整frame width 和 frame height，并计算新的frame ratio
            if (frame_width === 0) {
                frame_width = frame_height * texture_ratio;
            } else {
                // frame height === 0
                frame_height = frame_width / texture_ratio;
            }
            frame_ratio = frame_width / frame_height;
        }

        let object_fit_str = "";

        switch(object_fit) {
            case object_fit_define.FILL:
                expect_size.width = frame_width;
                expect_size.height = frame_height;
                object_fit_str = "fill";
                break;
            case object_fit_define.NONE:
                expect_size.width = texture_width;
                expect_size.height = texture_height;
                object_fit_str = "none";
                break;
            case object_fit_define.COVER:
                expect_size = this._StretchSize(frame_width, frame_height, texture_ratio, texture_ratio < frame_ratio);
                object_fit_str = "cover";
                break;
            case object_fit_define.SCALEDOWN:
                // 使用contain和none之间尺寸小的一个。
                let refer_width = (texture_ratio > frame_ratio); // use object-fit.contain
                if(frame_width > texture_width
                    && frame_height > texture_height) { // use object-fit.none
                    refer_width = (texture_ratio < frame_ratio); // use object-fit.contain
                }
                expect_size = this._StretchSize(frame_width, frame_height, texture_ratio, refer_width);
                object_fit_str = "scaledown";
                break;
            case object_fit_define.CONTAIN:
                expect_size = this._StretchSize(frame_width, frame_height, texture_ratio, texture_ratio > frame_ratio);
                // console.warn("Element.JsvFitViewLayout() expect_size=" + JSON.stringify(expect_size));
                object_fit_str = "contain";
                break;
            default:
                throw Error("Unexpected object-fit.");
        }

        // format expect size
        expect_size.width = Math.floor(expect_size.width);
        expect_size.height = Math.floor(expect_size.height);

        // 计算可视区域
        clip_layout.width = Math.min(expect_size.width, frame_width);
        clip_layout.height = Math.min(expect_size.height, frame_height);
        clip_layout.x = Math.floor((frame_width - clip_layout.width) / 2);
        clip_layout.y = Math.floor((frame_height - clip_layout.height) / 2);
        clip_layout.overflow = (expect_size.width > frame_width || expect_size > frame_height);

        // element设置object fit
        let target_ele = (this.InnerChildElement ? this.InnerChildElement : this.Element);
        target_ele.style.width = frame_width + "px";
        target_ele.style.height = frame_height + "px";
        target_ele.style.objectFit = object_fit_str;

        return clip_layout;
    }

    _StretchSize(origin_width, origin_height, ratio, refer_width) {
        let stretchSize = { width: 0, height: 0 };

        if (!!refer_width) {
            stretchSize.width = origin_width;
            stretchSize.height = origin_width / ratio;
        } else {
            stretchSize.height = origin_height;
            stretchSize.width = origin_height * ratio;
        }

        return stretchSize;
    }
}
LayoutViewBase.DivId = 0;
// Static variable
Forge["LayoutViewBase"] = LayoutViewBase;

class LayoutView extends Forge.LayoutViewBase {

    /**
     * 渲染树的每个节点。<br>
     *     创建例子：<br>
     *         1. 通过Forge.TextureManager创建Texture<br>
     *         2. 将Texture装入Forge.TextureSetting集合, var ts = new Forge.TextureSetting(...);<br>
     *         3. var v = new Forge.LayoutView(ts)<br>
     *         4. 将view加入渲染树 parent_view.AddView(v, {x:0, y:0, width:100, height:100})<br>
     *            width和height决定Texture的描画尺寸（拉伸）<br>
     *
     * @public
     * @constructor Forge.LayoutView
     * @extends Forge.LayoutViewBase
     * @param {Forge.TextureSetting} texture_setting            用于描画的Texture合集
     **/
    constructor(texture_setting, element_name) {
        if (texture_setting && !(texture_setting instanceof Forge.TextureSetting))
            Forge.ThrowError("ERROR:LayoutView need TextureSetting as parameter");
        element_name = element_name ? element_name:"div";
        super(texture_setting, element_name);
    }

}

Forge.LayoutView = LayoutView;
window["LayoutView"] = Forge.LayoutView; // export class
class RootView extends Forge.LayoutView {

    /**
     * 根节点LayoutView
     *
     * @protected
     * @constructor Forge.RootView
     * @extends Forge.LayoutView
     **/
    constructor() {
        super(undefined, "root");
        this._ViewType = 1;
        this._IsChildOfRootView = true;
        window.gRootView = this;
        Forge.sRootView = this;
    }

    /**
     * 初始化RootView的尺寸（一般根据window.innerHeight和window.innerWidth)
     *
     * @public
     * @func Init
     * @memberof Forge.RootView
     * @instance
     * @param {Forge.Renderer} renderer
     * @param {int} left
     * @param {int} top
     * @param {int} width
     * @param {int} height
     **/
    Init(renderer, left, top, width, height) {
        // Init static private value
        this.InitLayoutViewStaticValues(renderer);

        this.ResetLayoutParams({x: 0, y: 0, width: 1280, height: 720}); // TODO: 需要和ActivityManager设置进行对接
    };

    /**
     * 初始化LayoutViewBase中的静态变量
     *
     * @protected
     * @func InitLayoutViewStaticValues
     * @memberof Forge.LayoutViewBase
     * @instance
     * @param {Forge.Renderer} renderer
     **/
    InitLayoutViewStaticValues(renderer) {
        Forge.LayoutViewBase.sRenderer = renderer; // Set shared renderer of all LayoutView
        Forge.LayoutViewBase.sInternalTextureManager = renderer.GetSharedTextureManager();
        Forge.LayoutViewBase.sIdentityMat4 = new Forge.Mat4();
        Forge.LayoutViewBase.sNullDirectParentMat4 = new Forge.Mat4();
        Forge.LayoutViewBase.sBakeFlipYMat4 = (new Forge.Mat4()).rotatex(180);
    };

}
Forge.RootView = RootView;
window["RootView"] = Forge.RootView; // export class
class CClipRectInfo {
    constructor(x, y, w, h, enable) {
        this.coordX = x;
        this.coordY = y;
        this.width = w;
        this.height = h;
        this.useScissors = enable;
        this.maskStencil = null;
    }

    updateInfo(x, y, w, h, enable) {
        this.coordX = x;
        this.coordY = y;
        this.width = w;
        this.height = h;
        this.useScissors = enable;
    }

    setMaskStencil(local_file_uri) {
        this.maskStencil = local_file_uri;
    }
}

class ClipView extends Forge.LayoutView {

    /**
     * 带裁剪功能的LayoutView
     *
     * @public
     * @constructor Forge.ClipView
     * @extends Forge.LayoutView
     * @param {Forge.TextureSetting} texture_setting 背景Texture集合
     **/
    constructor(texture_setting) {
        super(texture_setting, "div");
        this._ClipRectInfo = null;
        this.Id = "ClipView";
        this.TextureSetting = null;
    }

    /**
     * 重载LayoutView.SetId，为所设置的Id添加后缀_ClipView
     *
     * @public
     * @func SetId
     * @memberof Forge.ClipView
     * @instance
     * @param {string} id 原始id
     **/
    SetId(id) {
        this.Id = id + "_ClipView";
    }

    /**
     * 设置裁剪区域大小
     *
     * @public
     * @func SetClipRect
     * @memberof Forge.ClipView
     * @instance
     * @param {int} x           相对于自己的坐标
     * @param {int} y           相对于自己的坐标
     * @param {int} width       相对于自己的坐标
     * @param {int} height      相对于自己的坐标
     * @param {boolean} use_scissors    是否进行裁剪
     **/
    SetClipRect(x, y, width, height, use_scissors) {
        //use_scissors = false; // Enabled only when debug
        if (this._ClipRectInfo === null) {
            this._ClipRectInfo = new CClipRectInfo(x, y, width, height, use_scissors);
        } else {
            this._ClipRectInfo.updateInfo(x, y, width, height, use_scissors);
        }
        let clip_left = x;
        let clip_top = y;
        let clip_right = this.LayoutParams.Width - clip_left - width;
        let clip_bottom = this.LayoutParams.Height - clip_top - height;
        if (use_scissors) {
            this.Element.style.overflow = "hidden";
            this.Element.style.clipPath = "inset(" + clip_top + "px " + clip_right + "px " + clip_bottom + "px " + clip_left + "px)";
        } else {
            this.Element.style.overflow = "visible";
            this.Element.style.clipPath = "unset";
        }
    };
}
Forge.ClipView = ClipView;
window["ClipView"] = Forge.ClipView; // export class

class NinePatchView extends Forge.LayoutView {

    /**
     * 按照NinePatch方式进行渲染的专用LayoutView
     *
     * @public
     * @constructor Forge.NinePatchView
     * @extends Forge.LayoutView
     * @param {Forge.TextureSetting} texture_setting 背景Texture集合
     **/
    constructor(texture_setting) {
        super(texture_setting, "div");
        this._HorizontalRepeats = [0, 0, 0, 0];
        this._VerticalRepeats = [0, 0, 0, 0];
        this._HorizontalPadding = [0, 0];
        this._VerticalPadding = [0, 0];
    }

    /**
     * 设置新的Texture集合
     *
     * @public
     * @func ResetTexture
     * @memberof Forge.LayoutViewBase
     * @instance
     * @param {Forge.TextureSetting} texture_setting    新的Texture集合
     **/
    ResetTexture(texture_setting) {
        this.TextureSetting = texture_setting;

        if (texture_setting) {
            if (texture_setting.MaskSetting) {
                if (texture_setting.MaskSetting._MaskType === "CORNER") {
                    this._SetBorderRadius(texture_setting.MaskSetting);
                }
            }
            if (texture_setting.Texture.Source) {
                let texture_width = texture_setting.Texture.RenderTexture.Width;
                let texture_height = texture_setting.Texture.RenderTexture.Height;
                let slice_left = this._HorizontalRepeats[0];
                let slice_right = texture_width - this._HorizontalRepeats[1] - slice_left;
                let slice_top = this._VerticalRepeats[0];
                let slice_bottom = texture_height - this._VerticalRepeats[1] - slice_top;

                //top right bottom left
                let slice_str = slice_top + " " + slice_right + " " + slice_bottom + " " + slice_left
                this.Element.style.borderImage = 'url(' + texture_setting.Texture.Source + ') ' + slice_str + ' fill';//图片边框向内偏移。
                let outset_left = this._HorizontalPadding[0];
                let outset_right = texture_width - this._HorizontalPadding[1] - outset_left;
                let outset_top = this._VerticalPadding[0];
                let outset_bottom = texture_height - this._VerticalPadding[1] - outset_top;

                this.Element.style.borderImageWidth = slice_top + "px " + slice_right + "px " + slice_bottom + "px " + slice_left + "px";//图片边框的宽度。
                this.Element.style.borderImageOutset = outset_top + "px " + outset_right + "px " + outset_bottom + "px " + outset_left + "px";//边框图像区域超出边框的量。
            }
        }
    }

    /**
     * 设置横向延展区域和纵向延展的区域。（即NinePatch规则中的上边线和左边线）
     *
     * @public
     * @func SetRepeat
     * @memberof Forge.NinePatchView
     * @instance
     * @param {Array} horizontal_repeat  横向延展区域设置数组（目前延展区域个数最大支持2个）<br>
     *                                  数组元素内容，包含start和end该点：{start:xxx, width:xxx}
     * @param {Array} vertical_repeat  纵向延展区域设置数组（目前延展区域个数最大支持2个）<br>
     *                                  数组元素内容，包含start和end该点：{start:xxx, width:xxx}
     **/
    SetRepeat(horizontal_repeat, vertical_repeat) {
        Forge.Assert(horizontal_repeat.length <= 2);
        Forge.Assert(vertical_repeat.length <= 2);

        for (var i = 0; i < 2; i++) {
            if (i < horizontal_repeat.length) {
                this._HorizontalRepeats[i * 2] = horizontal_repeat[i].start;
                this._HorizontalRepeats[i * 2 + 1] = horizontal_repeat[i].width;
            } else {
                this._HorizontalRepeats[i * 2] = 0;
                this._HorizontalRepeats[i * 2 + 1] = 0;
            }

            if (i < vertical_repeat.length) {
                this._VerticalRepeats[i * 2] = vertical_repeat[i].start;
                this._VerticalRepeats[i * 2 + 1] = vertical_repeat[i].width;
            } else {
                this._VerticalRepeats[i * 2] = 0;
                this._VerticalRepeats[i * 2 + 1] = 0;
            }
        }
        return this; // 为了支持连续设定的用法
    };

    /**
     * 设置横向填充区尺寸以及纵向填充区尺寸。（即NinePatch规则中的下边线和右边线）
     *
     * @public
     * @func SetPadding
     * @memberof Forge.NinePatchView
     * @instance
     * @param {Object} horizontal_padding  内容覆盖区域（横向），格式：{start:xxx, width:xxx}
     * @param {Object} vertical_padding  内容覆盖区域（纵向向），格式：{start:xxx, width:xxx}
     **/
    SetPadding(horizontal_padding, vertical_padding) {
        Forge.Assert(horizontal_padding !== null);
        Forge.Assert(vertical_padding !== null);
        this._VerticalPadding[0] = vertical_padding.start;
        this._VerticalPadding[1] = vertical_padding.width;
        this._HorizontalPadding[0] = horizontal_padding.start;
        this._HorizontalPadding[1] = horizontal_padding.width;
        return this; // 为了支持连续设定的用法
    };
}

Forge.NinePatchView = NinePatchView;

class JsvElementView extends Forge.LayoutView {

    /**
     * 根节点LayoutView
     *
     * @protected
     * @constructor Forge.RootView
     * @extends Forge.LayoutView
     **/
    constructor(name) {
        let origin_name = name.substr(3);
        super(undefined, origin_name);
    }

    setAttribute(name, value) {
        this.Element.setAttribute(name, value);
    }

    removeAttribute(name) {
        this.Element.removeAttribute(name);
    }

    getAttribute(name) {
        return this.Element.getAttribute(name);
    }

    hasAttribute(name) {
        return this.Element.hasAttribute(name);
    }

    get textContent() {
        return this.Element.textContent;
    }

    set textContent(text) {
        this.Element.textContent = text;
    }
}
Forge.JsvElementView = JsvElementView;


