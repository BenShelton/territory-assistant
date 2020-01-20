import { Module } from 'vuex'

import api from '@/api'
import { IInfoText } from 'types'
import { IInfoState, IRootState } from 'types/vuex'

const storeModule: Module<IInfoState, IRootState> = {
  namespaced: true,
  state: {
    texts: [],
    loading: false
  },
  actions: {
    async load ({ commit }): Promise<void> {
      commit('setLoading', true)
      const res = await api.info.list()
      commit('setInfo', res)
    },
    async add ({ commit }, payload: IInfoText): Promise<IInfoText> {
      const res = await api.info.add(payload)
      commit('addInfo', res)
      return res
    },
    async update ({ commit }, payload: IInfoText): Promise<IInfoText> {
      const res = await api.info.update(payload)
      commit('updateInfo', res)
      return res
    },
    async delete ({ commit }, payload: string): Promise<void> {
      const res = await api.info.delete(payload)
      commit('removeInfo', res)
    }
  },
  mutations: {
    setLoading (state, payload: boolean) {
      state.loading = payload
    },
    setInfo (state, payload: IInfoText[]) {
      state.texts = payload
      state.loading = false
    },
    addInfo (state, payload: IInfoText) {
      state.texts.push(payload)
    },
    updateInfo (state, payload: IInfoText) {
      const index = state.texts.findIndex(i => i._id === payload._id)
      if (index !== -1) state.texts.splice(index, 1, payload)
      else state.texts.push(payload)
    },
    removeInfo (state, payload: string) {
      const index = state.texts.findIndex(i => i._id === payload)
      if (index !== -1) state.texts.splice(index, 1)
    }
  }
}

export default storeModule
