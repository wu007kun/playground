import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import createLoginComp from '@/components/tempPassword/index.js'

const vueApp = createApp(App)
// const loginComp = createLoginComp({
//   Vue: vueApp,
//   defaultPassword: 'clear!@#',
//   title: '智慧景区综合管控平台'
// })
// router.addRoute(
//   {
//     name: 'login',
//     path: '/login',
//     component: loginComp
//   }
// )
// router.beforeEach((to, from, next) => {
//   if (to.name === 'login') {
//     next()
//   } else if (localStorage.getItem('tempLogin') && localStorage.getItem('tempLogin') > new Date().setUTCHours(0, 0, 0, 0)) {
//     next()
//   } else {
//     next('/login')
//   }
// })
// router.afterEach((to, from) => {
//   if (to.name === 'login') {
//     localStorage.removeItem('tempLogin')
//   }
// })
vueApp.use(store).use(router).mount('#app')
