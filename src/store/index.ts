import Vue from 'vue'
import Vuex from 'vuex'

import drawer from './modules/drawer'
import territory from './modules/territory'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  modules: {
    drawer,
    territory
  }
})
