

const eventProxy = {
  onObj: {},
  oneObj: {},
  on (key, fn) {
    if (this.onObj[key] === undefined) {
      this.onObj[key] = [];
    }

    this.onObj[key].push(fn);
  },
  one (key, fn) {
    if (this.oneObj[key] === undefined) {
      this.oneObj[key] = [];
    }

    this.oneObj[key].push(fn);
  },
  off (key) {
    this.onObj[key] = [];
    this.oneObj[key] = [];
  },
  trigger (...args) {
    if (args.length === 0) {
      return false;
    }
    const key = args[0];
    const args1 = [].concat(Array.prototype.slice.call(args, 1));

    if (this.onObj[key] !== undefined
            && this.onObj[key].length > 0) {
      for (const i in this.onObj[key]) {
        if (this.onObj[key].hasOwnProperty(i)) {
          this.onObj[key][i].apply(null, args1);
        }
      }
    }
    if (this.oneObj[key] !== undefined
            && this.oneObj[key].length > 0) {
      for (const i in this.oneObj[key]) {
        if (this.oneObj[key].hasOwnProperty(i)) {
          this.oneObj[key][i].apply(null, args1);
          this.oneObj[key][i] = undefined;
        }
      }
      this.oneObj[key] = [];
    }
  }
};

export default eventProxy;
