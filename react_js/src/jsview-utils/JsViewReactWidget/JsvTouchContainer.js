import React from 'react';
import { Forge } from "../jsview-react/index_widget";

class JsvTouchContainer extends React.Component {
  constructor(props) {
    super(props);
    this._touchRef = null;
  }

    static DIRECTION_HORIZONTAL = Forge.DragSetting.DIRECTION_HORIZONTAL;

    static DIRECTION_VERTICAL = Forge.DragSetting.DIRECTION_VERTICAL;

    static DIRECTION_DISABLE = Forge.DragSetting.DIRECTION_DISABLE;

    static DIRECTION_AUTO = Forge.DragSetting.DIRECTION_AUTO;

    _initRef = (ref) => {
      this._touchRef = ref;
    }

    componentDidMount() {
      if (this._touchRef && this._touchRef.jsvMaskView) {
        const view = this._touchRef.jsvMaskView;
        const view_lp = view.GetLayoutParams();
        const page_width = this.props.flingPageWidth;
        const page_edge = this.props.flingPageEdge;
        const direction = this.props.direction;
        // 整屏滑动（启动tab模式，即flingPageWidth设置相应参数），dragLimitArea为固定值
        let drag_limit_area = this.props.dragLimitArea;
        if (page_width !== -1) {
          if (direction === Forge.DragSetting.DIRECTION_HORIZONTAL) {
            drag_limit_area = { x: 0, y: 0, width: page_width, height: view_lp.Height };
          } else {
            drag_limit_area = { x: 0, y: 0, width: view_lp.Width, height: page_width };
          }
        }

        const drag_setting = new Forge.DragSetting(direction, this.props.triggerMovedDistance, false,
          new Forge.RectArea(drag_limit_area.x, drag_limit_area.y, drag_limit_area.width, drag_limit_area.height),
          page_width, page_edge);
        let callback = {};
        if (direction === Forge.DragSetting.DIRECTION_DISABLE) {
          callback.OnTap = (msg) => {
            console.log("Container OnTap:", msg);
            if (this.props.onClick) {
              return this.props.onClick(msg);
            }
            return false;
          };
        } else {
          callback = {
            OnTap: (msg) => {
              console.log("Container OnTap:", msg);
              if (this.props.onClick) {
                return this.props.onClick(msg);
              }
              return false;
            },
            OnDragStart: (msg) => {
              console.log("Container OnDragStart:", msg);
              if (this.props.onDragStart) {
                return this.props.onDragStart(msg);
              }
              return false;
            },
            OnMoved: (msg) => {
              console.log("Container OnMoved:", msg);
              if (this.props.onMoved) {
                return this.props.onMoved(msg);
              }
              return false;
            },
            OnDragEnd: (msg) => {
              console.log("Container OnDragEnd:", msg);
              if (this.props.onDragEnd) {
                return this.props.onDragEnd(msg);
              }
              return false;
            },
            OnFling: (msg) => {
              console.log("Container OnFling:", msg);
              if (this.props.onFling) {
                return this.props.onFling(msg);
              }
              return false;
            },
            OnRelease: (msg) => {
              console.log("Container OnRelease:", msg);
              if (this.props.onRelease) {
                return this.props.onRelease(msg);
              }
              return false;
            }
          };
        }
        view.EnableDrag(drag_setting, callback, "translateMat(dx,dy,0)");
      }
    }

    componentWillUnmount() {
      this._touchRef = null;
    }

    render() {
      const { left, top, ...others } = this.props.style;
      return (
            <div key="containerPos"style={{ left,
              top,
              width: this.props.dragLimitArea.width ? this.props.dragLimitArea.width : this.props.style.width,
              height: this.props.dragLimitArea.height ? this.props.dragLimitArea.height : this.props.style.height,
              overflow: "hidden" }}>
                <div key="container" ref={this._initRef} style={others}>
                    {this.props.children}
                </div>
            </div>
      );
    }
}

JsvTouchContainer.defaultProps = {
  style: {
    left: 0,
    top: 0,
    width: 1920,
    height: 600
  },
  direction: JsvTouchContainer.DIRECTION_DISABLE,
  dragLimitArea: { x: 0, y: 0, width: 0, height: 0 },
  flingPageWidth: -1, // 滑动页的宽度，即开启整平滑动模式
  flingPageEdge: 1 / 5, // 触发整屏滑动页的边界，默认为1/5
  triggerMovedDistance: 20, // 触发onmoved的最小距离
  onClick: null,
  onDragStart: null,
  onMoved: null,
  onDragEnd: null,
  onFling: null,
  onRelease: null,
};

export default JsvTouchContainer;
