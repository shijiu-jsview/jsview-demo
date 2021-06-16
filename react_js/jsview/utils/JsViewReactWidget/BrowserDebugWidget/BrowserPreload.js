/**
 * Created by ludl on 5/14/21.
 */

import { JsvWidgetWrapperGroup } from "./WidgetWrapper";

console.log("Loading BrowserDebug JsvPreload");

JsvWidgetWrapperGroup.getPreload = (base_class) => {
  return class extends base_class {
    // Override
    render() {
      this._htmlPreload();
      return null;
    }

    _htmlPreload() {
      this._PreloadStateList = new Array(this.props.preloadList.length).fill(
        false
      );
      this._PreloadViewList = this.props.preloadList.map((item, index) => {
        if (!item.url) {
          this._PreloadStateList[index] = true;
          return null;
        }
        const image = new Image();
        image.onload = () => {
          this._PreloadStateList[index] = true;
          this._PreloadResultMap[item.url] = {
            width: image.width,
            height: image.height,
          };
          console.log(
            `preload succeed ${item.url}, width:${image.width}, height:${image.height}`
          );
          this._checkPreload();
        };
        image.src = item.url;
        return image;
      });

      this._DownloadStateList = new Array(this.props.downloadList.length).fill(
        false
      );
      this._DownloadViewList = this.props.downloadList.map((item, index) => {
        if (!item.url) {
          this._DownloadStateList[index] = true;
          return null;
        }
        const image = new Image();
        image.onload = () => {
          this._DownloadStateList[index] = true;
          console.log(`pre download succeed ${item.url}`);
          this._checkDownload();
        };
        image.src = item.url;
        return image;
      });
    }
  };
};
