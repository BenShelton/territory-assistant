import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import auth from './modules/auth'
import drawer from './modules/drawer'
import map from './modules/map'
import notification from './modules/notification'
import settings from './modules/settings'
import territory from './modules/territory'

import { IRootState } from 'types/vuex'

Vue.use(Vuex)

export default new Vuex.Store<IRootState>({
  modules: {
    auth,
    drawer,
    map,
    notification,
    settings,
    territory
  },
  plugins: [createPersistedState({
    paths: ['auth']
  })]
})
