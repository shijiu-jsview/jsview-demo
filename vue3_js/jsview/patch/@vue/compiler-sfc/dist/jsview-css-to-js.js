'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const compilerSfc = require("./compiler-sfc.cjs");
var jsvPostCssToJs = require('postcss-js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

var jsvPostCssToJs__default = /*#__PURE__*/_interopDefaultLegacy(jsvPostCssToJs);

function ensureSfcDescriptor(descriptor) {
    // 如果css-style不存在，不做任何事
    if(descriptor.styles.length <= 0) {
        return;
    }

    // 为了将css-style植入到script中，script或scriptSetup必须存在一个
    if(!!descriptor.script
    || !!descriptor.scriptSetup) {
        return;
    }

    // 为了触发compiler-sfc.cjs.compileScript()
    // 如果script和scriptSetup都不存在，就做一个空的
    console.log("JsView: insert a empty script.");
    descriptor.script = {
        type: 'script',
        content: "",
        loc: {
            source: "",
            start: { column: 0, line: 0, offset: 0 },
            end: { column: 0, line: 0, offset: 0}
        },
        attrs: {},
        map: {
            version: 3,
            sources: [],
            names: [],
            mappings: '',
            // file: null,
            sourceRoot: '',
            sourcesContent: []
        }
    };
}

function compileCssToJs(sfc, options) {
    if(sfc.styles.length <= 0) {
        return ""
    }

    let compileStyleOptions = {
        // filename: sfc.filename,
        id: `data-v-${options.id}`,
        // map: null,
        trim: true,
        isProd: options.isProd,

        source: null,
        scoped: false,
        modules: false,
    };
    let jsvCssStyles = "if(!window.jsvCssStyle) { window.jsvCssStyle = {} };";
    jsvCssStyles += "Object.assign(window.jsvCssStyle, {";
    sfc.styles.forEach(style => {
        if(!!style.module
        || !!style.scoped) {
            const errMsg = "JsView: style module/scoped is not released by Vue3!";
            console.error(errMsg + " errors =", errors);
            throw new Error(errMsg)
        }
        compileStyleOptions.source = style.content
        compileStyleOptions.scoped = style.scoped
        compileStyleOptions.modules = style.module
        const { rawResult, errors } = compilerSfc.compileStyle(compileStyleOptions)
        if(errors.length) {
            const errMsg = "JsView: Failed to compile style when convert css to js!";
            console.error(errMsg + " errors =", errors);
            throw new Error(errMsg)
        }
        
        const styleNodes = rawResult.result.root.nodes;
        styleNodes.forEach(node => {
            const selector = node.selector;
            // console.log('node=', node)
            if(!selector) {
                const errMsg = "JsView Error: Undefined selector is found!";
                console.error(errMsg);
                throw new Error(errMsg);
            }
            if(!selector.startsWith('.')) {
                let errMsg = "JsView Error: Only class selector is supported!\n";
                errMsg += "JsView Error: Please use css like `.classname { property: value; }`";
                console.error(errMsg);
                throw new Error(errMsg);
            }
            const declarations = jsvPostCssToJs__default.objectify(node);
            jsvCssStyles += "'" + selector.substr(1) + "':";
            jsvCssStyles += JSON.stringify(declarations);
            jsvCssStyles += ",";
        })
    })
    jsvCssStyles += "});";

    return "\n" + jsvCssStyles;
}

// function concatCssToJs(sfc, options) {
//     const cssToJs = compileCssToJs(sfc, options);
//     if(!!sfc.script) {
//         console.log("JsView: concat css-style to <script>.");
//         sfc.script.content += cssToJs;
//     } else if(!!sfc.scriptSetup) {
//         console.log("JsView: concat css-style to <script setup>.");
//         sfc.scriptSetup.content += cssToJs;
//     } else {
//         console.error("JsView Error: Neither <script> or <script setup> is exists.");
//         throw new Error()
//     }
// }

exports.ensureSfcDescriptor = ensureSfcDescriptor;
exports.compileCssToJs = compileCssToJs;