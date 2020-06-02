/*
 * @Author: ChenChanghua
 * @Date: 2020-06-01 09:43:35
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2020-06-02 16:37:51
 * @Description: file content
 */
import React from 'react';
import {Forge, ForgeExtension} from "../jsview-react/index_widget.js"

class JsvSpray extends React.Component {
    constructor(props) {
        super(props);
        this._buildForgeView = this._buildForgeView.bind(this);
        this._releaseViewId = this._releaseViewId.bind(this);
        this._SpraViewId = -1;
    };

    _buildForgeView() {
        if (!this.props.pointRes) {return -1;}
        let texture_manager = ForgeExtension.TextureManager;
        let texture_setting;
        if (this.props.pointRes.trim().startsWith("#") || this.props.pointRes.trim().startsWith("rgba")) {
            texture_setting = new Forge.TextureSetting(texture_manager.GetColorTexture(this.props.pointRes));
        } else {
            texture_setting = new Forge.ExternalTextureSetting(texture_manager.GetImage2(this.props.pointRes));
        }
        let spray_view = new Forge.SprayView(texture_setting);
        let add_num_per_frame = this.props.sprayStyle.addNumPerFrame ? this.props.sprayStyle.addNumPerFrame : 0.0005;
        let accelerate_x = typeof this.props.sprayStyle.accelerateX !== 'undefined' ? this.props.sprayStyle.accelerateX : 0;
        let accelerate_y = typeof this.props.sprayStyle.accelerateY !== 'undefined' ? this.props.sprayStyle.accelerateY : -100;
        spray_view.SetSprayInfo(
            this.props.sprayStyle.type,
            this.props.sprayStyle.particleNum,
            add_num_per_frame,
            this.props.sprayStyle.deltaAngle / 180 * 3.1415,
            this.props.sprayStyle.deltaWidth,
            this.props.sprayStyle.pointSizeMin, this.props.sprayStyle.pointSizeMax,
            this.props.sprayStyle.speedMin, this.props.sprayStyle.speedMax,
            this.props.sprayStyle.lifeMin, this.props.sprayStyle.lifeMax,
            accelerate_x, accelerate_y
        );
        let view_width = this.props.sprayStyle.deltaWidth === 0 ? 1 : 2 * this.props.sprayStyle.deltaWidth;
        return ForgeExtension.RootActivity.ViewStore.add(
            new Forge.ViewInfo(spray_view, {x:0, y:0, width: view_width, height: 1})
        );
    }

    _releaseViewId() {
        if (this._SpraViewId >= 0) {
            ForgeExtension.RootActivity.ViewStore.remove(this._SpraViewId);
            this._SpraViewId = -1;
        }
    }

    shouldComponentUpdate(next_props, next_state) {
        let cur_spray_style = this.props.sprayStyle;
        let next_spray_style = next_props.sprayStyle;
        let spray_style_changed = false;
        for (let i of Object.keys(next_spray_style)) {
            if (cur_spray_style[i] !== next_spray_style[i]) {
                spray_style_changed = true;
                break;
            }
        }
        return this.props.pointImg !== next_props.pointImg || spray_style_changed;
    }

    render() {
        if (Forge.SprayView) {
            this._releaseViewId();
            this._SpraViewId = this._buildForgeView();
            if (this._SpraViewId < 0) {
                return null; 
            } else {
                return (
                    <div key={this._SpraViewId} jsv_innerview={this._SpraViewId}></div>
                )
            }
        } else {
            //暂时不支持网页
            return null
        }
    }

    componentWillUnmount() {
        this._releaseViewId();
    }
}
export default JsvSpray;