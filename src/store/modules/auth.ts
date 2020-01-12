import { Module } from 'vuex'

import api from '@/api'
import { IAuthState, IRootState } from 'types/vuex'

const storeModule: Module<IAuthState, IRootState> = {
  namespaced: true,
  state: {
    token: ''
  },
  getters: {
    loggedIn: state => !!state.token
  },
  actions: {
    async login ({ commit }, password: string) {
      const res = await api.auth.login({ password })
      commit('loadToken', res.token)
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
}

export default storeModule
