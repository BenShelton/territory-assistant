import { Handler, Context, APIGatewayEvent } from 'aws-lambda'

const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
  const params = event.queryStringParameters
  return {
    statusCode: 200,
    body: JSON.stringify({
      msg: `Hello world ${Math.floor(Math.random() * 10)}`,
      params
    })
  }
}

export { handler }
