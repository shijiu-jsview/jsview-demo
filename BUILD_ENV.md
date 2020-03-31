1. 恢复react-app的依赖库
- 进入react_js目录
- 执行npm i

2. 打入jsview-react补丁
- 进入react_js/patch_package
- 执行 update.sh
- (或者) 手动按照update.sh中的拷贝路径，手动进行拷贝

3. 启动react-app服务
- 进入react_js
- 执行npm start

4. 安装jsview的loader服务程序

5. 调整APK中的加载路径，见ViewLoader.java的loadUrl2处理中的说明

6. 界面启动后，修改js代码后，可以按遥控器的两次菜单键进行reload操作

7. 更改react js中的样例，请参照react_js/src/main.js中的import的说明
