import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import store from '@/store'
import Home from '@/views/Home.vue'
import Maps from '@/views/Maps.vue'
import Settings from '@/views/Settings.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/maps',
    name: 'maps',
    component: Maps
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
  if (!store.state.settings.src) {
    try {
      await store.dispatch('settings/load')
    } catch (err) {
      console.error(err)
      next()
    }
  }
  next()
})

export default router
