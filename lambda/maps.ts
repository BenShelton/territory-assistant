import { Handler, APIGatewayEvent } from 'aws-lambda'

import { validateToken } from './db/auth'
import { getMap, addMap, updateMap, deleteMap, recalculateMaps } from './db/maps'
import { success, badRequest, notFound, RouteMatcher, unauthorized, isObject, isPointList } from './helpers'

import { IMap, API } from 'types'

function isMap (obj: unknown): obj is IMap {
  if (!isObject(obj)) return false
  const baseMap: Omit<IMap, 'bounds' | 'dncs' | 'houses' | 'flats' | 'businesses'> = { name: '', group: '' }
  if (!isPointList(obj.bounds)) return false
  if (!Array.isArray(obj.dncs) || obj.dncs.some(dnc => typeof dnc !== 'string')) return false
  return Object.entries(baseMap)
    .every(([k, v]) => {
      const val = obj[k]
      return typeof val === typeof v
    })
}

const handler: Handler = async (event: APIGatewayEvent) => {
  try {
    await validateToken(event)
  } catch {
    return unauthorized()
  }

  const matcher = new RouteMatcher(event)

  // GET /maps
  if (matcher.testRoute('GET', '/maps')) {
    const list = await getMap()
    return success<API.Maps.List.Response>(list)

  // POST /maps
  } else if (matcher.testRoute('POST', '/maps')) {
    if (!event.body) return badRequest('No data sent')
    const data: unknown = JSON.parse(event.body)
    if (!isMap(data)) return badRequest('Invalid data sent')
    const res = await addMap(data)
    return success<API.Maps.Add.Response>(res)

  // PUT /maps/recalculate
  } else if (matcher.testRoute('PUT', '/maps/recalculate')) {
    const list = await recalculateMaps()
    return success<API.Maps.List.Response>(list)

  // PUT /maps/:id
  } else if (matcher.testRoute('PUT', '/maps/:id')) {
    const { id } = matcher.pathParams
    if (!id) return badRequest('Invalid ID')
    if (!event.body) return badRequest('No data sent')
    const data: unknown = JSON.parse(event.body)
    if (!isMap(data)) return badRequest('Invalid data sent')
    const res = await updateMap(id, data)
    return success<API.Maps.Update.Response>(res)

  // DELETE /maps/:id
  } else if (matcher.testRoute('DELETE', '/maps/:id')) {
    const { id } = matcher.pathParams
    if (!id) return badRequest('Invalid ID')
    await deleteMap(id)
    return success<API.Maps.Delete.Response>(true)
  }

  // 404
  return notFound()
}

export { handler }
