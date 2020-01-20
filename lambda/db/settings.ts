import { Collection, Db } from 'mongodb'
import setup from './setup'

import { ISettingsListItem, ISettings, UpdatedSettings } from 'types'
import { MongoInterface } from 'types/mongo'

type CollSettings = MongoInterface<ISettingsListItem>

const getCollection: Promise<Collection<CollSettings>> = new Promise(resolve => {
  setup
    .then((db: Db) => db.collection('settings'))
    .then(resolve)
})

export const getSettings = async (): Promise<ISettings> => {
  const coll = await getCollection
  const settingsList = await coll.find().toArray() as ISettingsListItem[]
  return settingsList.reduce((acc, item) => {
    Object.assign(acc, { [item.key]: item.value })
    return acc
  }, {}) as ISettings
}

export const updateSettings = async (settings: UpdatedSettings): Promise<void> => {
  const coll = await getCollection
  const operations = settings.map(i => {
    return {
      updateOne: {
        filter: { key: i.key },
        update: { $set: { value: i.value } },
        upsert: true
      }
    }
  })
  await coll.bulkWrite(operations, { ordered: false })
}
