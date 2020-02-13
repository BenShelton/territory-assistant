import { createModule } from 'direct-vuex'

const storeModule = createModule({
  namespaced: true,
  state: {
    list: [],
    loading: true
  }
})

export default storeModule
