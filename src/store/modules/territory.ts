import { Module } from 'vuex'

import api from '@/api'

import { IPoint } from 'types'
import { ITerritoryState, IRootState } from 'types/vuex'

const storeModule: Module<ITerritoryState, IRootState> = {
  namespaced: true,
  state: {
    points: []
  },
  actions: {
    async load ({ commit }) {
      const res = await api.territory.load()
      commit('loadPoints', res)
    },
    async update ({ commit }, payload: IPoint[]) {
      const res = await api.territory.update(payload)
      commit('loadPoints', res)
    }
  },
  mutations: {
    loadPoints (state, payload: IPoint[]) {
      state.points = payload
    }
  }
}

export default storeModule
