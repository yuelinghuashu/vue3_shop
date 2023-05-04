import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import service from './utils/index'



const app = createApp(App)

/* 挂载全局对象 */
app.config.globalProperties.$axios = service;

app.use(router).mount('#app')