import { createModule } from 'direct-vuex'

const storeModule = createModule({
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
})

export default storeModule
