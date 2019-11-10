import { Module } from 'vuex'
import { ITerritory, IBoundaryText } from 'types'

interface IState {
  src: string
  infoText: IBoundaryText[]
  list: ITerritory[]
  loading: boolean
}

const storeModule: Module<IState, {}> = {
  namespaced: true,
  state: {
    src: '',
    infoText: [],
    list: [],
    loading: false
  },
  mutations: {
    updateOutline (state, payload) {
      state.list[0].outline = payload
    }
  }
}

export default storeModule
