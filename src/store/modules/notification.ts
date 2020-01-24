import { createModule } from 'direct-vuex'

import { INotification } from 'types'

const storeModule = createModule({
  namespaced: true,
  state: {
    list: [] as INotification[]
  },
  mutations: {
    add (state, payload: INotification) {
      state.list.push(payload)
    },
    remove (state, payload: number) {
      const index = state.list.findIndex(({ id }) => id === payload)
      if (index > -1) state.list.splice(index, 1)
    }
  }
})

export default storeModule
