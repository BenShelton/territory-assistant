import { Module } from 'vuex'
import { IMap } from 'types'

interface IState {
  list: IMap[]
  loading: boolean
}

const storeModule: Module<IState, {}> = {
  namespaced: true,
  state: {
    list: [],
    loading: true
  }
}

export default storeModule
