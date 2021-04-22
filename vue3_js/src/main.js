import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

// 备注：
// 1. App.vue是一个最简的Vue3样例(参考`vue create helloworld`)，可在此基础上进行二次开发。
// 2. 将第2行[import App from './App.vue']中的
//    './App.vue'改为'jsview/samples/basic/App', 可以运行samples。
// 3. 如果你想使用某个sample作为base，可以直接从jsview/samples/xxx拷贝到src目录。
