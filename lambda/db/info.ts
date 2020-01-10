import { Collection, Db, ObjectID } from 'mongodb'
import setup from './setup'

import { IBoundaryText, API } from 'types'
import { MongoInterface } from 'types/mongo'

type CollInfo = MongoInterface<IBoundaryText>

const getCollection: Promise<Collection<CollInfo>> = new Promise(resolve => {
  setup
    .then((db: Db) => db.collection('info'))
    .then(resolve)
})

export async function getInfo (): Promise<IBoundaryText[]> {
  const coll = await getCollection
  const info = await coll.find().toArray()
  return info as IBoundaryText[]
}

export async function addInfo (info: API.Territory.AddInfo.Request): Promise<CollInfo> {
  const coll = await getCollection
  const newInfoResult = await coll.insertOne(info)
  const newInfo: CollInfo | null = newInfoResult && newInfoResult.ops && newInfoResult.ops[0]
  if (!newInfo) throw new Error('Adding New Info was unsuccessful')
  return newInfo
}

export async function deleteInfo (id: API.Territory.DeleteInfo.Request): Promise<void> {
  const coll = await getCollection
  const { deletedCount } = await coll.deleteOne({ _id: new ObjectID(id) })
  if (deletedCount !== 1) throw new Error('Could not find Info to delete')
}
