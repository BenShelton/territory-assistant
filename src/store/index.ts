import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { createDirectStore } from 'direct-vuex'

import auth from './modules/auth'
import drawer from './modules/drawer'
import info from './modules/info'
import map from './modules/map'
import notification from './modules/notification'
import territory from './modules/territory'

Vue.use(Vuex)

const { store, rootActionContext, moduleActionContext } = createDirectStore({
  modules: {
    auth,
    drawer,
    info,
    map,
    notification,
    territory
  },
  plugins: [createPersistedState({
    paths: ['auth']
  })]
})

export default store

export { rootActionContext, moduleActionContext }
