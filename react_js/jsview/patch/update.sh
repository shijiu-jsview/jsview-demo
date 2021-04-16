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

echo UPDATE DONE!!

