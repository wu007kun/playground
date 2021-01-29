import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
const vueApp = createApp(App)
vueApp.use(Antd)
vueApp.use(router).mount('#app')
