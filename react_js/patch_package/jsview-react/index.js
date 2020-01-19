if(!!window.JsView) {
	module.exports = require("./dist/jsviewreact.min")
} else {
	module.exports = require("./dist/jsviewhtml.min")
}
