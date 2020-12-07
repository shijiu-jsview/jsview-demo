class BridgeProxy {
  indicateHomePageLoadDone() {
    const bridge = this._GetBridge();
    if (bridge && bridge.indicateHomePageLoadDone) {
      bridge.indicateHomePageLoadDone();
    }
  }

  _GetBridge() {
    return window.jContentShellJBridge;
  }
}

const instance = new BridgeProxy();

export { instance as JSBridge };
