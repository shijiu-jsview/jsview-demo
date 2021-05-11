'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const compilerSfc = require("./compiler-sfc.cjs");

var findCacheDir = _interopDefaultLegacy(require("find-cache-dir"));
var fs = _interopDefaultLegacy(require('fs'));
var hash = _interopDefaultLegacy(require('hash-sum'));
var path = _interopDefaultLegacy(require('path'));
var postCss = _interopDefaultLegacy(require('postcss'));
var postCssJs = _interopDefaultLegacy(require('postcss-js'));
var postCssImport = _interopDefaultLegacy(require('postcss-import-sync'));

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const adaptPath = (path.posix || path);

var cachedCssStyles = {}

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
        content: "export default {}\n",
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
    // let styleCodeContainer = new Set();
    let styleContentContainer = "";
    let styleImportContainer = "";
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
                const styleInfo = compileImportNode(node);
                // styleCodeContainer.add(styleCode);

                checkSelectors(node, styleInfo.styleFilePath, styleInfo.styleSelectors); // 检测selector是否已经处理过
                styleImportContainer += `\nimport "${styleInfo.styleJsFilePath}";`
            } else if(node.name === "keyframes") {
                const styleFilePath = node.source.input.file;
                const styleSelectors = new Set([node.params]);
                const styleContent = compileKeyframesNode(node);

                checkSelectors(node, styleFilePath, styleSelectors); // 检测selector是否已经处理过
                styleContentContainer += styleContent;
            } else if(!!node.selector) {
                const styleFilePath = node.source.input.file;
                const styleSelectors = new Set([node.selector]);
                const styleContent = compileSelectorNode(node);

                checkSelectors(node, styleFilePath, styleSelectors); // 检测selector是否已经处理过
                styleContentContainer += styleContent;
            } else {
                check(false, node.source.input.css, "JsView Error: Unsupported css node.");
            }
        })
    })

    let jsvStyleSheets = styleImportContainer;
    jsvStyleSheets += "\nObject.assign(window.JsvCode.Dom.StyleSheets, {";
    jsvStyleSheets += styleContentContainer;
    jsvStyleSheets += "});\n";

    // 用于@import的css hotload，但是没有生效
    // styleCodeContainer.forEach(styleCode => {
    //     jsvStyleSheets += styleCode + "\n";
    // });

    // console.log('jsview-css-to-js.compileCssToJs() jsvStyleSheets=' + jsvStyleSheets)
    return jsvStyleSheets;
}

function checkSelectors(node, styleFilePath, styleSelectors) {
    for(let cachedFilePath in cachedCssStyles) {
        if(cachedFilePath == styleFilePath) {
            continue;
        }

        const cachedSelectors = cachedCssStyles[cachedFilePath];
        for(let selector of cachedSelectors) {
            if(styleSelectors.has(selector)) { // 发现重复的selector
                let errMsg = "JsView Error: Multi defined CSS selector '" + selector + "' from " + node.source.input.file + ".\n";
                errMsg += "It has been defined in " + cachedFilePath + ".\n";
                check(false, node.source.input.css, errMsg);
            }
        }
    }

    // 添加到缓存
    let cachedSelectors = cachedCssStyles[styleFilePath];
    if(!cachedSelectors) {
        cachedSelectors = new Set()
    }
    cachedSelectors = new Set([...cachedSelectors, ...styleSelectors]);
    cachedCssStyles[styleFilePath] = cachedSelectors;
}

function check(expr, source, errMsg) {
    if(!expr) {
        errMsg += (" source is: \n" + source);
        console.error("\n" + errMsg);
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
        plugins.push(postCssImport)

        const content = node.source.input.css.slice(node.source.start.offset, node.source.end.offset + 1);
        check(content.endsWith(";"), "JsView Error: Failed to parse @import, please end with ';'")

        const options = {
            from: node.source.input.file
        };

        result = postCss(plugins).process(content, options);
    } catch (e) {
        console.log('JsView Error: Failed to compile css import node.', e);
        throw e;
    }

    const sourceDir = adaptPath.dirname(node.source.input.file);
    let styleFileName = node.params.replace(/^["'](.+(?=["']$))["']$/, '$1')
    const styleFilePath = adaptPath.resolve(sourceDir, styleFileName);
    return compileAndSaveImportedNode(styleFilePath, result.root.nodes);
}

function compileAndSaveImportedNode(styleFilePath, styleNodes) {
    let styleSelectors = new Set();
    let styleContent = "";

    styleNodes.forEach(node => {
        if(!!node.selector) {
            styleContent += compileSelectorNode(node);
            styleSelectors.add(node.selector);
        } else {
            check(false, node.source.input.css, "JsView Error: Unsupported css node from import css file.");
        }
    })

    // 保存到js文件并import到script中
    const cacheDir = findCacheDir({
        name: 'jsview-dom', create: true
    });
    const styleJsFileName = adaptPath.basename(styleFilePath) + `.${hash(styleFilePath)}.js`;
    const styleJsFilePath = adaptPath.join(cacheDir, styleJsFileName);

    styleContent = "\nObject.assign(window.JsvCode.Dom.StyleSheets, {" + styleContent;
    styleContent += "});\n";
    fs.writeFileSync(styleJsFilePath, styleContent, "utf8");

    return {
        styleFilePath,
        styleSelectors,
        styleJsFilePath
    };
}

function compileKeyframesNode(node) {
    const name = node.name;
    check(name, node.source.input.css, "JsView Error: name is not found!");

    check(name === "keyframes", node.source.input.css, "JsView Error: @keyframes name is not found!");

    const content = node.source.input.css.slice(node.source.start.offset, node.source.end.offset + 1);

    let styleContent = "'" + node.params + "':'";
    styleContent += content.replace(/\n/g, " ");
    styleContent += "',";

    // console.log('jsview-css-to-js.compileKeyframesNode() return ' + styleContent);
    return styleContent
}

function compileSelectorNode(node) {
    const selector = node.selector;
    check(selector, node.source.input.css, "JsView Error: Selector is not found!");

    let errMsg = "JsView Error: Only class selector is supported!\n";
    errMsg += "JsView Error: Please use css like `.classname { property: value; }`";
    check(selector.startsWith('.'), node.source.input.css, errMsg);

    const declarations = postCssJs.objectify(node);
    let styleContent = "'" + selector.substr(1) + "':";
    styleContent += JSON.stringify(declarations);
    styleContent += ",";

    // console.log('jsview-css-to-js.compileSelectorNode() return ', styleContent);
    return styleContent;
}

exports.ensureSfcDescriptor = ensureSfcDescriptor;
exports.compileCssToJs = compileCssToJs;
exports.compileAndSaveImportedNode = compileAndSaveImportedNode;