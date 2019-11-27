import { APIGatewayEvent } from 'aws-lambda'

type APIMethod = 'GET' | 'POST'
type RouteMatcher = (method: APIMethod, path: string) => boolean
interface IResult {
  statusCode: number
  body: string
}

export function generateRouteMatcher (event: APIGatewayEvent): RouteMatcher {
  return function routeMatcher (method: APIMethod, path: string) {
    if (event.httpMethod !== method) return false
    return new RegExp(path + '/?$').test(event.path)
  }
}

export function success<T> (data: T): IResult {
  return { statusCode: 200, body: JSON.stringify(data) }
}

export function badRequest (message: string): IResult {
  return { statusCode: 400, body: message }
}

export function notFound (): IResult {
  return { statusCode: 404, body: 'Unknown Route' }
}
