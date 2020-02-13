import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import store from '@/store'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Territory from '@/views/Territory.vue'
import ImageOverlay from '@/views/ImageOverlay.vue'
import Maps from '@/views/Maps.vue'
import Info from '@/views/Info.vue'
import Settings from '@/views/Settings.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/territory',
    name: 'territory',
    component: Territory
  },
  {
    path: '/image',
    name: 'image',
    component: ImageOverlay
  },
  {
    path: '/maps',
    name: 'maps',
    component: Maps
  },
  {
    path: '/info',
    name: 'info',
    component: Info
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.name !== 'login' && !store.state.territory.overlay.src) {
    try {
      await store.dispatch.territory.load()
    } catch (err) {
      console.error(err)
      next('/login')
    }
  }
  next()
})

export default router
