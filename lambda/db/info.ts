import { Collection, Db } from 'mongodb'
import setup from './setup'

import { IBoundaryText } from 'types'
import { MongoInterface } from 'types/mongo'

type CollInfo = MongoInterface<IBoundaryText>

const getCollection: Promise<Collection<CollInfo>> = new Promise(resolve => {
  setup
    .then((db: Db) => db.collection('info'))
    .then(resolve)
})

export const getInfo = async (): Promise<IBoundaryText[]> => {
  const coll = await getCollection
  const info = await coll.find().toArray()
  return info as IBoundaryText[]
}

export const addInfo = async (info: CollInfo): Promise<CollInfo> => {
  const coll = await getCollection
  const newInfoResult = await coll.insertOne(info)
  const newInfo: CollInfo | null = newInfoResult && newInfoResult.ops && newInfoResult.ops[0]
  if (!newInfo) throw new Error('Adding New Info was unsuccessful')
  return newInfo
}
