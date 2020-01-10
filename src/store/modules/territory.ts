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
    async loadInfo ({ commit }): Promise<void> {
      commit('setLoading', true)
      const res = await api.territory.listInfo()
      commit('setInfo', res)
    },
    async addInfo ({ commit }, payload: IBoundaryText): Promise<IBoundaryText> {
      const res = await api.territory.addInfo(payload)
      commit('setInfo', res)
      return res
    },
    async deleteInfo ({ commit }, payload: string): Promise<void> {
      const res = await api.territory.deleteInfo(payload)
      commit('removeInfo', res)
    }
  },
  mutations: {
    setLoading (state, payload: boolean) {
      state.loading = payload
    },
    addInfo (state, payload: IBoundaryText) {
      state.info.push(payload)
    },
    setInfo (state, payload: IBoundaryText[]) {
      state.info = payload
      state.loading = false
    },
    removeInfo (state, payload: string) {
      const index = state.info.findIndex(i => i._id === payload)
      if (index !== -1) state.info.splice(index, 1)
    }
  }
}

export default storeModule
