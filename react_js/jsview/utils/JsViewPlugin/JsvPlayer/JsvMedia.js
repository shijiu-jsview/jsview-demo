let MediaPluginInfo={
    //downloadUrl:"http://192.168.0.54:8080/plugin/JsvPlayer.zip", //插件下载地址
    packageName:"com.qcode.jsvplayer",
    name:"播放器插件",
    version:"1.1.1",  //插件需要的最低版本号
    versionCodeMin:111,
    versionCodeMax:111,
    bridgeName:"jsvPlayerBridge", //插件bridge注册到jsview的名称
    className:"com.qcode.jsvplayer.JsvPlayer",  //插件初始化类名称
    initMethod:"createInstance",   //插件初始化方法
    listener:"top.JsvPlayerPluginLoadResult",  //插件加载结果回调
    //md5:"ef0f30b0d4ecefa1b3094bec3da57d41"
};


class JsvBaseMedia {
    constructor(type, hole_id, player_type, key, background, design_map_width, is_surface_view) {
        this.state = {
			muted: false,
			paused: true,
			repeat: false,
            enablePlayer: false,
            autoPlay: false,
			startTime: 0.0,
			aspectRatio: "origin",
        };
        
		this.local = {
			currentTime: 0.0,
			playableDuration: 0.0,
			duration: 0.0,

			isRenderable: false,
        };
        
        this.type = type;
        this._AutoPlay = false;
        this.playerCreate = false;
        this.key = key;
        this.background = background;
        this.holeId = hole_id;
        // this.styleHandler = null;
        // this.style = {
        //     left:0,
        //     top:0,
        //     width:1280,
        //     height:720
        // };
        

        window.top.JsvPlayerPluginLoadResult = function (result) {
            console.log(result);
            this.buildPlatformInstance(type, player_type, key, background, design_map_width, is_surface_view);
        }.bind(this);

        if(typeof window.jsvPlayerBridge=='undefined' || !window.jsvPlayerBridge){
            this.loadJsvPlayerPlugin();
        }else{
            this.buildPlatformInstance(type, player_type, key, background, design_map_width, is_surface_view);
        }
    }

    loadJsvPlayerPlugin(){
        if(typeof window.jPluginManagerBridge=='undefined' || !window.jPluginManagerBridge){
            return;
        }

        window.jPluginManagerBridge.LoadPlugin(JSON.stringify(MediaPluginInfo));
    }

    buildPlatformInstance(type, player_type, key, background, design_map_width, is_surface_view) {
        if(typeof window.jsvPlayerBridge=='undefined' || !window.jsvPlayerBridge){
            console.log("no jsvPlayerBridge");
            return;
        }

        let view_type = 0;
        if(!is_surface_view)
            view_type = 1;

        window.top.CreatePlayerResult = function (result) {
            console.log(result);
            let result_obj = JSON.parse(result);
            if(result_obj.code == 0){
                this.playerCreate = true;
                this.initPlayer(key);
            }
        }.bind(this);

        let result = window.jsvPlayerBridge.CreatePlayer(key, this.holeId, background, design_map_width, view_type, player_type, "top.CreatePlayerResult");
        if(result > 0){
            this.playerCreate = true;
            this.initPlayer(key);
        }
    }

    initPlayer(key){
        window.JMD.subscribe(key, function (event) {
            console.log("event data:" + event);
            let obj = JSON.parse(event);
            let event_obj = JSON.parse(obj.param);
            this.onEvent(event_obj.event, event_obj.data);
        }.bind(this));

        console.log("InitPlayer:1");
        if(this.state["src"])
            this.setState("src", this.state["src"], "string");
        
        // console.log("InitPlayer:2"); 
        // this.setState("style", JSON.stringify(this.style), "string");

        console.log("InitPlayer:3");
        if(this.state["currentTime"])
            this.setState("currentTime", this.state["currentTime"], "number");

        if(this.state["paused"] == false){
            this.setState("paused", this.state["paused"], "boolean");
        }
    }

    releasePlayer(){
        if(typeof window.jsvPlayerBridge != "undefined" && window.jsvPlayerBridge){
            window.jsvPlayerBridge.ReleasePlayer(this.key, this.holeId, this.background);
        }
    }

    onEvent(event, data){
       switch(event){
            case "onProgress":
                console.log("onProgress:"+data);
                if (this.local.isRenderable == false) {
                    return;
                }

                let time_update = this.local.currentTime != data.currentTime;
                this.local.currentTime = data.currentTime;
                if (time_update && this.hasOwnProperty("ontimeupdate")) {
                    this["ontimeupdate"]();
                }

                let progress_update = this.local.playableDuration != data.playableDuration;
                this.local.playableDuration = data.playableDuration;
                if (progress_update && this.hasOwnProperty("onprogress")) {
                    this["onprogress"]();
                }

                let canplay_through = this.local.playableDuration == this.local.duration;
                if (canplay_through && progress_update && this.hasOwnProperty("oncanplaythrough")) {
                    this["oncanplaythrough"](); // only called one time
                }
                break;
            case "onEnd":
                this.local.isRenderable = false;
                this.setState("paused", true, "boolean");
                if(this.hasOwnProperty("onend")){
                    this["onend"]();
                }
                break;
            case "onLoadStart":
                console.log("onLoadStart:"+data);
                if(this.hasOwnProperty("onloadstart")){
                    this["onloadstart"]();
                }
                break;
            case "onLoad":
                console.log("onLoad:"+data);
                this.local.currentTime = data.currentTime;
                this.local.duration = data.duration;

                if (this.hasOwnProperty("onloadedmetadata")) {
                    this["onloadedmetadata"]();
                }

                if (this.hasOwnProperty("onload")) {
                    this["onload"]();
                }

                if (this.hasOwnProperty("ondurationchange")) {
                    this["ondurationchange"]();
                }
                break;
            case "onError":
                console.log("onError:"+data);
                this.local.isRenderable = false;
                if(this.hasOwnProperty("onerror")){
                    const Error = {
                        MEDIA_ERR_ABORTED: 1,
                        MEDIA_ERR_NETWORK: 2,
                        MEDIA_ERR_DECODE: 3,
                        MEDIA_ERR_SRC_NOT_SUPPORTED: 4,
                    };
                    const platform_error = data.error.extra;
                    let e = Error.MEDIA_ERR_ABORTED;
                    switch (platform_error) {
                        case -1004 : // MediaPlayer.MEDIA_ERROR_IO
                            e = Error.MEDIA_ERR_NETWORK;
                            break;
                        case -1007 : // MediaPlayer.MEDIA_ERROR_MALFORMED
                            e = Error.MEDIA_ERR_DECODE;
                            break;
                        case -1010 : // MediaPlayer.MEDIA_ERROR_UNSUPPORTED
                            e = Error.MEDIA_ERR_SRC_NOT_SUPPORTED;
                            break;
                    }
                    this["onerror"](e);
                }
                break;
            case "onSeek":
                console.log("onSeek:"+data);
                this.local.isRenderable = false;
                if(this.hasOwnProperty("onseeking")){
                    this["onseeking"](data);
                }
                break;
            case "onEventExt":
                console.log("onEventExt:"+data);
                switch (data.eventExt) {
                    case "videoMetadataUpdate" :
                        if (this.hasOwnProperty("onloadedmetadata")) {
                            this["onloadedmetadata"]();
                        }
                        break;
                    case "videoSeekComplete" :
                        //this.local.isRenderable = true; // waiting until BUFFERING END
                        if (this.hasOwnProperty("onseeked")) {
                            this["onseeked"]();
                        }
                        break;
                    default:
                        console.warn("unimplentation event ext type = " + data.eventExt);
                        break;
                }
                break;
            case "onAudioFocusGain":
                console.log("onAudioFocusGain:"+data);
                if(this.hasOwnProperty("onaudiofocusgain")){
                    this["onaudiofocusgain"](data);
                }
                break;
            case "onAudioFocusLoss":
                console.log("onAudioFocusLoss:"+data);
                if(this.hasOwnProperty("onaudiofocusloss")){
                    this["onaudiofocusloss"](data);
                }
                break;
            case "onPlaybackStalled":
                this.local.isRenderable = false;
                if(this.hasOwnProperty("onstalled")){
                    this["onstalled"]();
                }
                break;
            case "onPlaybackResume":
                this.local.isRenderable = true;
                if(this.hasOwnProperty("onplaying")){
                    this["onplaying"]();
                }
                break;
            case "onReadyForDisplay":
                this.local.isRenderable = true;
                if(this.hasOwnProperty("oncanplay")){
                    this["oncanplay"]();
                }
                break;
            default:
                break; 
       }
    }

    set autoplay(value) {
        this.setState("autoplay", value, "boolean");
    }

    get currentTime() {
        let result = this.getProperty("currentTime");
        if(result != null)
            return result;
        return 0;
    }

    set currentTime(value) {
        this.local.isRenderable = false;
        this.local.currentTime = value;
		this.setState("seek", value, "number");
    }

    get duration() {
        let result = this.getProperty("duration");
        if(result != null)
            return result;

        return 0;
    }

    set loop(value) {
        if(typeof value == "boolean") {
	        this.setState("repeat", value, "boolean");
	    } else if(typeof value == "undefined") {
            this.setState("repeat", false, "boolean");
        } else {
	        this.setState("repeat", true, "boolean"); // html5标准用法, 任何value不为boolean|undefined都会转变为true
	    }
    }

    get muted() {
        return this.getState("muted");
    }

    set muted(value) {
        this.setState("muted", value, "boolean");
    }

    get paused() {
        let result = this.getProperty("paused");
        if(result != null)
            return result;

        return true;
    }

    get playbackRate() {
        return this.getState("rate");
    }

    set playbackRate(value) {
        this.setState("rate", value, "number");
    }

    get preload() {
		let enablePlayer = this.getState("enablePlayer");
		return (this.enablePlayer ? 'auto' : 'none');
    }
    
    set preload(value) {
		if (value != 'none') { // preload = 'none' is default
			this.load();
		}
	}

    set src(value) {
        this.setState("src", value, "string");
    }

    get volume() {
        let result = this.getProperty("volume");
        if(result != null)
            return result;

        return 0;
    }

    set volume(value) {
        this.setState("volume", value, "number");
    }

    // Extension beyond HTML5
	get startTime() {
		return this.getState("startTime");
	}

	set startTime(value) {
		this.setState("startTime", value, "number");
    }
    
    get playableDuration() {
		return this.local.playableDuration;
    }
    
    set timeupdateless(value) {
        this.setState("timeUpdateLess", !!value, "boolean");
    }

    addEventListener(type, listener) {
        this['on' + type] = listener;
    };

    load() {
		this.setState("enablePlayer", true, "boolean");
    }
    
    pause() {
        this.setState("paused", true, "boolean");
        if (this.hasOwnProperty("onpause")) {
			this["onpause"]();
		}
    }

    play() {
        this.setState("paused", false, "boolean");
        if (this.hasOwnProperty("onplay")) {
			this["onplay"]();
		}
    }

    unload() {
        this.setState("paused", true, "boolean");
        this.local.isRenderable = false;
		this.setState("enablePlayer", false, "boolean");
	}

    setState(key, value, type) {
        if (typeof(value) !== type) {
            console.warn("invalid paramter type to set " + key + ". value is not " + type);
            return;
        }

        this.state[key] = value;
        console.log("set " + key + " = " + value);

        let param = {};
        param[key] = value;

        if(this.playerCreate){
            window.jsvPlayerBridge.SetProperty(this.key, JSON.stringify(param));
        }
    }

    getState(key) {
        let value = this.state[key];
        console.log("get " + key + " = " + value);
        if (typeof value == "undefined" && this.playerCreate) {
            value = window.jsvPlayerBridge.GetProperty(this.key, key);
            this.state[key] = value;
        }

        return value;
    }

    getProperty(key){
        if (this.playerCreate && typeof window.jsvPlayerBridge != "undefined") {
            let result_str = window.jsvPlayerBridge.GetProperty(this.key, key);
            if(result_str == null || result_str == "")
                return null;
            
            let result = JSON.parse(result_str);
            if(result.hasOwnProperty(key))
                return result[key];

            return null;
        }

        return null;
    }

    // setStyle(){
    //     if(this.styleHandler != null){
    //         clearTimeout(this.styleHandler);
    //         this.styleHandler = null;
    //     }

    //     this.styleHandler = setTimeout(()=>{
    //         this.setState("style", JSON.stringify(this.style), "string");
    //     }, 0);
    // }
}

class JsvMedia extends JsvBaseMedia {
    constructor(type, hole_id, player_type, key, background, design_map_width, is_surface_view) {
        super(type, hole_id, player_type, key, background, design_map_width, is_surface_view);
        //super.buildPlatformInstance(type);
    }
}

class JsvMediaAudio extends JsvMedia {
    constructor() {
        super("audio", null, null, null, null, null);
    }
}

class JsvMediaVideo extends JsvMedia {
    constructor(hole_id, player_type, key, background, design_map_width, is_surface_view) {
        super("video", hole_id, player_type, key, background, design_map_width, is_surface_view);
        
        this.state.aspectRatio = 'origin'; // 'origin', 'full', '16:9', '4:3',
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
        return this.getState("videoHeight");
    }

    get videoWidth() {
        return this.getState("videoWidth");
    }

    // get left() {
    //     return this.style.left;
    // }

    // set left(value) {
    //     this.style.left = value;
    //     this.setStyle();
    // }

    // get top() {
    //     return this.style.top;
    // }

    // set top(value) {
    //     this.style.top = value;
    //     this.setStyle();
    // }

    // get width() {
    //     return this.style.width;
    // }

    // set width(value) {
    //     this.style.width = value;
    //     this.setStyle();
    // }

    // get height() {
    //     return this.style.height;
    // }

    // set height(value) {
    //     this.style.height = value;
    //     this.setStyle();
    // }
}

export {
    JsvMediaVideo,
    JsvMediaAudio
}