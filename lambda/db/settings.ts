import { Collection, Db } from 'mongodb'
import setup from './setup'

import { ISettingsListItem, ISettings } from 'types'
import { MongoInterface } from 'types/mongo'

type CollInfo = MongoInterface<ISettingsListItem>

const getCollection: Promise<Collection<CollInfo>> = new Promise(resolve => {
  setup
    .then((db: Db) => db.collection('info'))
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
