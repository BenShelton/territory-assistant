import { Collection, Db, ObjectID, UpdateQuery } from 'mongodb'
import setup from './setup'

import { IMap, API } from 'types'
import { MongoInterface } from 'types/mongo'

type CollMap = MongoInterface<IMap>

const getCollection: Promise<Collection<CollMap>> = new Promise(resolve => {
  setup
    .then((db: Db) => db.collection('maps'))
    .then(resolve)
})

export async function getMap (): Promise<IMap[]> {
  const coll = await getCollection
  const map = await coll.find().toArray()
  return map as IMap[]
}

export async function addMap (map: API.Maps.Add.Request): Promise<CollMap> {
  const coll = await getCollection
  const newMapResult = await coll.insertOne(map)
  const newMap: CollMap | null = newMapResult && newMapResult.ops && newMapResult.ops[0]
  if (!newMap) throw new Error('Adding New Map was unsuccessful')
  return newMap
}

export async function updateMap (id: string, map: API.Maps.Update.Request): Promise<CollMap> {
  const coll = await getCollection
  const query = { _id: new ObjectID(id) }
  const updateMap = { ...map }
  delete updateMap._id
  const update: UpdateQuery<CollMap> = { $set: updateMap }
  const { value } = await coll.findOneAndUpdate(query, update, { returnOriginal: false })
  if (!value) throw new Error('Updating Map was unsuccessful')
  return value
}

export async function deleteMap (id: API.Maps.Delete.Request): Promise<void> {
  const coll = await getCollection
  const { deletedCount } = await coll.deleteOne({ _id: new ObjectID(id) })
  if (deletedCount !== 1) throw new Error('Could not find Map to delete')
}
