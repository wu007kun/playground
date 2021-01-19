import { createRouter, createWebHashHistory } from 'vue-router'
// import Home from '../views/Home.vue'
import GetPic from '../views/GIS/GetPic'

const routes = [
  {
    path: '/',
    redirect: '/canvas'
  },
  {
    path: '/canvas',
    name: 'canvas',
    component: () => import('../views/Canvas/Index.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/Test.vue')
  },
  // // {
  // //   path: '/',
  // //   name: 'Home',
  // //   component: Home
  // // },
  // {
  //   path: '/capture',
  //   name: 'capture',
  //   component: () => import('../views/Capture/Index.vue')
  // },
  // {
  //   path: '/nest',
  //   name: 'nest',
  //   component: () => import('../views/Nest/Index.vue')
  // },
  {
    path: '/gis',
    name: 'gis',
    component: () => import('../views/GIS/Index.vue')
  },
  {
    path: '/getPic',
    name: 'getPic',
    component: GetPic
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
