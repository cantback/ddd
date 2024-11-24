 

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router.js'

import ElementUI from 'element-plus'; 
let app = createApp(App);
app.use(ElementUI);
// 将路由文件注册到全局
app.use(router);
// 挂载根实例
app.mount('#app')
 
