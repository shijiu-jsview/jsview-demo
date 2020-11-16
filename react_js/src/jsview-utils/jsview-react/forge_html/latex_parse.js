

let WordType = {
    STRING: Symbol("STRING"),
    FUNCTION: Symbol("FUNCTION"),
    LINE_FEED: Symbol("LINE_FEED"),
    LEFT_BRACE: Symbol("LEFT_BRACE"),
    RIGHT_BRACE: Symbol("RIGHT_BRACE"),
}

function lexicalAnalyze(arr) {
    let result = [];
    let i = 0;
    while (i < arr.length) {
        if (arr[i] == '\\') {
            if (i < arr.length - 1) {
                if (arr[i + 1] == '\\' || arr[i + 1] == '{' || arr[i + 1] == '}') {
                    //普通字符
                    let pair = [i + 1, i + 2];
                    let word = {
                        type: WordType.STRING,
                        indexPair: pair,
                    }
                    result.push(word);
                    i += 2;
                } else {
                    //函数
                    ++i;
                    let start_i = i;
                    let end_i = i;
                    let has_char = false; //函数名后有空字符的处理
                    while (i < arr.length && arr[i] != '{' && arr[i] != '}') {
                        if (arr[i] != ' ') {
                            has_char = true;
                        }
                        if (!(arr[i] == ' ' && has_char)) {
                            //字符串后的空字符不计入
                            end_i = ++i;
                        } else {
                            ++i;
                        }
                    }
                    let pair = [start_i, end_i];
                    let word = {
                        type: WordType.FUNCTION,
                        indexPair: pair,
                    }
                    result.push(word);
                }
            } else {
                console.error("backslash at end.");
            }
        } else if (arr[i] == '{') {
            let word = {
                type: WordType.LEFT_BRACE,
                indexPair: null,
            }
            result.push(word);
            ++i;
        } else if (arr[i] == '}') {
            let word = {
                type: WordType.RIGHT_BRACE,
                indexPair: null,
            }
            result.push(word);
            ++i;
        } else if (arr[i] == '\n') {
            let word = {
                type: WordType.LINE_FEED,
                indexPair: null,
            }
            result.push(word);
            ++i;
        } else {
            //普通字符
            let start = i;
            let end = i;
            while (i < arr.length) {
                if (arr[i] == '\\' || arr[i] == '{' || arr[i] == '}' || arr[i] == '\n') {
                    break;
                } else {
                    ++i;
                    end = i;
                }
            }
            let pair = [start, end];
            let word = {
                type: WordType.STRING,
                indexPair: pair,
            }
            result.push(word);
        }
    }
    //清理
    for (let index = result.length - 1; index >= 0; index--) {
        let info = result[index];
        if (info.type == WordType.STRING) {
            let all_blank = true;
            for (let j = info.indexPair[0]; j < info.indexPair[1]; j++) {
                if (arr[j] != ' ') {
                    all_blank = false;
                    break;
                }
            }
            //纯空字符的片段
            if (all_blank && index > 0 && index < result.length - 1 && (result[index - 1].type == WordType.LEFT_BRACE || result[index - 1].type == WordType.RIGHT_BRACE) && (result[index + 1].type == WordType.RIGHT_BRACE || result[index + 1].type == WordType.LEFT_BRACE)) {
                //参数中间的空字符串该删除
                result.splice(index, 1);
                // result.remove(index);
            }
        }
    }
    return result;
}


let LEFT_BRACE = {};
let RIGHT_BRACE = {};

let Style = {
    BASE: Symbol("BASE"),
    COLOR: Symbol("COLOR"),
    BOLD: Symbol("BOLD"),
    ITALIC: Symbol("ITALIC"),
    DECORATION: Symbol("DECORATION"),
    SUPERSCRIPT: Symbol("SUPERSCRIPT"),
    SUBSCRIPT: Symbol("SUBSCRIPT"),
}

class TextStyle {
    style;
    styleValue = "";
}

class BaseNode {
    textStyle = new TextStyle();
    childNodes = [];
    parent;
}

class LeafNode extends BaseNode {
    styleList = [];
    indexPair;
    lineFeedNode = false;
    testValue;
}

function parseLatex(text) {
    if (text == null || text.length == 0) { return null; }
    let word_list = lexicalAnalyze(text);
    let stack = [];
    let leaf_list = [];
    let i = 0;
    while (i < word_list.length) {
        let word = word_list[i];
        if (word.type == WordType.STRING) {
            let node = new LeafNode();
            leaf_list.push(node);
            node.indexPair = word.indexPair;
            node.textStyle.style = Style.BASE;
            stack.push(node);
        } else if (word.type == WordType.LINE_FEED) {
            let node = new LeafNode();
            leaf_list.push(node);
            node.lineFeedNode = true;
        } else if (word.type == WordType.LEFT_BRACE) {
            stack.push(LEFT_BRACE);
        } else if (word.type == WordType.RIGHT_BRACE) {
            if (stack.length > 0) {
                let tmp_stack = [];
                let node = stack.pop();
                while (node != LEFT_BRACE) {
                    tmp_stack.push(node);
                    if (stack.length > 0) {
                        node = stack.pop();
                    } else {
                        break;
                    }
                }
                if (stack.length > 0) {
                    let func_node = stack[stack.length - 1];
                    if (func_node.textStyle.style == Style.BASE) {
                        console.error("lack of function");
                    } else {
                        while (tmp_stack.length > 0) {
                            let n = tmp_stack.pop();
                            func_node.childNodes.push(n);
                            n.parent = func_node;
                        }
                    }
                } else {
                    console.error("lack of function");
                }
            } else {
                console.error("extra }");
            }
        } else if (word.type == WordType.FUNCTION) {
            let func_name = text.substring(word.indexPair[0], word.indexPair[1]);

            let node = new BaseNode();
            switch (func_name) {
                case "textcolor":
                    if (i < word_list.length - 3) {
                        node.textStyle.style = Style.COLOR;
                        let l_b = word_list[i + 1];
                        let setting = word_list[i + 2];
                        let r_b = word_list[i + 3];
                        if (l_b.type == WordType.LEFT_BRACE && setting.type == WordType.STRING && r_b.type == WordType.RIGHT_BRACE) {
                            node.textStyle.styleValue = text.substring(setting.indexPair[0], setting.indexPair[1]);
                            i += 3;
                        } else {
                            console.error("textcolor param format error.");
                        }
                    } else {
                        console.error("textcolor param format error.");
                    }
                    break;
                case "textb":
                    node.textStyle.style = Style.BOLD;
                    break;
                case "texti":
                    node.textStyle.style = Style.ITALIC;
                    break;
                case "textdecoration":
                    if (i < word_list.length - 3) {
                        node.textStyle.style = Style.DECORATION;
                        let l_b = word_list[i + 1];
                        let setting = word_list[i + 2];
                        let r_b = word_list[i + 3];
                        if (l_b.type == WordType.LEFT_BRACE && setting.type == WordType.STRING && r_b.type == WordType.RIGHT_BRACE) {
                            node.textStyle.styleValue = text.substring(setting.indexPair[0], setting.indexPair[1]);
                            i += 3;
                        } else {
                            console.error("textdecoration param format error.");
                        }
                    } else {
                        console.error("textdecoration param format error.");
                    }
                    break;
                case "textsup":
                    node.textStyle.style = Style.SUPERSCRIPT;
                    break;
                case "textsub":
                    node.textStyle.style = Style.SUBSCRIPT;
                    break;
                default:
                    console.error("undefined style type: " + func_name);
            }
            stack.push(node);
        }
        ++i;
    }

    for (let n of leaf_list) {
        let node = n.parent;
        while (node != null) {
            n.styleList.push(node.textStyle);
            node = node.parent;
        }
    }
    //将语法树转为描画列表
    return {
        nodeList: leaf_list,
        text: text
    };
}

function toHtml(node_info) {
    let root = window.originDocument.createElement("div");
    root.style.position = "position";
    let origin_str = node_info.text;
    for (let node of node_info.nodeList) {
        if (node.lineFeedNode) {
            root.appendChild(window.originDocument.createElement("br"));
            continue;
        }
        let str = origin_str.substring(node.indexPair[0], node.indexPair[1]);
        let span = window.originDocument.createElement("span");
        let ele = span;
        let tmp_ele;
        for (let style of node.styleList) {
            switch(style.style) {
                case Style.BASE:
                    break;
                case Style.BOLD:
                    tmp_ele = window.originDocument.createElement("b");
                    ele.appendChild(tmp_ele);
                    ele = tmp_ele;
                    break;
                case Style.ITALIC:
                    tmp_ele = window.originDocument.createElement("i");
                    ele.appendChild(tmp_ele);
                    ele = tmp_ele;
                    break;
                case Style.COLOR:
                    span.style.color = style.styleValue;
                    break;
                case Style.DECORATION:
                    span.style.textDecoration = style.styleValue;
                    break;
                case Style.SUPERSCRIPT:
                    tmp_ele = window.originDocument.createElement("sup");
                    ele.appendChild(tmp_ele);
                    ele = tmp_ele;
                    break;
                case Style.SUBSCRIPT:
                    tmp_ele = window.originDocument.createElement("sub");
                    ele.appendChild(tmp_ele);
                    ele = tmp_ele;
                    break;
            }
        }
        ele.textContent = str;
        root.appendChild(span);
    }
    return root;
}
export {
    parseLatex,
    toHtml
}