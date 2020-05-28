/**
 * Created by luocf on 2020/5/12.
 */
import Editor from "./Editor"

class Until {
    static clone(json_source) {
        return JSON.parse(JSON.stringify(json_source));
    }
    static getTemplate() {
        var template = Editor.Config.common.template;
        var style = Editor.Config.common.style;
        template = Editor.path + "/template/" + template + "/js/" + style.toLowerCase() + ".js";
        return template
    }

    static getAssetsFileName(value) {
        const urlParmsArr = value.split('/');
        return urlParmsArr[urlParmsArr.length - 1];
    }

    static getGameAssetsUrl(item) {
        if (item.value.indexOf("/") > -1) {
            return ".";
        } else {
            if (Editor.env !== "production") {
                if (item.type === "images") {
                    let path = Editor.path + "/template/" + Editor.Config.common.template + "/theme/";
                    if (item.lang) {
                        path += Editor.Config.common.language + "/"
                    }
                    return path;
                }
                let path = Editor.path + "/template/" + Editor.Config.common.template + "/" + item.type + "/";
                if (item.lang) {
                    path += Editor.Config.common.language + "/"
                }
                return path;
            }
            return "./assets/" + item.type + "/";
        }
    }

    static getCommonTheme(item) {
        if (Editor.env === "production") {
            return './assets/' + item.type + "/";
        } else {
            if (item.path) {
                return Editor.path + item.path + item.type + "/"
            }
            var path = Editor.path + "/common/theme/" + Editor.Config.common.theme + "/" + item.type + "/";
            if (item.lang) {
                path += Editor.Config.common.language + "/";
            }
            return path;
        }

        return Editor.env === "production" ? "./" : Editor.path + "/common/theme/" + Editor.Config.common.theme;
    }

    static getCommonThemeJs() {
        return Editor.env === "production" ? "./" : Editor.path + "/common/js";
    }

    static dataFromatAsstes() {
        var resoure = {};
        const stagesList = Editor.Config.stages;
        stagesList.forEach((stage, stageIndex) => {
            const assets = stage
            if (assets) {
                Object.keys(assets).forEach(key => {
                    var item = assets[key]
                    if (Array.isArray(item)) {
                        if (item[0].assets) {
                            item.forEach((rounds, index) => {
                                var roundAssets = rounds.assets;
                                Object.keys(roundAssets).forEach((val) => {
                                    var detail = roundAssets[val]
                                    if (typeof detail === 'object' && !Array.isArray(detail)) {
                                        resoure["stage-" + stageIndex + "_" + "rounds-" + index + "_" + val] = detail
                                        detail.key = Until.getAssetsFileName(detail.value);
                                    } else if (Array.isArray(detail)) {
                                        detail.forEach((a, roundIndex) => {
                                            resoure["stage-" + stageIndex + "_" + "rounds-" + index + "_" + val + roundIndex] = a
                                            a.key = Until.getAssetsFileName(a.value);
                                        })
                                    }
                                })
                            })

                        } else if (item[0].value) {
                            item.forEach((val, index) => {
                                resoure["stage-" + stageIndex + "_" + key + index] = val
                                val.key = Until.getAssetsFileName(val.value);
                            })
                        }
                    } else if (typeof item === 'object') {
                        resoure["stage-" + stageIndex + "_" + key] = item
                        item.key = Until.getAssetsFileName(item.value);
                    }
                })
            }
        })
        return resoure;
    }

    static isUndefined(value) {
        return typeof value === "undefined";
    }

    static getRandomValue() {
        let offestValue = 170;
        return Math.random() * offestValue;
    }
}

export default Until;