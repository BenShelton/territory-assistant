import { Handler, APIGatewayEvent } from 'aws-lambda'

import { addToken, validateToken, removeToken } from './db/auth'
import { success, badRequest, notFound, RouteMatcher, unauthorized } from './helpers'

import { API, IToken } from 'types'

function hasPassword (obj: unknown): obj is { password: string } {
  return typeof obj === 'object' && obj !== null && 'password' in obj
}

const handler: Handler = async (event: APIGatewayEvent) => {
  const matcher = new RouteMatcher(event)

  // POST /login
  if (matcher.testRoute('POST', '/login')) {
    if (!event.body) return badRequest('No data sent')
    const data: unknown = JSON.parse(event.body)
    if (!hasPassword(data)) return badRequest('No password sent')
    const token = await addToken(data)
    return success<API.Auth.Login.Response>({ token })
  }

  let token: IToken
  try {
    token = await validateToken(event)
  } catch {
    return unauthorized()
  }

  // POST /logout
  if (matcher.testRoute('POST', '/logout')) {
    await removeToken(token)
    return success<API.Auth.Logout.Response>(true)
  }

  // 404
  return notFound()
}

export { handler }
