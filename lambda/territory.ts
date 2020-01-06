import { Handler, APIGatewayEvent } from 'aws-lambda'

import { getInfo, addInfo } from './db/info'
import { generateRouteMatcher, success, badRequest, notFound } from './helpers'
import { IBoundaryText, API } from 'types'

function isBoundaryText (obj: unknown): obj is IBoundaryText {
  if (typeof obj !== 'object' || !obj) return false
  const baseBoundaryText: IBoundaryText = { lat: 0, lng: 0, content: '' }
  return Object.entries(baseBoundaryText)
    .every(([k, v]) => {
      const val = (obj as Record<string, unknown>)[k]
      return typeof val === typeof v
    })
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
    const res = await addInfo(data)
    return success<API.Territory.AddInfo.Response>(res)

  // 404
  } else {
    return notFound()
  }
}

export { handler }
