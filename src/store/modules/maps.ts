import { createModule } from 'direct-vuex'

import { moduleActionContext } from '@/store'
import api from '@/api'

import { IMap } from 'types'

const storeModule = createModule({
  namespaced: true,
  state: {
    list: [] as IMap[],
    loading: true
  },
  actions: {
    async load (context): Promise<void> {
      const { commit } = storeModuleActionContext(context)
      commit.setLoading(true)
      const res = await api.maps.list()
      commit.setMaps(res)
    },
    async add (context, payload: IMap): Promise<IMap> {
      const { commit } = storeModuleActionContext(context)
      const res = await api.maps.add(payload)
      commit.addMap(res)
      return res
    },
    async update (context, payload: IMap): Promise<IMap> {
      const { commit } = storeModuleActionContext(context)
      const res = await api.maps.update(payload)
      commit.updateMap(res)
      return res
    },
    async delete (context, payload: string): Promise<void> {
      const { commit } = storeModuleActionContext(context)
      await api.maps.delete(payload)
      commit.removeMap(payload)
    }
  },
  mutations: {
    setLoading (state, payload: boolean) {
      state.loading = payload
    },
    setMaps (state, payload: IMap[]) {
      state.list = payload
      state.loading = false
    },
    addMap (state, payload: IMap) {
      state.list.push(payload)
    },
    updateMap (state, payload: IMap) {
      const index = state.list.findIndex(i => i._id === payload._id)
      if (index !== -1) state.list.splice(index, 1, payload)
      else state.list.push(payload)
    },
    removeMap (state, payload: string) {
      const index = state.list.findIndex(i => i._id === payload)
      if (index !== -1) state.list.splice(index, 1)
    }
  }
})

export default storeModule
const storeModuleActionContext = (context: any) => moduleActionContext(context, storeModule)
