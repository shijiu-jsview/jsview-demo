#!/bin/bash

# 已经在package.json做关联,不需在此拷贝了
#echo UPDATE jsview-react
cp -a jsview-react ../node_modules/

echo UDPATE react-script/config/webpack.config.js
cp react-scripts/config/webpack.config.js ../node_modules/react-scripts/config/webpack.config.js

echo UDPATE react-scripts/scripts/build.js
cp react-scripts/scripts/build.js ../node_modules/react-scripts/scripts/build.js

echo UPDATE DONE!!

