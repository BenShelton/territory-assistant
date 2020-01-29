import { Handler, APIGatewayEvent } from 'aws-lambda'

import { validateToken } from './db/auth'
import { getTerritory, updateTerritoryOverlay, updateTerritoryPoints } from './db/territory'
import { success, badRequest, notFound, RouteMatcher, unauthorized } from './helpers'

import { API, IPoint, ITerritory } from 'types'

function isObject (obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && !Array.isArray(obj) && !!obj
}

function isPartialOverlay (obj: unknown): obj is Partial<ITerritory['overlay']> {
  if (!isObject(obj)) return false
  const baseOverlay: ITerritory['overlay'] = { src: '', center: { lat: 0, lng: 0 }, scale: 0 }
  if ('src' in obj && typeof obj.src !== typeof baseOverlay.src) return false
  if ('center' in obj) {
    const center = obj.center
    if (!isObject(center)) return false
    const validCenter = Object.entries(baseOverlay.center)
      .every(([k, v]) => {
        return typeof center[k] === typeof v
      })
    if (!validCenter) return false
  }
  if ('scale' in obj && typeof obj.scale !== typeof baseOverlay.scale) return false
  return true
}

function isPointList (obj: unknown): obj is IPoint[] {
  if (!Array.isArray(obj)) return false
  const basePoint: IPoint = { lat: 0, lng: 0 }
  return Object.entries(basePoint)
    .every(([k, v]) => {
      return obj.every(p => {
        if (!isObject(p)) return false
        return typeof p[k] === typeof v
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

  // POST /territory/overlay
  } else if (matcher.testRoute('POST', '/territory/overlay')) {
    if (!event.body) return badRequest('No data sent')
    const data: unknown = JSON.parse(event.body)
    if (!isPartialOverlay(data)) return badRequest('Invalid points sent')
    const territoryOverlay = await updateTerritoryOverlay(data)
    return success<API.Territory.UpdateOverlay.Response>(territoryOverlay)

  // POST /territory/points
  } else if (matcher.testRoute('POST', '/territory/points')) {
    if (!event.body) return badRequest('No data sent')
    const data: unknown = JSON.parse(event.body)
    if (!isPointList(data)) return badRequest('Invalid points sent')
    const territoryPoints = await updateTerritoryPoints(data)
    return success<API.Territory.UpdatePoints.Response>(territoryPoints)
  }

  // 404
  return notFound()
}

export { handler }
