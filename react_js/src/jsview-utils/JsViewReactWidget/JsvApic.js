/**
 * Created by changhua.chen@qcast.cn on 11/13/2020.
 */

/*
 * 【模块 export 内容】
 * JsvApic：React高阶组件，控制动图播放
 *      prop说明:
 *          src {string} 对应img标签的src
 *          style {object} 对应img标签的style
 *      方法说明
 *          stop: 停止播放
 *          play: 开始播放
 */

import React from "react";
import { ForgeExtension } from "../jsview-react/index_widget";

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

  decode(array_buffer) {}

  toImage(frame_index, canvas, canvas_ctx) {}
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
      : frame["imgheigth"];
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

class Viewer {
  constructor(apic_data, canvas, listener, auto_play) {
    this._ApicData = apic_data;
    this._Canvas = canvas;
    this._Context = this._Canvas.getContext("2d");
    this._Listener = listener;
    this._TimeoutId = -1;

    this._FrameIndex = 0;
    this._LoopCount = 0;
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

  stop() {
    clearTimeout(this._TimeoutId);
    if (this._Listener?.onend) {
      this._Listener.onend();
    }
  }

  play() {
    clearTimeout(this._TimeoutId);
    this._FrameIndex = 0;
    let duration = this.renderFrame(0);
    this._TimeoutId = setTimeout(() => {
      this.renderLoop();
    }, duration);
    if (this._Listener?.onStart) {
      this._Listener.onStart();
    }
  }

  renderLoop() {
    let next_index = this._FrameIndex + 1;
    let draw_next = false;
    if (next_index >= this._ApicData.FrameCount) {
      if (this._ApicData.LoopCount <= 0) {
        //无限循环
        draw_next = true;
        next_index = 0;
      } else {
        //有限循环
        this._LoopCount++;
        if (this._LoopCount <= this._ApicData.LoopCount) {
          draw_next = true;
          next_index = 0;
        }
      }
    } else {
      draw_next = true;
    }
    if (draw_next) {
      this._FrameIndex = next_index;
      let duration = this.renderFrame(this._FrameIndex);
      this._TimeoutId = setTimeout(() => {
        this.renderLoop();
      }, duration);
    }
  }

  renderFrame(frame_index) {
    return this._ApicData.toImage(frame_index, this._Canvas, this._Context);
  }
}

let Token = 0;
class JsvApic extends React.Component {
  constructor(props) {
    super(props);
    this._Element = null;
    this._CanvasId = "JsvApic" + Token++;
    this._Viewer = null;
  }

  stop() {
    if (window.JsView) {
      if (this._Element) {
        let main_view = this._Element.jsvMainView;
        if (main_view && main_view.ChildViews.length > 0) {
          let target_view = main_view.ChildViews[0];
          if (
            target_view.TextureSetting &&
            target_view.TextureSetting.Texture &&
            target_view.TextureSetting.Texture.RenderTexture
          ) {
            ForgeExtension.TextureManager.DispatchCommand(
              target_view.TextureSetting.Texture.RenderTexture.IdToken,
              1,
              ""
            );
          }
        }
      }
    } else {
      if (this._Viewer) {
        this._Viewer.stop();
      }
    }
  }

  play() {
    if (window.JsView) {
      if (this._Element) {
        let main_view = this._Element.jsvMainView;
        if (main_view && main_view.ChildViews.length > 0) {
          let target_view = main_view.ChildViews[0];
          if (
            target_view.TextureSetting &&
            target_view.TextureSetting.Texture &&
            target_view.TextureSetting.Texture.RenderTexture
          ) {
            ForgeExtension.TextureManager.DispatchCommand(
              target_view.TextureSetting.Texture.RenderTexture.IdToken,
              0,
              ""
            );
            if (this.props.onStart) {
              target_view.TextureSetting.Texture.registerOnStart(
                this.props.onStart
              );
            }
            if (this.props.onEnd) {
              target_view.TextureSetting.Texture.registerOnEnd(
                this.props.onEnd
              );
            }
          }
        }
      }
    } else {
      if (this._Viewer) {
        this._Viewer.play();
      }
    }
  }

  render() {
    if (window.JsView) {
      return (
        <img
          alt=""
          ref={(ele) => {
            this._Element = ele;
          }}
          jsv_auto_play="false"
          src={this.props.src}
          style={this.props.style}
        />
      );
    } else {
      return (
        <div style={this.props.style}>
          <jsvcanvas id={this._CanvasId} />
        </div>
      );
    }
  }

  componentDidMount() {
    if (!window.JsView) {
      let canvas = window.originDocument.getElementById(this._CanvasId);
      if (canvas) {
        if (this.props.src.indexOf("webp") > 0) {
          this.loadWebp(this.getUrl(this.props.src), canvas);
        } else if (this.props.src.indexOf("gif") > 0) {
          this.loadGif(this.getUrl(this.props.src), canvas);
        }
      }
    } else {
      if (this.props.autoPlay) {
        this.play();
      }
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  getUrl(base_url) {
    let url_trim = base_url.trim();
    if (url_trim.indexOf("http") === 0) {
      return url_trim;
    } else if (url_trim.indexOf("url") === 0) {
      let index_1 = url_trim.indexOf("(");
      let index_2 = url_trim.indexOf(")");
      return url_trim.substring(index_1 + 1, index_2);
    } else {
      return url_trim;
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
          this.props.autoPlay
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
            this.props.autoPlay
          );
        }
      }
    };
    xhr.send();
  }
}

JsvApic.defaultProps = {
  autoPlay: true,
};

export { JsvApic };
