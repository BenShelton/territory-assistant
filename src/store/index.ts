import Vue from 'vue'
import Vuex from 'vuex'

import drawer from './modules/drawer'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  modules: {
    drawer
  }
})
