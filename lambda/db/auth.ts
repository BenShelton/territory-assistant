import jwt from 'jsonwebtoken'
import { APIGatewayEvent } from 'aws-lambda'
import { Collection, Db, ObjectID } from 'mongodb'

import setup from './setup'

import { IToken, API, JWT } from 'types'
import { MongoInterface } from 'types/mongo'

type CollAuth = MongoInterface<IToken>

const getCollection: Promise<Collection<CollAuth>> = new Promise(resolve => {
  setup
    .then((db: Db) => db.collection('auth'))
    .then(resolve)
})

const { PASSWORD = '', JWT_SECRET = '' } = process.env

function checkDecoded (decoded: string | object): decoded is IToken {
  if (typeof decoded !== 'object') return false
  return '_id' in decoded
}

export async function addToken (data: API.Auth.Login.Request): Promise<JWT> {
  if (data.password !== PASSWORD) throw new Error('Passwords do not match')
  const _id = new ObjectID()
  const decoded: IToken = { _id: _id.toHexString() }
  const token = jwt.sign(decoded, JWT_SECRET, { expiresIn: '60d' })
  const coll = await getCollection
  await coll.insertOne({ _id })
  return token
}

export const validateToken = async (event: APIGatewayEvent): Promise<IToken> => {
  if (!JWT_SECRET) throw new Error('No JWT secret set')
  const token = event.headers.authorization
  const decoded = jwt.verify(token, JWT_SECRET)
  if (!decoded) throw new Error('Decoded Token is empty')
  if (!checkDecoded(decoded)) throw new Error('Decoded Token is not an object')
  const coll = await getCollection
  const query = { _id: new ObjectID(decoded._id) }
  const existingToken = await coll.findOne(query)
  if (!existingToken) throw new Error('Token no longer valid')
  return decoded
}

export const removeToken = async (token: IToken): Promise<void> => {
  const tokenID = token._id
  if (!tokenID) throw new Error('No tokenID extracted in response')
  const coll = await getCollection
  const query = { _id: new ObjectID(tokenID) }
  await coll.deleteOne(query)
}
