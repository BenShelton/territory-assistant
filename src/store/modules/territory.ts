import { createModule } from 'direct-vuex'

import { moduleActionContext } from '@/store'
import api from '@/api'

import { ITerritory, IPoint } from 'types'

const state: ITerritory = {
  overlay: {
    src: '',
    center: { lat: 0, lng: 0 },
    scale: 1
  },
  points: [] as IPoint[]
}

const storeModule = createModule({
  namespaced: true,
  state,
  actions: {
    async load (context) {
      const { commit } = storeModuleActionContext(context)
      const res = await api.territory.load()
      commit.loadTerritory(res)
    },
    async updateOverlay (context, payload: Partial<ITerritory['overlay']>) {
      const { commit } = storeModuleActionContext(context)
      const res = await api.territory.updateOverlay(payload)
      commit.loadOverlay(res)
    },
    async updatePoints (context, payload: IPoint[]) {
      const { commit } = storeModuleActionContext(context)
      const res = await api.territory.updatePoints(payload)
      commit.loadPoints(res)
    }
  },
  mutations: {
    loadTerritory (state, payload: ITerritory) {
      Object.assign(state, payload)
    },
    loadOverlay (state, payload: ITerritory['overlay']) {
      state.overlay = payload
    },
    loadPoints (state, payload: IPoint[]) {
      state.points = payload
    }
  }
})

export default storeModule
const storeModuleActionContext = (context: any) => moduleActionContext(context, storeModule)
