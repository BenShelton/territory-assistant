import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import { mount, createLocalVue, Wrapper } from '@vue/test-utils'

import store from '@/store'
import router from '@/router'

interface IWrapperOptions {
  store: boolean
}

interface IMountOptions {
  localVue: ReturnType<typeof createLocalVue>
  router: VueRouter
  vuetify: typeof Vuetify
  store?: typeof store
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createWrapper (component: any, options?: IWrapperOptions): Wrapper<any> {
  const { store: includeStore = false, ...otherOptions } = options || {}
  const localVue = createLocalVue()
  localVue.use(VueRouter)
  const mountOptions: IMountOptions = {
    localVue,
    router: new VueRouter(router),
    vuetify: new Vuetify(),
    ...otherOptions
  }
  if (includeStore) {
    mountOptions.localVue.use(Vuex)
    mountOptions.store = store
  }
  return mount(component, mountOptions)
}
