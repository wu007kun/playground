import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/park'
  },
  {
    path: '/canvas',
    name: 'canvas',
    component: () => import('../views/Canvas/Index.vue')
  },
  {
    path: '/park',
    name: 'park',
    component: () => import('../views/Park/Index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
