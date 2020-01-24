import { createModule } from 'direct-vuex'

import { moduleActionContext } from '@/store'
import api from '@/api'

import { IPoint } from 'types'

const storeModule = createModule({
  namespaced: true,
  state: {
    points: [] as IPoint[]
  },
  actions: {
    async load (context) {
      const { commit } = storeModuleActionContext(context)
      const res = await api.territory.load()
      commit.loadPoints(res)
    },
    async update (context, payload: IPoint[]) {
      const { commit } = storeModuleActionContext(context)
      const res = await api.territory.update(payload)
      commit.loadPoints(res)
    }
  },
  mutations: {
    loadPoints (state, payload: IPoint[]) {
      state.points = payload
    }
  }
})

export default storeModule
const storeModuleActionContext = (context: any) => moduleActionContext(context, storeModule)
