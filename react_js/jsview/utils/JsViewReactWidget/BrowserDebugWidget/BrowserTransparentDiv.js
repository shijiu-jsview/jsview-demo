/**
 * Created by ludl on 5/13/21.
 */

import React from "react";
import { JsvWidgetWrapperGroup } from "./WidgetWrapper";

console.log("Loading BrowserDebug JsvTransparentDiv");

JsvWidgetWrapperGroup.getTransparentDivClass = (base_class) => {
  return class extends base_class {
    // Override
    render() {
      // 非JsView场景，以蓝区域代替，没有可描画的内容
      return (
        <div
          style={{
            left: this.props.style.left,
            top: this.props.style.top,
            width: this.props.style.width,
            height: this.props.style.height,
            backgroundColor: "#0000FF",
          }}
          children={this.props.children}
        />
      );
    }
  };
};
