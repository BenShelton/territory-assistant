import { APIGatewayEvent } from 'aws-lambda'

type APIMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
interface IResult {
  statusCode: number
  body: string
}

export class RouteMatcher {
  private _paramRegex = /:(.*?)(?=(\/|$))/
  private _event: APIGatewayEvent
  private _pathParams: Record<string, string> = {}

  constructor (event: APIGatewayEvent) {
    this._event = event
  }

  get pathParams (): Record<string, string> {
    return this._pathParams
  }

  private _getMatches (path: string, regex: RegExp): string[] {
    const matches = path.match(regex)
    if (!matches) return []
    return matches.slice(1)
  }

  testRoute (method: APIMethod, path: string): boolean {
    if (this._event.httpMethod !== method) return false
    const stringParamRegex = new RegExp(path.replace(this._paramRegex, '(\\w+)') + '/?$')
    if (!stringParamRegex.test(this._event.path)) return false
    const paramNames = this._getMatches(path, this._paramRegex)
    const paramValues = this._getMatches(this._event.path, stringParamRegex)
    this._pathParams = paramNames.reduce((acc: Record<string, string>, p, i) => {
      if (p) acc[p] = paramValues[i]
      return acc
    }, {})
    return true
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
