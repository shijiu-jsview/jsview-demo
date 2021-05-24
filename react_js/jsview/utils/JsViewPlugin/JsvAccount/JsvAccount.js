
let AccountPluginInfo={
    //downloadUrl:"http://192.168.0.104:8080/plugin/JsvAccount.zip", //插件下载地址
	packageName:"com.qcode.account",
	name:"账号系统",
    version:"1.0.1",  //插件需要的最低版本号
	versionCodeMin:1,
	versionCodeMax:1,
    bridgeName:"jsvAccountBridge", //插件bridge注册到jsview的名称
    className:"com.qcode.account.JsvAccount",  //插件初始化类名称
    initMethod:"createInstance",   //插件初始化方法
    listener:"top.JsvAccountPluginLoadResult",  //插件加载结果回调
    //md5:"984c59e1100693e2eee34615ea6c70b7"
};

class account {
	constructor(callback){
		this.loginLogoutCallback = [];

		window.top.JsvAccountPluginLoadResult = function (result) {
            console.log(result);
			if(result != null){
				let obj = JSON.parse(result);
				if(obj){
					if(obj.status === 1){
						callback("success");
					}else{
						callback("fail");
					}
				}
			}
            this.onEvent();
        }.bind(this);

        if(typeof window.jsvAccountBridge=='undefined' || !window.jsvAccountBridge){
            this.loadJsvAccountPlugin();
        }else{
			callback("success");
			this.onEvent();
		}
	}

	configAccountPluginInfo(){
		let json_str = null;
		if (window.jJsvRuntimeBridge && typeof window.jJsvRuntimeBridge.getAppInfo === "function") {
            json_str = window.jJsvRuntimeBridge.getAppInfo();
        } else if (window.jContentShellJBridge && typeof window.jContentShellJBridge.getAppInfo === "function") {
            json_str = window.jContentShellJBridge.getAppInfo();
        }

		if(json_str != null){
			let json_obj = JSON.parse(json_str);
			let market_code = json_obj.MarketCode;

			if(market_code === "103"){
				AccountPluginInfo={
					//downloadUrl:"http://192.168.0.104:8080/plugin/JsvAccount.zip", //插件下载地址
					packageName:"com.qcode.account",
					name:"账号系统",
					version:"1.1.1",  //插件需要的最低版本号
					versionCodeMin:111,
					versionCodeMax:111,
					bridgeName:"jsvAccountBridge", //插件bridge注册到jsview的名称
					className:"com.qcode.account.JsvAccount",  //插件初始化类名称
					initMethod:"createInstance",   //插件初始化方法
					listener:"top.JsvAccountPluginLoadResult",  //插件加载结果回调
					//md5:"984c59e1100693e2eee34615ea6c70b7"
				};
			}
		}
	}

	loadJsvAccountPlugin(){
		console.log("loadJsvAccountPlugin 1");
        if(typeof window.jPluginManagerBridge=='undefined' || !window.jPluginManagerBridge){
            return;
        }

		console.log("loadJsvAccountPlugin 2");
        window.jPluginManagerBridge.LoadPlugin(JSON.stringify(AccountPluginInfo));
    }

	onEvent(){
		if(!!window.JsView) {
			window.JMD.subscribe('JsvAccount', function (event_data) {
				console.log("event data:" + event_data);
				let data_obj = JSON.parse(event_data);
				let event_obj = JSON.parse(data_obj.param);
				switch(event_obj.event){
					case "onLoginLogout":
						for (var i = 0; i < this.loginLogoutCallback.length; i++) {
							this.loginLogoutCallback[i](event_obj.data);
						}
						break;
					default:
						break;
				}
				
			}.bind(this));
		}
	}

	registerLoginLogoutCallback(callback){
		for(var i=0; i<this.loginLogoutCallback.length; i++){
			if(this.loginLogoutCallback[i] == callback)
				return;
		}

		this.loginLogoutCallback.push(callback);
	}

	unRegisterLoginLogoutCallback(callback) {
		for(var i=0; i<this.loginLogoutCallback.length; i++){
			if(this.loginLogoutCallback[i] == callback){
				this.loginLogoutCallback.splice(i,1);
				return;
			}
		}
	}

	getAccountInfo(){
		if (typeof window.jsvAccountBridge != 'undefined'
			&& typeof window.jsvAccountBridge.getAccountInfo != "undefined") {
			return window.jsvAccountBridge.getAccountInfo();
		}
	}

	startLoginPage(){
		if (typeof window.jsvAccountBridge != 'undefined'
			&& typeof window.jsvAccountBridge.startLoginPage != "undefined") {
				window.jsvAccountBridge.startLoginPage();
		}
	}

	startUserDetailsPage(){
		if (typeof window.jsvAccountBridge != 'undefined'
			&& typeof window.jsvAccountBridge.startUserDetailsPage != "undefined") {
				window.jsvAccountBridge.startUserDetailsPage();
		}
	}

	startUserCenterPage(){
		if (typeof window.jsvAccountBridge != 'undefined'
			&& typeof window.jsvAccountBridge.startUserCenterPage != "undefined") {
				window.jsvAccountBridge.startUserCenterPage();
		}
	}
}

let accountObj = null;


class JsvAccount {
	/**
	 * 构造函数
	 * @param {function} callback，插件初始化结果，如果返回的结果为"success"，表示成功，否则表示失败。
	 *
	 */
	constructor(callback){
		if(accountObj == null)
			accountObj = new account(callback);
	}

	/**
	 * 注册登陆状态变化通知函数
	 * @param {function} callback，通知函数
	 *
	 */
	registerLoginLogoutCallback(callback){
		accountObj.registerLoginLogoutCallback(callback);
	}

	/**
	 * 注销登陆状态变化通知函数
	 * @param {function} callback，通知函数
	 *
	 */
	unRegisterLoginLogoutCallback(callback) {
		accountObj.unRegisterLoginLogoutCallback(callback);
	}

	/**
	 * 获取账号信息
	 * @returns {string} json数据结构，账号信息
	 *
	 */
	getAccountInfo(){
		return accountObj.getAccountInfo();
	}

	/**
	 * 打开登陆界面
	 *
	 */
	startLoginPage(){
		accountObj.startLoginPage();
	}

	/**
	 * 打开用户信息界面，不可用
	 *
	 */
	startUserDetailsPage(){
		accountObj.startUserDetailsPage();
	}

	/**
	 * 打开用户中心界面，不可用
	 *
	 */
	startUserCenterPage(){
		accountObj.startUserCenterPage();
	}
}

export default JsvAccount; 