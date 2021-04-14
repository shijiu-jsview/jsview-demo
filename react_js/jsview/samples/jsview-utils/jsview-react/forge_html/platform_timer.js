import Forge from "../ForgeDefine";

class PersistTimer {
  constructor() {
    this._AlreadyExited = false;
    if (window.PersistTimer) {
      this._AlreadyExited = true;
    }
  }

  setTimeout(code, delay) {
    if (this._AlreadyExited && window.PersistTimer.setTimeout) {
      return window.PersistTimer.setTimeout(code, delay);
    }
    return window.setTimeout(code, delay);
  }

  clearTimeout(intervalId) {
    if (this._AlreadyExited && window.PersistTimer.clearTimeout) {
      window.PersistTimer.clearTimeout(intervalId);
    } else {
      window.clearTimeout(intervalId);
    }
  }

  setInterval(code, delay) {
    if (this._AlreadyExited && window.PersistTimer.setInterval) {
      window.PersistTimer.setInterval(code, delay);
    } else {
      return window.setInterval(code, delay);
    }
  }

  clearInterval(intervalId) {
    if (this._AlreadyExited && window.PersistTimer.clearInterval) {
      window.PersistTimer.clearInterval(intervalId);
    } else {
      window.clearInterval(intervalId);
    }
  }
}
Forge.PersistTimer = new PersistTimer();

class ForegroundTimer {
  setTimeout(code, delay) {
    return window.setTimeout(code, delay);
  }

  clearTimeout(intervalId) {
    window.clearTimeout(intervalId);
  }

  setInterval(code, delay) {
    return window.setInterval(code, delay);
  }

  clearInterval(intervalId) {
    window.clearInterval(intervalId);
  }
}
Forge.ForegroundTimer = new ForegroundTimer();
