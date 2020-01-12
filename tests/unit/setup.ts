import Vue from 'vue'
import Vuetify from 'vuetify'

import '@/plugins/leaflet'

Vue.use(Vuetify)
Vue.prototype.$leaflet.Map.prototype._initContainer = jest.fn(function () {
  // @ts-ignore
  this._container = document.createElement('div')
})
