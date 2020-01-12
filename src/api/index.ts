import { API } from 'types'
import store from '@/store'
import router from '@/router'

async function request<T> (path: string, init: RequestInit): Promise<T> {
  const { token } = store.state.auth
  if (token) {
    init.headers = { authorization: token }
  }
  const resource = '/.netlify/functions/' + path
  const res = await fetch(resource, init)
  if (res.ok) return res.json() as Promise<T>
  if (res.status === 401) {
    store.commit('auth/clearToken')
    router.push('/login')
    throw new Error('Unauthorized, please log in')
  }
  throw new Error(`Invalid Response: ${res.status} - ${res.statusText}`)
}

const api = {
  auth: {
    login: (data: API.Auth.Login.Request) => request<API.Auth.Login.Response>('auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => request<API.Auth.Logout.Response>('auth/logout', { method: 'POST' })
  },
  settings: {
    load: () => request<API.Settings.Load.Response>('settings', { method: 'GET' }),
    update: (data: API.Settings.Update.Request) => request<API.Settings.Update.Response>('settings', { method: 'POST', body: JSON.stringify(data) })
  },
  territory: {
    listInfo: () => request<API.Territory.GetInfo.Response>('territory/info', { method: 'GET' }),
    addInfo: (data: API.Territory.AddInfo.Request) => request<API.Territory.AddInfo.Response>('territory/info', { method: 'POST', body: JSON.stringify(data) }),
    updateInfo: (data: API.Territory.UpdateInfo.Request) => request<API.Territory.UpdateInfo.Response>('territory/info/' + data._id, { method: 'PUT', body: JSON.stringify(data) }),
    deleteInfo: (id: API.Territory.DeleteInfo.Request) => request<API.Territory.DeleteInfo.Response>('territory/info/' + id, { method: 'DELETE' })
  }
}

export default api
