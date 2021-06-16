/**
 * Created by ludl on 5/14/21.
 */

import React from "react";
import { JsvWidgetWrapperGroup } from "./WidgetWrapper";

console.log("Loading BrowserDebug JsvApic");

JsvWidgetWrapperGroup.getApic = (base_class) => {
  return class extends base_class {
    constructor(props) {
      super(props);
      this._Viewer = null;
    }

    // Override
    render() {
      return (
        <>
          <jsvcanvas id={this._CanvasId} style={this.props.style} />
        </>
      );
    }

    // Override
    stop() {
      if (this._Viewer) {
        this._Viewer.stop();
      }
    }

    // Override
    play() {
      if (this._Viewer) {
        this._Viewer.play();
      }
    }

    // Override
    componentDidMount() {
      let canvas = window.originDocument.getElementById(this._CanvasId);
      if (canvas) {
        if (this.props.src.indexOf("webp") > 0) {
          this.loadWebp(this.getUrl(this.props.src), canvas);
        } else if (this.props.src.indexOf("gif") > 0) {
          this.loadGif(this.getUrl(this.props.src), canvas);
        }
      }
    }

    loadWebp(url, canvas) {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "arraybuffer";
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let apic_data = new WebpData(xhr.response);
          let listener = {
            onstart: this.props.onStart,
            onend: this.props.onEnd,
          };
          this._Viewer = new Viewer(
            apic_data,
            canvas,
            listener,
            this.props.autoPlay,
            this.props.loopType,
            this.props.loopInfo
          );
        }
      };
      xhr.send();
    }

    loadGif(url, canvas) {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "arraybuffer";
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let arrayBuffer = xhr.response;
          if (arrayBuffer) {
            let apic_data = new GifData(xhr.response);
            let listener = {
              onstart: this.props.onStart,
              onend: this.props.onEnd,
            };
            this._Viewer = new Viewer(
              apic_data,
              canvas,
              listener,
              this.props.autoPlay,
              this.props.loopType,
              this.props.loopInfo
            );
          }
        }
      };
      xhr.send();
    }
  };
};

class ApicData {
  constructor(array_buffer) {
    this.LoopCount = 0;
    this.FrameCount = 0;
    this.Width = 0;
    this.Height = 0;
    this._Canvas = window.originDocument.createElement("canvas");
    this._Context = this._Canvas.getContext("2d");
    this._DecodedData = null;
    this.decode(array_buffer);
  }

  decode(array_buffer) { }

  toImage(frame_index, canvas, canvas_ctx) { }
}

class WebpData extends ApicData {
  decode(array_buffer) {
    let webp_data = new Uint8Array(array_buffer);
    let webp_decoder = new window.WebPDecoder();
    let image_data = window.WebPRiffParser(webp_data, 0);

    let blend = false;
    let header = image_data["header"] ? image_data["header"] : null;
    let frames = image_data["frames"] ? image_data["frames"] : null;
    if (header) {
      this.LoopCount = header["loop_count"];
      header["loop_counter"] = header["loop_count"];
      this._Canvas.height = header["canvas_height"];
      this._Canvas.width = header["canvas_width"];
      this.Width = header["canvas_width"];
      this.Height = header["canvas_height"];
      for (let f = 0; f < frames.length; f++) {
        if (frames[f]["blend"] === 0) {
          blend = true;
          break;
        }
      }
    }
    this.FrameCount = frames.length;
    for (let f = 0; f < frames.length; f++) {
      let height = [0];
      let width = [0];
      let frame = frames[f];
      let rgba = webp_decoder.WebPDecodeRGBA(
        webp_data,
        frame["src_off"],
        frame["src_size"],
        width,
        height
      );
      frame["rgba"] = rgba;
      frame["imgwidth"] = width[0];
      frame["imgheight"] = height[0];

      let oldimagedata = [];
      if (!header) {
        this._Canvas.height = height[0];
        this._Canvas.width = width[0];
      } else {
        if (blend) {
          let oldimagedata_ = this._Context.getImageData(
            frame["offset_x"],
            frame["offset_y"],
            width[0],
            height[0]
          );
          for (let i = 0; i < width[0] * height[0] * 4; i++) {
            oldimagedata[i] = oldimagedata_.data[i];
          }
        }
      }
      let imagedata = this._Context.createImageData(width[0], height[0]);

      if (
        (frames.length === 1 && typeof frame["blend"] === "undefined") ||
        frame["blend"] === 1
      ) {
        for (let i = 0; i < width[0] * height[0] * 4; i++)
          imagedata.data[i] = rgba[i];
      } else {
        for (let i = 0; i < width[0] * height[0] * 4; i += 4) {
          if (rgba[i + 3] > 0) {
            imagedata.data[i + 3] = rgba[i + 3];
            imagedata.data[i] = rgba[i];
            imagedata.data[i + 1] = rgba[i + 1];
            imagedata.data[i + 2] = rgba[i + 2];
          } else {
            imagedata.data[i + 3] = oldimagedata[i + 3];
            imagedata.data[i] = oldimagedata[i];
            imagedata.data[i + 1] = oldimagedata[i + 1];
            imagedata.data[i + 2] = oldimagedata[i + 2];
          }
        }
      }
      if (frames.length === 1) {
        this._Context.putImageData(imagedata, 0, 0);
      } else {
        this._Context.putImageData(
          imagedata,
          frame["offset_x"],
          frame["offset_y"]
        );
      }

      frame["frameData"] = frame["rgba"]
        ? header
          ? this._Context.getImageData(
            0,
            0,
            header["canvas_width"],
            header["canvas_height"]
          ).data
          : rgba
        : null;
      if (frame["dispose"] === 1) {
        this._Context.clearRect(
          frame["offset_x"],
          frame["offset_y"],
          width[0],
          height[0]
        );
      }
    }
    this._DecodedData = image_data;
  }

  toImage(frame_index, canvas, canvas_ctx) {
    let frame = this._DecodedData["frames"][frame_index];
    let width = this._DecodedData["header"]
      ? this._DecodedData["header"]["canvas_width"]
      : frame["imgwidth"];
    let height = this._DecodedData["header"]
      ? this._DecodedData["header"]["canvas_height"]
      : frame["imgheight"];
    canvas.width = width;
    canvas.height = height;
    let image_data = canvas_ctx.createImageData(width, height);
    let frame_data = frame["frameData"];
    image_data.data.set(frame_data);
    // for(let i = 0;i < width * height * 4; i++)
    // 	image_data.data[i] = frame_data[i];
    canvas_ctx.putImageData(image_data, 0, 0);
    return frame["duration"];
  }
}

class GifData extends ApicData {
  decode(array_buffer) {
    const gif = window.ApicTools.parseGIF(array_buffer);
    this._DecodedData = window.ApicTools.decompressFrames(gif, true);
    this.LoopCount = 0;
    this.FrameCount = this._DecodedData.length;
    this.Width = this._DecodedData[0].dims.width;
    this.Height = this._DecodedData[0].dims.height;

    // 打patch
    for (let i = 0; i < this._DecodedData.length; i++) {
      let frame = this._DecodedData[i];
      if (
        frame["dims"]["width"] !== this.Width ||
        frame["dims"]["height"] !== this.Height
      ) {
        // 打patch
        let pre_frame_data = this._DecodedData[i - 1]["frameData"];
        let left = frame["dims"]["left"];
        let top = frame["dims"]["top"];
        let width = frame["dims"]["width"];
        let height = frame["dims"]["height"];
        let patch_data = frame["patch"];
        let image_data = new Uint8ClampedArray(this.Width * this.Height * 4);
        for (let x = 0; x < this.Width; x++) {
          for (let y = 0; y < this.Height; y++) {
            let patch_x = x - left;
            let patch_y = y - top;
            let pixel_index = y * this.Width + x;
            let patch_pixel_index = patch_y * width + patch_x;
            if (
              x >= left &&
              x < left + width &&
              y >= top &&
              y < top + height &&
              patch_data[patch_pixel_index * 4 + 3] > 0
            ) {
              image_data[pixel_index * 4] = patch_data[patch_pixel_index * 4];
              image_data[pixel_index * 4 + 1] =
                patch_data[patch_pixel_index * 4 + 1];
              image_data[pixel_index * 4 + 2] =
                patch_data[patch_pixel_index * 4 + 2];
              image_data[pixel_index * 4 + 3] =
                patch_data[patch_pixel_index * 4 + 3];
            } else {
              image_data[pixel_index * 4] = pre_frame_data[pixel_index * 4];
              image_data[pixel_index * 4 + 1] =
                pre_frame_data[pixel_index * 4 + 1];
              image_data[pixel_index * 4 + 2] =
                pre_frame_data[pixel_index * 4 + 2];
              image_data[pixel_index * 4 + 3] =
                pre_frame_data[pixel_index * 4 + 3];
            }
          }
        }
        frame["frameData"] = image_data;
      } else {
        frame["frameData"] = frame["patch"];
      }
    }
  }

  toImage(frame_index, canvas, canvas_ctx) {
    canvas.width = this.Width;
    canvas.height = this.Height;
    let frame = this._DecodedData[frame_index];
    let image_data = canvas_ctx.createImageData(this.Width, this.Height);
    image_data.data.set(frame["frameData"]);
    canvas_ctx.putImageData(image_data, 0, 0);
    return frame["delay"];
  }
}

let LOOP_DEFAULT = 0;
let LOOP_INFINITE = 1;
let LOOP_FINITE = 2;
let LOOP_PART = 3;

class LoopTool {
  getNextIndex() { return -1; }
  reset() { }
}

class NormalLoopTool extends LoopTool {
  constructor(loop_type, loop_num, frame_num) {
    super();
    this.mLoopType = loop_type;
    this.mLoopNum = loop_num;
    this.mFrameNum = frame_num;
    this.mLoopCount = 0;
    this.mFrameIndex = 0;
  }

  getNextIndex() {
    let next_index = -1;
    switch (this.mLoopType) {
      case LOOP_DEFAULT:
        if (this.mLoopNum <= 0) {
          //默认无限循环
          next_index = (this.mFrameIndex + 1) % this.mFrameNum;
        } else {
          if (this.mFrameIndex == this.mFrameNum - 1) {
            this.mLoopCount++;
          }
          next_index = this.mLoopCount >= this.mLoopNum ? -1 : (this.mFrameIndex + 1) % this.mFrameNum;
        }
        break;
      case LOOP_INFINITE:
        next_index = (this.mFrameIndex + 1) % this.mFrameNum;
        break;
      case LOOP_FINITE:
        if (this.mFrameIndex == this.mFrameNum - 1) {
          this.mLoopCount++;
        }
        next_index = this.mLoopCount >= this.mLoopNum ? -1 : (this.mFrameIndex + 1) % this.mFrameNum;
        break;
      default:
    }
    this.mFrameIndex = next_index;
    return next_index;
  }

  reset() {
    this.mFrameIndex = 0;
    this.mLoopCount = 0;
  }
}

class PartLoopTool extends LoopTool {
  constructor(info_list, frame_num) {
    super();
    if (info_list == null) {
      console.error("PartLoopTool info is null.");
      this.mDataError = true;
      return;
    }
    this.mLoopPeriod = 0;
    this.mFrameIndex = 0;

    this.mCurLoopStartFrame = 0;
    this.mCurLoopEndFrame = 0;
    this.mCurLoopNum = 0;
    this.mCurLoopCount = 0;

    this.mDataError = false;
    this.mFrameNum = frame_num;
    this.mLoopInfo = info_list;
    if (this.mLoopInfo.length > 0) {
      let has_next = this.updateLoop();
      if (!has_next) {
        console.error("PartLoopTool init loop info error.", info_list);
        this.mDataError = true;
      }
    } else {
      console.error("PartLoopTool init loop info error.", info_list);
      this.mDataError = true;
    }
  }

  getNextIndex() {
    if (this.mDataError) { return -1; }
    let next_index = -1;
    let loop_period_num = this.mLoopInfo.length;
    if (this.mLoopPeriod < loop_period_num) {
      if (this.mFrameIndex < this.mCurLoopEndFrame) {
        next_index = this.mFrameIndex + 1;
      } else {
        if (this.mCurLoopNum <= 0) {
          //无限循环
          next_index = this.mCurLoopStartFrame;
        } else {
          this.mCurLoopCount++;
          if (this.mCurLoopCount >= this.mCurLoopNum) {
            //出当前循环更新循环信息
            this.mLoopPeriod++;
            if (this.mLoopPeriod < loop_period_num) {
              let has_next = this.updateLoop();
              if (has_next) {
                this.mCurLoopCount = 0;
                next_index = this.mFrameIndex + 1;
              }
            } else {
              //所有循环已完成
              if (this.mFrameIndex < this.mFrameNum - 1) {
                next_index = this.mFrameIndex + 1;
              }
            }
          } else {
            next_index = this.mCurLoopStartFrame;
          }
        }
      }
    } else {
      //所有循环已完成
      if (this.mFrameIndex < this.mFrameNum - 1) {
        next_index = this.mFrameIndex + 1;
      }
    }

    if (next_index >= 0) {
      this.mFrameIndex = next_index;
    }
    return next_index;
  }

  updateLoop() {
    let loop = this.mLoopInfo[this.mLoopPeriod];
    this.mCurLoopNum = loop[0];
    this.mCurLoopStartFrame = loop[1];
    this.mCurLoopEndFrame = loop[2];
    if (this.mCurLoopStartFrame >= this.mFrameNum || this.mCurLoopEndFrame >= this.mFrameNum) {
      this.mDataError = true;
      console.error("data error, frame number out of size.", this.mLoopInfo);
      this.reset();
      return false;
    } else {
      return true;
    }
  }

  reset() {
    this.mLoopPeriod = 0;
    this.mFrameIndex = 0;
    this.mCurLoopCount = 0;

    this.mCurLoopStartFrame = 0;
    this.mCurLoopEndFrame = 0;
    this.mCurLoopNum = 0;
  }
}

class Viewer {
  constructor(apic_data, canvas, listener, auto_play, loop_type, loop_info_list) {
    this._ApicData = apic_data;
    this._Canvas = canvas;
    this._Context = this._Canvas.getContext("2d");
    this._Listener = listener;
    this._TimeoutId = -1;

    this._LoopType = loop_type;
    this._LoopInfo = loop_info_list;
    this._createLoopTool();
    let duration = this.renderFrame(0);
    if (auto_play) {
      this._TimeoutId = setTimeout(() => {
        this.renderLoop();
      }, duration);
      if (this._Listener?.onstart) {
        this._Listener.onstart();
      }
    }
  }

  _createLoopTool() {
    switch (this._LoopType) {
      case LOOP_DEFAULT:
      case LOOP_INFINITE:
      case LOOP_FINITE:
        let loop_num = this._LoopType == LOOP_DEFAULT ? this._ApicData.LoopCount : this._LoopInfo[0][0]
        this._LoopTool = new NormalLoopTool(this._LoopType, loop_num, this._ApicData.FrameCount);
        break;
      case LOOP_PART:
        this._LoopTool = new PartLoopTool(this._LoopInfo, this._ApicData.FrameCount);
        break;
    }
  }

  stop() {
    clearTimeout(this._TimeoutId);
    if (this._Listener?.onend) {
      this._Listener.onend();
    }
  }

  play() {
    clearTimeout(this._TimeoutId);
    let duration = this.renderFrame(0);
    this._LoopTool.reset();
    this._TimeoutId = setTimeout(() => {
      this.renderLoop();
    }, duration);
    if (this._Listener?.onstart) {
      this._Listener.onstart();
    }
  }

  renderLoop() {
    let next_index = this._LoopTool.getNextIndex();
    if (next_index < 0) {
      console.log("loop finished")
      if (this._Listener?.onend) {
        this._Listener.onend();
      }
    } else {
      let duration = this.renderFrame(next_index);
      this._TimeoutId = setTimeout(() => {
        this.renderLoop();
      }, duration);
    }
  }

  renderFrame(frame_index) {
    return this._ApicData.toImage(frame_index, this._Canvas, this._Context);
  }
}
