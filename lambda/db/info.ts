import { Collection, Db } from 'mongodb'
import setup from './setup'

import { IBoundaryText } from '../types'
import { MongoInterface } from '../types/mongo'

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
