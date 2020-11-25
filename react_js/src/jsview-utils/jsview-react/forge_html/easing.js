import Forge from "../ForgeDefine";

Forge.EasingTypeIn = 0;
Forge.EasingTypeOut = 1;
Forge.EasingTypeInOut = 2;
Forge.EasingTypeBezier = 3;
Forge.EasingTypeBlink = 4;
Forge.EasingTypeDeceleration = 5;
Forge.EasingTypeSteps = 6;
class EasingBase {
  constructor() {
    this.Pacakge = this.Package; // 兼容老版本的拼写错误
  }

  Package() {
  }

  _GetBasePackage(type) {
    return {
      T: type,
      St: null
    };
  }
}
Forge.EasingBase = EasingBase;

class EasingIn extends Forge.EasingBase {
  Package() {
    return this._GetBasePackage(Forge.EasingTypeIn);
  }
}
Forge.EasingIn = EasingIn;

class EasingOut extends Forge.EasingBase {
  Package() {
    return this._GetBasePackage(Forge.EasingTypeOut);
  }
}
Forge.EasingOut = EasingOut;

class EasingInOut extends Forge.EasingBase {
  Package() {
    return this._GetBasePackage(Forge.EasingTypeInOut);
  }
}
Forge.EasingInOut = EasingInOut;

class EasingDeceleration extends Forge.EasingBase {
  Package() {
    return this._GetBasePackage(Forge.EasingTypeDeceleration);
  }
}
Forge.EasingDeceleration = EasingDeceleration;

class EasingBlink extends Forge.EasingBase {
  Package() {
    return this._GetBasePackage(Forge.EasingTypeBlink);
  }
}
Forge.EasingBlink = EasingBlink;

class BezierEasing extends Forge.EasingBase {
  constructor(x1, y1, x2, y2, duration) {
    super();
    this._Inited = false;
    this._X1 = x1;
    this._X2 = x2;
    this._Y1 = y1;
    this._Y2 = y2;
    this._Duration = duration;
  }

  Package() {
    const data = this._GetBasePackage(Forge.EasingTypeBezier);
    data.St = {
      X1: this._X1,
      X2: this._X2,
      Y1: this._Y1,
      Y2: this._Y2,
      Dur: this._Duration
    };
    return data;
  }
}
Forge.BezierEasing = BezierEasing;

class StepsEasing extends Forge.EasingBase {
  constructor(steps, type) {
    super();
    this._Steps = steps;
    this._Type = type;
  }

  Package() {
    const data = this._GetBasePackage(Forge.EasingTypeSteps);
    data.St = {
      S: this._Steps,
      T: this._Type
    };
    return data;
  }
}
Forge.StepsEasing = StepsEasing;

Forge.Easing =
	{
	  Circular: {
	    In: new Forge.EasingIn(),
	    Out: new Forge.EasingOut(),
	    InOut: new Forge.EasingInOut(),
	    Deceleration: new Forge.EasingDeceleration(),
	  }
	};
window.Easing = Forge.Easing; // Export object
