import { IBoundaryText } from 'types'

async function request<T> (path: string, init: RequestInit): Promise<T> {
  const resource = '/.netlify/functions/' + path
  const res = await fetch(resource, init)
  if (res.ok) return res.json() as Promise<T>
  throw new Error(`Invalid Response: ${res.status} - ${res.statusText}`)
}

const api = {
  territory: {
    info: () => request<IBoundaryText[]>('/territory/info', { method: 'GET' })
  }
}

export default api
