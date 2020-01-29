import { Collection, Db } from 'mongodb'
import setup from './setup'

import { ITerritory, IPoint } from 'types'
import { MongoInterface } from 'types/mongo'

type CollTerritory = MongoInterface<ITerritory>

const getCollection: Promise<Collection<CollTerritory>> = new Promise(resolve => {
  setup
    .then((db: Db) => db.collection('territory'))
    .then(resolve)
})

export const getTerritory = async (): Promise<ITerritory> => {
  const coll = await getCollection
  const territory = await coll.findOne({})
  if (!territory) throw new Error('Territory not yet created')
  return territory
}

export const updateTerritoryOverlay = async (overlay: Partial<ITerritory['overlay']>): Promise<ITerritory['overlay']> => {
  const coll = await getCollection
  const $set = Object.entries(overlay).reduce((acc, [k, v]) => {
    return Object.assign(acc, { ['overlay.' + k]: v })
  }, {})
  const territory = await coll.findOneAndUpdate({}, { $set }, { returnOriginal: false, upsert: true })
  if (!territory || !territory.value) throw new Error('Could not update territory overlay')
  return territory.value.overlay
}

export const updateTerritoryPoints = async (points: IPoint[]): Promise<IPoint[]> => {
  const coll = await getCollection
  const territory = await coll.findOneAndUpdate({}, { $set: { points } }, { returnOriginal: false, upsert: true })
  if (!territory || !territory.value) throw new Error('Could not update territory points')
  return territory.value.points
}
