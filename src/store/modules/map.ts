import { Module } from 'vuex'
import { IMapState, IRootState } from 'types/vuex'

const storeModule: Module<IMapState, IRootState> = {
  namespaced: true,
  state: {
    list: [],
    loading: true
  }
}

export default storeModule
