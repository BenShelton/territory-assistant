import { Module } from 'vuex'

import api from '@/api'
import { ISettings, UpdatedSettings } from 'types'
import { ISettingsState, IRootState } from 'types/vuex'

const storeModule: Module<ISettingsState, IRootState> = {
  namespaced: true,
  state: {
    src: ''
  },
  actions: {
    async load ({ commit }) {
      const res = await api.settings.load()
      commit('loadSettings', res)
    },
    async update ({ commit }, payload: UpdatedSettings) {
      const res = await api.settings.update(payload)
      commit('loadSettings', res)
    }
  },
  mutations: {
    loadSettings (state, payload: ISettings) {
      Object.assign(state, payload)
    }
  }
}

export default storeModule
