import React, {Component} from "react"
import PropTypes from "prop-types"
import QRCodeImpl from 'qr.js/lib/QRCode'
import {Forge, ForgeExtension} from "../jsview-react/index_widget.js"

const ErrorCorrectLevel = require('qr.js/lib/ErrorCorrectLevel');
function convertStr(str) {
    let out = '';
    for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x0080) {
            out += String.fromCharCode(charcode);
        } else if (charcode < 0x0800) {
            out += String.fromCharCode(0xc0 | (charcode >> 6));
            out += String.fromCharCode(0x80 | (charcode & 0x3f));
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
            out += String.fromCharCode(0xe0 | (charcode >> 12));
            out += String.fromCharCode(0x80 | ((charcode >> 6) & 0x3f));
            out += String.fromCharCode(0x80 | (charcode & 0x3f));
        } else {
            // This is a surrogate pair, so we'll reconsitute the pieces and work
            // from that
            i++;
            charcode =
                0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
            out += String.fromCharCode(0xf0 | (charcode >> 18));
            out += String.fromCharCode(0x80 | ((charcode >> 12) & 0x3f));
            out += String.fromCharCode(0x80 | ((charcode >> 6) & 0x3f));
            out += String.fromCharCode(0x80 | (charcode & 0x3f));
        }
    }
    return out;
}

const DEFAULT_PROPS = {
    size: 128,
    level: 'L',
    bgColor: '#FFFFFF',
    fgColor: '#000000',
    includeMargin: false,
};

const PROP_TYPES =
    process.env.NODE_ENV !== 'production'
        ? {
        value: PropTypes.string.isRequired,
        size: PropTypes.number,
        level: PropTypes.oneOf(['L', 'M', 'Q', 'H']),
        bgColor: PropTypes.string,
        fgColor: PropTypes.string,
        includeMargin: PropTypes.bool,
        imageSettings: PropTypes.shape({
            src: PropTypes.string.isRequired,
            height: PropTypes.number.isRequired,
            width: PropTypes.number.isRequired,
            x: PropTypes.number,
            y: PropTypes.number,
        }),
    }
        : {};

const MARGIN_SIZE = 4;

// This is *very* rough estimate of max amount of QRCode allowed to be covered.
// It is "wrong" in a lot of ways (area is a terrible way to estimate, it
// really should be number of modules covered), but if for some reason we don't
// get an explicit height or width, I'd rather default to something than throw.
function generatePath(modules, margin = 0) {
    const ops = [];
    modules.forEach(function (row, y) {
        let start = null;
        row.forEach(function (cell, x) {
            if (!cell && start !== null) {
                // M0 0h7v1H0z injects the space with the move and drops the comma,
                // saving a char per operation
                ops.push(
                    `M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`
                );
                start = null;
                return;
            }

            // end of row, clean up or skip
            if (x === row.length - 1) {
                if (!cell) {
                    // We would have closed the op above already so this can only mean
                    // 2+ light modules in a row.
                    return;
                }
                if (start === null) {
                    // Just a single dark module.
                    ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`);
                } else {
                    // Otherwise finish the current line.
                    ops.push(
                        `M${start + margin},${y + margin} h${x + 1 - start}v1H${start +
                        margin}z`
                    );
                }
                return;
            }

            if (cell && start === null) {
                start = x;
            }
        });
    });
    return ops.join('');
}


class QRCodeSVG extends Component {
    constructor() {
        super();
        this._renderview = this._renderview.bind(this);
        this._OldProps = null;
        this._InnerViewId = null;
        this._ActivityManager = null;
        this._initActivityManager();
    }
    getImageSettings(props,) {
        const {imageSettings, size} = props;
        if (imageSettings == null) {
            return null;
        }
        const w = imageSettings.width;
        const h = imageSettings.height;
        const x =
            imageSettings.x == null
                ? size / 2 - w / 2
                : imageSettings.x;
        const y =
            imageSettings.y == null
                ? size / 2 - h / 2
                : imageSettings.y;

        return {x, y, h, w};
    }
    _initActivityManager() {
        if (!this._ActivityManager && window._instanceRef) {
            this._ActivityManager = window._instanceRef.getActivityManager();
        }
    }


    render() {
        if (!!window.JsView) {
            return this.jsvQRcode();
        } else {
            return this.htmlQRCode();
        }
    }

    _renderview() {
        const {
            value,
            size,
            level,
            bgColor,
            fgColor,
            includeMargin,
            imageSettings,
            ...otherProps
        } = this.props;
        let view = null;
        let lp_params = null;
        if (this._ActivityManager != null) {
            let texture_manager =  ForgeExtension.TextureManager;
            let qrcode_texture =texture_manager.GetQRCodeTexture(value, size,size,Forge.QRCodeLevel[level],bgColor,fgColor);
            view = new Forge.LayoutView(new Forge.TextureSetting(qrcode_texture));
            let calculatedImageSettings = this.getImageSettings(this.props);
            if (imageSettings && calculatedImageSettings) {
                let img_texture = texture_manager.GetImage(imageSettings.src);
                let img_view = new Forge.LayoutView(new Forge.TextureSetting(img_texture));
                view.AddView(img_view, new Forge.LayoutParams({x:calculatedImageSettings.x,y:calculatedImageSettings.y,
                    width:calculatedImageSettings.w,height:calculatedImageSettings.h}))
            }
            lp_params = new Forge.LayoutParams({x:0,y:0,width:size,height:size});
        }
        return new Forge.ViewInfo(view, lp_params);
    }

    jsvQRcode() {
        if (this._oldProps != this.props &&  this._ActivityManager != null) {
            let view_info = this._renderview();
            this._tryRemoveInnerView();
            this._InnerViewId  = this._ActivityManager.ViewStore.add(view_info);
        }

        return (<div jsv_innerview={this._InnerViewId}></div>)
    }

    _tryRemoveInnerView() {
        if (!!window.JsView) {
            if (this._InnerViewId != null && this._ActivityManager != null) {
                this._ActivityManager.ViewStore.remove(this._InnerViewId);
                this._InnerViewId = null;
            }
        }
    }

    htmlQRCode() {
        const {
            value,
            size,
            level,
            bgColor,
            fgColor,
            includeMargin,
            imageSettings,
            ...otherProps
        } = this.props;
        const qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[level]);
        qrcode.addData(convertStr(value));
        qrcode.make();

        let cells = qrcode.modules;
        if (cells === null) {
            return null;
        }

        const margin = includeMargin ? MARGIN_SIZE : 0;
        const numCells = cells.length + margin * 2;
        const calculatedImageSettings = this.getImageSettings(this.props);
        let image = null;
        if (imageSettings != null) {
            image = (
                <div
                    style={{
                        backgroundImage: `url(${imageSettings.src})`,
                        height: calculatedImageSettings.h,
                        width: calculatedImageSettings.w,
                        left: calculatedImageSettings.x + margin,
                        top: calculatedImageSettings.y + margin,
                    }}
                />
            );
        }
        const fgPath = generatePath(cells, margin);
        return (
            <div>
                <jsvsvg
                    type="qrcode"
                    shapeRendering="crispEdges"
                    height={size}
                    width={size}
                    viewBox={`0 0 ${numCells} ${numCells}`}
                    {...otherProps}>
                    <jsvpath fill={bgColor} d={`M0,0 h${numCells}v${numCells}H0z`}/>
                    <jsvpath fill={fgColor} d={fgPath}/>
                </jsvsvg>
                {image}
            </div>
        );
    }
    componentWillUnmount() {
        this._tryRemoveInnerView();
    }
}

if (process.env.NODE_ENV !== 'production') {
    QRCodeSVG.propTypes = PROP_TYPES;
}

const QRCode = (props) => {
    const {...otherProps} = props;
    return <QRCodeSVG {...otherProps} />;
};

QRCode.defaultProps = DEFAULT_PROPS;

export default QRCode;