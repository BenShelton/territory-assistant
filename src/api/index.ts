import { API } from 'types'

async function request<T> (path: string, init: RequestInit): Promise<T> {
  const resource = '/.netlify/functions/' + path
  const res = await fetch(resource, init)
  if (res.ok) return res.json() as Promise<T>
  throw new Error(`Invalid Response: ${res.status} - ${res.statusText}`)
}

const api = {
  settings: {
    load: () => request<API.Settings.Load.Response>('settings', { method: 'GET' }),
    update: (data: API.Settings.Update.Request) => request<API.Settings.Update.Response>('settings', { method: 'POST', body: JSON.stringify(data) })
  },
  territory: {
    listInfo: () => request<API.Territory.GetInfo.Response>('territory/info', { method: 'GET' }),
    addInfo: (data: API.Territory.AddInfo.Request) => request<API.Territory.AddInfo.Response>('territory/info', { method: 'POST', body: JSON.stringify(data) })
  }
}

export default api
