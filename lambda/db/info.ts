import { Collection, Db, ObjectID } from 'mongodb'
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

export const updateInfo = async (infoTexts: CollInfo[]): Promise<void> => {
  const coll = await getCollection
  const operations = infoTexts.map(i => {
    const _id = i._id ? new ObjectID(i._id) : new ObjectID()
    return {
      replaceOne: {
        filter: { _id },
        replacement: { ...i, _id },
        upsert: true
      }
    }
  })
  await coll.bulkWrite(operations, { ordered: false })
}
