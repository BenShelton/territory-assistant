import { API } from 'types'

async function request<T> (path: string, init: RequestInit): Promise<T> {
  const resource = '/.netlify/functions/' + path
  const res = await fetch(resource, init)
  if (res.ok) return res.json() as Promise<T>
  throw new Error(`Invalid Response: ${res.status} - ${res.statusText}`)
}

const api = {
  settings: {
    load: () => request<API.Settings.Load.Response>('/settings', { method: 'GET' })
  },
  territory: {
    listInfo: () => request<API.Territory.GetInfo.Response>('/territory/info', { method: 'GET' }),
    updateInfo: (data: API.Territory.UpdateInfo.Request) => request<API.Territory.UpdateInfo.Response>('/territory/info', { method: 'POST', body: JSON.stringify(data) })
  }
}

export default api
