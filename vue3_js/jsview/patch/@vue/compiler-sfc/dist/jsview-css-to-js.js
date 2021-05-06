'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const compilerSfc = require("./compiler-sfc.cjs");
var postCss = require('postcss');
var postCssJs = require('postcss-js');
var postCssImport = require('postcss-import-sync');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

var postCss__default = /*#__PURE__*/_interopDefaultLegacy(postCss);
var postCssJs__default = /*#__PURE__*/_interopDefaultLegacy(postCssJs);
var postCssImport__default = /*#__PURE__*/_interopDefaultLegacy(postCssImport);

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
        filename: sfc.filename,
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
        if(!!style.module) {
            let errMsg = "JsView: style module is not released by Vue3!\n";
            errMsg += style;
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
            // console.log('node=', node.name)
            if(node.name === "import") {
                jsvCssStyles += compileImportNode(node);
            } else if(node.name === "keyframes") {
                jsvCssStyles += compileKeyframesNode(node);
            } else if(!!node.selector) {
                jsvCssStyles += compileSelectorNode(node);
            } else {
                console.log('===================================')
                console.log('node=', node)
                console.log('===================================')
                check(false, node.source.input.css, "JsView Error: Unsupported css node.");
            }
        })
    })
    jsvCssStyles += "});";
    // console.log('jsview-css-to-js.compileCssToJs() jsvCssStyles=' + jsvCssStyles)

    return "\n" + jsvCssStyles;
}

function check(expr, source, errMsg) {
    if(!expr) {
        errMsg += (" source is: \n" + source);
        console.error(errMsg);
        throw new Error(errMsg);
    }
}

function compileImportNode(node) {
    const name = node.name;
    check(name, node.source.input.css, "JsView Error: name is not found!");

    check(name === "import", node.source.input.css, "JsView Error: @import name is not found!");

    let result = null;
    try {
        const plugins = [].slice();
        plugins.push(postCssImport__default)

        const content = node.source.input.css.slice(node.source.start.offset, node.source.end.offset + 1);
        check(content.endsWith(";"), "JsView Error: Failed to parse @import, please end with ';'")

        const options = {
            from: node.source.input.file
        };

        result = postCss__default(plugins).process(content, options);
    } catch (e) {
        console.log('JsView Error: Failed to compile css import node.', e);
        throw e;
    }

    let styles = "";
    const styleNodes = result.root.nodes;
    styleNodes.forEach(node => {
    // console.log('jsview-css-to-js.compileImportNode() ====== ' + node.selector);
        if(!!node.selector) {
            styles += compileSelectorNode(node);
        } else {
            check(false, node.source.input.css, "JsView Error: Unsupported css node from import css file.");
        }
    })

    // console.log('jsview-css-to-js.compileImportNode() return ' + styles);
    return styles
}

function compileKeyframesNode(node) {
    const name = node.name;
    check(name, node.source.input.css, "JsView Error: name is not found!");

    check(name === "keyframes", node.source.input.css, "JsView Error: @keyframes name is not found!");

    const content = node.source.input.css.slice(node.source.start.offset, node.source.end.offset + 1);

    let styles = "'" + node.params + "':'";
    styles += content.replace(/\n/g, " ");
    styles += "',";

    // console.log('jsview-css-to-js.compileKeyframesNode() return ' + styles);
    return styles
}

function compileSelectorNode(node) {
    const selector = node.selector;
    check(selector, node.source.input.css, "JsView Error: Selector is not found!");

    let errMsg = "JsView Error: Only class selector is supported!\n";
    errMsg += "JsView Error: Please use css like `.classname { property: value; }`";
    check(selector.startsWith('.'), node.source.input.css, errMsg);

    const declarations = postCssJs__default.objectify(node);
    let styles = "'" + selector.substr(1) + "':";
    styles += JSON.stringify(declarations);
    styles += ",";

    // console.log('jsview-css-to-js.compileSelectorNode() return ', styles);
    return styles;
}

exports.ensureSfcDescriptor = ensureSfcDescriptor;
exports.compileCssToJs = compileCssToJs;