class _EventCenter {
  constructor() {
    this._Listener = {};
  }

  emitEvent(event_name, value) {
    const callback = this._Listener[event_name];
    if (callback) {
      callback(value);
    }
  }

  setLisener(event_name, callback) {
    this._Listener[event_name] = callback;
  }

  removeListener(event_name) {
    delete this._Listener[event_name];
  }
}

const EventCenter = new _EventCenter();

export {
  EventCenter
};
