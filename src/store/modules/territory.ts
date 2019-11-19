import { Module } from 'vuex'

import api from '@/api'
import { IBoundaryText } from 'types'

interface IState {
  src: string
  info: IBoundaryText[]
  loading: boolean
}

const storeModule: Module<IState, {}> = {
  namespaced: true,
  state: {
    src: '',
    info: [],
    loading: false
  },
  actions: {
    async loadInfo ({ commit }) {
      commit('setLoading', true)
      const res = await api.territory.listInfo()
      commit('setInfo', res)
    },
    async updateInfo ({ commit }, payload: IBoundaryText[]) {
      const res = await api.territory.updateInfo(payload)
      commit('setInfo', res)
    }
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setInfo (state, payload) {
      state.info = payload
      state.loading = false
    }
  }
}

export default storeModule
