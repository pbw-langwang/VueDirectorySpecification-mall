import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from "views/Home/Home.vue"

Vue.use(VueRouter)

const routes = [
  // 路由重定向
  // path表示需要被重定向的原地址，一般为'/'，redirect将要被重定向到的新地址
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/home",
    component: Home
  },
  {
    path: "/classify",
    // 提高性能
    component: () => import('views/Classify/Classify.vue')
  },
  {
    path: "/shopcart",
    component: () => import('views/ShopCart/ShopCart.vue')
  },
  {
    path: "/mine",
    component: () => import('views/Profile/Profile.vue')
  },
  {
    path: "/detail/:iid",
    component: () => import('views/detail/Detail.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
