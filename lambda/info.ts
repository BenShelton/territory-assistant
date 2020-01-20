import { Handler, APIGatewayEvent } from 'aws-lambda'

import { validateToken } from './db/auth'
import { getInfo, addInfo, updateInfo, deleteInfo } from './db/info'
import { success, badRequest, notFound, RouteMatcher, unauthorized } from './helpers'

import { IInfoText, API } from 'types'

function isInfoText (obj: unknown): obj is IInfoText {
  if (typeof obj !== 'object' || !obj) return false
  const baseInfoText: IInfoText = { lat: 0, lng: 0, content: '', type: 'Houses' }
  return Object.entries(baseInfoText)
    .every(([k, v]) => {
      const val = (obj as Record<string, unknown>)[k]
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

  // GET /info
  if (matcher.testRoute('GET', '/info')) {
    const list = await getInfo()
    return success<API.Info.List.Response>(list)

  // POST /info
  } else if (matcher.testRoute('POST', '/info')) {
    if (!event.body) return badRequest('No data sent')
    const data: unknown = JSON.parse(event.body)
    if (!isInfoText(data)) return badRequest('Invalid data sent')
    const res = await addInfo(data)
    return success<API.Info.Add.Response>(res)

  // PUT /info/:id
  } else if (matcher.testRoute('PUT', '/info/:id')) {
    const { id } = matcher.pathParams
    if (!id) return badRequest('Invalid ID')
    if (!event.body) return badRequest('No data sent')
    const data: unknown = JSON.parse(event.body)
    if (!isInfoText(data)) return badRequest('Invalid data sent')
    const res = await updateInfo(id, data)
    return success<API.Info.Update.Response>(res)

  // DELETE /info/:id
  } else if (matcher.testRoute('DELETE', '/info/:id')) {
    const { id } = matcher.pathParams
    if (!id) return badRequest('Invalid ID')
    await deleteInfo(id)
    return success<API.Info.Delete.Response>(true)
  }

  // 404
  return notFound()
}

export { handler }
