import { Handler, APIGatewayEvent } from 'aws-lambda'

import { getSettings } from './db/settings'
import { generateRouteMatcher, success, notFound } from './helpers'
import { API } from 'types'

const handler: Handler = async (event: APIGatewayEvent) => {
  const matcher = generateRouteMatcher(event)

  // GET /settings
  if (matcher('GET', '/settings')) {
    const settings = await getSettings()
    return success<API.Settings.Load.Response>(settings)

  // 404
  } else {
    return notFound()
  }
}

export { handler }
