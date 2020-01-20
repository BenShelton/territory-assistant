import { Handler, APIGatewayEvent } from 'aws-lambda'

import { validateToken } from './db/auth'
import { getTerritory, updateTerritory } from './db/territory'
import { success, badRequest, notFound, RouteMatcher, unauthorized } from './helpers'

import { API, IPoint } from 'types'

function isPointList (obj: unknown): obj is IPoint[] {
  if (!Array.isArray(obj)) return false
  const basePoint: IPoint = { lat: 0, lng: 0 }
  return Object.entries(basePoint)
    .every(([k, v]) => {
      return obj.every(p => {
        const val = (p as Record<string, unknown>)[k]
        return typeof val === typeof v
      })
    })
}

const handler: Handler = async (event: APIGatewayEvent) => {
  try {
    await validateToken(event)
  } catch {
    return unauthorized()
  }

  const matcher = new RouteMatcher(event)

  // GET /territory
  if (matcher.testRoute('GET', '/territory')) {
    const territory = await getTerritory()
    return success<API.Territory.Load.Response>(territory)

  // POST /territory
  } else if (matcher.testRoute('POST', '/territory')) {
    if (!event.body) return badRequest('No data sent')
    const data: unknown = JSON.parse(event.body)
    if (!isPointList(data)) return badRequest('Invalid points sent')
    const territory = await updateTerritory(data)
    return success<API.Territory.Update.Response>(territory)
  }

  // 404
  return notFound()
}

export { handler }
