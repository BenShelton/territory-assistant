import { Module } from 'vuex'

import api from '@/api'
import { IBoundaryText } from 'types'
import { ITerritoryState, IRootState } from 'types/vuex'

const storeModule: Module<ITerritoryState, IRootState> = {
  namespaced: true,
  state: {
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
    setLoading (state, payload: boolean) {
      state.loading = payload
    },
    setInfo (state, payload: IBoundaryText[]) {
      state.info = payload
      state.loading = false
    }
  }
}

export default storeModule
