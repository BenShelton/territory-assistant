async function request<T> (requestParams: any): Promise<T> {
  const res = await fetch(requestParams)
  if (res.ok) return res.json() as Promise<T>
  throw new Error(`Invalid Response: ${res.status} - ${res.statusText}`)
}

const api = {
  maps: {
    list: () => request({})
  }
}

export default api
