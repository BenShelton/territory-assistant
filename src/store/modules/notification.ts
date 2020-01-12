import { Module } from 'vuex'
import { INotification } from 'types'
import { INotificationState, IRootState } from 'types/vuex'

const storeModule: Module<INotificationState, IRootState> = {
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
