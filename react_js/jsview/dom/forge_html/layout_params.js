import Forge from "../ForgeDefine";

class LayoutParamsBase {
  constructor() {
    this.Width = 0;
    this.Height = 0;
    this.MarginTop = 0;
    this.MarginLeft = 0;
    this.MarginRight = 0;
    this.MarginBottom = 0;
    this.Z = 0;
    this.SizeAdjust = false;
  }

  SetPosition(x, y, z) {
    this.MarginTop = y;
    this.MarginLeft = x;
    if (z) {
      this.Z = z;
    }
  }

  SetSize(w, h) {
    this.Width = w;
    this.Height = h;
  }

  Clone() {
    const new_layout_params = new LayoutParamsBase(null);
    new_layout_params.Width = this.Width;
    new_layout_params.Height = this.Height;
    new_layout_params.MarginTop = this.MarginTop;
    new_layout_params.MarginLeft = this.MarginLeft;
    new_layout_params.MarginRight = this.MarginRight;
    new_layout_params.MarginBottom = this.MarginBottom;
    new_layout_params.Z = this.Z;
    new_layout_params.SizeAdjust = this.SizeAdjust;
    return new_layout_params;
  }

  Equals(other_layout_params) {
    return (other_layout_params.Width === this.Width
        && other_layout_params.Height === this.Height
        && other_layout_params.MarginTop === this.MarginTop
        && other_layout_params.MarginLeft === this.MarginLeft
        && other_layout_params.MarginRight === this.MarginRight
        && other_layout_params.MarginBottom === this.MarginBottom
        && other_layout_params.Z === this.Z);
  }
}
Forge.LayoutParamsBase = LayoutParamsBase;

class LayoutParams extends Forge.LayoutParamsBase {
  constructor(settings) {
    super();

    if (settings instanceof Forge.RectArea) { settings = { x: settings.x, y: settings.y, width: settings.width, height: settings.height }; }

    if (settings) {
      // Reset marginLeft
      if (settings.x) {
        this.MarginLeft = settings.x;
      } else if (settings.marginLeft) {
        this.MarginLeft = settings.marginLeft;
      }

      // Reset marginTop
      if (settings.y) {
        this.MarginTop = settings.y;
      } else if (settings.marginTop) {
        this.MarginTop = settings.marginTop;
      }
      if (settings.z) {
        this.Z = settings.z;
      }

      // Reset width
      if (settings.width) {
        this.Width = settings.width;
      }

      // Reset height
      if (settings.height) {
        this.Height = settings.height;
      }
      // 参数检查
      if (Number.isNaN(this.MarginTop)) {
        Forge.LogE("isNaN(this.MarginTop)!");
        this.MarginTop = 0;
      }
      if (Number.isNaN(this.MarginLeft)) {
        Forge.LogE("isNaN(this.MarginLeft)!");
        this.MarginLeft = 0;
      }
      if (this.Width !== "MatchParent") {
        if (Number.isNaN(this.Width)) {
          Forge.LogE("isNaN(this.Width)!");
        }
      } else {
        this.SizeAdjust = true;
      }
      if (this.Height !== "MatchParent") {
        if (Number.isNaN(this.Height)) {
          Forge.LogE("isNaN(this.Height)!");
        }
      } else {
        this.SizeAdjust = true;
      }
    }
  }
}
Forge.LayoutParams = LayoutParams;
window.LayoutParams = Forge.LayoutParams; // export class
