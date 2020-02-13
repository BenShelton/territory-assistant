import { createModule } from 'direct-vuex'

import { moduleActionContext } from '@/store'
import api from '@/api'

const storeModule = createModule({
  namespaced: true,
  state: {
    token: ''
  },
  getters: {
    loggedIn: state => !!state.token
  },
  actions: {
    async login (context, password: string) {
      const { commit } = storeModuleActionContext(context)
      const res = await api.auth.login({ password })
      commit.loadToken(res.token)
    },
    async logout ({ commit }) {
      try {
        await api.auth.logout()
      } finally {
        commit('clearToken')
      }
    }
  },
  mutations: {
    loadToken (state, payload: string) {
      state.token = payload
    },
    clearToken (state) {
      state.token = ''
    }
  }
})

export default storeModule
const storeModuleActionContext = (context: any) => moduleActionContext(context, storeModule)
