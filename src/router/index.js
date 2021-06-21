import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/parkConfig'
  },
  {
    path: '/label',
    name: 'label',
    component: () => import('../views/Label/Index.vue')
  },
  {
    path: '/parkConfig',
    name: 'parkConfig',
    component: () => import('../views/Park/Config.vue')
  },
  {
    path: '/parkShow',
    name: 'parkShow',
    component: () => import('../views/Park/Show.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
