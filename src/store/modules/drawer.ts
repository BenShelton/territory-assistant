import { Module } from 'vuex'
import { IDrawerState, IRootState } from 'types/vuex'

const storeModule: Module<IDrawerState, IRootState> = {
  namespaced: true,
  state: {
    open: false
  },
  mutations: {
    setDrawer (state, payload: boolean) {
      state.open = payload
    },
    toggleDrawer (state) {
      state.open = !state.open
    }
  }
}

export default storeModule
