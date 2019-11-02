import { Module } from 'vuex'

interface IState {
  open: boolean
}

const storeModule: Module<IState, {}> = {
  namespaced: true,
  state: {
    open: false
  },
  mutations: {
    setDrawer (state, payload) {
      state.open = payload
    },
    toggleDrawer (state) {
      state.open = !state.open
    }
  }
}

export default storeModule
