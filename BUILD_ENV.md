1. 恢复react-app的依赖库
- 进入react_js目录
- 将package-lock.json-perfect文件恢复(重命名)为package-lock.json
- 执行npm install

2. 打入jsview-react补丁
- 进入react_js/jsview/
- 执行 node do_patch.js

3. 启动react-app服务
- 进入react_js
- 执行npm start

4. 调整APK中的加载路径，见ViewLoader.java的loadUrl2处理中的说明

5. 界面启动后，修改js代码后，可以按遥控器的两次菜单键进行reload操作

6. 更改react js中的样例，请参照 react_js/jsview/samples/ 中的内容
   样例列表参照文件 react_js/jsview/samples/demoHomepage/DemoApp.js 内容
