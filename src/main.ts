import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import vuetify from './plugins/vuetify'
import './plugins/leaflet'
import './plugins/notification'

Vue.config.productionTip = false

new Vue({
  router,
  store: store.original,
  vuetify,
  render: h => h(App)
}).$mount('#app')
