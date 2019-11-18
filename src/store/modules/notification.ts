import { Module } from 'vuex'
import { INotification } from 'types'

interface IState {
  list: INotification[]
}

const storeModule: Module<IState, {}> = {
  namespaced: true,
  state: {
    list: []
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
}

export default storeModule
