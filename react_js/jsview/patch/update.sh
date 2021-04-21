#!/bin/bash

echo change path back to react_js
cd ../..

echo install/update jsview-dom jsview-react-widget package
npm install ./jsview/dom/bin/jsview-dom-package.tgz ./jsview/utils/JsViewEngineWidget/bin/jsview-react-widget-package.tgz

echo change path to jsview/patch
cd -

echo UDPATE react-script/config/webpack.config.js
cp react-scripts/config/webpack.config.js ../../node_modules/react-scripts/config/webpack.config.js

echo UDPATE react-scripts/scripts/build.js
cp react-scripts/scripts/build.js ../../node_modules/react-scripts/scripts/build.js

# 输出 engineJs 信息
echo "**************************************************"
echo "* Update revision to:"
core_revision=`cat ../dom/target_core_revision.js | grep "CoreRevision"`
core_revision=${core_revision#*CoreRevision:}; # 去掉开头
core_revision=${core_revision%,*}; # 去掉末尾的引号
echo "* CORE: ${core_revision}"

# 输出engineJs URL信息
engine_js=`cat ../dom/target_core_revision.js | grep "JsViewES6"`
engine_js=${engine_js#*\"}; # 去掉开头的引号
engine_js=${engine_js%\",*}; # 去掉末尾的引号
echo "* ENGINE JS URL: ${engine_js}"
echo "**************************************************"

echo UPDATE DONE!!

