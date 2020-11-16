1. JsView运行环境公开的接口
============================================
a. JsView.addEventListener(event_name, callback)  
	对Java端发送的事件进行监听JAVA端通过JsView.emitEvent函数发送的消息，
	另外，目前固有事件有
		"onActivityState": JAVA activity状态变化通知
	参数:	
		event_name(string)  		事件名称
		callback(function[Object]) 	事件消息处理
	返回值:
		无
		
b. JsView.getAppUrl()
	获得JAVA端进行加载页面时指定的url，内容同window.location.href
	返回值:
		string	URL字符串
		
c. JsView.addKeysMap(settings)
	定制JAVA端的按键到JS的按键映射，同时可以调整两个固化的映射(包括返回键和菜单键)
	参数:
		settings(Object)	样例: {"keys":{"164":20001},"syncKeys":{}}, 相当于将JAVA键164映射成20001
		
d. JsView.setStorageDomain(domain)
	定制LocalStorage存储的domain，以防止数据和其他内容冲突
	参数:
		domain(string)	domain的字符串
		
e. JsView.enableStorageNames(name1, name2, name3...)
	定制localStorage的预置变量名，预置变量外的localStorage只能通过setItem和getItem进行写入和读取
	参数:
		name(可变长参数)	需要预置的变量名

2. jsview-utils/JsViewReactTools
============================================
	BlockDefine.js			React HOC: FocusBlock，进行焦点管理和控制按键事件按照焦点链进行流转，样例:【basicFdivControl】
	DebugContentShellJBridge.js		(内部调试控件)
	DefaultKeyMap.js		按键键值->名称对应表、enum定义
	JsvDynamicCssStyle.js	内部类，服务于JsvStyleClass
	JsvDynamicKeyFrames.js	动态KeyFrame创建器，样例:【keyframeSerial】
	JsvImpactTracer.js		游戏类应用的碰撞管理模块，样例:【collision】【impactStopDemo】
	JsvRuntimeBridge.js		JsView平台在Native端统一规划出的接口，为全平台类第三方应用服务
	JsvStyleClass.js		ClassName的支持，使用ClassName可以提高渲染性能。样例:【classNameDemo】
	PageSwitcher.js			(实验性接口，未调试完毕)
	RouterHistoryProxy.js	仿照hash history的history实现，和react-router配合。样例:【hashHistoryLike】
	StandaloneApp.js		将一个React.Component包装成含有焦点管理的应用。样例:【emptyProject】
	
3. jsview-utils/JsViewReactWidget
============================================
	JsvActorBase.js			JsvActorMove的基类
	JsvActorMove.js			React HOC，单轴(X 或 Y)运动控制控件,可控制完成单方向的匀速运动和变速运动(抛物运动)，样例:【throwMoveDemo】
	JsvDynamicKeyFrames.js	(老接口兼容)
	JsvInput.js				(实验性接口，未调试完毕)
	JsvMarquee.js			(老接口兼容)
	JsvMarquee2.js			React HOC，文字跑马灯效果控件，样例: 【classNameDemo】
	JsvNinePatch.js			React HOC，正方形.9图片加载控件，样例: 【ninePatchDemo】
	JsvPosterDiv.js			React HOC，海报图效果控件，含有holder和前景图联动效果，前景图加载完毕淡出效果，样例: 暂无
	JsvPosterImage.js		React HOC，同JsvPosterDiv，但海报载体由div改成了img，支持scaleDown和颜色空间设置以节省内存消耗，样例:暂无
	JsvPreload.js			React HOC，图片预下载(针对巨型图片)和预加载处理，解决焦点非焦点切换图片闪动问题。 样例: 【preload】
	JsvQrcode.js			React HOC，展示由url转出来的二维码，样例: 【qrcodeDemo】
	JsvScrollNum.js			React HOC，数值滚动变化特效的控件，样例: 【scrollNum】
	JsvSoundPool.js			功能类，面向游戏开发的多音效混音支持，样例: 【soundPool】
	JsvSpray.js				React HOC，粒子效果控件，样例: 【sprayView】
	JsvSpriteAnim.js		React HOC，精灵图动图展示控件，样例: 【spriteImage】
	JsvSpriteBase.js		(老接口兼容)
	JsvSpriteStatic.js		React HOC，精灵图静态图展示控件，样例: 暂无
	JsvSpriteTranslate.js	(老接口兼容)
	JsvTabWidget.js			React HOC，类似于爱奇艺主页布局方式的多SimpleWidget组合控件，样例: 【tabWidgetSample】
	JsvTextBox.js			React HOC，帮助多行文字做居中对齐等对齐效果的控件，样例: 【textBox】
	JsvVideo.js				React HOC，Video元素封装控件，添加离屏模式这种可以支持圆角和旋转效果，但绘制性能略有焦点的特效，样例: 【videoDemo】

	