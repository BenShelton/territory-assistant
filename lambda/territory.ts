import { Handler, APIGatewayEvent } from 'aws-lambda'

import { getInfo, updateInfo } from './db/info'
import { generateRouteMatcher, success, badRequest } from './helpers'
import { IBoundaryText, API } from 'types'

function isBoundaryText (obj: unknown): obj is IBoundaryText[] {
  if (!Array.isArray(obj)) return false
  const baseBoundaryText: IBoundaryText = { x: 0, y: 0, content: '' }
  const keyChecks = Object.entries(baseBoundaryText).map(([k, v]) => ({ key: k, type: typeof v }))
  // eslint-disable-next-line valid-typeof
  return Array.isArray(obj) && obj.every(o => keyChecks.every(check => typeof o[check.key] === check.type))
}

const handler: Handler = async (event: APIGatewayEvent) => {
  const matcher = generateRouteMatcher(event)

  // GET /info
  if (matcher('GET', '/info')) {
    const list = await getInfo()
    return success<API.Territory.GetInfo.Response>(list)

  // POST /info
  } else if (matcher('POST', '/info')) {
    if (!event.body) return badRequest('No data sent')
    const data: unknown = JSON.parse(event.body)
    if (!isBoundaryText(data)) return badRequest('Invalid set of boundary texts sent')
    await updateInfo(data)
    const list = await getInfo()
    return success<API.Territory.UpdateInfo.Response>(list)

  // 404
  } else {
    return { statusCode: 404, body: 'Unknown Route' }
  }
}

export { handler }
