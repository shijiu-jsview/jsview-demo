class BaseMedia {
    constructor(type) {
        this.state = {};
        this.type = type;
        this._AutoPlay = false;
    }

    buildPlatformInstance() {
        this.Ele = window.originDocument.createElement(this.type);
        this.Ele.addEventListener("loadedmetadata", ()=>{
            if (this.hasOwnProperty("onload")) {//这个onload是必须调用的，否则创建的video 标签不会被添加到父view上
                this.onload();
            }
            if (this.hasOwnProperty("onloadedmetadata")) {
                this.onloadedmetadata();
            }
        });
    }

    set autoplay(value) {
        if (typeof value !== "undefined") {
            this._AutoPlay = true;
            if (this.Ele.paused) {//属性设置时，不允许操作play，故设置timeout 0
                setTimeout(()=>{
                    this.play();
                },0)
            }
        }
    }

    get currentTime() {
        return this.Ele.currentTime;
    }

    set currentTime(value) {
        this.Ele.isRenderable = false;
        this.Ele.currentTime = value;
        this.setState("seek", value, "number");
    }

    get duration() {
        return this.Ele.duration;
    }

    set loop(value) {
        if(typeof value == "boolean") {
            this.Ele.loop = true;
        } else if(typeof value == "undefined") {
            this.Ele.loop = false;
        } else {
            this.Ele.loop = true;; // html5标准用法, 任何value不为boolean|undefined都会转变为true
        }
    }

    get muted() {
        return this.getState("muted");
    }

    set muted(value) {
        this.setState("muted", value, "boolean");
    }

    get paused() {
        return this.Ele.paused;
    }

    get playbackRate() {
        return this.getState("rate");
    }

    set playbackRate(value) {
        this.setState("rate", value, "number");
    }

    set src(value) {
        this.setState("src", value, "string");
        if (value && this._AutoPlay) {
            setTimeout(()=>{//属性设置时，不允许操作play，故设置timeout 0
                this.play();
            },0)
        }
    }

    get style() {
        let _this = this;
        return {
            set bottom(value) {
                _this.setState("style", '{"bottom":"' + value + '"}', "string");
            },
            set left(value) {
                _this.setState("style", '{"left":"' + value + '"}', "string");
            },
            set right(value) {
                _this.setState("style", '{"right":"' + value + '"}', "string");
            },
            set top(value) {
                _this.setState("style", '{"top":"' + value + '"}', "string");
            },
            set height(value) {
                _this.setState("style", '{"height":"' + value + '"}', "string");
            },
            set width(value) {
                _this.setState("style", '{"width":"' + value + '"}', "string");
            },
        };
    }

    get volume() {
        return this.getState("volume");
    }

    set volume(value) {
        this.setState("volume", value, "number");
    }

    get playableDuration() {
        return this.Ele.playableDuration;
    }

    addEventListener(type, listener) {
        this['on' + type] = listener;
        this.Ele.addEventListener(type, (event)=>{
            this['on' + type](event);
        })
    };

    load() {
        this.Ele.load();
    }

    pause() {
        this.Ele.pause();
        this.setState("paused", true, "boolean");
        if (this.hasOwnProperty("onpause")) {
            this.onpause();
        }
    }

    play() {
        this.setState("paused", false, "boolean");
        this.Ele.play();
        if (this.hasOwnProperty("onplay")) {
            this.onplay();
        }
    }

    unload() {
        this.setState("paused", true, "boolean");
        this.Ele.isRenderable = false;
        this.Ele.pause();
        this.Ele.removeAttribute('src'); // empty source
        this.Ele.load();
    }

    setState(key, value, type) {
        if (typeof(value) !== type) {
            console.warn("invalid paramter type to set " + key + ". value is not " + type);
            return;
        }
        this.Ele.setAttribute(key, value);
        this.state[key] = value;
        console.log("set " + key + " = " + value);
    }

    getState(key) {
        let value = this.state[key];
        console.log("get " + key + " = " + value);
        if (typeof value == "undefined") {
            value = this.Ele.getAttribute(key);
            this.state[key] = value;
        }
        return value;
    }

    onError(event) {
        this.Ele.isRenderable = false;
        if (this.hasOwnProperty("onerror")) {
            this.onerror(event.currentTarget.error.code);
        }
    }

    mediaHandler() {
        return this.Ele;
    }

    // Extension beyond HTML5
    static setDesignMapWidth(w) {
        if (typeof(w) !== "number") {
            console.warn("Invalid paramter type to set " + w + ". It is not number.");
            return;
        }

        BaseMedia.prototype.designMapWidth = w;
    }
}
BaseMedia.prototype.designMapWidth = 0

class Media extends BaseMedia {
    constructor(type) {
        super(type);
        super.buildPlatformInstance(type);
    }
}

class Audio extends Media {
    constructor() {
        super("audio");
    }
}

class Video extends Media {
    constructor() {
        super("video");
        this.state.height = 0;
        this.state.width = 0;
        this.state.aspectRatiow = 'origin'; // 'origin', 'full', '16:9', '4:3',
        this.Ele.videoWidth = 0;
        this.Ele.videoHeight = 0;
    }

    get height() {
        return this.getState("height");
    }

    set height(value) {
        this.style.height = value;
        this.state["height"] = value;
    }

    get poster() {
        console.log("Video.poster() TODO");
    }

    set poster(value) {
        console.log("Video.poster() TODO");
    }

    get videoAspectRatio() {
        return this.getState("aspectRatio");
    }

    set videoAspectRatio(value) {
        this.setState("aspectRatio", value, "string");
    }

    get videoHeight() {
        return this.Ele.videoHeight;
    }

    get videoWidth() {
        return this.Ele.videoWidth;
    }

    get width() {
        return this.getState("width");
    }

    set width(value) {
        this.style.width = value;
        this.state["width"] = value;
    }

    onLoad(event) {
        super.onLoad(event);
    }
}

class OffscreenVideoPlayer extends BaseMedia {
    constructor() {
        super("video");
        this._ReleaseCallbacks = [];
        this._ResourceTerminater = null;
        super.buildPlatformInstance();
    }

    setResourceTerminator(callback) {
        this._ResourceTerminater = callback;
    }

    hasTerminator() {
        return (this._ResourceTerminater != null);
    }

    listenToRelease(callback) {
        this._ReleaseCallbacks.push(callback);
    }

    unload() {
        super.unload();
        // 用于在回调中释放Texture资源
        if (this._ResourceTerminater != null) {
            this._ResourceTerminater();
        }
        this._ResourceTerminater = null;
    }

    releaseResource() {
        for (var i = 0; i < this._ReleaseCallbacks.length; i++) {
            this._ReleaseCallbacks[i]();
        }

        // 用于在回调中释放Texture资源
        if (this._ResourceTerminater != null) {
            this._ResourceTerminater();
        }
        this._ResourceTerminater = null;
    }

    onPlatformDestroy() {

    }

    get videoHeight() {
        return this.Ele.videoHeight;
    }

    get videoWidth() {
        return this.Ele.videoWidth;
    }
}

window.Audio = Audio;
window.Video = Video;
window.OffscreenVideoPlayer = OffscreenVideoPlayer;