import Vue from 'vue'
import Vuex from 'vuex'

import drawer from './modules/drawer'
import map from './modules/map'
import notification from './modules/notification'
import territory from './modules/territory'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    drawer,
    map,
    notification,
    territory
  }
})
