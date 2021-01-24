import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/canvas'
  },
  {
    path: '/canvas',
    name: 'canvas',
    component: () => import('../views/Canvas/Index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
