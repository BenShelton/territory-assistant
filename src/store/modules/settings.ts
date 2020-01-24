import { createModule } from 'direct-vuex'

import { moduleActionContext } from '@/store'
import api from '@/api'
import { ISettings, UpdatedSettings } from 'types'

const storeModule = createModule({
  namespaced: true,
  state: {
    src: '',
    centerLat: '0',
    centerLng: '0',
    defaultZoom: '10'
  },
  actions: {
    async load (context) {
      const { commit } = storeModuleActionContext(context)
      const res = await api.settings.load()
      commit.loadSettings(res)
    },
    async update (context, payload: UpdatedSettings) {
      const { commit } = storeModuleActionContext(context)
      const res = await api.settings.update(payload)
      commit.loadSettings(res)
    }
  },
  mutations: {
    loadSettings (state, payload: ISettings) {
      Object.assign(state, payload)
    }
  }
})

export default storeModule
const storeModuleActionContext = (context: any) => moduleActionContext(context, storeModule)
