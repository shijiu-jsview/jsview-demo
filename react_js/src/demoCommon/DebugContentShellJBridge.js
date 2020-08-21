
class BridgeProxy {
	constructor() {

	}

	indicateHomePageLoadDone() {
		let bridge = this._GetBridge();
		if (bridge && bridge.indicateHomePageLoadDone) {
			bridge.indicateHomePageLoadDone();
		}
	}

	_GetBridge() {
		return window.jContentShellJBridge;
	}
}

let instance = new BridgeProxy();

export {instance as JSBridge}