import { Collection, Db } from 'mongodb'
import setup from './setup'

import { IPoint } from 'types'
import { MongoInterface } from 'types/mongo'

interface ITerritory {
  points: IPoint[]
}

type CollTerritory = MongoInterface<ITerritory>

const getCollection: Promise<Collection<CollTerritory>> = new Promise(resolve => {
  setup
    .then((db: Db) => db.collection('territory'))
    .then(resolve)
})

export const getTerritory = async (): Promise<IPoint[]> => {
  const coll = await getCollection
  const territory = await coll.findOne({})
  if (!territory) return []
  return territory.points
}

export const updateTerritory = async (points: IPoint[]): Promise<IPoint[]> => {
  const coll = await getCollection
  const territory = await coll.findOneAndUpdate({}, { $set: { points } }, { returnOriginal: false, upsert: true })
  if (!territory || !territory.value) throw new Error('Could not update territory points')
  return territory.value.points
}
