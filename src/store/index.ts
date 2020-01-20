import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import auth from './modules/auth'
import drawer from './modules/drawer'
import info from './modules/info'
import map from './modules/map'
import notification from './modules/notification'
import settings from './modules/settings'

import { IRootState } from 'types/vuex'

Vue.use(Vuex)

export default new Vuex.Store<IRootState>({
  modules: {
    auth,
    drawer,
    info,
    map,
    notification,
    settings
  },
  plugins: [createPersistedState({
    paths: ['auth']
  })]
})
