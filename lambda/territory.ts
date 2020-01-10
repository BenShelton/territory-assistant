import { Handler, APIGatewayEvent } from 'aws-lambda'

import { getInfo, addInfo, updateInfo, deleteInfo } from './db/info'
import { success, badRequest, notFound, RouteMatcher } from './helpers'
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
  const matcher = new RouteMatcher(event)

  // GET /info
  if (matcher.testRoute('GET', '/info')) {
    const list = await getInfo()
    return success<API.Territory.GetInfo.Response>(list)

  // POST /info
  } else if (matcher.testRoute('POST', '/info')) {
    if (!event.body) return badRequest('No data sent')
    const data: unknown = JSON.parse(event.body)
    if (!isBoundaryText(data)) return badRequest('Invalid data sent')
    const res = await addInfo(data)
    return success<API.Territory.AddInfo.Response>(res)

  // PUT /info/:id
  } else if (matcher.testRoute('PUT', '/info/:id')) {
    const { id } = matcher.pathParams
    if (!id) return badRequest('Invalid ID')
    if (!event.body) return badRequest('No data sent')
    const data: unknown = JSON.parse(event.body)
    if (!isBoundaryText(data)) return badRequest('Invalid data sent')
    const res = await updateInfo(id, data)
    return success<API.Territory.UpdateInfo.Response>(res)

  // DELETE /info/:id
  } else if (matcher.testRoute('DELETE', '/info/:id')) {
    const { id } = matcher.pathParams
    if (!id) return badRequest('Invalid ID')
    await deleteInfo(id)
    return success<API.Territory.DeleteInfo.Response>(true)

  // 404
  } else {
    return notFound()
  }
}

export { handler }
