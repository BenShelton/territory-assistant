import { createModule } from 'direct-vuex'

import { moduleActionContext } from '@/store'
import api from '@/api'
import { IInfoText } from 'types'

const storeModule = createModule({
  namespaced: true,
  state: {
    texts: [] as IInfoText[],
    loading: false
  },
  actions: {
    async load (context): Promise<void> {
      const { commit } = storeModuleActionContext(context)
      commit.setLoading(true)
      const res = await api.info.list()
      commit.setInfo(res)
    },
    async add (context, payload: IInfoText): Promise<IInfoText> {
      const { commit } = storeModuleActionContext(context)
      const res = await api.info.add(payload)
      commit.addInfo(res)
      return res
    },
    async update (context, payload: IInfoText): Promise<IInfoText> {
      const { commit } = storeModuleActionContext(context)
      const res = await api.info.update(payload)
      commit.updateInfo(res)
      return res
    },
    async delete (context, payload: string): Promise<void> {
      const { commit } = storeModuleActionContext(context)
      await api.info.delete(payload)
      commit.removeInfo(payload)
    }
  },
  mutations: {
    setLoading (state, payload: boolean) {
      state.loading = payload
    },
    setInfo (state, payload: IInfoText[]) {
      state.texts = payload
      state.loading = false
    },
    addInfo (state, payload: IInfoText) {
      state.texts.push(payload)
    },
    updateInfo (state, payload: IInfoText) {
      const index = state.texts.findIndex(i => i._id === payload._id)
      if (index !== -1) state.texts.splice(index, 1, payload)
      else state.texts.push(payload)
    },
    removeInfo (state, payload: string) {
      const index = state.texts.findIndex(i => i._id === payload)
      if (index !== -1) state.texts.splice(index, 1)
    }
  }
})

export default storeModule
const storeModuleActionContext = (context: any) => moduleActionContext(context, storeModule)
