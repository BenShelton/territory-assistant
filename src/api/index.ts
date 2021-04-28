/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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
    store.commit.auth.clearToken()
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
  info: {
    list: () => request<API.Info.List.Response>('info', { method: 'GET' }),
    add: (data: API.Info.Add.Request) => request<API.Info.Add.Response>('info', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: API.Info.Update.Request) => request<API.Info.Update.Response>('info/' + data._id, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: API.Info.Delete.Request) => request<API.Info.Delete.Response>('info/' + id, { method: 'DELETE' })
  },
  maps: {
    list: () => request<API.Maps.List.Response>('maps', { method: 'GET' }),
    add: (data: API.Maps.Add.Request) => request<API.Maps.Add.Response>('maps', { method: 'POST', body: JSON.stringify(data) }),
    recalculate: () => request<API.Maps.Recalculate.Response>('maps/recalculate', { method: 'PUT' }),
    update: (data: API.Maps.Update.Request) => request<API.Maps.Update.Response>('maps/' + data._id, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: API.Maps.Delete.Request) => request<API.Maps.Delete.Response>('maps/' + id, { method: 'DELETE' })
  },
  territory: {
    load: () => request<API.Territory.Load.Response>('territory', { method: 'GET' }),
    updateOverlay: (data: API.Territory.UpdateOverlay.Request) => request<API.Territory.UpdateOverlay.Response>('territory/overlay', { method: 'POST', body: JSON.stringify(data) }),
    updatePoints: (data: API.Territory.UpdatePoints.Request) => request<API.Territory.UpdatePoints.Response>('territory/points', { method: 'POST', body: JSON.stringify(data) })
  }
}

export default api
