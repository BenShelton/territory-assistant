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
      commit('addInfo', res)
      return res
    },
    async updateInfo ({ commit }, payload: IBoundaryText): Promise<IBoundaryText> {
      const res = await api.territory.updateInfo(payload)
      commit('updateInfo', res)
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
    setInfo (state, payload: IBoundaryText[]) {
      state.info = payload
      state.loading = false
    },
    addInfo (state, payload: IBoundaryText) {
      state.info.push(payload)
    },
    updateInfo (state, payload: IBoundaryText) {
      const index = state.info.findIndex(i => i._id === payload._id)
      if (index !== -1) state.info.splice(index, 1, payload)
      else state.info.push(payload)
    },
    removeInfo (state, payload: string) {
      const index = state.info.findIndex(i => i._id === payload)
      if (index !== -1) state.info.splice(index, 1)
    }
  }
}

export default storeModule
