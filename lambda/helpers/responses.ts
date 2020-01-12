interface IResult {
  statusCode: number
  body: string
}

export function success<T> (data: T): IResult {
  return { statusCode: 200, body: JSON.stringify(data) }
}

export function badRequest (message: string): IResult {
  return { statusCode: 400, body: message }
}

export function unauthorized (): IResult {
  return { statusCode: 401, body: 'Unauthorized' }
}

export function notFound (): IResult {
  return { statusCode: 404, body: 'Unknown Route' }
}
