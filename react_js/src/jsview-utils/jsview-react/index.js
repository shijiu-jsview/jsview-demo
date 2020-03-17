var debug_enable = false;

if (!debug_enable) {
	module.exports = require("jsview-react")
} else {
	// TODO: 进行编译(yarn build)时，需要关闭掉此require
	// module.exports = require("./code/index.js")
}
