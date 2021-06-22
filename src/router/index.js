import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/menu'
  },
  {
    path: '/menu',
    name: 'menu',
    component: () => import('../views/Menu/Index.vue')
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
