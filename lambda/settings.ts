import { Handler, APIGatewayEvent } from 'aws-lambda'

import { getSettings, updateSettings } from './db/settings'
import { success, badRequest, notFound, RouteMatcher } from './helpers'
import { API, UpdatedSettings, ValidSettings } from 'types'

function isUpdateSettings (obj: unknown): obj is UpdatedSettings {
  if (!Array.isArray(obj)) return false
  const validSettings: ValidSettings = ['src', 'centerLat', 'centerLng', 'defaultZoom']
  return obj.every(o => validSettings.includes(o.key) && typeof o.value === 'string')
}

const handler: Handler = async (event: APIGatewayEvent) => {
  const matcher = new RouteMatcher(event)

  // GET /settings
  if (matcher.testRoute('GET', '/settings')) {
    const settings = await getSettings()
    return success<API.Settings.Load.Response>(settings)

  // POST /settings
  } else if (matcher.testRoute('POST', '/settings')) {
    if (!event.body) return badRequest('No data sent')
    const data: unknown = JSON.parse(event.body)
    if (!isUpdateSettings(data)) return badRequest('Invalid settings sent')
    await updateSettings(data)
    const settings = await getSettings()
    return success<API.Settings.Update.Response>(settings)

  // 404
  } else {
    return notFound()
  }
}

export { handler }
