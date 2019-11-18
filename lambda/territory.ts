import { Handler, APIGatewayEvent } from 'aws-lambda'
import { getInfo } from '../db/info'

const handler: Handler = async (event: APIGatewayEvent) => {
  // GET /info
  if (event.httpMethod === 'GET' && /\/info\/?$/.test(event.path)) {
    const list = await getInfo()
    return {
      statusCode: 200,
      body: JSON.stringify(list)
    }
  // 404
  } else {
    return { statusCode: 404, body: 'Unknown Route' }
  }
}

export { handler }
